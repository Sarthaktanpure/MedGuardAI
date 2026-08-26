import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../components/ui/Toast";
import { ModelVersion } from "../../../../shared/types";
import { ShieldCheck, Cpu, RefreshCw } from "lucide-react";

export default function ModelRegistry() {
  const queryClient = useQueryClient();

  const { data: models, isLoading, refetch } = useQuery<ModelVersion[]>({
    queryKey: ["models"],
    queryFn: async () => {
      const res = await fetch("/api/v1/models");
      if (!res.ok) throw new Error("Failed to load models");
      return res.json();
    },
  });

  const retrainMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/models/retrain", { method: "POST" });
      if (!res.ok) throw new Error("Retraining initiation failed");
      return res.json();
    },
    onSuccess: (data) => {
      toast.info("Retraining job dispatched. Monitoring metrics pipeline...", "Pipeline Triggered");
      queryClient.invalidateQueries({ queryKey: ["models"] });

      // Start a polling interval to update the list as it trains!
      let pollTimer = setInterval(async () => {
        const checkRes = await fetch("/api/v1/models");
        const checkData: ModelVersion[] = await checkRes.json();
        const activeJob = checkData.find((m) => m._id === data._id);

        if (activeJob && activeJob.status === "active") {
          toast.success("Retrained model validated and deployed to production.", "Deployment Complete");
          queryClient.invalidateQueries({ queryKey: ["models"] });
          clearInterval(pollTimer);
        }
      }, 3000);
    },
    onError: () => {
      toast.error("Retraining scheduler rejected query request.", "Pipeline Error");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Model Registry</h1>
          <p className="text-xs text-muted-foreground font-medium">
            Monitor convolutional neural network catalog, evaluate metrics, and launch pipeline retraining.
          </p>
        </div>
        <Button
          size="sm"
          isLoading={retrainMutation.isPending}
          onClick={() => retrainMutation.mutate()}
        >
          <Cpu className="h-3.5 w-3.5 mr-1.5" />
          Retrain Model
        </Button>
      </div>

      {isLoading ? (
        <div className="h-40 bg-muted rounded animate-pulse" />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Identifier</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Precision</TableHead>
                <TableHead>Recall</TableHead>
                <TableHead>F1 Score</TableHead>
                <TableHead>Deployment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models?.map((mdl) => (
                <TableRow key={mdl._id}>
                  <TableCell className="font-semibold text-xs text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {mdl.version}
                  </TableCell>
                  <TableCell className="font-bold text-xs">{mdl.metrics.accuracy}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mdl.metrics.precision}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mdl.metrics.recall}%</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{mdl.metrics.f1}%</TableCell>
                  <TableCell>
                    {mdl.status === "active" ? (
                      <Badge variant="genuine">ACTIVE DEPLOY</Badge>
                    ) : mdl.status === "training" ? (
                      <Badge variant="suspect" className="animate-pulse">
                        TRAINING (CONVERGING)
                      </Badge>
                    ) : (
                      <Badge variant="muted">ARCHIVED</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
