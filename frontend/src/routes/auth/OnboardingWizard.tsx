import * as React from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Form";
import { toast } from "../../components/ui/Toast";

export default function OnboardingWizard() {
  const { user, completeOnboarding } = useAuthStore();
  const [step, setStep] = React.useState(1);

  // Manufacturer fields
  const [company, setCompany] = React.useState("");
  const [license, setLicense] = React.useState("");
  const [initialBatch, setInitialBatch] = React.useState("");

  // Regulator fields
  const [region, setRegion] = React.useState("central");
  const [badgeId, setBadgeId] = React.useState("");

  // Patient fields
  const [locationConsent, setLocationConsent] = React.useState(true);

  const handleComplete = () => {
    const wizardData = {
      company,
      license,
      initialBatch,
      region,
      badgeId,
      locationConsent,
    };

    completeOnboarding(wizardData);
    toast.success("Onboarding profile saved! Entering console workspaces.", "Onboarding Complete");

    if (user?.role === "patient") {
      window.location.href = "/verify#/";
    } else {
      window.location.href = `/dashboard#/${user?.role || "patient"}`;
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Onboarding Profile Wizard</h1>
        <p className="text-xs text-muted-foreground">
          Welcome, {user?.displayName || "Member"}! Configure your settings before accessing the workspace.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b border-border/20 pb-4">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span>Role Setup: {user?.role.toUpperCase()}</span>
            <span>Step {step} of 2</span>
          </div>
        </CardHeader>
        <CardContent className="pt-6 text-xs space-y-4">
          {/* MANUFACTURER ONBOARDING */}
          {user?.role === "manufacturer" && (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Company Registration</h3>
                  <div className="space-y-1.5">
                    <label>Pharmaceutical Company Name *</label>
                    <Input
                      required
                      placeholder="e.g. Pfizer Global"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Manufacturing Facility License ID *</label>
                    <Input
                      required
                      placeholder="e.g. MFR-LIC-998822"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">First Batch Pre-registration</h3>
                  <div className="space-y-1.5">
                    <label>Onboard Initial Batch Key (Optional)</label>
                    <Input
                      placeholder="e.g. MG-2026-0041A"
                      value={initialBatch}
                      onChange={(e) => setInitialBatch(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Pre-registering batch keys makes them searchable immediately in the provenance verify database.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* REGULATOR ONBOARDING */}
          {user?.role === "regulator" && (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Audit Region Designation</h3>
                  <div className="space-y-1.5">
                    <label>Jurisdictional Territory *</label>
                    <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="north">Northern Territory (High Incident)</option>
                      <option value="central">Central Metropolitan Area</option>
                      <option value="south">Southern Valley Zone</option>
                      <option value="east">Coastal East District</option>
                      <option value="west">Western Border Province</option>
                    </Select>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Credentials Validation</h3>
                  <div className="space-y-1.5">
                    <label>Inspector Badge ID Card Number *</label>
                    <Input
                      required
                      placeholder="e.g. REG-BADGE-77443"
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* PATIENT/OTHER ONBOARDING */}
          {user?.role !== "manufacturer" && user?.role !== "regulator" && (
            <>
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Permission Preferences</h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-secondary/30">
                    <input
                      type="checkbox"
                      id="location"
                      checked={locationConsent}
                      onChange={(e) => setLocationConsent(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="location" className="leading-tight">
                      <strong>Share GPS coordinates during scans</strong>
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        Helps system isolate counterfeit locations and flag suspect pharmacies.
                      </span>
                    </label>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm">Finish Setup</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Camera permissions will be requested on the scan panel. Align medications cleanly.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Navigation Controls */}
          <div className="flex gap-3 justify-end border-t border-border/20 pt-4 mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Onboard Account
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
