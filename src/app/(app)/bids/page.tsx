"use client";

import { useState, useMemo } from "react";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "@/components/auction/CountdownTimer";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import Link from "next/link";

type Tab = "active" | "won" | "lost";

export default function BidsPage() {
  const { user } = useAuth();
  const { auctions } = useAuctions();
  const [tab, setTab] = useState<Tab>("active");

  const categorized = useMemo(() => {
    if (!user) return { active: [], won: [], lost: [] };

    const active = auctions.filter(
      (a) =>
        (a.status === "active" || a.status === "ending_soon") &&
        a.highestBidderId === user.id
    );

    const won = auctions.filter(
      (a) => a.status === "sold" && a.highestBidderId === user.id
    );

    // Lost = auctions where user bid but didn't win (sold to someone else, or expired)
    const lost = auctions.filter(
      (a) =>
        (a.status === "sold" || a.status === "expired") &&
        a.highestBidderId !== user.id &&
        (user.activeBidAuctionIds || []).includes(a.id)
    );

    return { active, won, lost };
  }, [user, auctions]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "active", label: "Active Bids", count: categorized.active.length },
    { key: "won", label: "Won", count: categorized.won.length },
    { key: "lost", label: "Lost", count: categorized.lost.length },
  ];

  const displayed = categorized[tab];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">My Bids</h1>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-accent-blue text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">
          {tab === "active"
            ? "No active bids. Browse the marketplace to start bidding!"
            : tab === "won"
            ? "No won auctions yet."
            : "No lost auctions."}
        </p>
      ) : (
        <div className="space-y-3">
          {displayed.map((a) => {
            const isWinning = user && a.highestBidderId === user.id;
            return (
              <Link
                key={a.id}
                href={`/auction/${a.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4 transition-colors hover:bg-bg-card-hover"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary">{a.title}</span>
                    <AuctionStatusBadge status={a.status} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="font-bold text-accent-green">
                      {formatCurrency(a.currentBid)}
                    </span>
                    <span>{a.bidCount} bids</span>
                    {isWinning && tab === "active" && (
                      <span className="text-accent-green font-medium">Winning</span>
                    )}
                  </div>
                </div>
                {(a.status === "active" || a.status === "ending_soon") && (
                  <CountdownTimer endsAt={a.endsAt} size="sm" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
