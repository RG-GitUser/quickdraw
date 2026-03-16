"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Pack } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PackCardProps {
  pack: Pack;
  balance: number;
  onOpen: (pack: Pack) => void;
}

export default function PackCard({ pack, balance, onOpen }: PackCardProps) {
  const canAfford = balance >= pack.price;

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card"
    >
      {/* Pack image with shimmer */}
      <div className="relative h-[280px] overflow-hidden bg-bg-secondary">
        <Image
          src={pack.imageUrl}
          alt={pack.name}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="card-shimmer absolute inset-0 pointer-events-none" />
        {/* Genre badge */}
        <div className="absolute top-2 left-2 rounded-full bg-bg-primary/80 px-2 py-0.5 text-xs font-bold text-accent-gold uppercase">
          {pack.genre === "mixed" ? "Mystery" : pack.genre}
        </div>
      </div>

      {/* Pack info */}
      <div className="flex flex-col gap-3 p-4">
        <h3 className="text-base font-bold text-text-primary">{pack.name}</h3>
        <p className="text-xs text-text-secondary">{pack.description}</p>

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>{pack.cardCount} cards</span>
          <span className="capitalize">{pack.guaranteedRarity}+ guaranteed</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent-gold">{formatCurrency(pack.price)}</span>
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={() => onOpen(pack)}
          >
            {canAfford ? "Buy & Open" : "Not enough"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
