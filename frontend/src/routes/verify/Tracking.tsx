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
    // Initial fetch for demo purposes
    void fetchTracking("MG-DEL-001");
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Progress Visualizer (Left 2 cols on desktop) */}
          <Card className="md:col-span-2 overflow-hidden bg-gradient-to-b from-card to-card/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                Geographic Custody Path
              </CardTitle>
              <CardDescription className="text-xs">
                Visualizing route checkpoints matched against the immutable ledger logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 relative flex items-center justify-center px-4">
              <div className="w-full max-w-md relative py-12 flex justify-between items-center">
                {/* Horizontal progress bar track */}
                <div className="absolute left-0 right-0 h-1 bg-border rounded-full z-0" />
                <div 
                  className="absolute left-0 h-1 bg-primary rounded-full z-0 transition-all duration-500" 
                  style={{ width: timeline.length > 1 ? `${((timeline.length - 1) / 3) * 100}%` : "0%" }}
                />

                {/* Stop Nodes */}
                {(["Registered", "In Transit", "Delivered", "Dispensed"] as const).map((step, index) => {
                  const resolvedEvent = timeline.find(e => e.status.toLowerCase().includes(step.toLowerCase()));
                  const isActive = !!resolvedEvent;
                  const isLastActive = timeline[timeline.length - 1]?.status.toLowerCase().includes(step.toLowerCase());

                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive 
                            ? isLastActive 
                              ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                              : "bg-background border-primary text-primary" 
                            : "bg-background border-border text-muted-foreground"
                        }`}
                      >
                        {isActive && !isLastActive ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : step === "Registered" ? (
                          <Shield className="h-4 w-4" />
                        ) : step === "In Transit" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </div>
                      <div className="absolute top-12 text-center w-24">
                        <span className={`text-[10px] font-bold block capitalize ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {step}
                        </span>
                        {resolvedEvent && (
                          <span className="text-[9px] text-muted-foreground block truncate">
                            {resolvedEvent.location}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Activity list (Right 1 col on desktop) */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Custody Chain
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <div className="relative pl-6 border-l-2 border-border space-y-6 py-2 ml-2">
                {timeline.map((event, index) => (
                  <div key={event._id} className="relative">
                    {/* Event dot marker */}
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs font-extrabold text-foreground">
                          {event.status}
                        </span>
                        <span className="text-[9px] text-muted-foreground shrink-0 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <span className="text-[10px] text-primary flex items-center gap-1 font-semibold">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                      <p className="text-[11px] text-muted-foreground leading-normal">
                        {event.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
