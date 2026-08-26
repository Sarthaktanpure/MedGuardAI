import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../App.jsx";
import "../App.css";
import "../index.css";

export default function HomePage() {
  return <App page="home" />;
}

export function mountHomePage(rootId = "root") {
  const root = document.getElementById(rootId);
  if (!root) return;

  createRoot(root).render(
    <StrictMode>
      <HomePage />
    </StrictMode>,
  );
}
