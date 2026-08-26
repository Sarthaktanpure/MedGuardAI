import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../App.jsx";
import "../App.css";
import "../index.css";

export default function VerifyPage() {
  return <App page="verify" />;
}

export function mountVerifyPage(rootId = "root") {
  const root = document.getElementById(rootId);
  if (!root) return;

  createRoot(root).render(
    <StrictMode>
      <VerifyPage />
    </StrictMode>,
  );
}
