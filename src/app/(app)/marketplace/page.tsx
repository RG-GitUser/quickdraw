"use client";

import { useState, useMemo } from "react";
import { CardGenre, AuctionType, Card } from "@/types";
import { useAuctions } from "@/hooks/useAuctions";
import { getItem } from "@/lib/storage";
import MarketplaceFilters from "./_components/MarketplaceFilters";
import AuctionGrid from "./_components/AuctionGrid";

type SortOption = "ending_soon" | "price_low" | "price_high" | "most_bids" | "newest";

export default function MarketplacePage() {
  const { auctions } = useAuctions();
  const cards = getItem<Card[]>("cards") || [];
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<CardGenre | "all">("all");
  const [type, setType] = useState<AuctionType | "all">("all");
  const [sort, setSort] = useState<SortOption>("ending_soon");

  const filtered = useMemo(() => {
    let list = auctions.filter(
      (a) => a.status === "active" || a.status === "ending_soon"
    );

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.title.toLowerCase().includes(q));
    }

    if (genre !== "all") {
      list = list.filter((a) => {
        const card = cardMap.get(a.cardId);
        return card?.genre === genre;
      });
    }

    if (type !== "all") {
      list = list.filter((a) => a.type === type);
    }

    switch (sort) {
      case "ending_soon":
        list.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
        break;
      case "price_high":
        list.sort((a, b) => (b.currentBid || b.startingPrice) - (a.currentBid || a.startingPrice));
        break;
      case "price_low":
        list.sort((a, b) => (a.currentBid || a.startingPrice) - (b.currentBid || b.startingPrice));
        break;
      case "most_bids":
        list.sort((a, b) => b.bidCount - a.bidCount);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return list;
  }, [auctions, search, genre, type, sort, cardMap]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Marketplace</h1>
      <MarketplaceFilters
        search={search}
        genre={genre}
        type={type}
        sort={sort}
        onSearchChange={setSearch}
        onGenreChange={setGenre}
        onTypeChange={setType}
        onSortChange={setSort}
      />
      <AuctionGrid auctions={filtered} cards={cards} />
    </div>
  );
}
