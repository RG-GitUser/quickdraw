"use client";

import { Auction, Card } from "@/types";
import AuctionCard from "@/components/auction/AuctionCard";

interface AuctionGridProps {
  auctions: Auction[];
  cards: Card[];
}

export default function AuctionGrid({ auctions, cards }: AuctionGridProps) {
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  if (auctions.length === 0) {
    return (
      <div className="py-12 text-center text-text-secondary">
        No auctions found matching your filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {auctions.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
          card={cardMap.get(auction.cardId)}
        />
      ))}
    </div>
  );
}
