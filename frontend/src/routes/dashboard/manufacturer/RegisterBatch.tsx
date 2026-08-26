import * as React from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Form";
import { toast } from "../../../components/ui/Toast";
import { Badge } from "../../../components/ui/Badge";
import { Database, ShieldAlert, Cpu, Download, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterBatch() {
  const [step, setStep] = React.useState(1);
  const [batchKey, setBatchKey] = React.useState("");
  const [metadata, setMetadata] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "pending" | "confirmed">("idle");
  const [txHash, setTxHash] = React.useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchKey) return;

    setLoading(true);
    setStatus("pending");
    setStep(2);

    try {
      // Post to MSW mock endpoints
      const response = await fetch("/api/v1/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchKey, metadataHash: metadata }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Registration failed");
      }

      setTxHash(data.chainTxHash);
      toast.info("Registration submitted. Syncing blockchain consensus...", "Tx Dispatched");

      // Poll mock status changes
      let checkTimer = setInterval(async () => {
        const checkRes = await fetch(`/api/v1/batches/${data.batchKey}`);
        const checkData = await checkRes.json();
        if (checkData.chainStatus === "confirmed") {
          setStatus("confirmed");
          toast.success("Batch successfully committed to smart contract.", "Consensus Confirmed");
          clearInterval(checkTimer);
        }
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit batch transaction.", "Tx Failed");
      setStep(1);
      setStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Onboard Production Batch</h1>
        <p className="text-xs text-muted-foreground">
          Register new lot checksums onto the immutable smart contract registry.
        </p>
      </div>

      {step === 1 && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold">Unique Batch Key *</label>
                <Input
                  required
                  placeholder="e.g. MG-2026-0041A"
                  value={batchKey}
                  onChange={(e) => setBatchKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold">Batch Metadata Description</label>
                <Input
                  placeholder="e.g. Paracetamol 500mg, Pfizer Dublin Facility"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Write to Ledger
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="overflow-hidden">
          <CardContent className="pt-6 flex flex-col items-center text-center p-8 space-y-6">
            {status === "pending" ? (
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  {/* Outer spinning ring */}
                  <div className="h-14 w-14 border-4 border-primary border-t-transparent rounded-full animate-spin flex items-center justify-center" />
                  <Database className="h-6 w-6 text-primary absolute top-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <Badge variant="suspect" className="animate-pulse">
                    SYNCING LEDGER
                  </Badge>
                  <h3 className="font-bold text-sm text-foreground mt-2">Writing Batch to Blockchain...</h3>
                  <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                    Broadcasting signed cryptohashes to Ethereum nodes. Waiting for smart contract receipt.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <ShieldAlert className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <Badge variant="genuine">CONFIRMED</Badge>
                  <h3 className="font-bold text-sm text-foreground mt-2">Batch Onboarded Successfully</h3>
                  <p className="text-[10px] text-muted-foreground max-w-xs leading-normal">
                    This batch is now immutable. Inspection systems can verify blister pack outputs instantly.
                  </p>
                </div>
              </div>
            )}

            {/* Transaction metadata */}
            <div className="w-full bg-slate-950/20 border rounded-xl p-4 space-y-2 text-left text-[11px] font-mono text-muted-foreground">
              <div className="flex justify-between">
                <span>Lot Identifier:</span>
                <span className="text-slate-200">{batchKey}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={status === "confirmed" ? "text-emerald-500 font-bold" : "text-amber-500"}>
                  {status}
                </span>
              </div>
              {txHash && (
                <div className="space-y-0.5 mt-1 border-t border-border/20 pt-1.5">
                  <span>Tx Hash:</span>
                  <span className="text-slate-300 block truncate select-all">{txHash}</span>
                </div>
              )}
            </div>

            {status === "confirmed" && (
              <div className="flex gap-2 w-full pt-2">
                <Button className="flex-1 text-xs" onClick={() => {
                  setStep(1);
                  setBatchKey("");
                  setMetadata("");
                  setStatus("idle");
                }}>
                  Register Another
                </Button>
                <Button variant="outline" className="text-xs" onClick={() => {
                  window.location.hash = "/manufacturer/batches";
                }}>
                  Inventory List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
