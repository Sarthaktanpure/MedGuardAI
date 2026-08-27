import * as React from "react";
import { Shield, Menu, X, Sun, Moon, ArrowRight, Globe, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils/cn";

export function MarketingNav({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const mobileLinks = [
    { name: "Home", href: "#/" },
    { name: "How It Works", href: "#/how-it-works" },
    { name: "For Manufacturers", href: "/auth#/signup" },
    { name: "For Regulators", href: "/auth#/signup" },
    { name: "Impact Statistics", href: "#/impact" },
    { name: "Pricing Plans", href: "#/pricing" },
    { name: "Public Lookup", href: "#/lookup" },
    { name: "Live Tracking", href: "/tracking#/" },
    { name: "About Us", href: "#/about" },
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
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <a href="#/" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
            <a href="#/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="/auth#/signup" className="text-muted-foreground hover:text-foreground transition-colors">For Manufacturers</a>
            <a href="/auth#/signup" className="text-muted-foreground hover:text-foreground transition-colors">For Regulators</a>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-semibold">
                Resources
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-1">
                <a href="#/impact" className="block px-3 py-2 rounded-lg text-xs hover:bg-secondary text-muted-foreground hover:text-foreground font-medium">Impact Statistics</a>
                <a href="#/pricing" className="block px-3 py-2 rounded-lg text-xs hover:bg-secondary text-muted-foreground hover:text-foreground font-medium">Pricing Plans</a>
                <a href="#/lookup" className="block px-3 py-2 rounded-lg text-xs hover:bg-secondary text-muted-foreground hover:text-foreground font-medium">Public Lookup</a>
                <a href="/tracking#/" className="block px-3 py-2 rounded-lg text-xs hover:bg-secondary text-muted-foreground hover:text-foreground font-medium">Live Tracking</a>
              </div>
            </div>

            <a href="#/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
          </nav>

          {/* Desktop CTA + Theme */}
          <div className="hidden md:flex items-center gap-5">
            {/* Language Selector */}
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm font-semibold">
                <Globe className="h-4 w-4 text-primary" />
                English
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 rounded-xl bg-card border border-border shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 p-1">
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-secondary text-foreground font-medium">English</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-secondary text-muted-foreground">Español</button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-secondary text-muted-foreground">Français</button>
              </div>
            </div>

            {/* Conditional Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <a href={user?.role === "patient" ? "/verify#/" : `/dashboard#/${user?.role}`}>
                  <button className="inline-flex items-center justify-center gap-1.5 font-bold h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-sm transition-colors shadow-lg shadow-primary/20">
                    <LayoutDashboard className="h-4 w-4" />
                    Console
                  </button>
                </a>
                <button
                  onClick={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="inline-flex items-center justify-center font-semibold h-9 px-3 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-secondary/50 text-sm transition-colors"
                  title="Log Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <>
                {/* Login button */}
                <a href="/auth#/">
                  <button className="inline-flex items-center justify-center font-semibold h-9 px-4 rounded-lg border border-border text-foreground hover:bg-secondary/50 text-sm transition-colors">
                    Login
                  </button>
                </a>

                {/* Get Started button */}
                <a href="/verify#/">
                  <button className="inline-flex items-center justify-center font-bold h-9 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-sm transition-colors shadow-lg shadow-primary/20">
                    Get Started
                  </button>
                </a>
              </>
            )}
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
              {mobileLinks.map((l) => (
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
              {isAuthenticated ? (
                <div className="space-y-2">
                  <a
                    href={user?.role === "patient" ? "/verify#/" : `/dashboard#/${user?.role}`}
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Go to Console ({user?.displayName})
                    </button>
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                      window.location.reload();
                    }}
                    className="w-full h-10 rounded-lg border border-border text-muted-foreground hover:text-destructive font-semibold flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <a href="/auth#/" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-semibold">
                    Access Portal
                  </button>
                </a>
              )}
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
