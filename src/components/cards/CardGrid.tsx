"use client";

import { Card } from "@/types";
import CardDisplay from "./CardDisplay";

interface CardGridProps {
  cards: Card[];
  size?: "sm" | "md";
}

export default function CardGrid({ cards, size = "sm" }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <p className="text-lg">No cards found</p>
        <p className="text-sm">Open packs or swipe to discover cards!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {cards.map((card) => (
        <CardDisplay key={card.id} card={card} size={size} />
      ))}
    </div>
  );
}
