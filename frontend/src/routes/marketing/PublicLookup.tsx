import * as React from "react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import { Input, FormItem, FormMessage, Label } from "../../components/ui/Form";
import { Badge } from "../../components/ui/Badge";
import { Search, ShieldAlert, CheckCircle, Clock } from "lucide-react";
import { toast } from "../../components/ui/Toast";

interface BatchData {
  batchKey: string;
  metadataHash: string;
  chainTxHash: string;
  chainStatus: "pending" | "confirmed" | "failed";
  flagged: boolean;
  createdAt: string;
}

export default function PublicLookup() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<BatchData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a batch number.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      // Fetch from the mocked MSW endpoint
      const response = await fetch(`/api/v1/batches/${query.trim()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Batch not registered on ledger.");
      }

      setResult(data);
      toast.success("Batch successfully fetched from ledger.", "Ledger Found");
    } catch (err: any) {
      setError(err.message || "Failed to find batch on ledger.");
      toast.error(err.message || "Batch registration check failed.", "Ledger Missing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Public Batch Lookup</h1>
        <p className="text-sm text-muted-foreground">
          Query the decentralized ledger directly to verify batch registration status.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleLookup} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Batch Key (e.g. MG-2026-0041A, MG-2026-0012B)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button type="submit" isLoading={loading}>
              <Search className="h-4 w-4 mr-2" />
              Lookup
            </Button>
          </form>
          {error && <p className="text-xs text-destructive mt-2 font-medium">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-in fade-in zoom-in-95">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Ledger Record
                </span>
                <CardTitle className="text-lg font-mono mt-0.5">{result.batchKey}</CardTitle>
              </div>
              <div className="flex gap-2">
                {result.flagged ? (
                  <Badge variant="fake">RECALLED / FLAGGED</Badge>
                ) : (
                  <Badge variant="genuine">ACTIVE BATCH</Badge>
                )}
                <Badge variant={result.chainStatus === "confirmed" ? "genuine" : "suspect"}>
                  {result.chainStatus}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  On-chain Metadata Hash
                </span>
                <p className="font-mono text-xs truncate select-all bg-secondary/50 p-2 rounded border" title={result.metadataHash}>
                  {result.metadataHash}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                  Blockchain Transaction ID
                </span>
                <p className="font-mono text-xs truncate select-all bg-secondary/50 p-2 rounded border" title={result.chainTxHash}>
                  {result.chainTxHash}
                </p>
              </div>
            </div>

            <div className="border-t border-border/30 pt-4 flex gap-3 items-start">
              {result.flagged ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-rose-500 text-xs">Counterfeit Recall Order Active</strong>
                    <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                      This batch has been marked as compromised by regulatory inspectors. Do not purchase or consume medicine from this batch.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-500 text-xs">Immutable Ledger Verified</strong>
                    <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                      This batch key exists on the smart contract and matches its metadata checksum hashes. Check packaging condition on scan page.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info card describing the lookup mechanism */}
      <Card className="bg-slate-950/20 border-dashed">
        <CardContent className="pt-6 text-xs text-muted-foreground leading-relaxed flex gap-3">
          <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
          <p>
            Batch registrations are submitted by manufacturers when packaging medicines. Scanners and inspect systems query these transactions to prove identity, tracking logistics timestamps across checkpoints.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
