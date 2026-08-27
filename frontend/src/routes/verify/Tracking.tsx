import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/Card";
import { Input } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";
import { Truck, MapPin, Shield, Calendar, Search, ArrowRight, CheckCircle2, Clock } from "lucide-react";

interface TrackingEvent {
  _id: string;
  trackingId: string;
  status: string;
  location: string;
  note: string;
  createdAt: string;
}

export default function Tracking() {
  const [trackingId, setTrackingId] = React.useState("MG-DEL-001");
  const [timeline, setTimeline] = React.useState<TrackingEvent[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [etaSeconds, setEtaSeconds] = React.useState(1420); // Simulated remaining time
  const [liveTemp, setLiveTemp] = React.useState(4.1);

  // Tick ETA and fluctuate cold-chain temperature in real-time
  React.useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => (prev > 10 ? prev - 1 : 1420));
      setLiveTemp((prev) => {
        const change = (Math.random() - 0.5) * 0.15;
        const target = prev + change;
        return target < 3.5 ? 3.5 : target > 4.7 ? 4.7 : parseFloat(target.toFixed(1));
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatEta = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  const fetchTracking = async (idToSearch: string) => {
    if (!idToSearch.trim()) {
      toast.warning("Please enter a valid tracking ID", "Input Required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/tracking/${idToSearch.trim()}`);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error?.message || "Tracking ID not found");
      }

      setTimeline(json.items || []);
      setSearched(true);
      toast.success(`Loaded custody timeline for ${idToSearch}`, "Tracking Resolved");
    } catch (err: any) {
      setTimeline([]);
      setSearched(true);
      toast.error(err.message || "Failed to load tracking data", "Query Failed");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    void fetchTracking("MG-DEL-001");
  }, []);

  // Determine if seal is compromised or if temperature violated at any point
  const isSealCompromised = timeline.some(t => !t.sealIntact);
  const isTempViolated = timeline.some(t => t.temperature > 8);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider">
          <Shield className="h-3.5 w-3.5" />
          Ledger Provenance
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Shipment & Custody Tracer</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Trace package provenance, manufacturer exit scans, and distributor handoffs in real-time.
        </p>
      </div>

      {/* Query Bar */}
      <Card className="border-primary/20 shadow-md">
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter Shipment Lot or Tracking ID (e.g. MG-DEL-001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="pl-9 font-mono"
            />
          </div>
          <Button onClick={() => fetchTracking(trackingId)} disabled={loading} className="w-full sm:w-auto shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
            {loading ? "Searching..." : "Trace Route"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {searched && timeline.length === 0 ? (
        <Card className="border-dashed border-rose-500/30 bg-rose-500/5 text-center p-8">
          <CardContent className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-rose-500">No History Found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We couldn't locate any registered checkpoints for tracking ID <code className="font-mono text-xs px-1 py-0.5 bg-secondary rounded">{trackingId}</code>.
            </p>
          </CardContent>
        </Card>
      ) : searched ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Timeline & Custody logs - Left 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Horizontal Map Path Visualizer */}
            <Card className="overflow-hidden bg-gradient-to-b from-card to-card/50">
              <CardContent className="h-44 relative flex items-center justify-center px-4">
                <div className="w-full max-w-md relative py-12 flex justify-between items-center">
                  <div className="absolute left-0 right-0 h-1 bg-border rounded-full z-0" />
                  <div 
                    className="absolute left-0 h-1 bg-primary rounded-full z-0 transition-all duration-500" 
                    style={{ width: timeline.length > 1 ? `${((timeline.length - 1) / 3) * 100}%` : "0%" }}
                  />

                  {(["Registered", "In Transit", "Delivered", "Dispensed"] as const).map((step, index) => {
                    const resolvedEvent = timeline.find(e => e.status.toLowerCase().includes(step.toLowerCase()));
                    const isActive = !!resolvedEvent;
                    const isLastActive = timeline[timeline.length - 1]?.status.toLowerCase().includes(step.toLowerCase());

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center">
                        <div 
                          className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive 
                              ? isLastActive 
                                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                                : "bg-background border-primary text-primary" 
                              : "bg-background border-border text-muted-foreground"
                          }`}
                        >
                          {isActive && !isLastActive ? (
                            <CheckCircle2 className="h-4.5 w-4.5" />
                          ) : step === "Registered" ? (
                            <Shield className="h-3.5 w-3.5" />
                          ) : step === "In Transit" ? (
                            <Truck className="h-3.5 w-3.5" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="absolute top-11 text-center w-24">
                          <span className={`text-[9px] font-bold block capitalize ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {step}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Checkpoints Timeline */}
            <Card className="bg-card">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-primary" />
                  Custody Timeline Checkpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative pl-6 border-l-2 border-border space-y-6 ml-2 text-xs">
                  {timeline.map((event) => (
                    <div key={event._id} className="relative">
                      <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                      <div className="space-y-1">
                        <div className="flex justify-between items-center gap-1">
                          <strong className="text-foreground text-xs font-bold">{event.status}</strong>
                          <span className="text-[9px] text-muted-foreground shrink-0">
                            {new Date(event.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })} &bull; {new Date(event.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {event.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Telemetry View - Right 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-primary/30 bg-slate-950/20 overflow-hidden relative">
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 text-[9px] text-rose-500 font-extrabold animate-pulse uppercase tracking-wider">
                <span className="h-1.5 w-1.5 bg-rose-500 rounded-full" />
                Live GPS
              </div>
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Truck className="h-4.5 w-4.5 text-primary" />
                  Live Shipping Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-5 text-xs">
                {/* Simulated ETA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40">
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">ETA Countdown</span>
                    <strong className="text-sm font-extrabold text-foreground tracking-tight">
                      {formatEta(etaSeconds)}
                    </strong>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl border border-border/40">
                    <span className="text-muted-foreground block text-[9px] uppercase font-bold">Cold Chain Temp</span>
                    <strong className={`text-sm font-extrabold tracking-tight ${isTempViolated ? "text-rose-500" : "text-emerald-500"}`}>
                      +{liveTemp}°C
                    </strong>
                  </div>
                </div>

                {/* Animated delivery route GPS line */}
                <div className="relative h-28 bg-slate-950 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
                  <svg className="w-full h-full text-muted-foreground/30 relative z-10" viewBox="0 0 100 40">
                    {/* Road track line */}
                    <path
                      d="M 10,20 Q 30,5 50,20 T 90,20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4,4"
                    />
                    {/* Finished line */}
                    <path
                      d="M 10,20 Q 30,5 50,20 T 90,20"
                      fill="none"
                      stroke="var(--color-emerald-500)"
                      strokeWidth="2"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (timeline.length * 25)}
                      className="transition-all duration-1000"
                    />
                    {/* Animated dispatch vehicle marker */}
                    <circle cx={10 + (timeline.length * 20)} cy={20 + (Math.sin(timeline.length) * 5)} r="3.5" fill="var(--color-primary)" className="animate-pulse" />
                  </svg>
                  <span className="absolute bottom-2 right-3 text-[8px] text-muted-foreground uppercase font-bold tracking-wider">
                    route simulation
                  </span>
                </div>

                {/* Real-time telemetry specifications */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                    <span className="text-muted-foreground">Blockchain Anchor Status</span>
                    <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold uppercase">
                      Immutable OK
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                    <span className="text-muted-foreground">Telemetry Sensors</span>
                    <span className="font-semibold text-foreground">Calibrated</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/20">
                    <span className="text-muted-foreground">Seal Check-in</span>
                    <span className={`font-bold ${isSealCompromised ? "text-rose-500" : "text-emerald-500"}`}>
                      {isSealCompromised ? "Tampered / Broken" : "Secure / Intact"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Inline icons definition for clean compiling
function Truck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5.14a1 1 0 0 0-.294-.707l-2.073-2.073A1 1 0 0 0 18.927 9H14v9" />
      <circle cx="7.5" cy="18.5" r="2.5" />
      <circle cx="16.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
