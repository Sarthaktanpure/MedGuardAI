import * as React from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input, FormItem, FormMessage } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";
import { ShieldCheck, User, Building, Compass } from "lucide-react";
import { UserRole } from "../../../../shared/types";

export default function Signup() {
  const { signup } = useAuthStore();
  const [role, setRole] = React.useState<UserRole>("patient");
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please fill in all details.", "Validation");
      return;
    }

    setLoading(true);
    try {
      await signup(email, name, role);
      toast.success("Account created successfully! Proceeding to onboarding.", "Welcome");
      window.location.hash = "/onboarding";
    } catch {
      toast.error("Failed to register. Please try again.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      id: "patient" as UserRole,
      title: "Patient / Consumer",
      desc: "Verify packaging integrity of medicines you purchase at pharmacies.",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "manufacturer" as UserRole,
      title: "Manufacturer",
      desc: "Log batch cryptohashes on-chain and trace supply chains globally.",
      icon: <Building className="h-5 w-5" />,
    },
    {
      id: "regulator" as UserRole,
      title: "Health Inspector",
      desc: "Audit regional pharmacies, coordinate recalls, and view counterfeit clusters.",
      icon: <Compass className="h-5 w-5" />,
    },
  ];

  return (
    <div className="max-w-lg mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create Your MedGuard Account</h1>
        <p className="text-xs text-muted-foreground">
          Select your operational role below to start.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSignup} className="space-y-6 text-xs">
            {/* Visually distinct role selection cards */}
            <div className="space-y-2">
              <label className="font-semibold text-foreground">1. Choose Operational Role</label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setRole(opt.id)}
                    className={`flex items-start gap-4 p-4.5 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-secondary/40 ${
                      role === opt.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg border ${
                      role === opt.id ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border/80"
                    }`}>
                      {opt.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-sm leading-tight text-foreground">{opt.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-normal">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email/Name Inputs */}
            <div className="space-y-4">
              <label className="font-semibold text-foreground block">2. Account Credentials</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormItem>
                  <Input
                    required
                    placeholder="Full Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormItem>
                <FormItem>
                  <Input
                    required
                    type="email"
                    placeholder="Corporate or Personal Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormItem>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" isLoading={loading}>
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <a href="#/" className="text-primary hover:underline font-semibold">
          Sign In
        </a>
      </p>
    </div>
  );
}
