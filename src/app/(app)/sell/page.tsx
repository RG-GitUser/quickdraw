"use client";

import { useMemo, useCallback, useState } from "react";
import { Card } from "@/types";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { getItem } from "@/lib/storage";
import ListingForm from "./_components/ListingForm";
import MyListings from "./_components/MyListings";

export default function SellPage() {
  const { user, refresh: refreshAuth } = useAuth();
  const { auctions, refresh: refreshAuctions } = useAuctions();
  const [, setTick] = useState(0);

  const allCards = getItem<Card[]>("cards") || [];

  const ownedCards = useMemo(() => {
    if (!user) return [];
    return allCards.filter((c) => user.collection.includes(c.id));
  }, [user, allCards]);

  const myListings = useMemo(() => {
    if (!user) return [];
    return auctions.filter((a) => a.sellerId === user.id);
  }, [user, auctions]);

  const handleRefresh = useCallback(() => {
    refreshAuth();
    refreshAuctions();
    setTick((t) => t + 1);
  }, [refreshAuth, refreshAuctions]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Sell Cards</h1>

      <ListingForm cards={ownedCards} onCreated={handleRefresh} />

      <div>
        <h2 className="mb-3 text-lg font-bold text-text-primary">My Listings</h2>
        <MyListings listings={myListings} onCancel={handleRefresh} />
      </div>
    </div>
  );
}
