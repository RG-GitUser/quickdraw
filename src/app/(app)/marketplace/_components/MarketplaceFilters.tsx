"use client";

import { CardGenre, AuctionType } from "@/types";

interface FiltersProps {
  search: string;
  genre: CardGenre | "all";
  type: AuctionType | "all";
  sort: "ending_soon" | "price_low" | "price_high" | "most_bids" | "newest";
  onSearchChange: (v: string) => void;
  onGenreChange: (v: CardGenre | "all") => void;
  onTypeChange: (v: AuctionType | "all") => void;
  onSortChange: (v: FiltersProps["sort"]) => void;
}

const genres: (CardGenre | "all")[] = ["all", "sports", "pokemon", "magic", "yugioh", "marvel", "vintage"];
const types: { value: AuctionType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "house", label: "House" },
  { value: "peer", label: "Peer" },
];
const sorts: { value: FiltersProps["sort"]; label: string }[] = [
  { value: "ending_soon", label: "Ending Soon" },
  { value: "price_high", label: "Price: High" },
  { value: "price_low", label: "Price: Low" },
  { value: "most_bids", label: "Most Bids" },
  { value: "newest", label: "Newest" },
];

export default function MarketplaceFilters({
  search, genre, type, sort,
  onSearchChange, onGenreChange, onTypeChange, onSortChange,
}: FiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search auctions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg-card px-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
      />

      <div className="flex flex-wrap gap-3">
        {/* Genre pills */}
        <div className="flex flex-wrap gap-1.5">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => onGenreChange(g)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                genre === g
                  ? "bg-accent-blue text-white"
                  : "bg-bg-card text-text-secondary hover:text-text-primary"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="flex gap-1.5">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                type === t.value
                  ? "bg-accent-blue text-white"
                  : "bg-bg-card text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as FiltersProps["sort"])}
          className="rounded-lg border border-border bg-bg-card px-3 py-1 text-xs text-text-primary focus:border-accent-blue focus:outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
