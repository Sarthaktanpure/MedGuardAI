import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input, FormItem } from "../../../components/ui/Form";
import { toast } from "../../../components/ui/Toast";
import {
  ShieldCheck,
  ShieldAlert,
  Thermometer,
  Lock,
  Unlock,
  MapPin,
  Search,
  Activity,
  Link as LinkIcon,
  AlertTriangle,
  Barcode,
  X
} from "lucide-react";

interface TimelineEvent {
  _id: string;
  trackingId: string;
  status: string;
  location: string;
  latitude: number;
  longitude: number;
  temperature: number;
  sealIntact: boolean;
  note: string;
  blockchainHash: string;
  createdAt: string;
}

interface BatchDetails {
  _id: string;
  batchKey: string;
  metadataHash: string;
  chainTxHash: string;
  chainStatus: string;
  flagged: boolean;
  createdAt: string;
}

export default function PharmacistDashboard() {
  const [batchId, setBatchId] = React.useState("");
  const [searching, setSearching] = React.useState(false);
  const [batch, setBatch] = React.useState<BatchDetails | null>(null);
  const [timeline, setTimeline] = React.useState<TimelineEvent[]>([]);
  const [barcodeOpen, setBarcodeOpen] = React.useState(false);

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 90);
    } catch (e) {
      console.warn("Beep audio failed", e);
    }
  };

  const handleVerifyId = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;

    setSearching(true);
    setBatch(null);
    setTimeline([]);

    try {
      const resBatch = await fetch(`/api/v1/batches`);
      if (!resBatch.ok) throw new Error("Failed to search batches");
      const batchesList: BatchDetails[] = await resBatch.json();
      
      const foundBatch = batchesList.find(
        (b) => b.batchKey.toLowerCase() === idToVerify.trim().toLowerCase()
      );

      if (!foundBatch) {
        toast.error("Medicine Batch ID not found in ledger.", "Unknown Batch");
        setSearching(false);
        return;
      }

      setBatch(foundBatch);

      const trackingId = `MG-DEL-${foundBatch.batchKey}`;
      const resTimeline = await fetch(`/api/v1/tracking/${trackingId}`);
      if (resTimeline.ok) {
        const data = await resTimeline.json();
        setTimeline(data.items || []);
      } else {
        setTimeline([]);
      }
      
      toast.success("Cryptographic registry retrieved from ledger.", "Verification Complete");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to execute blockchain audit.", "Network Error");
    } finally {
      setSearching(false);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyId(batchId);
  };

  const handleBarcodeScan = (mockCode: string) => {
    playBeep();
    setBatchId(mockCode);
    setBarcodeOpen(false);
    toast.success(`Barcode detected: ${mockCode}`, "Scan Successful");
    handleVerifyId(mockCode);
  };

  // Check transit constraints: seal broken or temp > 8°C
  const isTempViated = timeline.some((evt) => evt.temperature > 8);
  const maxTemp = timeline.length > 0 ? Math.max(...timeline.map((e) => e.temperature)) : 0;
  const isSealBroken = timeline.some((evt) => !evt.sealIntact);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pharmacist Verification Hub</h1>
        <p className="text-xs text-muted-foreground font-medium">
          Scan product barcodes or input batch IDs to verify authenticity, packaging seals, and temperature logs.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                required
                placeholder="Enter Batch ID (e.g. MG-2026-0041A)"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="h-11 font-mono"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setBarcodeOpen(true)}
                className="h-11 px-3.5 flex gap-1.5 font-semibold text-muted-foreground border-border hover:text-foreground shrink-0"
              >
                <Barcode className="h-5 w-5" />
                <span>Scan Barcode</span>
              </Button>
            </div>
            <Button type="submit" className="h-11 px-6 flex gap-2 shrink-0" isLoading={searching}>
              <Search className="h-4 w-4" />
              Verify Lot
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Barcode Scanner View Modal */}
      {barcodeOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border/80 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/30">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Barcode className="h-5 w-5 text-primary" />
                Pharmacist Barcode Scanner
              </CardTitle>
              <button
                onClick={() => setBarcodeOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {/* Animated view finder */}
              <div className="relative aspect-[16/9] bg-black rounded-lg overflow-hidden border border-border/60 flex items-center justify-center">
                <div className="text-center p-4 text-[11px] text-slate-400 space-y-2 z-10">
                  <div className="mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p>Align package barcode inside the scanner lines...</p>
                </div>
                {/* Laser scan line overlay */}
                <div className="absolute inset-x-0 h-0.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-bounce z-20" style={{ top: "45%" }} />
              </div>

              {/* Barcode simulation options */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Select Product Barcode (Simulate Camera Scan)
                </span>
                <div className="space-y-1.5">
                  <button
                    onClick={() => handleBarcodeScan("MG-2026-0041A")}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/15 text-xs text-left"
                  >
                    <span className="font-semibold text-foreground">Paracip-650 (Paracetamol)</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">MG-2026-0041A</span>
                  </button>
                  <button
                    onClick={() => handleBarcodeScan("MG-2026-0012B")}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/15 text-xs text-left"
                  >
                    <span className="font-semibold text-foreground">Cardioguard-10 (Amlodipine)</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">MG-2026-0012B</span>
                  </button>
                  <button
                    onClick={() => handleBarcodeScan("MG-2026-EXP99")}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/15 text-xs text-left"
                  >
                    <span className="font-semibold text-foreground">Ibuprofen-400 (Ibuprofen)</span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">MG-2026-EXP99</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {batch && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Verification Summary */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={batch.flagged || isTempViated || isSealBroken ? "border-rose-500/50 bg-rose-500/[0.02]" : "border-emerald-500/50 bg-emerald-500/[0.02]"}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {batch.flagged || isTempViated || isSealBroken ? (
                      <ShieldAlert className="h-5 w-5 text-rose-500" />
                    ) : (
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    )}
                    Batch Verification Status
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    batch.flagged || isTempViated || isSealBroken
                      ? "bg-rose-500/10 text-rose-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {batch.flagged ? "RECALLED LOT" : isTempViated || isSealBroken ? "TAMPERED / FAILED" : "AUTHENTIC & VERIFIED"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block">Batch ID</span>
                    <strong className="text-sm font-semibold">{batch.batchKey}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">On-chain Genesis Timestamp</span>
                    <strong className="text-sm font-semibold">{new Date(batch.createdAt).toLocaleString()}</strong>
                  </div>
                </div>

                <div className="p-3 bg-card border border-border/80 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1">
                      <LinkIcon className="h-3 w-3 text-primary" />
                      Blockchain Ledger Anchor
                    </span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-semibold uppercase">
                      Immutable
                    </span>
                  </div>
                  <p className="text-[11px] font-mono break-all text-muted-foreground">
                    {batch.chainTxHash}
                  </p>
                </div>

                {/* Failures Alert Cards */}
                {isTempViated && (
                  <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
                    <Thermometer className="h-5 w-5 shrink-0 animate-bounce" />
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-xs">Cold-chain Violation Detected</h5>
                      <p className="text-[11px] leading-relaxed">
                        The transit temperature exceeded safety thresholds (+8°C), peaking at **{maxTemp}°C**. Discard batch immediately due to potency risk.
                      </p>
                    </div>
                  </div>
                )}

                {isSealBroken && (
                  <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg">
                    <AlertTriangle className="h-5 w-5 shrink-0 animate-pulse" />
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-xs">Package Seal Integrity Breach</h5>
                      <p className="text-[11px] leading-relaxed">
                        A transit checkpoint logged a BROKEN package seal. High risk of drug tampering, substitution, or counterfeiting.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transit Route Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Live Transit Audits (Zomato-Style Timeline)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                {timeline.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No shipping/transit records registered for this batch lot. Log in as the Delivery Man to add check-ins.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-6 border-l-2 border-primary/20">
                    {timeline.map((evt, idx) => (
                      <div key={evt._id} className="relative">
                        {/* Dot marker */}
                        <div className={`absolute -left-[31px] top-1 p-1 rounded-full border bg-card ${
                          !evt.sealIntact || evt.temperature > 8
                            ? "border-rose-500 text-rose-500"
                            : "border-primary text-primary"
                        }`}>
                          <MapPin className="h-3 w-3" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-foreground text-sm">{evt.status}</h4>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(evt.createdAt).toLocaleString()}
                            </span>
                          </div>

                          <p className="text-muted-foreground text-[11px]">
                            {evt.location} &bull; {evt.note}
                          </p>

                          {/* Telemetry info */}
                          <div className="flex gap-4 text-[10px] bg-secondary/35 p-2 rounded border border-border/40">
                            <span className="flex items-center gap-1 font-medium">
                              <Thermometer className="h-3.5 w-3.5 text-primary" />
                              Temp: <strong className={evt.temperature > 8 ? "text-rose-500 font-bold" : "text-foreground"}>{evt.temperature}°C</strong>
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              {evt.sealIntact ? (
                                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Unlock className="h-3.5 w-3.5 text-rose-500" />
                              )}
                              Seal: <strong className={evt.sealIntact ? "text-emerald-500" : "text-rose-500 font-bold"}>{evt.sealIntact ? "Intact" : "Broken"}</strong>
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground font-mono text-[9px] truncate max-w-xs">
                              Block: {evt.blockchainHash.substring(0, 16)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Info & Metrics Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase font-semibold text-muted-foreground">
                  Transit Constraints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Maximum Allowed Temp</span>
                  <span className="font-bold">8.0 °C</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Recorded Peak Temp</span>
                  <span className={`font-bold ${isTempViated ? "text-rose-500" : "text-emerald-500"}`}>
                    {maxTemp} °C
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/20">
                  <span className="text-muted-foreground">Seal Check-in</span>
                  <span className={`font-bold ${isSealBroken ? "text-rose-500" : "text-emerald-500"}`}>
                    {isSealBroken ? "Seal Breached" : "Fully Sealed"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase font-semibold text-muted-foreground">
                  Recall Directives
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-3">
                <p className="text-muted-foreground leading-normal">
                  If this lot matches a known counterfeit or packaging recall database, you can flag it globally to lock and quarantine inventory.
                </p>
                {!batch.flagged && (
                  <Button
                    variant="destructive"
                    className="w-full text-xs font-bold"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/v1/batches/${batch._id}/flag`, {
                          method: "POST"
                        });
                        if (!res.ok) throw new Error();
                        toast.success("Lot flagged globally. Blockchain updated.", "Recalled Lot");
                        setBatch({ ...batch, flagged: true });
                      } catch {
                        toast.error("Failed to dispatch recall flag.", "Network Error");
                      }
                    }}
                  >
                    Flag/Recall Lot
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
