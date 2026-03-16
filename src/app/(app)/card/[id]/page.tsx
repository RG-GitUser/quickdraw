"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { getItem } from "@/lib/storage";
import { mockCards } from "@/lib/data/cards";
import { useAuth } from "@/hooks/useAuth";
import { updateUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/types";
import { RarityBadge, GenreBadge } from "@/components/ui/Badge";
import PSABadge from "@/components/cards/PSABadge";
import Button from "@/components/ui/Button";

const rarityBorder: Record<string, string> = {
  common: "border-rarity-common/40",
  uncommon: "border-rarity-uncommon/40",
  rare: "border-rarity-rare/40",
  "ultra-rare": "border-rarity-ultra-rare/40",
  legendary: "border-rarity-legendary/60",
};

export default function CardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, refresh } = useAuth();
  const allCards = getItem<Card[]>("cards") || mockCards;
  const card = allCards.find((c) => c.id === id);

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-text-muted">Card not found</p>
        <Link href="/dashboard" className="mt-4 text-accent-blue hover:underline text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isOwned = user?.collection.includes(card.id);
  const isLiked = user?.likedCardIds.includes(card.id);

  const handleLike = () => {
    if (!user) return;
    const updated = { ...user };
    if (isLiked) {
      updated.likedCardIds = user.likedCardIds.filter((id) => id !== card.id);
    } else {
      updated.likedCardIds = [...user.likedCardIds, card.id];
    }
    updateUser(updated);
    refresh();
  };

  const handleAddToCollection = () => {
    if (!user || isOwned) return;
    const updated = {
      ...user,
      collection: [...user.collection, card.id],
    };
    updateUser(updated);
    refresh();
  };

  const isRareOrAbove = ["rare", "ultra-rare", "legendary"].includes(card.rarity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
    >
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Card image with PSA slab */}
        <div className="flex justify-center">
          <div className={`relative rounded-2xl border-4 ${rarityBorder[card.rarity]} bg-bg-card p-3 ${isRareOrAbove ? `glow-${card.rarity}` : ""}`}>
            {/* PSA slab header */}
            {card.psaGrade !== null && (
              <div className="mb-2 flex items-center justify-between rounded-lg bg-accent-gold/10 px-3 py-2">
                <span className="text-xs font-bold text-accent-gold tracking-wider">PSA CERTIFIED</span>
                <span className="text-xl font-black text-accent-gold">{card.psaGrade}</span>
              </div>
            )}

            <div className="relative w-[280px] h-[392px] overflow-hidden rounded-xl bg-bg-secondary">
              <Image src={card.imageUrl} alt={card.name} fill className="object-cover" unoptimized />
              {isRareOrAbove && (
                <div className="card-shimmer absolute inset-0 pointer-events-none" />
              )}
            </div>

            {/* Raw badge if ungraded */}
            {card.psaGrade === null && (
              <div className="mt-2 text-center">
                <span className="rounded-full bg-text-muted/20 px-3 py-1 text-xs font-medium text-text-muted">
                  RAW / Ungraded
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card info */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">{card.name}</h1>
            <p className="mt-1 text-sm text-text-secondary">{card.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <RarityBadge rarity={card.rarity} />
            <GenreBadge genre={card.genre} />
            <PSABadge grade={card.psaGrade} size="sm" />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-bg-card p-3">
              <p className="text-xs text-text-muted">Estimated Value</p>
              <p className="text-xl font-bold text-accent-gold">{formatCurrency(card.estimatedValue)}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg-card p-3">
              <p className="text-xs text-text-muted">Year</p>
              <p className="text-xl font-bold text-text-primary">{card.year}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg-card p-3">
              <p className="text-xs text-text-muted">Set</p>
              <p className="text-sm font-medium text-text-primary">{card.setName}</p>
            </div>
            <div className="rounded-lg border border-border bg-bg-card p-3">
              <p className="text-xs text-text-muted">Artist</p>
              <p className="text-sm font-medium text-text-primary">{card.artist}</p>
            </div>
          </div>

          {/* Trend */}
          <div className="rounded-lg border border-border bg-bg-card p-3 flex items-center justify-between">
            <span className="text-sm text-text-secondary">Trend Score</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent-green"
                  style={{ width: `${card.trendScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-accent-green">{card.trendScore}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              variant={isLiked ? "primary" : "secondary"}
              onClick={handleLike}
              className="flex-1"
            >
              {isLiked ? "♥ Liked" : "♡ Like"}
            </Button>
            {isOwned ? (
              <Link href={`/sell`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Auction This Card
                </Button>
              </Link>
            ) : (
              <Button onClick={handleAddToCollection} className="flex-1">
                Add to Collection
              </Button>
            )}
          </div>

          {isOwned && (
            <p className="text-xs text-accent-green text-center">You own this card!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
