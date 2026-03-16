"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { RarityBadge } from "@/components/ui/Badge";
import PSABadge from "@/components/cards/PSABadge";

const rarityGlow: Record<string, string> = {
  common: "",
  uncommon: "shadow-[0_0_20px_rgba(102,187,106,0.4)]",
  rare: "shadow-[0_0_25px_rgba(78,140,255,0.5)]",
  "ultra-rare": "shadow-[0_0_30px_rgba(187,134,252,0.5)]",
  legendary: "shadow-[0_0_40px_rgba(245,197,66,0.6)]",
};

interface CardRevealProps {
  card: Card;
  index: number;
}

export default function CardReveal({ card, index }: CardRevealProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
      className="perspective cursor-pointer"
      onClick={() => setFlipped(true)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
        className={`preserve-3d relative w-[160px] h-[224px] sm:w-[180px] sm:h-[252px] ${flipped ? rarityGlow[card.rarity] : ""} rounded-xl`}
      >
        {/* Back face (card back) */}
        <div className="backface-hidden absolute inset-0 rounded-xl border-2 border-accent-gold/30 bg-gradient-to-br from-bg-card via-accent-gold/10 to-bg-card overflow-hidden">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/20">
              <span className="text-xl font-black text-accent-gold">Q</span>
            </div>
            <p className="text-xs text-accent-gold/60 font-medium">Tap to reveal</p>
          </div>
          <div className="card-shimmer absolute inset-0 pointer-events-none" />
        </div>

        {/* Front face (revealed card) */}
        <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-xl border-2 border-border bg-bg-card overflow-hidden">
          <div className="relative h-[60%] bg-bg-secondary">
            <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
            {["rare", "ultra-rare", "legendary"].includes(card.rarity) && (
              <div className="card-shimmer absolute inset-0 pointer-events-none" />
            )}
            <div className="absolute top-1 right-1">
              <PSABadge grade={card.psaGrade} />
            </div>
          </div>
          <div className="flex flex-col gap-1 p-2">
            <h4 className="text-xs font-bold text-text-primary truncate">{card.name}</h4>
            <div className="flex items-center justify-between">
              <RarityBadge rarity={card.rarity} />
              <span className="text-xs font-semibold text-accent-gold">
                {formatCurrency(card.estimatedValue)}
              </span>
            </div>
            <p className="text-[10px] text-text-muted truncate">{card.setName} ({card.year})</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
