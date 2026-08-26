import * as React from "react";
import { Shield, Menu, X, Sun, Moon, ArrowRight } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { cn } from "../../lib/utils/cn";

export function MarketingNav({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const links = [
    { name: "Home", href: "#/" },
    { name: "How It Works", href: "#/how-it-works" },
    { name: "Impact", href: "#/impact" },
    { name: "Features", href: "#/features" },
    { name: "Pricing", href: "#/pricing" },
    { name: "Lookup", href: "#/lookup" },
    { name: "Live Tracking", href: "/tracking#/" },
    { name: "About", href: "#/about" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#/" className="font-bold text-lg tracking-wider flex items-center gap-2 text-foreground">
            <Shield className="h-6 w-6 text-primary" />
            MedGuard
          </a>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {links.map((l) => (
              <a key={l.name} href={l.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {l.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA + Theme */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <a href="/auth#/">
              <button className="inline-flex items-center justify-center font-medium h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors">
                Log In
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted-foreground hover:text-foreground">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 animate-in slide-in-from-top-5">
            <nav className="flex flex-col gap-3.5 text-sm font-medium">
              {links.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {l.name}
                </a>
              ))}
              <hr className="border-border/60 my-1" />
              <a href="/auth#/" onClick={() => setMobileOpen(false)}>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">
                  Access Portal
                </button>
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer bar */}
      <footer className="border-t border-border/40 bg-card/40 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">MedGuard</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#/privacy" className="hover:underline">Privacy Policy</a>
            <a href="#/terms" className="hover:underline">Terms of Service</a>
            <a href="/verify#/" className="hover:underline">Verify Center</a>
            <a href="/dashboard#/" className="hover:underline">Dashboards</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
