"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { getItem } from "@/lib/storage";
import { mockCards } from "@/lib/data/cards";
import { updateUser } from "@/lib/auth";
import { Card } from "@/types";
import SwipeCard from "./_components/SwipeCard";
import SwipeControls from "./_components/SwipeControls";

export default function SwipePage() {
  const { user, refresh } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = useMemo(() => {
    const allCards = getItem<Card[]>("cards") || mockCards;
    if (!user) return allCards;
    const seen = new Set([...user.likedCardIds, ...user.dislikedCardIds]);
    return allCards.filter((c) => !seen.has(c.id));
  }, [user]);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!user || currentIndex >= cards.length) return;
      const card = cards[currentIndex];

      const updatedUser = { ...user };
      if (direction === "right") {
        updatedUser.likedCardIds = [...user.likedCardIds, card.id];
        if (!updatedUser.interestedGenres.includes(card.genre)) {
          updatedUser.interestedGenres = [...updatedUser.interestedGenres, card.genre];
        }
      } else {
        updatedUser.dislikedCardIds = [...user.dislikedCardIds, card.id];
      }

      updateUser(updatedUser);
      refresh();
      setCurrentIndex((i) => i + 1);
    },
    [user, currentIndex, cards, refresh]
  );

  const remaining = cards.length - currentIndex;
  const currentCard = currentIndex < cards.length ? cards[currentIndex] : null;
  const nextCard = currentIndex + 1 < cards.length ? cards[currentIndex + 1] : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Discover Cards</h1>
        <p className="text-sm text-text-secondary mt-1">
          {remaining > 0 ? `${remaining} cards to swipe` : "You've seen them all!"}
        </p>
      </div>

      {/* Card stack */}
      <div className="relative h-[500px] w-full max-w-[380px]">
        <AnimatePresence>
          {currentCard ? (
            <>
              {nextCard && <SwipeCard key={`next-${nextCard.id}`} card={nextCard} onSwipe={() => {}} isTop={false} />}
              <SwipeCard key={currentCard.id} card={currentCard} onSwipe={handleSwipe} isTop />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-bg-card border border-border">
                <span className="text-3xl">🎉</span>
              </div>
              <p className="text-lg font-medium text-text-primary">All caught up!</p>
              <p className="text-sm text-text-secondary mt-1">
                Open more packs to discover new cards
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <SwipeControls
        onPass={() => handleSwipe("left")}
        onWant={() => handleSwipe("right")}
        disabled={!currentCard}
      />

      {/* Stats */}
      {user && (
        <div className="flex gap-6 text-sm text-text-muted">
          <span>Liked: <span className="text-accent-green font-medium">{user.likedCardIds.length}</span></span>
          <span>Passed: <span className="text-accent-red font-medium">{user.dislikedCardIds.length}</span></span>
        </div>
      )}
    </div>
  );
}
