"use client";

import { Card } from "@/types";
import CardDisplay from "@/components/cards/CardDisplay";

export default function LatestReleases({ cards }: { cards: Card[] }) {
  const latest = [...cards].sort((a, b) => b.year - a.year).slice(0, 10);

  return (
    <section className="-mx-4">
      <h2 className="mb-4 px-4 text-lg font-bold">Latest Releases</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth">
        {latest.map((card) => (
          <div key={card.id} className="flex-shrink-0 snap-start">
            <CardDisplay card={card} size="sm" />
          </div>
        ))}
        {/* Spacer so last card isn't flush against edge */}
        <div className="w-1 flex-shrink-0" />
      </div>
    </section>
  );
}
