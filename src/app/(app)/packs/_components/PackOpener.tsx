"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pack, Card } from "@/types";
import { formatCurrency, RARITY_ORDER } from "@/lib/utils";
import { getItem } from "@/lib/storage";
import { mockCards } from "@/lib/data/cards";
import Button from "@/components/ui/Button";
import CardReveal from "./CardReveal";

type Stage = "sealed" | "opening" | "reveal" | "summary";

interface PackOpenerProps {
  pack: Pack;
  onClose: () => void;
  onComplete: (pulledCards: Card[]) => void;
}

function pullCards(pack: Pack): Card[] {
  const allCards = getItem<Card[]>("cards") || mockCards;
  const pool = allCards.filter((c) => pack.availableCardIds.includes(c.id));
  if (pool.length === 0) return [];

  const pulled: Card[] = [];
  const used = new Set<string>();

  // Guarantee at least one card of the guaranteed rarity or above
  const guaranteePool = pool.filter(
    (c) => (RARITY_ORDER[c.rarity] || 0) >= (RARITY_ORDER[pack.guaranteedRarity] || 0)
  );
  if (guaranteePool.length > 0) {
    const g = guaranteePool[Math.floor(Math.random() * guaranteePool.length)];
    pulled.push(g);
    used.add(g.id);
  }

  // Fill remaining slots
  while (pulled.length < pack.cardCount) {
    const available = pool.filter((c) => !used.has(c.id));
    if (available.length === 0) {
      // Allow duplicates if pool is small
      const c = pool[Math.floor(Math.random() * pool.length)];
      pulled.push(c);
    } else {
      const c = available[Math.floor(Math.random() * available.length)];
      pulled.push(c);
      used.add(c.id);
    }
  }

  return pulled;
}

export default function PackOpener({ pack, onClose, onComplete }: PackOpenerProps) {
  const [stage, setStage] = useState<Stage>("sealed");
  const [pulledCards, setPulledCards] = useState<Card[]>([]);

  const handleTear = useCallback(() => {
    setStage("opening");
    const cards = pullCards(pack);
    setPulledCards(cards);
    setTimeout(() => setStage("reveal"), 800);
  }, [pack]);

  const handleAddToCollection = () => {
    onComplete(pulledCards);
  };

  const totalValue = pulledCards.reduce((sum, c) => sum + c.estimatedValue, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && stage === "summary") onClose();
      }}
    >
      <AnimatePresence mode="wait">
        {/* SEALED PACK */}
        {stage === "sealed" && (
          <motion.div
            key="sealed"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              className="relative w-[240px] h-[336px] cursor-pointer rounded-2xl border-2 border-accent-gold/40 bg-gradient-to-br from-bg-card to-bg-secondary overflow-hidden shadow-[0_0_40px_rgba(245,197,66,0.3)]"
              onClick={handleTear}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-4xl font-black text-accent-gold mb-2">Q</span>
                <h3 className="text-lg font-bold text-text-primary">{pack.name}</h3>
                <p className="text-xs text-text-muted mt-1">{pack.cardCount} cards inside</p>
                <p className="mt-4 text-sm text-accent-gold font-medium animate-pulse">
                  Tap to tear open!
                </p>
              </div>
              <div className="card-shimmer absolute inset-0 pointer-events-none" />
            </motion.div>
          </motion.div>
        )}

        {/* OPENING ANIMATION */}
        {stage === "opening" && (
          <motion.div
            key="opening"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 0.5], opacity: [1, 1, 0] }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center"
          >
            <div className="h-20 w-20 rounded-full bg-accent-gold/30 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-accent-gold animate-ping" />
            </div>
          </motion.div>
        )}

        {/* CARD REVEAL */}
        {stage === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="text-xl font-bold text-text-primary">Your Pulls!</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {pulledCards.map((card, i) => (
                <CardReveal key={`${card.id}-${i}`} card={card} index={i} />
              ))}
            </div>
            <Button size="lg" onClick={() => setStage("summary")}>
              View Summary
            </Button>
          </motion.div>
        )}

        {/* SUMMARY */}
        {stage === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-border bg-bg-secondary p-6"
          >
            <h2 className="text-xl font-bold text-text-primary mb-4 text-center">
              Pack Summary
            </h2>
            <div className="space-y-2 mb-4">
              {pulledCards.map((card, i) => (
                <div key={`${card.id}-${i}`} className="flex items-center justify-between rounded-lg bg-bg-card p-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full bg-rarity-${card.rarity.replace("-", "-")}`}
                      style={{ backgroundColor: `var(--color-rarity-${card.rarity})` }}
                    />
                    <span className="text-sm text-text-primary">{card.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-accent-gold">
                    {formatCurrency(card.estimatedValue)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total Value</span>
                <span className="text-lg font-bold text-accent-gold">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Discard
              </Button>
              <Button className="flex-1" onClick={handleAddToCollection}>
                Add to Collection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
