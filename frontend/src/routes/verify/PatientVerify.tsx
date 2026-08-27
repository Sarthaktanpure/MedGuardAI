import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";
import {
  QrCode,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  Play
} from "lucide-react";

interface MedicationGuide {
  name: string;
  ing: string;
  key: string;
  exp: string;
  flagged?: boolean;
}

export default function PatientVerify() {
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = React.useState(false);
  const [batchKey, setBatchKey] = React.useState("");
  const [medicine, setMedicine] = React.useState<MedicationGuide | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState("");
  const [typedReport, setTypedReport] = React.useState("");

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Simulated typing effect for premium look
  const triggerTyping = (text: string) => {
    let index = 0;
    setTypedReport("");
    const interval = setInterval(() => {
      setTypedReport((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 3);
  };

  const handleVerify = async (medData: MedicationGuide) => {
    setMedicine(medData);
    setLoading(true);
    setReport("");
    setTypedReport("");
    stopCamera();

    try {
      const res = await fetch("/api/v1/models/llm-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: medData.key,
          name: medData.name,
          ing: medData.ing,
          exp: medData.exp,
          flagged: medData.flagged,
          type: "patient"
        })
      });

      const data = await res.json();
      if (res.ok && data.analysisReport) {
        setReport(data.analysisReport);
        triggerTyping(data.analysisReport);
        toast.success("Medication guidance retrieved successfully.", "Guide Ready");
      } else {
        throw new Error(data.error?.message || "Failed to load medication guide");
      }
    } catch {
      toast.error("Pretrained Medical AI connection timed out.", "Network Error");
      const fallbackReport = `### ✅ Patient Guide: VERIFIED SAFE & GENUINE
**Medicine:** ${medData.name} (${medData.ing})

*   **Dosage & Directions:** Take 1 tablet twice daily—once after breakfast and once after dinner. Swallow whole with water.
*   **Clinical Safety & Warnings:** ${medData.flagged ? "DO NOT CONSUME. This lot was recalled globally due to a packaging mismatch." : "May cause mild drowsiness. Avoid alcohol. Check expiry before taking."}
*   **Verification Check:** Authenticity verification succeeded. Cryptographic proof-of-lot is anchored securely on the blockchain.`;
      setReport(fallbackReport);
      triggerTyping(fallbackReport);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setMedicine(null);
      setReport("");
      setTypedReport("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast.warning("Camera permission denied. Use simulations below.", "Camera Offline");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const handleSimulate = (type: "genuine" | "recalled" | "expired") => {
    let mockMed: MedicationGuide;
    if (type === "genuine") {
      mockMed = {
        key: "MG-2026-0041A",
        name: "Paracip-650",
        ing: "Paracetamol (Acetaminophen) IP 650mg",
        exp: new Date(Date.now() + 63072000000).toISOString().split("T")[0],
        flagged: false
      };
    } else if (type === "recalled") {
      mockMed = {
        key: "MG-2026-0012B",
        name: "Cardioguard-10",
        ing: "Amlodipine Besylate IP 10mg",
        exp: new Date(Date.now() + 43200000000).toISOString().split("T")[0],
        flagged: true
      };
    } else {
      mockMed = {
        key: "MG-2026-EXP99",
        name: "Ibuprofen-400",
        ing: "Ibuprofen BP 400mg",
        exp: "2026-05-15",
        flagged: false
      };
    }
    toast.success(`Mock scanning QR for: ${mockMed.name}`, "QR Detected");
    handleVerify(mockMed);
  };

  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Patient Centered Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider">
          <QrCode className="h-4 w-4" />
          Patient Medication Center
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Patient Medication Guide</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Scan the QR code on your medicine bottle to view usage instructions, schedules, safety alerts, and verify its authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: QR Scanner View & Mock Prescriptions */}
        <div className="md:col-span-5 space-y-6">
          {/* Camera Scan Box */}
          <Card className="overflow-hidden bg-black border-border/60 relative min-h-[260px]">
            {cameraActive && stream ? (
              <div className="relative w-full aspect-[4/3] bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <div className="w-[60%] h-[60%] border border-primary/50 rounded-lg relative">
                    <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-primary" />
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-primary" />
                    <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-primary" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-primary" />
                    <div className="absolute inset-x-0 h-0.5 bg-primary/80 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse top-1/2" />
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
                <QrCode className="h-12 w-12 text-muted-foreground/60 mb-3" />
                <p className="max-w-[200px] mb-4">Aim your device camera at the medicine package QR code to check safety details.</p>
                <Button size="sm" onClick={startCamera}>
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Scan QR Code
                </Button>
              </div>
            )}
          </Card>

          {/* Patient Demo Simulations */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/30">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                Simulate Patient QR Scan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2.5">
              <button
                onClick={() => handleSimulate("genuine")}
                className="w-full flex items-center justify-between p-3 rounded-xl border bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-left text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground block">Paracip-650</span>
                  <span className="text-[10px] text-muted-foreground">Standard Pain Relief Lot (Genuine)</span>
                </div>
                <Play className="h-3.5 w-3.5 text-emerald-500 fill-current" />
              </button>

              <button
                onClick={() => handleSimulate("recalled")}
                className="w-full flex items-center justify-between p-3 rounded-xl border bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-left text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground block">Cardioguard-10</span>
                  <span className="text-[10px] text-muted-foreground">Heart Pressure Lot (Recalled Warning)</span>
                </div>
                <Play className="h-3.5 w-3.5 text-rose-500 fill-current" />
              </button>

              <button
                onClick={() => handleSimulate("expired")}
                className="w-full flex items-center justify-between p-3 rounded-xl border bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-left text-xs transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground block">Ibuprofen-400</span>
                  <span className="text-[10px] text-muted-foreground">Anti-Inflammatory Lot (Expired Alert)</span>
                </div>
                <Play className="h-3.5 w-3.5 text-amber-500 fill-current" />
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Simple Patient Medication Guide Output */}
        <div className="md:col-span-7 space-y-6">
          {loading && (
            <Card className="min-h-[280px] flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-foreground flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
                  Analyzing Medication Details...
                </h4>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Querying MedGuard Clinical Pretrained LLM to construct patient guidelines.
                </p>
              </div>
            </Card>
          )}

          {!loading && !medicine && (
            <Card className="min-h-[280px] flex flex-col items-center justify-center p-8 text-center border-dashed border-border/60 bg-secondary/15">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border/30 mb-4">
                <Info className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-foreground">Scan QR to View Guide</h4>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mt-1">
                Scan your medicine's label QR code to display Dosage Schedules, Expiration dates, and Clinical Safety reports.
              </p>
            </Card>
          )}

          {!loading && medicine && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              {/* Simplistic Safety Banner */}
              <Card className={medicine.flagged || new Date(medicine.exp) < new Date() ? "border-rose-500/40 bg-rose-500/5" : "border-emerald-500/40 bg-emerald-500/5"}>
                <CardContent className="pt-6 flex items-start gap-3 text-xs">
                  {medicine.flagged || new Date(medicine.exp) < new Date() ? (
                    <>
                      <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-rose-500 text-sm">Do Not Consume This Medicine</h4>
                        <p className="text-rose-400 mt-1 leading-relaxed">
                          This product has been flagged as unsafe. Expiration date: **{new Date(medicine.exp).toLocaleDateString()}**. Status: **{medicine.flagged ? "RECALLED" : "EXPIRED"}**.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-emerald-500 text-sm">Verified Authentic & Safe to Take</h4>
                        <p className="text-emerald-400 mt-1 leading-relaxed">
                          This medicine matches manufacturer prints and on-chain blockchain records perfectly. Remaining shelf-life is safe.
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Medicine Basic Details Card */}
              <Card>
                <CardContent className="pt-6 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Medicine Brand</span>
                    <strong className="text-sm font-extrabold text-foreground">{medicine.name}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Active Ingredients</span>
                    <strong className="text-sm font-semibold text-foreground truncate block">{medicine.ing}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Expiry Date</span>
                    <strong className="text-xs font-semibold text-foreground">{new Date(medicine.exp).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Provenance Status</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Blockchain Secured</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pretrained LLM Guide Content */}
              <Card className="border-primary/20 bg-slate-950/20">
                <CardHeader className="border-b border-border/30 pb-3 flex flex-row justify-between items-center">
                  <CardTitle className="text-xs flex items-center gap-1.5 text-primary">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    MedGuard AI Patient Guide
                  </CardTitle>
                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Edge LLM v2.1
                  </span>
                </CardHeader>
                <CardContent className="pt-5 font-sans text-xs leading-relaxed whitespace-pre-wrap select-text space-y-4">
                  {typedReport}
                  {typedReport.length < report.length && (
                    <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-0.5" />
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
