import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { BookOpen, HelpCircle, Users } from "lucide-react";

export default function About() {
  const team = [
    { name: "Dr. Elena Rostova", role: "Chief ML Architect", bio: "Former researcher at WHO Health Informatics Group. Specializes in edge neural architectures." },
    { name: "Marcus Vane", role: "Core Cryptography Lead", bio: "Smart contract engineer with 8 years of supply chain tracking experience on EVM platforms." },
  ];

  const blogs = [
    { title: "UNODC 2026 Counterfeit Report Analysis", date: "August 20, 2026", excerpt: "Analyzing the newest estimates on falsified malaria medications in sub-Saharan territories." },
    { title: "Why Web ONNX Inference Beats Server Checks", date: "July 12, 2026", excerpt: "Why local classification models are faster, safer, and consume 90% less bandwidth in regional audits." },
  ];

  const faqs = [
    { q: "Do users need active internet to scan blister packages?", a: "No. The convolutional model runs locally on the browser client using onnxruntime-web. The scan outputs a tentative verdict immediately, queueing the blockchain validation status to execute once a cellular sync is available." },
    { q: "How are manufacturer signatures validated?", a: "Lots are recorded as cryptographic hashes signed by verified pharmaceutical credentials on standard smart contracts. Anyone can inspect lot checksum alignments using the public search endpoint." },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      {/* Team section */}
      <section className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          The MedGuard Team
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((t) => (
            <Card key={t.name}>
              <CardHeader>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <span className="text-[10px] font-bold text-primary uppercase">{t.role}</span>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                {t.bio}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Recent Articles & Case Studies
        </h2>
        <div className="space-y-4">
          {blogs.map((b) => (
            <Card key={b.title} className="hover-premium">
              <CardHeader className="pb-2">
                <span className="text-[9px] text-muted-foreground">{b.date}</span>
                <CardTitle className="text-sm mt-1">{b.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {b.excerpt}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f, idx) => (
            <div key={idx} className="space-y-2 border-b border-border/40 pb-4">
              <h4 className="font-semibold text-sm">{f.q}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
