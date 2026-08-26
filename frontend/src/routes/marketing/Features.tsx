import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Camera, Cpu, CloudLightning, ShieldAlert, BarChart2, CheckCircle } from "lucide-react";

export default function Features() {
  const pillars = [
    {
      badge: "Detection",
      icon: <Camera className="h-5 w-5 text-emerald-500" />,
      title: "Blister Pack Classification",
      desc: "Local convolutional neural network evaluates print alignments, blister foil seals, card textures, and batch numbers. Highlights abnormalities using attention maps.",
    },
    {
      badge: "Offline",
      icon: <CloudLightning className="h-5 w-5 text-cyan-500" />,
      title: "Offline-First Sync Queue",
      desc: "Inspectors can queue scans and audits in remote, network-starved clinics. Scans are saved to local IndexedDB and sync to the backend once connectivity returns.",
    },
    {
      badge: "Provenance",
      icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
      title: "Blockchain Ledger Integrity",
      desc: "Batch metadata hashes are stored on public smart contracts. QR codes and packaging details are cryptographically locked to eliminate supply chain tampering.",
    },
    {
      badge: "Analytics",
      icon: <BarChart2 className="h-5 w-5 text-amber-500" />,
      title: "Regulator Threat Dashboards",
      desc: "Time-series charts and geographic heatmaps isolate counterfeit incidents by region. Allows authorities to route investigative resources to hotspot zones.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">System Capabilities</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          MedGuard features a dual-layer defensive framework that combines device edge ML classification with global blockchain lookup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((p, idx) => (
          <Card key={idx} className="hover-premium">
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-card border border-border/80 flex items-center justify-center">
                  {p.icon}
                </div>
                <CardTitle className="text-base">{p.title}</CardTitle>
              </div>
              <Badge variant="outline">{p.badge}</Badge>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed pt-2">
              {p.desc}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
