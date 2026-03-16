"use client";

import { Auction, Card } from "@/types";
import AuctionCard from "@/components/auction/AuctionCard";

interface Props {
  auctions: Auction[];
  cards: Card[];
}

export default function EndingSoonAuctions({ auctions, cards }: Props) {
  const endingSoon = auctions
    .filter((a) => {
      if (a.status !== "active" && a.status !== "ending_soon") return false;
      const timeLeft = new Date(a.endsAt).getTime() - Date.now();
      return timeLeft > 0 && timeLeft < 21600000; // 6 hours
    })
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
    .slice(0, 8);

  const cardMap = new Map(cards.map((c) => [c.id, c]));

  if (endingSoon.length === 0) return null;

  return (
    <section className="-mx-4">
      <h2 className="mb-4 px-4 text-lg font-bold text-text-primary">
        Ending Soon
        <span className="ml-2 text-sm font-normal text-accent-red">Don&apos;t miss out!</span>
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth">
        {endingSoon.map((auction) => (
          <div key={auction.id} className="w-48 flex-shrink-0 snap-start">
            <AuctionCard auction={auction} card={cardMap.get(auction.cardId)} />
          </div>
        ))}
        <div className="w-1 flex-shrink-0" />
      </div>
    </section>
  );
}
