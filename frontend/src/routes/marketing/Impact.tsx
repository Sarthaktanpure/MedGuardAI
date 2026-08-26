import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { TrendAreaChart, CompareBarChart } from "../../components/ui/Charts";
import { ShieldAlert, Users, TrendingUp } from "lucide-react";

export default function Impact() {
  // Mock data representing global pharmaceutical counterfeit trends
  const trendData = [
    { year: "2020", Incidents: 2400, Verified: 100 },
    { year: "2021", Incidents: 3100, Verified: 350 },
    { year: "2022", Incidents: 3900, Verified: 800 },
    { year: "2023", Incidents: 4500, Verified: 1800 },
    { year: "2024", Incidents: 5200, Verified: 4200 },
    { year: "2025", Incidents: 6100, Verified: 8500 },
  ];

  const distributionData = [
    { category: "Anti-Malaria", Fakes: 42, Ineffective: 58 },
    { category: "Antibiotics", Fakes: 38, Ineffective: 62 },
    { category: "Cardiovascular", Fakes: 15, Ineffective: 85 },
    { category: "Painkillers", Fakes: 28, Ineffective: 72 },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Counterfeit Impact & Statistics</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Falsified and substandard medications are one of the most critical healthcare crises of our decade. Learn what the statistics show.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Prevalence Curve vs. Ledgers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendAreaChart
              data={trendData}
              index="year"
              categories={["Incidents", "Verified"]}
              colors={["#f43f5e", "#10b981"]}
              height={260}
            />
            <p className="text-[10px] text-muted-foreground leading-normal mt-4">
              Tracking incidents of reported fake batches (red) alongside the volume of ledger registrations (green).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              Counterfeit Rates by Category (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CompareBarChart
              data={distributionData}
              index="category"
              categories={["Fakes", "Ineffective"]}
              colors={["#ef4444", "#f59e0b"]}
              height={260}
            />
            <p className="text-[10px] text-muted-foreground leading-normal mt-4">
              Distribution of falsified materials versus substandard/ineffective formulations across targeted medicine classes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Narrative Section */}
      <Card className="bg-slate-950/20">
        <CardHeader>
          <CardTitle className="text-base">UNODC / WHO Healthcare Burden report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            According to surveys by the World Health Organization (WHO) and the United Nations Office on Drugs and Crime (UNODC), counterfeit anti-malaria drugs in Sub-Saharan Africa alone cause over 280,000 avoidable deaths annually.
          </p>
          <p>
            Substandard formulations often contain trace amounts of actual active pharmaceutical ingredients (APIs)—just enough to bypass basic chemical field tests while driving pathogen drug-resistance across communities. MedGuard's physical packaging inspection (CNN model) combined with public ledger transparency stops fake packets before they make it onto clinic shelves.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
