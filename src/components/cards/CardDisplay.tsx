"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardRarity } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { RarityBadge } from "@/components/ui/Badge";
import PSABadge from "./PSABadge";

const glowClass: Record<CardRarity, string> = {
  common: "glow-common",
  uncommon: "glow-uncommon",
  rare: "glow-rare",
  "ultra-rare": "glow-ultra-rare",
  legendary: "glow-legendary",
};

const sizeStyles = {
  sm: { wrapper: "w-[140px]", image: "h-[196px]", text: "text-xs" },
  md: { wrapper: "w-[200px]", image: "h-[280px]", text: "text-sm" },
  lg: { wrapper: "w-[280px]", image: "h-[392px]", text: "text-base" },
};

interface CardDisplayProps {
  card: Card;
  size?: "sm" | "md" | "lg";
  disableLink?: boolean;
  showValue?: boolean;
}

export default function CardDisplay({
  card,
  size = "sm",
  disableLink = false,
  showValue = true,
}: CardDisplayProps) {
  const s = sizeStyles[size];
  const isRareOrAbove = ["rare", "ultra-rare", "legendary"].includes(card.rarity);

  const content = (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className={`${s.wrapper} flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card transition-shadow ${glowClass[card.rarity]}`}
    >
      {/* Card image */}
      <div className={`relative ${s.image} overflow-hidden bg-bg-secondary`}>
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="object-cover"
          unoptimized
        />
        {isRareOrAbove && (
          <div className="card-shimmer absolute inset-0 pointer-events-none" />
        )}
        {/* PSA badge overlay */}
        <div className="absolute top-1.5 right-1.5">
          <PSABadge grade={card.psaGrade} />
        </div>
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-1 p-2 min-w-0">
        <h3 className={`${s.text} font-semibold text-text-primary truncate`}>
          {card.name}
        </h3>
        <div className="flex items-center gap-1.5 min-w-0">
          <RarityBadge rarity={card.rarity} />
          {showValue && (
            <span className={`${s.text} font-medium text-accent-gold whitespace-nowrap`}>
              {formatCurrency(card.estimatedValue)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (disableLink) return content;

  return (
    <Link href={`/card/${card.id}`}>
      {content}
    </Link>
  );
}
