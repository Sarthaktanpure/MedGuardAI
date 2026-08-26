import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input, FormItem } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";

export default function ForgotPassword() {
  const [step, setStep] = React.useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success("Security OTP sent to your registered email.", "OTP Dispatched");
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("reset");
      toast.success("OTP verified successfully.", "Authorized");
    }, 600);
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset completed. You can now log in.", "Success");
      window.location.hash = "/";
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      {step === "email" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recover Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your email address to dispatch a security verify token.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
              <FormItem>
                <Input
                  required
                  type="email"
                  placeholder="name@organization.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormItem>
              <Button type="submit" className="w-full" isLoading={loading}>
                Send Recovery OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "otp" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verify OTP Token</CardTitle>
            <CardDescription className="text-xs">
              Enter the 6-digit confirmation code sent to {email}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <FormItem>
                <Input
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center tracking-widest font-bold text-lg"
                />
              </FormItem>
              <Button type="submit" className="w-full" isLoading={loading}>
                Confirm OTP Code
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "reset" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Set New Password</CardTitle>
            <CardDescription className="text-xs">
              Choose a secure password configuration for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4 text-xs">
              <FormItem>
                <Input
                  required
                  type="password"
                  placeholder="New Password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormItem>
              <Button type="submit" className="w-full" isLoading={loading}>
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
