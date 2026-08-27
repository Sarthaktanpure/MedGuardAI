import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";
import { AppShell } from "../components/shared/AppShell";

// Import Company sub-pages (reusing manufacturer components)
import CompanyDashboard from "../routes/dashboard/manufacturer/Dashboard";
import RegisterBatch from "../routes/dashboard/manufacturer/RegisterBatch";
import BatchList from "../routes/dashboard/manufacturer/BatchList";

// Import Pharmacist & Deliveryman dashboards
import PharmacistDashboard from "../routes/dashboard/pharmacist/Dashboard";
import DeliverymanDashboard from "../routes/dashboard/deliveryman/Dashboard";

import "../App.css";
import "../index.css";

function DashboardAppLayout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const path = location.pathname;
    
    // Company (Manufacturer) paths
    if (path === "/company" || path === "/manufacturer") setActiveTab("Company Home");
    else if (path === "/company/register" || path === "/manufacturer/register") setActiveTab("Register Batch");
    else if (path === "/company/batches" || path === "/manufacturer/batches") setActiveTab("Batch Inventory");
    
    // Pharmacist paths
    else if (path === "/pharmacist") setActiveTab("Pharmacist Portal");
    
    // Deliveryman paths
    else if (path === "/deliveryman") setActiveTab("Delivery Dashboard");
  }, [location]);

  return (
    <AppShell activeTab={activeTab}>
      <Routes>
        {/* Company (Manufacturer) sub-routes */}
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/company/register" element={<RegisterBatch />} />
        <Route path="/company/batches" element={<BatchList />} />
        
        {/* Compatibility fallbacks for seed swapping */}
        <Route path="/manufacturer" element={<CompanyDashboard />} />
        <Route path="/manufacturer/register" element={<RegisterBatch />} />
        <Route path="/manufacturer/batches" element={<BatchList />} />

        {/* Pharmacist routes */}
        <Route path="/pharmacist" element={<PharmacistDashboard />} />

        {/* Deliveryman routes */}
        <Route path="/deliveryman" element={<DeliverymanDashboard />} />

        {/* Fallbacks */}
        <Route path="*" element={<CompanyDashboard />} />
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
