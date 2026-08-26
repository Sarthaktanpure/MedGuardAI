import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Camera, Cpu, Server, Database, Globe } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "1. Capture Blister Pack",
      desc: "The inspector or patient aligns the medicine container with the grid guides on their mobile device. The app captures high-definition packaging highlights.",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "2. Edge ML Inference",
      desc: "The ONNX neural network runs locally on the browser edge. It inspects print errors, texture anomalies, and packaging formats to generate a layout confidence rating.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "3. Blockchain Checksum Check",
      desc: "The app matches the batch key on the box against the decentralized Ethereum ledger to confirm that the manufacturer actually registered this exact batch.",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "4. Global Alert System",
      desc: "If the CNN model detects a fake or the ledger lookup fails, a geo-hazard flag is emitted, prompting regional regulators and notifying local clinics immediately.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">How MedGuard Protects You</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          MedGuard merges machine learning with blockchain provenance to create a MERN-scale anti-counterfeiting verification shield.
        </p>
      </div>

      {/* Grid mapping out steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, idx) => (
          <Card key={idx} className="hover-premium">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <CardTitle className="text-base">{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              {step.desc}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Simplified Architecture block */}
      <Card className="bg-slate-950/20">
        <CardHeader>
          <CardTitle className="text-base text-center">Decentralized Trust Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            Traditional medicine verification systems rely on centralized databases, making them prone to single-point failures, connectivity loss, and spoofing. MedGuard is designed around an <strong>offline-first, multi-signature trust model</strong>.
          </p>
          <p>
            Manufacturers sign and submit batch cryptohashes via smart contracts to an Ethereum-compatible network. On-device edge classification checks blister packaging print alignments without uploading high-resolution photos, saving bandwidth in low-resource environments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
