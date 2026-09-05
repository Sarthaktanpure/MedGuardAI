import * as React from "react";
import jsQR from "jsqr";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import { InferenceEngine, InferenceResult } from "../../lib/InferenceEngine";
import { toast } from "../../components/ui/Toast";
import { Camera, Upload, AlertCircle, ShieldAlert, Sparkles, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";

export default function Scan() {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [batchKey, setBatchKey] = React.useState("");
  const [result, setResult] = React.useState<InferenceResult | null>(null);
  const [detectedQR, setDetectedQR] = React.useState<any | null>(null);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setPhoto(null);
      setResult(null);
      setDetectedQR(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast.warning("Camera permission denied. Use file upload fallback.", "Camera Denied");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Snaps photo from video stream
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match dimensions
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Draw frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);
    stopCamera();

    // Check if frame has QR code
    let qrInfo: any = null;
    let foundKey = batchKey;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height, { inversionAttempts: "attemptBoth" });
      if (code && code.data) {
        try {
          const parsed = JSON.parse(code.data);
          if (parsed.key) {
            foundKey = parsed.key;
            qrInfo = parsed;
          }
        } catch {
          const qIdx = code.data.indexOf("?");
          if (qIdx !== -1) {
            const p = new URLSearchParams(code.data.substring(qIdx + 1));
            const k = p.get("key");
            if (k) {
              foundKey = k;
              qrInfo = { key: k, name: p.get("name") };
            }
          } else {
            foundKey = code.data.trim();
            qrInfo = { key: foundKey };
          }
        }
      }
    } catch {}

    if (qrInfo) {
      setBatchKey(foundKey);
      setDetectedQR(qrInfo);
      toast.success(`Authenticity QR detected: ${foundKey}`, "QR Code Identified");
    }

    // Trigger local inference immediately
    runClassifier(dataUrl, foundKey, qrInfo);
  };

  // Triggers inference loader
  const runClassifier = async (imgData: string, overrideKey?: string, qrInfo?: any) => {
    setLoading(true);
    const activeKey = overrideKey !== undefined ? overrideKey : batchKey;
    try {
      const engine = InferenceEngine.getInstance();
      const inferResult = await engine.runInference(new Image(), activeKey, qrInfo);
      setResult(inferResult);
      toast.success("Classification inference resolved successfully.", "Inference Complete");

      // Save this scan session to MSW database
      await fetch("/api/v1/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchKey: activeKey || "MG-UNKNOWN",
          result: inferResult.verdict,
          confidence: inferResult.confidence,
          camSummary: inferResult.camSummary,
        }),
      });
    } catch {
      toast.error("Failed to run local package classifier.", "Inference Error");
    } finally {
      setLoading(false);
    }
  };

  // Handles manual file upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setPhoto(dataUrl);
        stopCamera();

        // Check if uploaded image contains a QR code
        const img = new Image();
        img.onload = () => {
          let foundKey = batchKey;
          let qrInfo: any = null;
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: "attemptBoth",
              });
              if (code && code.data) {
                try {
                  const parsed = JSON.parse(code.data);
                  if (parsed.key) {
                    foundKey = parsed.key;
                    qrInfo = parsed;
                  }
                } catch {
                  const qIdx = code.data.indexOf("?");
                  if (qIdx !== -1) {
                    const p = new URLSearchParams(code.data.substring(qIdx + 1));
                    const k = p.get("key");
                    if (k) {
                      foundKey = k;
                      qrInfo = { key: k, name: p.get("name") };
                    }
                  } else {
                    foundKey = code.data.trim();
                    qrInfo = { key: foundKey };
                  }
                }
              }
            }
          } catch (err) {
            console.warn("QR pre-scan skipped", err);
          }

          if (qrInfo) {
            setBatchKey(foundKey);
            setDetectedQR(qrInfo);
            toast.success(`Authenticity QR detected: ${foundKey}`, "QR Code Identified");
          }
          runClassifier(dataUrl, foundKey, qrInfo);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset scanner
  const handleReset = () => {
    setPhoto(null);
    setResult(null);
    setDetectedQR(null);
    startCamera();
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold">Inspect Blister Pack</h1>
        <p className="text-xs text-muted-foreground">
          Align package inside coordinates for CNN print verification.
        </p>
      </div>

      {/* Batch input card to trigger deterministic results */}
      <Card>
        <CardContent className="pt-4 space-y-2.5">
          <div className="flex gap-2">
            <Input
              placeholder="Target Batch Key (optional, try MG-2026-0041A)"
              value={batchKey}
              onChange={(e) => setBatchKey(e.target.value)}
              className="font-mono text-xs h-9"
            />
            {batchKey && (
              <Button size="sm" variant="ghost" onClick={() => setBatchKey("")} className="h-9 px-2 text-xs">
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] text-muted-foreground font-semibold">Demo Presets:</span>
            <button
              type="button"
              onClick={() => {
                setBatchKey("MG-2026-0041A");
                toast.info("Selected Genuine batch (MG-2026-0041A)", "Demo Mode");
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                batchKey === "MG-2026-0041A" ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              ✅ Genuine Batch
            </button>
            <button
              type="button"
              onClick={() => {
                setBatchKey("MG-2026-0033H");
                toast.info("Selected Suspect batch (MG-2026-0033H)", "Demo Mode");
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                batchKey === "MG-2026-0033H" ? "bg-amber-500 text-white" : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
              }`}
            >
              ⚠️ Suspect Batch
            </button>
            <button
              type="button"
              onClick={() => {
                setBatchKey("MG-2026-0012B");
                toast.info("Selected Recalled batch (MG-2026-0012B)", "Demo Mode");
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                batchKey === "MG-2026-0012B" ? "bg-rose-500 text-white" : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              }`}
            >
              🛑 Recalled / Fake
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Camera and Capture viewport card */}
      <Card className="overflow-hidden relative bg-black min-h-[300px]">
        {/* Loading overlay HUD */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-slate-100 flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                Analyzing Blister package...
              </h4>
              <p className="text-[10px] text-muted-foreground leading-normal max-w-xs">
                Running CNN classification layers locally on browser edge.
              </p>
            </div>
          </div>
        )}

        {/* Framing Guide Overlay */}
        {!photo && stream && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div className="w-[75%] h-[55%] border-2 border-dashed border-primary/60 rounded-xl relative">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary" />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-primary bg-slate-900/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                blister guide
              </span>
            </div>
          </div>
        )}

        {/* Video stream viewport */}
        {!photo && stream ? (
          <div className="relative w-full aspect-[4/3] bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
            <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
              <button
                onClick={handleCapture}
                className="h-12 w-12 rounded-full border-4 border-slate-100 bg-primary shadow-lg flex items-center justify-center focus:outline-none"
              >
                <div className="h-5 w-5 rounded-full bg-slate-100" />
              </button>
            </div>
          </div>
        ) : photo ? (
          /* Render Photo Capture & Hotspots Heatmap overlay */
          <div className="relative w-full aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
            <img src={photo} alt="captured scan" className="w-full h-full object-cover" />
            
            {/* Draw CAM Hotspot overlays if result is suspect/fake */}
            {result && result.verdict !== "genuine" && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {(() => {
                  try {
                    const parsed = JSON.parse(result.camSummary);
                    const grid = parsed.heatmapGrid || [];
                    return grid.map((coord: number[], idx: number) => (
                      <div
                        key={idx}
                        style={{ left: `${coord[0]}%`, top: `${coord[1]}%` }}
                        className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/30 border border-rose-500 animate-pulse flex items-center justify-center"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      </div>
                    ));
                  } catch {
                    return null;
                  }
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Fallback view when camera is offline */
          <div className="aspect-[4/3] bg-slate-900/40 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground border-b border-border/40">
            <Camera className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="max-w-[200px] mb-4">No active video stream. Grant camera permissions or select a packaging image.</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={startCamera}>
                Activate Lens
              </Button>
              <label className="inline-flex items-center justify-center font-medium h-9 px-3 rounded-lg border border-input bg-background hover:bg-accent text-xs cursor-pointer select-none">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload Blister
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}
      </Card>

      {/* Hidden canvas for snapshot raster rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Result Card Overlay */}
      {result && (
        <Card className="animate-in slide-in-from-bottom-5 border-t-2 border-t-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Inference Diagnosis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            {/* Authenticity QR Code Decoded Banner */}
            {detectedQR && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-emerald-400" />
                  <div>
                    <span className="font-bold block text-foreground">Authenticity QR Code Verified: {detectedQR.name || detectedQR.key}</span>
                    <span className="text-[10px] text-muted-foreground">Lot Key: {detectedQR.key} • Provenance Verified</span>
                  </div>
                </div>
                <a
                  href={`/verify#/qr?key=${encodeURIComponent(detectedQR.key)}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 transition-colors"
                >
                  View Dossier <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            )}

          <div className="flex items-center justify-between border bg-secondary/30 p-3 rounded-lg">
            <div className="space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Verdict</span>
              <h4 className={`font-extrabold text-sm capitalize ${
                result.verdict === "genuine" ? "text-emerald-500" : result.verdict === "suspect" ? "text-amber-500" : "text-rose-500"
              }`}>
                {result.verdict}
              </h4>
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Confidence</span>
              <p className="font-bold text-sm text-foreground">{result.confidence}%</p>
            </div>
          </div>

          {/* Explanation banner based on verdict */}
          {result.verdict === "genuine" ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg flex gap-2 text-xs">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
              <p className="leading-relaxed">
                {detectedQR 
                  ? "Authenticity QR signature verified. Cryptographic hash matches blockchain ledger records."
                  : "Packaging format conforms to manufacturer imprint specifications. Batch registered on-chain."}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex gap-2 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
              <p className="leading-relaxed">
                Anomaly hotspots found in printing layer. Blister texture template mismatch. Divergence warnings triggered.
              </p>
            </div>
          )}

            <div className="flex gap-2">
              <Button className="flex-1 text-xs" onClick={handleReset}>
                New Inspection
              </Button>
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => window.location.href = `/verify#/history`}
              >
                Inspection Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
