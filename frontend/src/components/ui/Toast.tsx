import * as React from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils/cn";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

// Global listener interface for hooks
type Listener = (toasts: ToastItem[]) => void;
let listeners: Listener[] = [];
let toasts: ToastItem[] = [];

export const toast = {
  show: (message: string, options?: Omit<ToastItem, "id" | "message">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      message,
      title: options?.title,
      type: options?.type ?? "info",
      duration: options?.duration ?? 4000,
    };
    toasts = [...toasts, newToast];
    listeners.forEach((l) => l(toasts));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, newToast.duration);
    }
    return id;
  },
  success: (message: string, title?: string) => toast.show(message, { type: "success", title }),
  warning: (message: string, title?: string) => toast.show(message, { type: "warning", title }),
  error: (message: string, title?: string) => toast.show(message, { type: "error", title }),
  info: (message: string, title?: string) => toast.show(message, { type: "info", title }),
  dismiss: (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((l) => l(toasts));
  },
};

export function useToast() {
  const [activeToasts, setActiveToasts] = React.useState<ToastItem[]>(toasts);

  React.useEffect(() => {
    listeners.push(setActiveToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setActiveToasts);
    };
  }, []);

  return {
    toasts: activeToasts,
    toast,
    dismiss: toast.dismiss,
  };
}

export function ToastProvider() {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm" role="region" aria-live="assertive">
      {toasts.map((item) => {
        const icons = {
          success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
          warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
          info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
        };

        const borders = {
          success: "border-emerald-500/20 bg-card",
          warning: "border-amber-500/20 bg-card",
          error: "border-rose-500/20 bg-card",
          info: "border-blue-500/20 bg-card",
        };

        return (
          <div
            key={item.id}
            className={cn(
              "flex gap-3 items-start border p-4 rounded-xl shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-5",
              borders[item.type ?? "info"]
            )}
          >
            {icons[item.type ?? "info"]}
            <div className="flex-1 space-y-1">
              {item.title && <h4 className="font-semibold text-sm leading-tight">{item.title}</h4>}
              <p className="text-xs text-muted-foreground leading-normal">{item.message}</p>
            </div>
            <button
              onClick={() => dismiss(item.id)}
              className="text-muted-foreground hover:text-foreground rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
