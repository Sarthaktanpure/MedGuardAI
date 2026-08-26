import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import { Check } from "lucide-react";
import { toast } from "../../components/ui/Toast";

export default function Pricing() {
  const [form, setForm] = React.useState({ name: "", email: "", org: "", role: "manufacturer", message: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.org) {
      toast.error("Please fill out all required fields.", "Form Error");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Enterprise request received. Our team will contact you shortly.", "Request Sent");
      setForm({ name: "", email: "", org: "", role: "manufacturer", message: "" });
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Flexible Plans for Every Stakeholder</h1>
        <p className="text-sm text-muted-foreground">
          MedGuard offers free basic verification utilities and advanced enterprise trace tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Tier 1 */}
        <Card className="flex flex-col justify-between hover-premium">
          <CardHeader>
            <span className="text-[10px] uppercase font-bold text-primary">Public Utility</span>
            <CardTitle className="text-xl">Pharmacy & Clinic Free</CardTitle>
            <div className="text-2xl font-bold mt-2">$0 <span className="text-xs text-muted-foreground font-normal">/ forever</span></div>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited mobile blister scans</div>
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Public blockchain batch validation</div>
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Local database scan history cache</div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/verify#/"}>
              Get Started Now
            </Button>
          </CardFooter>
        </Card>

        {/* Tier 2 */}
        <Card className="flex flex-col justify-between border-primary/40 relative hover-premium">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-bold text-[9px] uppercase px-3 py-1 rounded-bl-xl">
            Enterprise
          </div>
          <CardHeader>
            <span className="text-[10px] uppercase font-bold text-primary">Brand Integrity</span>
            <CardTitle className="text-xl">Manufacturer & Government</CardTitle>
            <div className="text-2xl font-bold mt-2">Custom <span className="text-xs text-muted-foreground font-normal">quota-based</span></div>
          </CardHeader>
          <CardContent className="text-xs space-y-3">
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Smart contract batch registration portal</div>
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Real-time geo incident notification streams</div>
            <div className="flex gap-2 items-center"><Check className="h-4 w-4 text-emerald-500 shrink-0" /> Custom training parameters & model exports</div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => {
              document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Enterprise form */}
      <Card id="contact-section" className="bg-slate-950/20">
        <CardHeader>
          <CardTitle className="text-base">Request Enterprise Access</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold">Full Name *</label>
                <Input
                  required
                  placeholder="Inspector Jane"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="jane@unodc.org"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold">Organization / Agency *</label>
                <Input
                  required
                  placeholder="FDA Logistics Division"
                  value={form.org}
                  onChange={(e) => setForm({ ...form, org: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold">Role Profile</label>
                <Select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="manufacturer">Medicine Manufacturer</option>
                  <option value="regulator">District Regulator / Inspector</option>
                  <option value="admin">System Architect</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold">Inquiry Message</label>
              <textarea
                rows={3}
                placeholder="Describe your manufacturing lots or district inspection zones..."
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto" isLoading={submitting}>
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
