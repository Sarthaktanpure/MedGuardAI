import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/Card";
import { TrendAreaChart } from "../../../components/ui/Charts";
import { Badge } from "../../../components/ui/Badge";
import { Database, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";
import { AnalyticsSnapshot } from "../../../../shared/types";

export default function ManufacturerDashboard() {
  const { data: overview, isLoading } = useQuery<AnalyticsSnapshot>({
    queryKey: ["analytics-overview"],
    queryFn: async () => {
      const res = await fetch("/api/v1/analytics/overview");
      if (!res.ok) throw new Error("Failed to load overview analytics");
      return res.json();
    },
  });

  const { data: chartData } = useQuery<any[]>({
    queryKey: ["analytics-scans"],
    queryFn: async () => {
      const res = await fetch("/api/v1/analytics/scans");
      if (!res.ok) throw new Error("Failed to load scan analytics");
      return res.json();
    },
  });

  const kpis = [
    { title: "Registered Batches", value: overview?.batchesRegistered ?? 142, icon: <Database className="h-4 w-4" /> },
    { title: "Active Recalls", value: overview?.flaggedBatchesCount ?? 2, icon: <ShieldAlert className="h-4 w-4 text-rose-500" /> },
    { title: "Counterfeit Alerts", value: overview?.fakeCount ?? 8, icon: <AlertCircle className="h-4 w-4 text-rose-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pharma Company Dashboard</h1>
        <p className="text-xs text-muted-foreground font-medium">
          Manage product registries, audit ledger blocks, and inspect alerts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
                {kpi.title}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted rounded animate-pulse w-24" />
              ) : (
                <div className="text-2xl font-bold">{kpi.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Verification Volume & Alert Incidence
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData ? (
            <TrendAreaChart
              data={chartData}
              index="date"
              categories={["Scans", "Counterfeit"]}
              colors={["#0ea5e9", "#ef4444"]}
              height={280}
            />
          ) : (
            <div className="h-48 bg-muted rounded animate-pulse flex items-center justify-center text-xs text-muted-foreground">
              Loading chart telemetry...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
