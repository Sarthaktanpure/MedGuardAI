import * as React from "react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useNotificationStore } from "../../store/notificationStore";
import { toast } from "../ui/Toast";
import {
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  LogOut,
  Shield,
  User as UserIcon,
  Activity,
  ScanLine,
  Database,
  Building,
  UserCheck,
  Compass,
} from "lucide-react";
import { cn } from "../../lib/utils/cn";

export function AppShell({ children, activeTab }: { children: React.ReactNode; activeTab?: string }) {
  const { user, logout, login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  // Role-aware sidebar links
  const menuItems = React.useMemo(() => {
    const common = [
      { name: "Verify Scan", icon: <ScanLine className="h-4 w-4" />, href: "/verify#/" },
      { name: "Scan History", icon: <Activity className="h-4 w-4" />, href: "/verify#/history" },
      { name: "Track Delivery", icon: <Compass className="h-4 w-4" />, href: "/tracking#/" },
    ];

    if (user?.role === "manufacturer") {
      return [
        { name: "Manufacturer Home", icon: <Compass className="h-4 w-4" />, href: "/dashboard#/manufacturer" },
        { name: "Register Batch", icon: <Database className="h-4 w-4" />, href: "/dashboard#/manufacturer/register" },
        { name: "Batch Inventory", icon: <Building className="h-4 w-4" />, href: "/dashboard#/manufacturer/batches" },
        ...common,
      ];
    }

    if (user?.role === "regulator") {
      return [
        { name: "Inspector Overview", icon: <Compass className="h-4 w-4" />, href: "/dashboard#/regulator" },
        { name: "Incidents Heatmap", icon: <Compass className="h-4 w-4" />, href: "/dashboard#/regulator/heatmap" },
        { name: "Trend Analysis", icon: <Activity className="h-4 w-4" />, href: "/dashboard#/regulator/trends" },
        ...common,
      ];
    }

    if (user?.role === "admin") {
      return [
        { name: "Admin Dashboard", icon: <Compass className="h-4 w-4" />, href: "/dashboard#/admin" },
        { name: "User Directory", icon: <UserCheck className="h-4 w-4" />, href: "/dashboard#/admin/users" },
        { name: "Model Registry", icon: <Shield className="h-4 w-4" />, href: "/dashboard#/admin/models" },
        { name: "System logs", icon: <Database className="h-4 w-4" />, href: "/dashboard#/admin/logs" },
        ...common,
      ];
    }

    // Default patient/pharmacist view
    return common;
  }, [user]);

  // Fast role swapping helper for easy demoing/judging
  const handleRoleSwap = async (role: "patient" | "manufacturer" | "regulator" | "admin") => {
    toast.info(`Swapping profile to ${role}...`, "Role Switcher");
    await login(`${role}@medguard.org`, role);
    toast.success(`Success! Swapped session to ${role}.`, "Role Switcher");
    // Redirect based on role to avoid route conflicts
    if (role === "patient") {
      window.location.href = "/verify#/";
    } else {
      window.location.href = `/dashboard#/${role}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* 1. Mobile top bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 bg-card border-b border-border/80 sticky top-0 z-40">
        <a href="/" className="font-bold text-base tracking-wide flex items-center gap-1">
          <Shield className="h-5 w-5 text-primary" />
          MedGuard
        </a>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMobileOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 2. Desktop Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border/80 transition-transform duration-300 md:translate-x-0 md:static shrink-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
          <a href="/" className="font-bold text-lg tracking-wider flex items-center gap-2 text-foreground">
            <Shield className="h-6 w-6 text-primary animate-pulse" />
            MedGuard
          </a>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Judge Demo Role Switcher Overlay in Sidebar footer */}
        <div className="p-4 border-t border-border/40 bg-slate-950/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
            Inspect As (Judge Mode)
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {(["patient", "manufacturer", "regulator", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleSwap(r)}
                className={cn(
                  "text-[10px] py-1 px-1.5 rounded font-bold border transition-colors capitalize",
                  user?.role === r
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Footer (Profile details) */}
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="text-xs font-semibold truncate leading-none">
                {user?.displayName ?? "Guest Inspector"}
              </span>
              <span className="text-[10px] text-muted-foreground capitalize leading-relaxed">
                {user?.role ?? "anonymous"}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              window.location.href = "/auth#/";
            }}
            className="text-muted-foreground hover:text-destructive rounded p-1 transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Workspace Top Header (Desktop only) */}
        <header className="hidden md:flex h-16 items-center justify-end px-8 border-b border-border/40 bg-card/60 backdrop-blur-sm z-30">
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button onClick={toggleTheme} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification drop center */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-card" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-2.5 border-b border-border/40">
                    <h5 className="font-semibold text-xs">System Notifications</h5>
                    <button onClick={markAllAsRead} className="text-[10px] text-primary hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto divide-y divide-border/20">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={cn("p-3 space-y-1 text-xs", !notif.read && "bg-primary/5")}>
                          <div className="flex justify-between items-start gap-1">
                            <h6 className="font-bold text-foreground">{notif.title}</h6>
                            <span className="text-[9px] text-muted-foreground shrink-0">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-normal">{notif.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content body wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
