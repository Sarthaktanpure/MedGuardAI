import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";
import { AppShell } from "../components/shared/AppShell";

import Tracking from "../routes/verify/Tracking";

import "../App.css";
import "../index.css";

function TrackingAppLayout() {
  return (
    <AppShell activeTab="Track Delivery">
      <Routes>
        <Route path="/" element={<Tracking />} />
        <Route path="*" element={<Tracking />} />
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
          <TrackingAppLayout />
        </HashRouter>
      </Providers>
    </StrictMode>
  );
});
