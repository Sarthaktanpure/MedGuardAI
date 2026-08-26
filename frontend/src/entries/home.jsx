import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";
import { MarketingNav } from "../components/shared/MarketingNav";

// Import marketing sub-pages
import Home from "../routes/marketing/Home";
import HowItWorks from "../routes/marketing/HowItWorks";
import Impact from "../routes/marketing/Impact";
import Features from "../routes/marketing/Features";
import Pricing from "../routes/marketing/Pricing";
import PublicLookup from "../routes/marketing/PublicLookup";
import About from "../routes/marketing/About";
import Legal from "../routes/marketing/Legal";

import "../App.css";
import "../index.css";

// Boot MSW first in dev mode before mounting React
bootMsw().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Providers>
        <HashRouter>
          <MarketingNav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/lookup" element={<PublicLookup />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Legal />} />
              <Route path="/terms" element={<Legal />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </MarketingNav>
        </HashRouter>
      </Providers>
    </StrictMode>
  );
});
