import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity, ArrowRight, Zap, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 p-8 md:p-14 text-slate-100 flex flex-col md:flex-row gap-8 items-center shadow-xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 h-[280px] w-[280px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Supply Chain Trust
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-lg mx-auto md:mx-0">
            Verify Your Medicine, <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Instantly.</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
            MedGuard combines edge ML scanning, decentralized ledger registration, and regional maps to eradicate counterfeit medicine.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = "/verify#/"}>
              Start Fast Scan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-slate-100 border-slate-700 hover:bg-slate-800" onClick={() => window.location.href = "/auth#/"}>
              Register Account
            </Button>
          </div>
        </div>

        {/* Feature grid overlay on hero */}
        <div className="w-full md:w-[360px] bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md space-y-4 text-xs z-10">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Security Protocol Stack</h4>
          <ul className="space-y-3">
            <li className="flex gap-2.5 items-start">
              <span className="h-5 w-5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-200">On-Device CNN Inference</strong>
                <p className="text-slate-400 leading-normal">Inspect packaging details locally without shipping images over networks.</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="h-5 w-5 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-200">Blockchain Provenance</strong>
                <p className="text-slate-400 leading-normal">Immutable batch registry verified against decentralized smart contracts.</p>
              </div>
            </li>
            <li className="flex gap-2.5 items-start">
              <span className="h-5 w-5 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-slate-200">Real-Time Threat Maps</strong>
                <p className="text-slate-400 leading-normal">Geographic counter-measures warn district health centers of alerts immediately.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. PROBLEM IMPACT STAT STRIP */}
      <section className="bg-card border border-border p-6 rounded-2xl">
        <h4 className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">
          Global Counterfeit Medicine Threat Landscape
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-border/60">
          <div className="text-center p-3 md:p-0 flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-extrabold text-rose-500">10.5%</span>
            <span className="text-xs font-semibold text-foreground mt-2">WHO Prevalence Rate</span>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              Of all medicines in low and middle-income nations are substandard or falsified.
            </p>
          </div>
          <div className="text-center p-3 md:p-0 pt-6 md:pt-0 flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-extrabold text-rose-500">1 Million+</span>
            <span className="text-xs font-semibold text-foreground mt-2">Annual Deaths</span>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              Attributed directly to toxic or inactive ingredients in counterfeit medications.
            </p>
          </div>
          <div className="text-center p-3 md:p-0 pt-6 md:pt-0 flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-extrabold text-rose-500">$30.5 Billion</span>
            <span className="text-xs font-semibold text-foreground mt-2">Illicit Industry Value</span>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              Annual economic drain and funding channel for transnational crime cartels.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS 3-STEP VISUAL */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold">Three Steps to Safety</h2>
          <p className="text-sm text-muted-foreground">
            Our multi-layered inspection engine resolves verification status within seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-premium">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Activity className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">1. Capture Pack Scan</CardTitle>
              <CardDescription className="text-xs">Inspect layout features on-device</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Open the verification camera, align the medicine blister pack with the framing guide, and trigger a photo. The local classifier runs inference.
            </CardContent>
          </Card>

          <Card className="hover-premium">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">2. Validate Ledger</CardTitle>
              <CardDescription className="text-xs">Immutable chain provenance</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              The app automatically extracts batch key hashes and queries the decentralized Ethereum registry to ensure the batch is legitimately recorded.
            </CardContent>
          </Card>

          <Card className="hover-premium">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">3. Review Verdict Map</CardTitle>
              <CardDescription className="text-xs">Immediate countermeasures</CardDescription>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Receive a diagnostic confidence score, heatmaps of visual defects, and geo-hazard warnings if the product has been recalled in your territory.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. ROLE-BASED CTA CARDS */}
      <section className="space-y-6">
        <h3 className="text-center font-bold text-lg">Integrated Ecosystem for Everyone</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base">For Patients & Pharmacies</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Protect yourself and your customers before dispensing medications.
              </p>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>• Mobile-first offline-ready verification</p>
              <p>• Immediate diagnostic report cards</p>
              <p>• Historical logs of verified purchases</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs" onClick={() => window.location.href = "/verify#/"}>
                Go to Verification Center
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base">For Manufacturers</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Log batches onto the ledger and trace verification counts over time.
              </p>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>• Smart contract batch onboarding wizard</p>
              <p>• Immediate counterfeit alerts dashboard</p>
              <p>• Recall propagation triggers in seconds</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs" onClick={() => window.location.href = "/auth#/signup"}>
                Onboard Manufacturer
              </Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-base">For District Regulators</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinate inspections and watch counterfeit clusters emerge.
              </p>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <p>• Dynamic geographic counterfeit mapping</p>
              <p>• Regional incidence rate trend metrics</p>
              <p>• CSV/PDF exportable field audit logs</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-xs" onClick={() => window.location.href = "/auth#/signup"}>
                Register Inspector
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
