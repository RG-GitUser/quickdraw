import { CardRarity, CardGenre } from "@/types";

const rarityColors: Record<CardRarity, string> = {
  common: "bg-rarity-common/20 text-rarity-common border-rarity-common/30",
  uncommon: "bg-rarity-uncommon/20 text-rarity-uncommon border-rarity-uncommon/30",
  rare: "bg-rarity-rare/20 text-rarity-rare border-rarity-rare/30",
  "ultra-rare": "bg-rarity-ultra-rare/20 text-rarity-ultra-rare border-rarity-ultra-rare/30",
  legendary: "bg-rarity-legendary/20 text-rarity-legendary border-rarity-legendary/30",
};

const genreColors: Record<CardGenre, string> = {
  sports: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
  pokemon: "bg-accent-orange/20 text-accent-orange border-accent-orange/30",
  magic: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
  yugioh: "bg-accent-red/20 text-accent-red border-accent-red/30",
  marvel: "bg-accent-green/20 text-accent-green border-accent-green/30",
  vintage: "bg-accent-gold/20 text-accent-gold border-accent-gold/30",
};

export function RarityBadge({ rarity }: { rarity: CardRarity }) {
  return (
    <span className={`inline-block shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize whitespace-nowrap ${rarityColors[rarity]}`}>
      {rarity}
    </span>
  );
}

export function GenreBadge({ genre }: { genre: CardGenre }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${genreColors[genre]}`}>
      {genre === "yugioh" ? "Yu-Gi-Oh" : genre}
    </span>
  );
}
