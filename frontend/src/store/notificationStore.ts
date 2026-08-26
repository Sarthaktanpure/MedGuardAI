import { create } from "zustand";

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (title: string, description: string, type?: SystemNotification["type"]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const initialNotifications: SystemNotification[] = [
  {
    id: "not-1",
    title: "New Batch Registered",
    description: "Batch MG-2026-0041A registered on the blockchain successfully.",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "not-2",
    title: "Flagged Counterfeit Alert",
    description: "A suspect scan of Batch MG-2026-0012B was reported in Central District.",
    type: "error",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "not-3",
    title: "ML Model Updated",
    description: "Counterfeit-detection model v2.1-resnet has been deployed to registry.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length,

  addNotification: (title, description, type = "info") => {
    set((state) => {
      const newNot: SystemNotification = {
        id: "not-" + Math.random().toString(36).substring(2, 9),
        title,
        description,
        type,
        read: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newNot, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      return {
        notifications: updated,
        unreadCount: 0,
      };
    });
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
