import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import {
  ShieldCheck,
  ArrowRight,
  WifiOff,
  Cpu,
  Database,
  Lock,
  Camera,
  Play,
  ShieldAlert,
  Activity,
  Zap,
  RefreshCw
} from "lucide-react";
import heroArt from "../../assets/hero.png";

export default function Home() {
  const [simStep, setSimStep] = React.useState(0);
  const [liveTemp, setLiveTemp] = React.useState(4.2);

  const simStates = [
    {
      step: 0,
      badge: "Capture Viewfinder",
      status: "ALIGNING PACKAGE",
      info: "Fit medicine package inside camera frame boundaries...",
      progress: "25%",
      color: "text-slate-500",
      bg: "bg-slate-500/10",
      border: "border-slate-300/10",
      showLaser: true,
      verdict: "Awaiting Capture",
      conf: "0%"
    },
    {
      step: 1,
      badge: "On-Device AI Check",
      status: "ANALYZING PRINT TEXTURE",
      info: "Verifying packaging print density & layout integrity...",
      progress: "50%",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      showLaser: true,
      verdict: "Computing...",
      conf: "78%"
    },
    {
      step: 2,
      badge: "On-Chain Audit",
      status: "LEDGER AUDIT",
      info: "Querying Polygon decentralized drug registry lot keys...",
      progress: "75%",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      showLaser: false,
      verdict: "Checking Blockchain...",
      conf: "91%"
    },
    {
      step: 3,
      badge: "Audit Complete",
      status: "VERIFIED GENUINE",
      info: "Lot matches blockchain anchors & print dossiers perfectly.",
      progress: "100%",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
      showLaser: false,
      verdict: "Verified Safe & Genuine",
      conf: "98%"
    }
  ];

  React.useEffect(() => {
    const simInterval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % simStates.length);
    }, 3000);

    const tempInterval = setInterval(() => {
      setLiveTemp((prev) => {
        const change = (Math.random() - 0.5) * 0.1;
        const target = prev + change;
        return target < 3.8 ? 3.8 : target > 4.6 ? 4.6 : parseFloat(target.toFixed(1));
      });
    }, 1200);

    return () => {
      clearInterval(simInterval);
      clearInterval(tempInterval);
    };
  }, []);

  const currentSim = simStates[simStep];

  return (
    <div className="space-y-16 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/25 dark:from-[#020d09] dark:via-[#03150e] dark:to-[#041c13] border border-emerald-500/10 dark:border-emerald-950 p-8 md:p-14 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row gap-12 items-center shadow-xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 h-[280px] w-[280px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/20 dark:border-primary/25 rounded-full uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            AI + Blockchain + Offline First
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-xl mx-auto md:mx-0">
            Instant. Intelligent. <span className="text-primary block sm:inline">Trust Every Medicine.</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-lg mx-auto md:mx-0 leading-relaxed">
            MedGuard uses on-device AI and blockchain technology to verify medicine authenticity in real-time — even offline. Because your health should never be a gamble.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-bold shadow-lg shadow-primary/25 group" onClick={() => window.location.href = "/verify#/"}>
              Scan Medicine Now
              <Camera className="ml-2 h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-primary font-bold group" onClick={() => window.location.href = "#/how-it-works"}>
              <span className="text-primary-foreground">See How It Works</span>
              <Play className="ml-2 h-4 w-4 fill-current text-slate-800 dark:text-slate-100 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Right Visual mockups */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center gap-8 z-10 shrink-0 relative">
          {/* Packaging Box */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-2xl blur-2xl group-hover:bg-primary/30 transition-all duration-300" />
            <div className="relative bg-white/90 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md max-w-[220px] shadow-lg">
              <div className="relative rounded-xl overflow-hidden shadow-md">
                <img src={heroArt} alt="Medicine Box Pack Mockup" className="w-full object-cover border border-slate-100/50" />
                {/* Visual scan point overlay markers */}
                {currentSim.showLaser && (
                  <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                    <div className="w-[80%] h-[80%] border border-primary/40 rounded relative">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-bounce" />
                    </div>
                  </div>
                )}
                {!currentSim.showLaser && simStep === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/5">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500 animate-pulse">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <strong className="text-xs text-slate-800 dark:text-slate-200 block font-extrabold">Paracip-650</strong>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Paracetamol Tablets IP 650 mg</span>
              </div>
            </div>
          </div>

          {/* Phone Frame Mockup */}
          <div className="w-[230px] h-[430px] rounded-[38px] border-[6px] border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 shadow-xl relative overflow-hidden flex flex-col shrink-0 font-sans transition-all duration-300">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-100 dark:bg-slate-800 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-900 rounded-full" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 p-3.5 pt-8 flex flex-col justify-between z-10 text-[10px] text-slate-600 dark:text-slate-300">
              {/* Phone Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-2 mb-2">
                <span className="font-bold text-slate-500 dark:text-slate-400">Scan Simulator</span>
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${currentSim.bg} ${currentSim.color} border ${currentSim.border} uppercase tracking-tight`}>
                  {currentSim.badge}
                </span>
              </div>

              {/* Verdict card */}
              <div className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-900/80 p-2.5 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[8px] uppercase font-bold">Inference Verdict</span>
                  <strong className={`font-bold text-[9px] ${currentSim.color}`}>{currentSim.verdict}</strong>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: currentSim.progress }} />
                </div>
              </div>

              {/* Live Scanner simulation details */}
              <div className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-900/80 p-2.5 rounded-xl space-y-1.5">
                <span className="text-[8px] font-bold text-slate-400 block uppercase">Lifecycle Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-primary rounded-full animate-ping shrink-0" />
                  <strong className="text-slate-800 dark:text-slate-100 text-[9px] font-bold tracking-tight">
                    {currentSim.status}
                  </strong>
                </div>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {currentSim.info}
                </p>
              </div>

              {/* Confidence check indicator */}
              <div className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-900/80 p-2.5 rounded-xl flex items-center justify-between">
                <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">AI CONFIDENCE</span>
                <strong className={`text-[10px] font-extrabold ${currentSim.color}`}>{currentSim.conf || "---"}</strong>
              </div>

              {/* Blockchain Registry status */}
              <div className="bg-slate-50/90 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-900/80 p-2.5 rounded-xl">
                <div className="flex justify-between items-center text-[8px]">
                  <span className="font-mono text-slate-400">LOT: P2B20324</span>
                  {simStep === 3 ? (
                    <span className="text-emerald-500 font-extrabold">LEDGER ANCHORED</span>
                  ) : simStep === 2 ? (
                    <span className="text-cyan-500 font-extrabold animate-pulse">QUERYING LEDGER...</span>
                  ) : (
                    <span className="text-slate-400">AWAITING SCAN</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cold Chain Telemetry Widget */}
          <div className="absolute -bottom-6 -left-10 bg-white/95 dark:bg-slate-900/95 border border-emerald-500/15 dark:border-emerald-500/25 rounded-2xl p-3.5 shadow-xl backdrop-blur-md max-w-[170px] z-20 space-y-2 transition-all duration-300 hidden sm:block animate-bounce" style={{ animationDuration: '4.5s' }}>
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              Live Cold Chain
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[7px] uppercase font-semibold">Sensor Temp</span>
                <strong className="text-slate-800 dark:text-slate-100 font-extrabold">+{liveTemp}°C</strong>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[7px] uppercase font-semibold">Lot Seal</span>
                <strong className="text-emerald-500 dark:text-emerald-400 font-extrabold">INTACT</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Bottom Row Features Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
        <div className="flex items-center gap-3.5 bg-white/70 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-900/80 shadow-sm transition-colors">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <WifiOff className="h-4.5 w-4.5" />
          </div>
          <div>
            <strong className="text-xs text-slate-800 dark:text-slate-100 block font-bold">Works Offline</strong>
            <span className="text-[10px] text-muted-foreground">No Internet Needed</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 bg-white/70 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-900/80 shadow-sm transition-colors">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Cpu className="h-4.5 w-4.5" />
          </div>
          <div>
            <strong className="text-xs text-slate-800 dark:text-slate-100 block font-bold">AI-Powered</strong>
            <span className="text-[10px] text-muted-foreground">On-Device Detection</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 bg-white/70 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-900/80 shadow-sm transition-colors">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Database className="h-4.5 w-4.5" />
          </div>
          <div>
            <strong className="text-xs text-slate-800 dark:text-slate-100 block font-bold">Blockchain Secured</strong>
            <span className="text-[10px] text-muted-foreground">Tamper-Proof Records</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5 bg-white/70 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-900/80 shadow-sm transition-colors">
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Lock className="h-4.5 w-4.5" />
          </div>
          <div>
            <strong className="text-xs text-slate-800 dark:text-slate-100 block font-bold">Privacy Focused</strong>
            <span className="text-[10px] text-muted-foreground">Your Data is Safe</span>
          </div>
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
