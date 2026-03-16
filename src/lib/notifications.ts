import { Notification, NotificationType } from "@/types";
import { getItem, setItem } from "./storage";
import { generateId } from "./utils";

export function getNotifications(userId: string): Notification[] {
  const all = getItem<Notification[]>("notifications") || [];
  return all.filter((n) => n.userId === userId);
}

export function getUnreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

export function addNotification(
  userId: string,
  type: NotificationType,
  auctionId: string,
  message: string
): Notification {
  const notif: Notification = {
    id: generateId(),
    userId,
    type,
    auctionId,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const all = getItem<Notification[]>("notifications") || [];
  all.unshift(notif);
  setItem("notifications", all);
  return notif;
}

export function markAsRead(notificationId: string): void {
  const all = getItem<Notification[]>("notifications") || [];
  const idx = all.findIndex((n) => n.id === notificationId);
  if (idx >= 0) {
    all[idx].read = true;
    setItem("notifications", all);
  }
}

export function markAllAsRead(userId: string): void {
  const all = getItem<Notification[]>("notifications") || [];
  let changed = false;
  for (const n of all) {
    if (n.userId === userId && !n.read) {
      n.read = true;
      changed = true;
    }
  }
  if (changed) setItem("notifications", all);
}
