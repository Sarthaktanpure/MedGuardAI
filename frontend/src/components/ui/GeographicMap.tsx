import * as React from "react";
import { AlertCircle, ShieldAlert, MapPin } from "lucide-react";
import { cn } from "../../lib/utils/cn";

interface MapPinPoint {
  id: string;
  name: string;
  lat: number; // mapped to x percentage (0 - 100)
  lng: number; // mapped to y percentage (0 - 100)
  verdict: "genuine" | "suspect" | "fake";
  batchKey: string;
  timestamp: string;
}

const mockPins: MapPinPoint[] = [
  { id: "1", name: "Apex Pharmacy - North", lat: 35, lng: 25, verdict: "fake", batchKey: "MG-2026-0041A", timestamp: "10 mins ago" },
  { id: "2", name: "Metro Health Center - Central", lat: 50, lng: 45, verdict: "suspect", batchKey: "MG-2026-0012B", timestamp: "1 hour ago" },
  { id: "3", name: "Regional Depot - South", lat: 65, lng: 70, verdict: "genuine", batchKey: "MG-2026-0099Z", timestamp: "3 hours ago" },
  { id: "4", name: "City Pharmacy - East", lat: 80, lng: 35, verdict: "fake", batchKey: "MG-2026-0077F", timestamp: "5 mins ago" },
  { id: "5", name: "Border Transit Hub - West", lat: 20, lng: 60, verdict: "suspect", batchKey: "MG-2026-0033H", timestamp: "30 mins ago" },
];

export function GeographicMap() {
  const [selectedPin, setSelectedPin] = React.useState<MapPinPoint | null>(mockPins[0]);
  const [activeRegion, setActiveRegion] = React.useState<string | null>(null);

  const regions = [
    { id: "north", name: "Northern Territory", path: "M 20 10 L 80 10 L 70 40 L 30 40 Z", scans: 1420, fakeRate: 12.4 },
    { id: "central", name: "Central Metro Region", path: "M 30 40 L 70 40 L 65 65 L 35 65 Z", scans: 4320, fakeRate: 3.2 },
    { id: "south", name: "Southern Valley", path: "M 35 65 L 65 65 L 55 90 L 45 90 Z", scans: 950, fakeRate: 1.1 },
    { id: "west", name: "Western Border Province", path: "M 10 20 L 30 40 L 35 65 L 20 80 Z", scans: 1120, fakeRate: 8.7 },
    { id: "east", name: "Coastal East Province", path: "M 80 10 L 90 30 L 80 70 L 65 65 L 70 40 Z", scans: 2540, fakeRate: 5.6 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-card border border-border p-5 rounded-2xl">
      <div className="flex-1 relative bg-slate-950/40 rounded-xl border border-border/60 overflow-hidden min-h-[380px] flex items-center justify-center">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Vector Map SVG */}
        <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] relative z-10 transition-all duration-300">
          {/* Render regions */}
          {regions.map((reg) => (
            <path
              key={reg.id}
              d={reg.path}
              className={cn(
                "fill-slate-800/40 stroke-slate-700/60 stroke-[0.8] cursor-pointer transition-all duration-300 hover:fill-primary/20",
                activeRegion === reg.id && "fill-primary/30 stroke-primary/80 stroke-[1.2]"
              )}
              onClick={() => setActiveRegion(reg.id)}
              onMouseEnter={() => setActiveRegion(reg.id)}
            />
          ))}

          {/* Render Hotspot markers */}
          {mockPins.map((pin) => {
            const colors = {
              genuine: "fill-emerald-500 stroke-emerald-950",
              suspect: "fill-amber-500 stroke-amber-950",
              fake: "fill-rose-500 stroke-rose-950",
            };

            return (
              <g key={pin.id} className="cursor-pointer" onClick={() => setSelectedPin(pin)}>
                {/* Outer pulsing ring for alert hotspots */}
                {pin.verdict !== "genuine" && (
                  <circle
                    cx={pin.lat}
                    cy={pin.lng}
                    r="4"
                    className={cn(
                      "animate-ping fill-none opacity-75 stroke-[0.5]",
                      pin.verdict === "fake" ? "stroke-rose-500" : "stroke-amber-500"
                    )}
                  />
                )}
                {/* Core Pin Point */}
                <circle
                  cx={pin.lat}
                  cy={pin.lng}
                  r="2.5"
                  className={cn("stroke-[0.8] transition-all duration-300 hover:scale-[1.5]", colors[pin.verdict])}
                />
              </g>
            );
          })}
        </svg>

        {/* Map Label Overlay */}
        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/40 z-20">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Regulator Map</span>
          <h4 className="text-xs font-bold">Counterfeit Hotspot Tracker</h4>
        </div>
      </div>

      {/* Side Info Details panel */}
      <div className="w-full lg:w-[280px] flex flex-col gap-4">
        {activeRegion ? (
          (() => {
            const reg = regions.find((r) => r.id === activeRegion);
            if (!reg) return null;
            return (
              <div className="bg-slate-900/40 p-4 rounded-xl border border-border/40 animate-in fade-in">
                <span className="text-[10px] uppercase font-bold text-primary">Active Territory</span>
                <h4 className="font-bold text-sm mt-0.5">{reg.name}</h4>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Total Scans</span>
                    <span className="text-xs font-semibold">{reg.scans}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Fake Incidence</span>
                    <span className="text-xs font-semibold text-rose-500">{reg.fakeRate}%</span>
                  </div>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="bg-slate-900/20 p-4 rounded-xl border border-border/20 border-dashed text-center text-xs text-muted-foreground">
            Hover over a map region to view specific statistics.
          </div>
        )}

        {/* Active Selected Incident Pin Detail */}
        {selectedPin && (
          <div className="bg-slate-900/60 p-4 rounded-xl border border-border animate-in slide-in-from-right-5">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Selected Alert</span>
              <span
                className={cn(
                  "text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase",
                  selectedPin.verdict === "fake"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : selectedPin.verdict === "suspect"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}
              >
                {selectedPin.verdict}
              </span>
            </div>

            <h5 className="font-semibold text-xs mt-2 flex items-center gap-1.5 text-slate-100">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              {selectedPin.name}
            </h5>

            <div className="space-y-1.5 mt-3 text-[11px] text-muted-foreground border-t border-border/20 pt-2.5">
              <div className="flex justify-between">
                <span>Batch Key:</span>
                <span className="font-mono text-slate-200">{selectedPin.batchKey}</span>
              </div>
              <div className="flex justify-between">
                <span>Captured:</span>
                <span className="text-slate-200">{selectedPin.timestamp}</span>
              </div>
            </div>

            {selectedPin.verdict !== "genuine" && (
              <div className="mt-3.5 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 flex gap-2 items-start">
                <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-tight text-rose-300">
                  ML inspection triggered immediate recall protocol. Ledger notified.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
