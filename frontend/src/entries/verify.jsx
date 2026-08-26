import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";
import { AppShell } from "../components/shared/AppShell";

// Import Patient verify sub-pages
import Scan from "../routes/verify/Scan";
import ScanHistory from "../routes/verify/ScanHistory";

import "../App.css";
import "../index.css";

function VerifyAppLayout() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Verify Scan");

  useEffect(() => {
    if (location.pathname === "/history") {
      setActiveTab("Scan History");
    } else {
      setActiveTab("Verify Scan");
    }
  }, [location]);

  return (
    <AppShell activeTab={activeTab}>
      <Routes>
        <Route path="/" element={<Scan />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="*" element={<Scan />} />
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
          <VerifyAppLayout />
        </HashRouter>
      </Providers>
    </StrictMode>
  );
});
