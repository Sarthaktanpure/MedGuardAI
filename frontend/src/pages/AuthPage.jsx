import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../App.jsx";
import "../App.css";
import "../index.css";

export default function AuthPage() {
  return <App page="auth" />;
}

export function mountAuthPage(rootId = "root") {
  const root = document.getElementById(rootId);
  if (!root) return;

  createRoot(root).render(
    <StrictMode>
      <AuthPage />
    </StrictMode>,
  );
}
