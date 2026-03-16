"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { RarityBadge, GenreBadge } from "@/components/ui/Badge";
import PSABadge from "@/components/cards/PSABadge";

interface SwipeCardProps {
  card: Card;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

export default function SwipeCard({ card, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const wantOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);
  const [exiting, setExiting] = useState(false);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 120;
    if (Math.abs(info.offset.x) > threshold) {
      setExiting(true);
      const direction = info.offset.x > 0 ? "right" : "left";
      setTimeout(() => onSwipe(direction), 200);
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[300px] h-[440px] sm:w-[340px] sm:h-[480px] rounded-2xl border border-border bg-bg-card scale-[0.95] opacity-60" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        animate={exiting ? { x: x.get() > 0 ? 500 : -500, opacity: 0 } : {}}
        transition={{ duration: 0.3 }}
        className="relative w-[300px] h-[440px] sm:w-[340px] sm:h-[480px] cursor-grab active:cursor-grabbing rounded-2xl border-2 border-border bg-bg-card overflow-hidden shadow-2xl"
      >
        {/* Card image */}
        <div className="relative h-[65%] bg-bg-secondary">
          <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
          {["rare", "ultra-rare", "legendary"].includes(card.rarity) && (
            <div className="card-shimmer absolute inset-0 pointer-events-none" />
          )}

          {/* WANT / PASS overlays */}
          <motion.div
            style={{ opacity: wantOpacity }}
            className="absolute top-6 left-6 rotate-[-12deg] rounded-lg border-4 border-accent-green bg-accent-green/20 px-4 py-2"
          >
            <span className="text-2xl font-black text-accent-green">WANT</span>
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 rotate-[12deg] rounded-lg border-4 border-accent-red bg-accent-red/20 px-4 py-2"
          >
            <span className="text-2xl font-black text-accent-red">PASS</span>
          </motion.div>

          {/* PSA badge */}
          <div className="absolute top-3 right-3">
            <PSABadge grade={card.psaGrade} size="sm" />
          </div>
        </div>

        {/* Card info */}
        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-lg font-bold text-text-primary">{card.name}</h3>
          <p className="text-xs text-text-muted">{card.setName} ({card.year})</p>
          <div className="flex items-center gap-2">
            <RarityBadge rarity={card.rarity} />
            <GenreBadge genre={card.genre} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-text-secondary">{card.artist}</span>
            <span className="text-lg font-bold text-accent-gold">
              {formatCurrency(card.estimatedValue)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
