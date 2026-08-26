import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableSkeleton, TableEmptyState } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Scan, ScanVerdict } from "../../../../shared/types";
import { Calendar, Filter, FileText, CheckCircle, AlertTriangle, AlertCircle } from "lucide-react";

export default function ScanHistory() {
  const [filter, setFilter] = React.useState<"all" | ScanVerdict>("all");

  const { data: scans, isLoading, refetch } = useQuery<Scan[]>({
    queryKey: ["scans"],
    queryFn: async () => {
      const response = await fetch("/api/v1/scans");
      if (!response.ok) throw new Error("Failed to load audit history");
      return response.json();
    },
  });

  const filteredScans = React.useMemo(() => {
    if (!scans) return [];
    if (filter === "all") return scans;
    return scans.filter((s) => s.result === filter);
  }, [scans, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Inspection Logs</h1>
          <p className="text-xs text-muted-foreground">
            Review diagnostics, confidence indices, and transaction references.
          </p>
        </div>
        <Button size="sm" onClick={() => refetch()}>
          Sync History
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-border/40 pb-3">
        {(["all", "genuine", "suspect", "fake"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-bold capitalize transition-colors ${
              filter === opt
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-card text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Loading list skeleton */}
      {isLoading ? (
        <TableSkeleton rows={4} cols={5} />
      ) : filteredScans.length === 0 ? (
        <TableEmptyState
          title="No inspection records"
          description="You have not recorded any blister pack scans with these filter parameters."
          icon={<FileText className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inspection Date</TableHead>
                <TableHead>Image Key</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Blockchain Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScans.map((scan) => (
                <TableRow key={scan._id}>
                  <TableCell className="text-xs font-semibold text-slate-300">
                    {new Date(scan.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] truncate max-w-[140px]" title={scan.imageObjectKey}>
                    {scan.imageObjectKey.split("/").pop()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={scan.result}>
                      {scan.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs">
                    {scan.confidence}%
                  </TableCell>
                  <TableCell>
                    {scan.flagged ? (
                      <Badge variant="fake" className="text-[10px]">
                        FLAGGED ALERT
                      </Badge>
                    ) : (
                      <Badge variant="genuine" className="text-[10px]">
                        RESOLVED OK
                      </Badge>
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
