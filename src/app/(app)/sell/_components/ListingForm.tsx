"use client";

import { useState } from "react";
import { Card } from "@/types";
import { createListing } from "@/lib/auction";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface ListingFormProps {
  cards: Card[];
  onCreated: () => void;
}

const durations = [
  { label: "1 hour", ms: 3600000 },
  { label: "6 hours", ms: 21600000 },
  { label: "12 hours", ms: 43200000 },
  { label: "1 day", ms: 86400000 },
  { label: "3 days", ms: 259200000 },
  { label: "7 days", ms: 604800000 },
];

export default function ListingForm({ cards, onCreated }: ListingFormProps) {
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [startingPrice, setStartingPrice] = useState("10.00");
  const [reservePrice, setReservePrice] = useState("");
  const [duration, setDuration] = useState(86400000);
  const [error, setError] = useState("");

  const card = cards.find((c) => c.id === selectedCard);

  function handleSubmit() {
    setError("");
    if (!selectedCard) {
      setError("Select a card to list");
      return;
    }

    const price = Math.round(parseFloat(startingPrice || "0") * 100);
    if (price < 100) {
      setError("Minimum starting price is $1.00");
      return;
    }

    const reserve = reservePrice ? Math.round(parseFloat(reservePrice) * 100) : null;
    const title = card ? `${card.name}${card.psaGrade ? ` PSA ${card.psaGrade}` : ""}` : "Card";

    const result = createListing(selectedCard, title, price, duration, reserve);
    if (result.success) {
      setSelectedCard("");
      setStartingPrice("10.00");
      setReservePrice("");
      onCreated();
    } else {
      setError(result.error || "Failed to create listing");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card p-4 space-y-4">
      <h2 className="text-lg font-bold text-text-primary">List a Card for Auction</h2>

      {/* Card selector */}
      {cards.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No cards in your collection to list. Open some packs first!
        </p>
      ) : (
        <>
          <div>
            <label className="mb-1 block text-sm text-text-secondary">Select Card</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {cards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCard(c.id)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all ${
                    selectedCard === c.id
                      ? "border-accent-blue ring-2 ring-accent-blue/50"
                      : "border-border hover:border-accent-blue/50"
                  }`}
                >
                  <Image src={c.imageUrl} alt={c.name} fill unoptimized className="object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-1">
                    <p className="truncate text-[10px] text-white">{c.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedCard && card && (
            <div className="rounded-lg bg-bg-elevated p-3 text-sm">
              <p className="font-medium text-text-primary">{card.name}</p>
              <p className="text-text-secondary">
                {card.genre} &middot; {card.rarity}
                {card.psaGrade && ` · PSA ${card.psaGrade}`}
                {card.estimatedValue && ` · Est. ${formatCurrency(card.estimatedValue)}`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Starting Price ($)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                min="1"
                step="0.01"
                className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-text-secondary">Reserve Price ($, optional)</label>
              <input
                type="number"
                value={reservePrice}
                onChange={(e) => setReservePrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="None"
                className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-accent-blue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">Duration</label>
            <div className="flex flex-wrap gap-2">
              {durations.map((d) => (
                <button
                  key={d.ms}
                  onClick={() => setDuration(d.ms)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    duration === d.ms
                      ? "bg-accent-blue text-white"
                      : "bg-bg-elevated text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <Button onClick={handleSubmit} disabled={!selectedCard}>
            Create Listing
          </Button>
        </>
      )}
    </div>
  );
}
