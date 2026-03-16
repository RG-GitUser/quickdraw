"use client";

import { Auction, Card } from "@/types";
import AuctionCard from "@/components/auction/AuctionCard";

interface Props {
  auctions: Auction[];
  cards: Card[];
}

export default function HotAuctions({ auctions, cards }: Props) {
  const hot = auctions
    .filter((a) => a.status === "active" || a.status === "ending_soon")
    .sort((a, b) => b.bidCount - a.bidCount)
    .slice(0, 6);

  const cardMap = new Map(cards.map((c) => [c.id, c]));

  if (hot.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-text-primary">Hot Auctions</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {hot.map((auction) => (
          <AuctionCard
            key={auction.id}
            auction={auction}
            card={cardMap.get(auction.cardId)}
          />
        ))}
      </div>
    </section>
  );
}
