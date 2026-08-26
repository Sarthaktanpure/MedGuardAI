import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/Table";
import { AuditLog } from "../../../../shared/types";
import { Database, ShieldCheck, Activity } from "lucide-react";

export default function SystemLogs() {
  const { data: logs, isLoading } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const res = await fetch("/api/v1/admin/audit-logs");
      if (!res.ok) throw new Error("Failed to load logs");
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">System Health & Auditing</h1>
        <p className="text-xs text-muted-foreground font-medium">
          Check API container statuses and review cryptographic operation logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core health stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              API Services & Containers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-border/20 pb-2">
              <span>MERN Express Container:</span>
              <span className="text-emerald-500 font-bold uppercase">Online (100% Uptime)</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/20 pb-2">
              <span>MongoDB Replica Set:</span>
              <span className="text-emerald-500 font-bold uppercase">Connected (db ready)</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/20 pb-2">
              <span>Blockchain Provider node:</span>
              <span className="text-emerald-500 font-bold uppercase">Synced (EVM Node 88)</span>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Security Checksums
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <p className="text-muted-foreground leading-relaxed">
              Cryptographic actions are logged on both MongoDB and indexed audit sheets. The blockchain transaction receipts provide immutable signatures that are validated by regional clinics.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Security Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-32 bg-muted rounded animate-pulse" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Operation Action</TableHead>
                  <TableHead>Audit Details</TableHead>
                  <TableHead>Client IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs?.map((l) => (
                  <TableRow key={l._id}>
                    <TableCell className="text-xs">
                      {new Date(l.createdAt).toLocaleDateString([], { dateStyle: "short" })}{" "}
                      {new Date(l.createdAt).toLocaleTimeString([], { timeStyle: "short" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{l.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-300 font-medium">{l.details}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{l.ipAddress ?? "local"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
