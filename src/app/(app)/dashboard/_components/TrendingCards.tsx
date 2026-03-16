"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { GenreBadge } from "@/components/ui/Badge";

export default function TrendingCards({ cards }: { cards: Card[] }) {
  const trending = [...cards].sort((a, b) => b.trendScore - a.trendScore).slice(0, 8);

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">Trending Now</h2>
      <div className="space-y-2">
        {trending.map((card, i) => (
          <Link
            key={card.id}
            href={`/card/${card.id}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-bg-card p-3 transition-colors hover:bg-bg-card-hover"
          >
            <span className="w-6 text-center text-sm font-bold text-text-muted">
              {i + 1}
            </span>
            <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden rounded bg-bg-secondary">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{card.name}</p>
              <GenreBadge genre={card.genre} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-accent-gold">
                {formatCurrency(card.estimatedValue)}
              </span>
              <span className="text-xs text-accent-green">
                +{card.trendScore}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
