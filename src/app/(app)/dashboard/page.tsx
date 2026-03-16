"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAuctions } from "@/hooks/useAuctions";
import { getItem } from "@/lib/storage";
import { Card } from "@/types";
import FeaturedAuctions from "./_components/FeaturedAuctions";
import EndingSoonAuctions from "./_components/EndingSoonAuctions";
import YourActiveBids from "./_components/YourActiveBids";
import HotAuctions from "./_components/HotAuctions";
import RecentActivity from "./_components/RecentActivity";

export default function DashboardPage() {
  const { user } = useAuth();
  const { auctions } = useAuctions();
  const cards: Card[] = getItem<Card[]>("cards") || [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-accent-gold">{user?.username || "Collector"}</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here&apos;s what&apos;s happening in the auction house
        </p>
      </div>

      {/* Featured Auctions */}
      <FeaturedAuctions auctions={auctions} cards={cards} />

      {/* Ending Soon - horizontal scroll */}
      <EndingSoonAuctions auctions={auctions} cards={cards} />

      {/* Two column: Active Bids + Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <YourActiveBids auctions={auctions} user={user} />
        <RecentActivity />
      </div>

      {/* Hot Auctions grid */}
      <HotAuctions auctions={auctions} cards={cards} />
    </div>
  );
}
