"use client";

import { useState, useEffect, useCallback } from "react";
import { Notification } from "@/types";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/lib/notifications";
import { getSession } from "@/lib/auth";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(() => {
    const session = getSession();
    if (!session) return;
    setNotifications(getNotifications(session.userId));
    setUnreadCount(getUnreadCount(session.userId));
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  const read = useCallback(
    (id: string) => {
      markAsRead(id);
      refresh();
    },
    [refresh]
  );

  const readAll = useCallback(() => {
    const session = getSession();
    if (!session) return;
    markAllAsRead(session.userId);
    refresh();
  }, [refresh]);

  return { notifications, unreadCount, read, readAll, refresh };
}
