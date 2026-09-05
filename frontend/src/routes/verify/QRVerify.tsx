import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";
import {
  QrCode,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Truck,
  Sparkles,
  Camera,
  Clipboard,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Upload,
  Zap,
  Check
} from "lucide-react";

interface QRPayload {
  key: string;         // Batch Key
  name?: string;       // Medicine Name
  mfr?: string;        // Manufacturer
  mfg?: string;        // Mfg Date
  exp?: string;        // Expiry Date
  ing?: string;        // Ingredients
  tx?: string;         // Tx Hash
}

export default function QRVerify() {
  const { user } = useAuthStore();
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const [rawInput, setRawInput] = React.useState("");
  const [activePayload, setActivePayload] = React.useState<QRPayload | null>(null);
  const [pendingFromStorage, setPendingFromStorage] = React.useState<QRPayload | null>(null);
  const [detectorActive, setDetectorActive] = React.useState(false);
  
  // Ledger Validation States
  const [ledgerLoading, setLedgerLoading] = React.useState(false);
  const [blockchainRecord, setBlockchainRecord] = React.useState<any | null>(null);
  
  // AI LLM Review States
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiReport, setAiReport] = React.useState("");
  const [animatedReport, setAnimatedReport] = React.useState("");
  
  // Checkout/Check-in States
  const [submittingCheckIn, setSubmittingCheckIn] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Check for newly generated QR from manufacturer
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem("medguard_pending_qr");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.key) {
          setPendingFromStorage(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setActivePayload(null);
      setBlockchainRecord(null);
      setAiReport("");
      setAnimatedReport("");
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      setScanning(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast.warning("Camera permission denied. Use simulation buttons or manual input.", "Camera Offline");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setScanning(false);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Real-time camera QR detector
  React.useEffect(() => {
    let intervalId: any = null;
    let isMounted = true;

    if (scanning && stream && typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        setDetectorActive(true);
        intervalId = setInterval(async () => {
          if (!isMounted || !videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const raw = barcodes[0].rawValue;
              try {
                const parsed = JSON.parse(raw);
                if (parsed.key) {
                  toast.success(`Scanned batch: ${parsed.key}`, "QR Code Detected");
                  loadPayload(parsed);
                }
              } catch {
                toast.success("Scanned QR code", "QR Code Detected");
                loadPayload({ key: raw.trim() });
              }
            }
          } catch {
            // frame detection skip
          }
        }, 200);
      } catch (err) {
        console.warn("BarcodeDetector setup error", err);
      }
    } else {
      setDetectorActive(false);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [scanning, stream]);

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
      if ("BarcodeDetector" in window) {
        const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        const barcodes = await detector.detect(img);
        URL.revokeObjectURL(url);
        if (barcodes && barcodes.length > 0) {
          const raw = barcodes[0].rawValue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.key) {
              toast.success(`Extracted batch ${parsed.key}`, "QR Found");
              loadPayload(parsed);
              return;
            }
          } catch {
            loadPayload({ key: raw.trim() });
            return;
          }
        }
      }
      toast.warning("Could not read QR automatically from image. Use manual JSON below.", "Upload Notice");
    } catch {
      toast.error("Failed to parse uploaded image.", "Error");
    }
  };

  // Clipboard paste handler
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawInput(text);
      try {
        const parsed = JSON.parse(text);
        if (parsed.key) {
          toast.success("Loaded QR payload from clipboard!", "Parsed");
          void loadPayload(parsed);
          return;
        }
      } catch {
        toast.info("Pasted JSON into field. Click Parse Payload to verify.", "Clipboard");
      }
    } catch {
      toast.error("Could not access clipboard.", "Permission Denied");
    }
  };

  // Trigger cross-referencing and AI audit
  const loadPayload = async (payload: QRPayload) => {
    stopCamera();
    setActivePayload(payload);
    setLedgerLoading(true);
    setAiLoading(true);
    setAiReport("");
    setAnimatedReport("");

    // 1. Cross-reference batch with mock chain/backend
    try {
      const res = await fetch(`/api/v1/batches/${payload.key}`);
      if (res.ok) {
        const data = await res.json();
        setBlockchainRecord(data);
      } else {
        setBlockchainRecord({ flagged: false, chainStatus: "unregistered" });
      }
    } catch {
      setBlockchainRecord({ flagged: false, chainStatus: "unregistered" });
    } finally {
      setLedgerLoading(false);
    }

    // 2. Fetch AI LLM report from backend
    try {
      const res = await fetch("/api/v1/models/llm-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.analysisReport) {
        setAiReport(data.analysisReport);
        triggerTypewriter(data.analysisReport);
      } else {
        throw new Error(data.error?.message || "AI Analysis failed");
      }
    } catch (err: any) {
      toast.error("Pretrained AI verification server error.", "AI Engine Failed");
      setAiReport("Error resolving clinical LLM report. Please inspect database integrity logs.");
      setAnimatedReport("Error resolving clinical LLM report. Please inspect database integrity logs.");
    } finally {
      setAiLoading(false);
    }
  };

  // Simulated typewriter animation for the AI output
  const triggerTypewriter = (text: string) => {
    let index = 0;
    setAnimatedReport("");
    const interval = setInterval(() => {
      setAnimatedReport((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 4); // super fast and responsive typing speed
  };

  // Preset payload simulations for easy testing
  const simulateScan = (type: "genuine" | "recalled" | "expired") => {
    let payload: QRPayload;

    if (type === "genuine") {
      payload = {
        key: "MG-2026-0041A",
        name: "Paracetamol 500mg",
        mfr: "Pfizer Logistics Dublin",
        mfg: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        exp: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        ing: "Paracetamol (Acetaminophen) Active Compound",
        tx: "0x88fca9b12d5ef393a557cd48eeab49182390f77df34a2e5d9c222ffda3d3bc1f",
      };
    } else if (type === "recalled") {
      payload = {
        key: "MG-2026-0012B",
        name: "Amlodipine 10mg",
        mfr: "Pfizer logistics Dublin",
        mfg: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        exp: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        ing: "Amlodipine Besylate Active Compound",
        tx: "0xcc28d49a3de894aefcb374a2e89d12aefbc31e8c9d4fa289bca7df23d4fa98ce",
      };
    } else {
      payload = {
        key: "MG-2026-EXP99",
        name: "Ibuprofen 400mg",
        mfr: "BioLabs Laboratories",
        mfg: "2024-01-10",
        exp: "2026-05-15", // Expired
        ing: "Ibuprofen BP 400mg",
        tx: "0x98b8c2d825a071a17de8bcaef1284a1e948c2b7cf23a85b9c24efda3d3bc1ab",
      };
    }

    toast.success(`Simulated scan: ${payload.name}`, "Scan Simulation");
    void loadPayload(payload);
  };

  // Handle manual JSON input
  const handleManualInput = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(rawInput);
      if (!parsed.key) {
        toast.error("JSON payload must contain a 'key' field.", "Invalid Format");
        return;
      }
      void loadPayload(parsed);
      setRawInput("");
    } catch {
      toast.error("Invalid JSON format. Check brackets and keys.", "Parsing Error");
    }
  };

  // Perform Retail Check-in / Accept Delivery
  const handleCheckIn = async () => {
    if (!activePayload) return;
    setSubmittingCheckIn(true);
    try {
      const res = await fetch("/api/v1/tracking/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingId: "MG-DEL-001", // Demo tracking lot
          status: "Delivered",
          location: "Pharmacist Retail - Vault",
          note: `Delivery lot accepted by ${user?.displayName || "Pharmacist"}. Authenticity QR checked. AI verify verdict matches: ${blockchainRecord?.flagged ? "RECALLED Alert" : "Genuine State"}.`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to write check-in event.");
      }

      toast.success("Delivery lot accepted and checked-in to active inventory.", "Retail Check-in Success");
      
      // Redirect to shipment custody tracer to review the event live
      setTimeout(() => {
        window.location.href = "/tracking#/";
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || "Could not log check-in.", "Registry Error");
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Verify Delivery QR</h1>
        <p className="text-xs text-muted-foreground">
          Scan shipment codes to cross-reference ledger provenance and run clinical AI analysis.
        </p>
      </div>

      {/* Pending QR Banner from Manufacturer */}
      {pendingFromStorage && !activePayload && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="font-bold block text-foreground">Active QR Tag from Manufacturer Ready: {pendingFromStorage.name || pendingFromStorage.key}</span>
              <span className="text-[10px] text-muted-foreground">Lot Key: {pendingFromStorage.key}</span>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3 shrink-0" 
            onClick={() => {
              void loadPayload(pendingFromStorage);
              sessionStorage.removeItem("medguard_pending_qr");
              setPendingFromStorage(null);
            }}
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            Verify This Batch
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Scanner, Inputs & Simulations (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Camera Viewfinder Card */}
          <Card className="overflow-hidden relative bg-black min-h-[250px]">
            {scanning && stream ? (
              <div className="relative w-full aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Live Scanner HUD Status */}
                <div className="absolute top-3 inset-x-0 flex justify-center z-20">
                  <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Barcode Reader Active
                  </span>
                </div>

                {/* Laser Overlay HUD */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <div className="w-[65%] h-[65%] border border-primary/50 rounded-lg relative">
                    <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-primary" />
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-primary" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-primary" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-primary" />
                    {/* Sweeping laser */}
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-[bounce_2s_infinite]" />
                  </div>
                </div>

                <div className="absolute bottom-4 inset-x-0 flex justify-center z-20">
                  <Button size="sm" variant="destructive" onClick={stopCamera}>
                    Deactivate Camera
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-slate-900/40 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
                <QrCode className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="max-w-[200px] mb-4">No active video stream. Use the camera to scan medicine box tags.</p>
                <Button size="sm" onClick={startCamera}>
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Activate Lens
                </Button>
              </div>
            )}
          </Card>

          {/* Quick File Upload Fallback */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs bg-card/60"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Upload QR Image / Screenshot
            </Button>
          </div>

          {/* Preset Simulations Widget */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Audit Simulations</CardTitle>
              <CardDescription className="text-[10px]">
                Click to mock-scan pre-compiled QR tags containing active lot metadata.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <button
                onClick={() => simulateScan("genuine")}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-left text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div>
                    <span className="font-bold block">Genuine Shipment</span>
                    <span className="text-[9px] text-muted-foreground">Paracetamol 500mg (Valid Lot)</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-500" />
              </button>

              <button
                onClick={() => simulateScan("recalled")}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-left text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <div>
                    <span className="font-bold block">Recalled Lot</span>
                    <span className="text-[9px] text-muted-foreground">Amlodipine 10mg (Flagged batch)</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-rose-500" />
              </button>

              <button
                onClick={() => simulateScan("expired")}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-left text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="font-bold block">Expired Lot</span>
                    <span className="text-[9px] text-muted-foreground">Ibuprofen 400mg (Mfg 2024 / Exp 2026)</span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
              </button>
            </CardContent>
          </Card>

          {/* Manual JSON Payload Entry */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs">Paste QR Raw Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualInput} className="space-y-3">
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder='{"key": "MG-2026-0041A", "name": "Aspirin", "mfr": "Bayer", "exp": "2028-12-01"}'
                  className="w-full h-16 p-2 rounded-lg border bg-secondary/30 font-mono text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1 text-xs">
                    <Clipboard className="h-3.5 w-3.5 mr-1.5" />
                    Parse Payload
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={handlePasteClipboard}>
                    <Clipboard className="h-3.5 w-3.5 mr-1 text-primary" />
                    Paste
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Verification Details and AI Audit Report (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {activePayload ? (
            <div className="space-y-6">
              {/* Lot Metadata Specs Card */}
              <Card>
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">Scanned Package Details</span>
                      <CardTitle className="text-sm font-extrabold">{activePayload.name || "Unknown Label"}</CardTitle>
                    </div>
                    <Badge variant={blockchainRecord?.flagged ? "fake" : "genuine"}>
                      {blockchainRecord?.flagged ? "RECALLED" : "ACTIVE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Batch Key
                    </span>
                    <p className="font-mono font-bold text-foreground">{activePayload.key}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Manufacturer
                    </span>
                    <p className="text-foreground">{activePayload.mfr || "Unspecified"}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Manufacturing Date
                    </span>
                    <p className="text-foreground">{activePayload.mfg || "Unknown"}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Expiry Date
                    </span>
                    <p className="text-foreground font-semibold">{activePayload.exp || "Unknown"}</p>
                  </div>

                  <div className="col-span-2 space-y-1 border-t border-border/20 pt-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Composition</span>
                    <p className="text-foreground leading-normal">{activePayload.ing || "Not detailed"}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Ledger Status Checklist */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-primary" />
                    Ledger Integrity Dossier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {ledgerLoading ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading on-chain registry data...
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {/* Check 1: Blockchain Anchor */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${blockchainRecord?.chainStatus === "unregistered" ? "text-amber-500" : "text-emerald-500"}`} />
                          <span className="text-xs font-semibold">Blockchain smart-contract receipt</span>
                        </div>
                        <Badge variant={blockchainRecord?.chainStatus === "unregistered" ? "suspect" : "genuine"} className="text-[9px]">
                          {blockchainRecord?.chainStatus === "unregistered" ? "NOT ANCHORED" : "ANCHORED & SECURE"}
                        </Badge>
                      </div>

                      {/* Check 2: Expiry Validation */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border bg-secondary/20">
                        {(() => {
                          const isExpired = activePayload.exp ? new Date(activePayload.exp) < new Date() : false;
                          return (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className={`h-4 w-4 ${isExpired ? "text-rose-500" : "text-emerald-500"}`} />
                                <span className="text-xs font-semibold">Remaining product shelf-life</span>
                              </div>
                              <Badge variant={isExpired ? "fake" : "genuine"} className="text-[9px]">
                                {isExpired ? "EXPIRED" : "OK"}
                              </Badge>
                            </>
                          );
                        })()}
                      </div>

                      {/* Check 3: Recall Verification */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg border bg-secondary/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 ${blockchainRecord?.flagged ? "text-rose-500" : "text-emerald-500"}`} />
                          <span className="text-xs font-semibold">Emergency recall check</span>
                        </div>
                        <Badge variant={blockchainRecord?.flagged ? "fake" : "genuine"} className="text-[9px]">
                          {blockchainRecord?.flagged ? "LOT RECALLED" : "NO ACTIVE RECALL"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pretrained AI LLM Analysis Panel */}
              <Card className="bg-slate-950 text-slate-100 border-primary/20 overflow-hidden">
                <CardHeader className="bg-slate-900 border-b border-slate-800/80 flex flex-row items-center justify-between py-3">
                  <CardTitle className="text-xs flex items-center gap-2 text-primary font-bold">
                    <Cpu className="h-4 w-4 text-primary animate-pulse" />
                    Pretrained AI LLM Diagnosis
                  </CardTitle>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground uppercase font-bold">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-bounce" />
                    MedGuard Edge v2.1
                  </div>
                </CardHeader>
                <CardContent className="pt-4 font-mono text-[11px] leading-relaxed min-h-[140px] max-h-[300px] overflow-y-auto">
                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="h-7 w-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] text-muted-foreground animate-pulse">
                        LLM analyzing ingredients, manufacturer registry, and temporal data...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 whitespace-pre-wrap select-text">
                      {animatedReport}
                      {animatedReport.length < aiReport.length && (
                        <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pharmacist Actions: Delivery Check-in */}
              {user?.role === "pharmacist" || user?.role === "admin" ? (
                <Card className="border-primary bg-primary/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-primary" />
                      Pharmacist Custody Check-in
                    </CardTitle>
                    <CardDescription className="text-[10px]">
                      Accept this delivery to add this verified lot key directly to your retail pharmacy catalog.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      onClick={handleCheckIn}
                      disabled={submittingCheckIn || blockchainRecord?.flagged}
                      className="w-full bg-primary text-primary-foreground font-bold text-xs h-10 shadow-lg"
                    >
                      {submittingCheckIn ? "Broadcasting check-in..." : "Accept Delivery & Inventory Check-in"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="p-3 bg-secondary/30 rounded-lg border text-center text-[10px] text-muted-foreground">
                  Logged in as <span className="font-bold capitalize">{user?.role}</span>. Change role to <span className="font-bold text-primary">pharmacist</span> to execute custody check-in.
                </div>
              )}
            </div>
          ) : (
            <Card className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-dashed border-border/60 bg-secondary/10">
              <CardContent className="space-y-3">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground border border-border/40">
                  <QrCode className="h-6 w-6 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-sm">Waiting for QR Code scan</h4>
                <p className="text-[11px] text-muted-foreground max-w-xs leading-normal">
                  Aim camera at delivery package QR tag, or choose a lot from the Audit Simulations sidebar to review authentication metrics.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
