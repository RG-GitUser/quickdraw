"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCollection } from "@/hooks/useCollection";
import { CardGenre, CardRarity } from "@/types";
import { formatCurrency, RARITY_ORDER } from "@/lib/utils";
import CardGrid from "@/components/cards/CardGrid";
import Button from "@/components/ui/Button";

const genres: CardGenre[] = ["sports", "pokemon", "magic", "yugioh", "marvel", "vintage"];
const rarities: CardRarity[] = ["common", "uncommon", "rare", "ultra-rare", "legendary"];

type SortBy = "value-desc" | "value-asc" | "name" | "rarity";

export default function CollectionPage() {
  const { user } = useAuth();
  const { collection } = useCollection(user?.id);
  const [genreFilter, setGenreFilter] = useState<CardGenre | "all">("all");
  const [rarityFilter, setRarityFilter] = useState<CardRarity | "all">("all");
  const [gradedFilter, setGradedFilter] = useState<"all" | "graded" | "raw">("all");
  const [sortBy, setSortBy] = useState<SortBy>("value-desc");

  const filtered = useMemo(() => {
    let cards = [...collection];

    if (genreFilter !== "all") cards = cards.filter((c) => c.genre === genreFilter);
    if (rarityFilter !== "all") cards = cards.filter((c) => c.rarity === rarityFilter);
    if (gradedFilter === "graded") cards = cards.filter((c) => c.psaGrade !== null);
    if (gradedFilter === "raw") cards = cards.filter((c) => c.psaGrade === null);

    switch (sortBy) {
      case "value-desc":
        cards.sort((a, b) => b.estimatedValue - a.estimatedValue);
        break;
      case "value-asc":
        cards.sort((a, b) => a.estimatedValue - b.estimatedValue);
        break;
      case "name":
        cards.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rarity":
        cards.sort((a, b) => (RARITY_ORDER[b.rarity] || 0) - (RARITY_ORDER[a.rarity] || 0));
        break;
    }

    return cards;
  }, [collection, genreFilter, rarityFilter, gradedFilter, sortBy]);

  const totalValue = collection.reduce((sum, c) => sum + c.estimatedValue, 0);

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div>
        <h1 className="text-2xl font-bold">My Collection</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-text-secondary">
          <span>{collection.length} cards</span>
          <span>Total value: <span className="font-semibold text-accent-gold">{formatCurrency(totalValue)}</span></span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Genre */}
        <div className="flex flex-wrap gap-1">
          <Button
            variant={genreFilter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setGenreFilter("all")}
          >
            All Genres
          </Button>
          {genres.map((g) => (
            <Button
              key={g}
              variant={genreFilter === g ? "primary" : "secondary"}
              size="sm"
              onClick={() => setGenreFilter(g)}
            >
              {g === "yugioh" ? "Yu-Gi-Oh" : g.charAt(0).toUpperCase() + g.slice(1)}
            </Button>
          ))}
        </div>

        {/* Rarity */}
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value as CardRarity | "all")}
          className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary"
        >
          <option value="all">All Rarities</option>
          {rarities.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {/* Graded */}
        <select
          value={gradedFilter}
          onChange={(e) => setGradedFilter(e.target.value as "all" | "graded" | "raw")}
          className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary"
        >
          <option value="all">All Cards</option>
          <option value="graded">PSA Graded</option>
          <option value="raw">Raw / Ungraded</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="rounded-lg border border-border bg-bg-card px-3 py-1.5 text-sm text-text-primary"
        >
          <option value="value-desc">Value: High to Low</option>
          <option value="value-asc">Value: Low to High</option>
          <option value="name">Name: A-Z</option>
          <option value="rarity">Rarity</option>
        </select>
      </div>

      {/* Grid */}
      <CardGrid cards={filtered} size="sm" />
    </div>
  );
}
