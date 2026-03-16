"use client";

import { Auction, Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "@/components/auction/CountdownTimer";
import Link from "next/link";
import Image from "next/image";

interface Props {
  auctions: Auction[];
  cards: Card[];
}

export default function FeaturedAuctions({ auctions, cards }: Props) {
  const featured = auctions
    .filter((a) => a.featured && (a.status === "active" || a.status === "ending_soon"))
    .slice(0, 4);

  const cardMap = new Map(cards.map((c) => [c.id, c]));

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-text-primary">Featured Auctions</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {featured.map((auction) => {
          const card = cardMap.get(auction.cardId);
          return (
            <Link
              key={auction.id}
              href={`/auction/${auction.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-card to-bg-elevated transition-all hover:border-accent-gold/50"
            >
              <div className="flex gap-4 p-4">
                <div className="relative h-32 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-bg-elevated">
                  {card && (
                    <Image src={card.imageUrl} alt={auction.title} fill unoptimized className="object-cover" />
                  )}
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <span className="mb-1 inline-block rounded-full bg-accent-gold/20 px-2 py-0.5 text-[10px] font-bold text-accent-gold">
                      FEATURED
                    </span>
                    <h3 className="text-sm font-semibold text-text-primary leading-tight">
                      {auction.title}
                    </h3>
                    <p className="text-xs text-text-secondary">{auction.bidCount} bids</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-accent-green">
                      {formatCurrency(auction.currentBid)}
                    </span>
                    <CountdownTimer endsAt={auction.endsAt} size="sm" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
