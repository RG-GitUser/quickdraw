"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { getItem } from "@/lib/storage";
import { mockPacks } from "@/lib/data/packs";
import { Pack, Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { updateUser } from "@/lib/auth";
import PackCard from "./_components/PackCard";
import PackOpener from "./_components/PackOpener";

export default function PacksPage() {
  const { user, refresh } = useAuth();
  const [openingPack, setOpeningPack] = useState<Pack | null>(null);
  const packs = getItem<Pack[]>("packs") || mockPacks;

  const handleOpen = useCallback(
    (pack: Pack) => {
      if (!user || user.balance < pack.price) return;
      // Deduct balance
      const updated = { ...user, balance: user.balance - pack.price };
      updateUser(updated);
      refresh();
      setOpeningPack(pack);
    },
    [user, refresh]
  );

  const handleComplete = useCallback(
    (pulledCards: Card[]) => {
      if (!user) return;
      const newIds = pulledCards.map((c) => c.id);
      const existing = new Set(user.collection);
      newIds.forEach((id) => existing.add(id));
      // Also add genres
      const genres = new Set(user.interestedGenres);
      pulledCards.forEach((c) => genres.add(c.genre));
      const updated = {
        ...user,
        collection: Array.from(existing),
        interestedGenres: Array.from(genres),
      };
      updateUser(updated);
      refresh();
      setOpeningPack(null);
    },
    [user, refresh]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Open Packs</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Balance: <span className="font-semibold text-accent-gold">{formatCurrency(user?.balance || 0)}</span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {packs.map((pack) => (
          <PackCard
            key={pack.id}
            pack={pack}
            balance={user?.balance || 0}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {/* Pack opener overlay */}
      <AnimatePresence>
        {openingPack && (
          <PackOpener
            pack={openingPack}
            onClose={() => setOpeningPack(null)}
            onComplete={handleComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
