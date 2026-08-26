import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export default function Legal() {
  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Legal Center</h1>
        <p className="text-sm text-muted-foreground">
          Terms of service and privacy compliance protocols.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Privacy Policy & HIPAA Alignment</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
          <p>
            MedGuard takes patient security and healthcare data privacy seriously. By default, package scans running on-device do not transmit images or facial characteristics to the cloud.
          </p>
          <p>
            Scans and telemetry recorded on our distributed ledger contain metadata hashes only (such as batch keys, check times, and verification diagnostics). No personally identifiable information (PII) is written to the blockchain.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
          <p>
            The MedGuard ledger validation tool is provided as-is to assist clinics and inspectors in detecting packaging defects. It does not replace chemical assays or lab evaluations.
          </p>
          <p>
            Pharmaceutical manufacturers are solely responsible for ensuring the accuracy of batch key hashes registered via smart contracts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
