import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { ArrowRight, ShieldCheck, FileSpreadsheet, Lock } from "lucide-react";

export function ForPharmacies() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">For Pharmacies & Clinics</h1>
        <p className="text-sm text-muted-foreground">
          Dispense medications with absolute confidence.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-2" />
            <CardTitle className="text-sm">Patient Safety First</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Eliminate fake packaging at point-of-sale. Simple mobile camera capture runs package verification in less than 2 seconds.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileSpreadsheet className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-sm">Audit Trails</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Keep historical records of inspected lots to protect your license and demonstrate compliance during regulatory audits.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lock className="h-6 w-6 text-blue-500 mb-2" />
            <CardTitle className="text-sm">Ledger Checksums</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Verify that manufacturer lot details exactly match blockchain transaction records before administering tablets.
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => window.location.href = "/auth#/signup"}>
          Create Pharmacy Account
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ForManufacturers() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">For Pharmaceutical Manufacturers</h1>
        <p className="text-sm text-muted-foreground">
          Secure your supply chain and protect your brand equity.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Lock className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-sm">Lot Cryptography</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Onboard production batches onto the blockchain ledger via standard smart contracts. Make verification keys public.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-2" />
            <CardTitle className="text-sm">Tamper Protection</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Provide verifiable blister pack templates to the neural network registry to train the packaging classifier model.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileSpreadsheet className="h-6 w-6 text-amber-500 mb-2" />
            <CardTitle className="text-sm">Divergence Alerts</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Get instant reports when package verification failures emerge in regional depots, enabling immediate recall containment.
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => window.location.href = "/auth#/signup"}>
          Register Manufacturer Portal
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ForRegulators() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">For Health Authorities & Inspectors</h1>
        <p className="text-sm text-muted-foreground">
          Enforce quality compliance with regional telemetry.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <ShieldCheck className="h-6 w-6 text-rose-500 mb-2" />
            <CardTitle className="text-sm">Incidence Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Monitor counterfeit drug prevalence ratios over time using interactive vector heatmaps and alert logs.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileSpreadsheet className="h-6 w-6 text-primary mb-2" />
            <CardTitle className="text-sm">Batch Recalls</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Flag compromised batches directly on-chain. Recall orders propagate instantly, notifying scanners in real time.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lock className="h-6 w-6 text-cyan-500 mb-2" />
            <CardTitle className="text-sm">Inspector Logbooks</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground leading-relaxed">
            Access secure audit trails containing scan geo-stamps, confidence ratings, and ledger transactions.
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <Button size="lg" onClick={() => window.location.href = "/auth#/signup"}>
          Register Inspector Credentials
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
