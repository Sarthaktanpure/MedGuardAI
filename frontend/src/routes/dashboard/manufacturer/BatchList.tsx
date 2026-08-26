import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableSkeleton } from "../../../components/ui/Table";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { toast } from "../../../components/ui/Toast";
import { Batch } from "../../../../shared/types";
import { ShieldAlert, RefreshCw, FileText } from "lucide-react";

export default function BatchList() {
  const queryClient = useQueryClient();

  const { data: batches, isLoading, refetch } = useQuery<Batch[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await fetch("/api/v1/batches");
      if (!res.ok) throw new Error("Failed to load inventory");
      return res.json();
    },
  });

  const recallMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/v1/batches/${id}/flag`, { method: "POST" });
      if (!res.ok) throw new Error("Recall action failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Batch successfully flagged as recalled on-chain.", "Recall Confirmed");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
    onError: () => {
      toast.error("Failed to submit recall order.", "Recall Failed");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Batch Inventory</h1>
          <p className="text-xs text-muted-foreground">
            Monitor lot status, on-chain checksum receipts, and active recalls.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Key</TableHead>
                <TableHead>Metadata Hash</TableHead>
                <TableHead>Chain Status</TableHead>
                <TableHead>Integrity State</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-300">
                    {item.batchKey}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] truncate max-w-[120px]" title={item.metadataHash}>
                    {item.metadataHash}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.chainStatus === "confirmed" ? "genuine" : "suspect"}>
                      {item.chainStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.flagged ? (
                      <Badge variant="fake">RECALLED</Badge>
                    ) : (
                      <Badge variant="genuine">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!item.flagged && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-[10px] h-7 px-2"
                        isLoading={recallMutation.isPending && recallMutation.variables === item._id}
                        onClick={() => {
                          if (confirm(`Trigger emergency blockchain recall for batch ${item.batchKey}?`)) {
                            recallMutation.mutate(item._id);
                          }
                        }}
                      >
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Recall Lot
                      </Button>
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
