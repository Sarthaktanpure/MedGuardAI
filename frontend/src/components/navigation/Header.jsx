import { useEffect, useState } from "react";

function joinClasses(...parts) {
  return parts.filter(Boolean).join(" ");
}

function BrandMark() {
  return (
    <a className="brand" href="#home" aria-label="MedGuard home">
      <span className="brand-mark">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3 4 6v6c0 5 3.3 8.7 8 11 4.7-2.3 8-6 8-11V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
      <span className="brand-copy">
        <strong>MedGuard</strong>
        <small>AI-Powered Medicine Verification</small>
      </span>
    </a>
  );
}

function NavLink({ id, label, active, onNavigate }) {
  return (
    <a
      className={joinClasses("nav-link", active === id && "active")}
      href={`#${id}`}
      onClick={onNavigate}
    >
      {label}
    </a>
  );
}

export default function Header({ navItems, activeSection }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("hashchange", closeMenu);
    window.addEventListener("resize", closeMenu);
    return () => {
      window.removeEventListener("hashchange", closeMenu);
      window.removeEventListener("resize", closeMenu);
    };
  }, []);

  function handleNavigate() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-bar">
        <BrandMark />
        <button
          type="button"
          className="header-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={joinClasses("header-links", menuOpen && "open")}>
        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              id={item.id}
              label={item.label}
              active={activeSection}
              onNavigate={handleNavigate}
            />
          ))}
        </nav>
        <div className="nav-actions">
          <a className="icon-link" href="#resources" aria-label="Language or region" onClick={handleNavigate}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a15 15 0 0 1 0 18" />
              <path d="M12 3a15 15 0 0 0 0 18" />
            </svg>
          </a>
          <a className="ghost-button" href="#access" onClick={handleNavigate}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10 7V5a2 2 0 0 1 2-2h7v18h-7a2 2 0 0 1-2-2v-2" />
              <path d="m14 12-4 4" />
              <path d="m14 12-4-4" />
              <path d="M10 12H3" />
            </svg>
            Login
          </a>
          <a className="primary-button small" href="#scan" onClick={handleNavigate}>
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
