"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAuctions } from "@/hooks/useAuctions";
import { Card } from "@/types";
import { getItem } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import CardDisplay from "@/components/cards/CardDisplay";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { auctions } = useAuctions();
  const cards = getItem<Card[]>("cards") || [];

  const likedCards = useMemo(() => {
    if (!user) return [];
    return cards.filter((c) => user.likedCardIds.includes(c.id));
  }, [user, cards]);

  const ownedCards = useMemo(() => {
    if (!user) return [];
    return cards.filter((c) => user.collection.includes(c.id));
  }, [user, cards]);

  const recentActivity = useMemo(() => {
    if (!user) return [];
    return auctions
      .filter(
        (a) =>
          (a.status === "sold" && (a.highestBidderId === user.id || a.sellerId === user.id))
      )
      .sort((a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime())
      .slice(0, 10);
  }, [user, auctions]);

  if (!user) return null;

  const totalValue = ownedCards.reduce((sum, c) => sum + (c.estimatedValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="rounded-xl border border-border bg-bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-blue text-2xl font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{user.username}</h1>
            {user.bio && <p className="text-sm text-text-secondary">{user.bio}</p>}
            <p className="text-xs text-text-secondary">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Cards Owned", value: user.collection.length.toString() },
          { label: "Collection Value", value: formatCurrency(totalValue) },
          { label: "Total Sales", value: user.totalSales.toString() },
          { label: "Total Purchases", value: user.totalPurchases.toString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-bg-card p-4 text-center">
            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
            <p className="text-xs text-text-secondary">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Liked Cards */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text-primary">
            Liked Cards
            <span className="ml-2 rounded-full bg-accent-blue/20 px-2 py-0.5 text-xs font-medium text-accent-blue">
              {likedCards.length}
            </span>
          </h2>
          {likedCards.length > 0 && (
            <Link href="/swipe" className="text-xs text-accent-blue hover:underline">
              Find more &rarr;
            </Link>
          )}
        </div>
        {likedCards.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-bg-card/50 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-red/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text-primary">No liked cards yet</p>
            <p className="mt-1 text-xs text-text-secondary">
              Swipe right on cards you love to add them here
            </p>
            <Link href="/swipe" className="mt-3 inline-block rounded-lg bg-accent-blue px-4 py-1.5 text-xs font-medium text-white hover:bg-accent-blue/80 transition-colors">
              Start Swiping
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="-mx-4 relative md:hidden">
              <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide">
                {likedCards.map((card) => (
                  <div key={card.id} className="flex-shrink-0 snap-start">
                    <CardDisplay card={card} size="sm" />
                  </div>
                ))}
                <div className="w-1 flex-shrink-0" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-bg-primary to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-bg-primary to-transparent" />
            </div>
            {/* Desktop: responsive grid */}
            <div className="hidden md:flex md:flex-wrap md:gap-4">
              {likedCards.map((card) => (
                <CardDisplay key={card.id} card={card} size="sm" />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Recent Auction Activity */}
      <div>
        <h2 className="mb-3 text-lg font-bold text-text-primary">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-text-secondary">No auction activity yet.</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a) => {
              const isBuyer = a.highestBidderId === user.id;
              return (
                <Link
                  key={a.id}
                  href={`/auction/${a.id}`}
                  className="flex items-center justify-between rounded-lg bg-bg-card border border-border px-4 py-3 hover:bg-bg-card-hover transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{a.title}</p>
                    <p className="text-xs text-text-secondary">
                      {isBuyer ? "Purchased" : "Sold"} &middot;{" "}
                      {new Date(a.endsAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${isBuyer ? "text-accent-red" : "text-accent-green"}`}>
                    {isBuyer ? "-" : "+"}{formatCurrency(a.currentBid)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
