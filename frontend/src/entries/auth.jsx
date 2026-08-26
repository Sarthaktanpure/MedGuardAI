import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { bootMsw } from "../lib/mswBoot";
import { Providers } from "../components/shared/Providers";

// Import Auth sub-pages
import Login from "../routes/auth/Login";
import Signup from "../routes/auth/Signup";
import ForgotPassword from "../routes/auth/ForgotPassword";
import OnboardingWizard from "../routes/auth/OnboardingWizard";

import "../App.css";
import "../index.css";

// Boot MSW first in dev mode before mounting React
bootMsw().then(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Providers>
        <HashRouter>
          <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/onboarding" element={<OnboardingWizard />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </div>
        </HashRouter>
      </Providers>
    </StrictMode>
  );
});
