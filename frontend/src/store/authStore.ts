import { create } from "zustand";
import { User, UserRole } from "../../../shared/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  signup: (email: string, displayName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (wizardData: Record<string, any>) => void;
  updateProfile: (displayName: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  onboardingCompleted: false,

  login: async (email, role) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "MedGuard123!" }),
      });

      let json = await response.json().catch(() => null);

      // Self-healing: if user not found, register them on the fly
      if (!response.ok || !json?.user) {
        const registerResponse = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password: "MedGuard123!",
            displayName: email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()),
            role,
          }),
        });

        json = await registerResponse.json().catch(() => null);
        if (!registerResponse.ok || !json?.user) {
          throw new Error(json?.error?.message || "Failed to authenticate");
        }
      }

      const activeUser: User = {
        _id: json.user.id || json.user._id,
        email: json.user.email,
        role: json.user.role,
        displayName: json.user.displayName,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("user_session", JSON.stringify(activeUser));
      set({ user: activeUser, isAuthenticated: true, onboardingCompleted: false });
    } catch (err: any) {
      console.error("Auth login error:", err);
      throw err;
    }
  },

  signup: async (email, displayName, role) => {
    try {
      const registerResponse = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "MedGuard123!",
          displayName: displayName || email.split("@")[0].replace(/^\w/, (c) => c.toUpperCase()),
          role,
        }),
      });

      const json = await registerResponse.json().catch(() => null);
      if (!registerResponse.ok || !json?.user) {
        throw new Error(json?.error?.message || "Failed to register");
      }

      const activeUser: User = {
        _id: json.user.id || json.user._id,
        email: json.user.email,
        role: json.user.role,
        displayName: json.user.displayName,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem("user_session", JSON.stringify(activeUser));
      set({ user: activeUser, isAuthenticated: true, onboardingCompleted: false });
    } catch (err: any) {
      console.error("Auth signup error:", err);
      throw err;
    }
  },

  logout: async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
    } finally {
      localStorage.removeItem("user_session");
      set({ user: null, isAuthenticated: false, onboardingCompleted: false });
    }
  },

  completeOnboarding: (wizardData) => {
    console.log("Onboarding data saved:", wizardData);
    set({ onboardingCompleted: true });
  },

  updateProfile: (displayName) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, displayName };
      localStorage.setItem("user_session", JSON.stringify(updated));
      return { user: updated };
    });
  },
}));

// Auto-hydrate login state from localStorage
if (typeof window !== "undefined") {
  const session = localStorage.getItem("user_session");
  if (session) {
    try {
      const parsed = JSON.parse(session);
      useAuthStore.setState({ user: parsed, isAuthenticated: true });
    } catch {
      localStorage.removeItem("user_session");
    }
  }
}
