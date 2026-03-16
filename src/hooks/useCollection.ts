"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/types";
import { getItem, setItem } from "@/lib/storage";
import { mockCards } from "@/lib/data/cards";

export function useCollection(userId: string | undefined) {
  const [collection, setCollection] = useState<Card[]>([]);

  const load = useCallback(() => {
    if (!userId) return;
    const allCards = getItem<Card[]>("cards") || mockCards;
    const users = getItem<{ id: string; collection: string[] }[]>("users") || [];
    const user = users.find((u) => u.id === userId);
    const ownedIds = user?.collection || [];
    setCollection(allCards.filter((c) => ownedIds.includes(c.id)));
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const addCards = useCallback(
    (cardIds: string[]) => {
      if (!userId) return;
      const users = getItem<{ id: string; collection: string[] }[]>("users") || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx < 0) return;
      const existing = new Set(users[idx].collection);
      cardIds.forEach((id) => existing.add(id));
      users[idx].collection = Array.from(existing);
      setItem("users", users);
      load();
    },
    [userId, load]
  );

  return { collection, addCards, reload: load };
}
