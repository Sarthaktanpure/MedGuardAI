import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";
import { AppShell } from "../components/shared/AppShell";

// Import Manufacturer sub-pages
import ManufacturerDashboard from "../routes/dashboard/manufacturer/Dashboard";
import RegisterBatch from "../routes/dashboard/manufacturer/RegisterBatch";
import BatchList from "../routes/dashboard/manufacturer/BatchList";

// Import Regulator sub-pages
import RegulatorOverview from "../routes/dashboard/regulator/Overview";

// Import Admin sub-pages
import UserManagement from "../routes/dashboard/admin/UserManagement";
import ModelRegistry from "../routes/dashboard/admin/ModelRegistry";
import SystemLogs from "../routes/dashboard/admin/SystemLogs";

import "../App.css";
import "../index.css";

function DashboardAppLayout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const path = location.pathname;
    
    // Manufacturer paths
    if (path === "/manufacturer") setActiveTab("Manufacturer Home");
    else if (path === "/manufacturer/register") setActiveTab("Register Batch");
    else if (path === "/manufacturer/batches") setActiveTab("Batch Inventory");
    
    // Regulator paths
    else if (path === "/regulator") setActiveTab("Inspector Overview");
    else if (path === "/regulator/heatmap") setActiveTab("Incidents Heatmap");
    else if (path === "/regulator/trends") setActiveTab("Trend Analysis");
    
    // Admin paths
    else if (path === "/admin" || path === "/admin/users") setActiveTab("User Directory");
    else if (path === "/admin/models") setActiveTab("Model Registry");
    else if (path === "/admin/logs") setActiveTab("System logs");
  }, [location]);

  return (
    <AppShell activeTab={activeTab}>
      <Routes>
        {/* Manufacturer sub-routes */}
        <Route path="/manufacturer" element={<ManufacturerDashboard />} />
        <Route path="/manufacturer/register" element={<RegisterBatch />} />
        <Route path="/manufacturer/batches" element={<BatchList />} />

        {/* Regulator sub-routes */}
        <Route path="/regulator" element={<RegulatorOverview />} />
        <Route path="/regulator/heatmap" element={<RegulatorOverview />} />
        <Route path="/regulator/trends" element={<RegulatorOverview />} />

        {/* Admin sub-routes */}
        <Route path="/admin" element={<UserManagement />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/models" element={<ModelRegistry />} />
        <Route path="/admin/logs" element={<SystemLogs />} />

        {/* Fallbacks */}
        <Route path="*" element={<ManufacturerDashboard />} />
      </Routes>
    </AppShell>
  );
}

// Boot MSW first in dev mode before mounting React
bootMsw().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Providers>
        <HashRouter>
          <DashboardAppLayout />
        </HashRouter>
      </Providers>
    </StrictMode>
  );
});
