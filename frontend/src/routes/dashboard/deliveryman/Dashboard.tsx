import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input, FormItem } from "../../../components/ui/Form";
import { toast } from "../../../components/ui/Toast";
import {
  Truck,
  MapPin,
  Thermometer,
  Lock,
  Compass,
  Link as LinkIcon,
  Activity,
  Plus
} from "lucide-react";
import { Batch } from "../../../../shared/types";

export default function DeliverymanDashboard() {
  const [batchKey, setBatchKey] = React.useState("");
  const [status, setStatus] = React.useState("In Transit");
  const [location, setLocation] = React.useState("");
  const [latitude, setLatitude] = React.useState(19.076); // Default Mumbai
  const [longitude, setLongitude] = React.useState(72.877);
  const [temperature, setTemperature] = React.useState(4.0); // Default cold chain temperature
  const [sealIntact, setSealIntact] = React.useState(true);
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch registered batches to choose from
  const { data: batches = [] } = useQuery<Batch[]>({
    queryKey: ["batches-list"],
    queryFn: async () => {
      const res = await fetch("/api/v1/batches");
      if (!res.ok) throw new Error("Failed to load batches");
      return res.json();
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchKey) {
      toast.error("Please select a lot batch to check in.", "Validation");
      return;
    }
    if (!location.trim()) {
      toast.error("Please specify transit location.", "Validation");
      return;
    }

    setSubmitting(true);
    try {
      const trackingId = `MG-DEL-${batchKey}`;
      const payload = {
        trackingId,
        status,
        location: location.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        temperature: Number(temperature),
        sealIntact,
        note: note.trim() || `Transit check-in: ${status}`
      };

      const res = await fetch("/api/v1/tracking/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      
      toast.success(
        `Check-in logged! Hash: ${data.item.blockchainHash.substring(0, 16)}...`,
        "Mined Block Successfully"
      );
      
      // Reset inputs
      setLocation("");
      setNote("");
      setTemperature(4.0);
      setSealIntact(true);
    } catch {
      toast.error("Failed to commit transit log to ledger.", "Blockchain Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Logistics & Delivery Dashboard</h1>
        <p className="text-xs text-muted-foreground font-medium">
          Update shipment checkpoints, report temperatures, and seal conditions. Every entry is signed and added to the blockchain ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />
                Register Route Check-in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormItem>
                    <label className="font-semibold text-foreground">Select Shipment Lot</label>
                    <select
                      value={batchKey}
                      onChange={(e) => setBatchKey(e.target.value)}
                      className="w-full h-11 px-3 bg-background border border-border/80 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs"
                      required
                    >
                      <option value="">-- Choose Batch Lot --</option>
                      {batches.map((b) => (
                        <option key={b._id} value={b.batchKey}>
                          {b.batchKey} (Genesis: {b.chainStatus})
                        </option>
                      ))}
                    </select>
                  </FormItem>

                  <FormItem>
                    <label className="font-semibold text-foreground">Transit Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-11 px-3 bg-background border border-border/80 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 text-xs"
                    >
                      <option value="In Transit">In Transit</option>
                      <option value="Distributor Hub">Distributor Hub</option>
                      <option value="Customs Check">Customs Check</option>
                      <option value="Cold Storage Warehouse">Cold Storage Warehouse</option>
                      <option value="Out for Pharmacy Delivery">Out for Pharmacy Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </FormItem>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormItem className="sm:col-span-2">
                    <label className="font-semibold text-foreground">Location Description</label>
                    <Input
                      required
                      placeholder="e.g. Pune Express Hub, IN"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11"
                    />
                  </FormItem>

                  <FormItem>
                    <label className="font-semibold text-foreground flex items-center gap-1">
                      <Thermometer className="h-3 w-3 text-rose-500" />
                      Temperature (°C)
                    </label>
                    <Input
                      required
                      type="number"
                      step="0.1"
                      placeholder="4.0"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 0)}
                      className="h-11"
                    />
                  </FormItem>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormItem>
                    <label className="font-semibold text-foreground">Latitude</label>
                    <Input
                      required
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                      className="h-11"
                    />
                  </FormItem>

                  <FormItem>
                    <label className="font-semibold text-foreground">Longitude</label>
                    <Input
                      required
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                      className="h-11"
                    />
                  </FormItem>
                </div>

                <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between border border-border/40">
                  <div className="space-y-0.5">
                    <h5 className="font-bold flex items-center gap-1.5 text-foreground">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      Package Seal Intact
                    </h5>
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Confirm that all safety bands, RFID tags, and barcodes are unbroken.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sealIntact}
                    onChange={(e) => setSealIntact(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                  />
                </div>

                <FormItem>
                  <label className="font-semibold text-foreground">Transit Notes</label>
                  <Input
                    placeholder="e.g. Temperature stable. Dry ice replaced."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-11"
                  />
                </FormItem>

                <Button type="submit" className="w-full h-11 flex gap-2 font-bold" isLoading={submitting}>
                  <Plus className="h-4 w-4" />
                  Mined & Sign Check-in
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Shipments */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase font-semibold text-muted-foreground flex items-center gap-2">
                <Compass className="h-4 w-4" />
                Ledger Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                MedGuard operates on a cold-chain consensus model. Temperature logs are verified against maximum allowed safety limits (+8°C).
              </p>
              <p>
                Any temperature deviation above this limit, or a reported seal breach, triggers a warning state, immediately visible to pharmacists looking up the shipment.
              </p>
              <div className="p-3 bg-card border border-border/80 rounded-lg flex items-center gap-2.5">
                <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-[10px] text-foreground font-semibold">
                  EVM Mock Engine State: active & synchronizing
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
