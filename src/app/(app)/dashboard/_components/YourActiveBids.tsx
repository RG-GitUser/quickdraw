"use client";

import { Auction, User } from "@/types";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "@/components/auction/CountdownTimer";
import Link from "next/link";

interface Props {
  auctions: Auction[];
  user: User | null;
}

export default function YourActiveBids({ auctions, user }: Props) {
  if (!user) return null;

  const bidIds = user.activeBidAuctionIds || [];
  const activeBids = auctions.filter(
    (a) =>
      (a.status === "active" || a.status === "ending_soon") &&
      bidIds.includes(a.id)
  );

  if (activeBids.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-2 text-lg font-bold text-text-primary">Your Active Bids</h2>
        <p className="text-sm text-text-secondary">
          No active bids.{" "}
          <Link href="/marketplace" className="text-accent-blue hover:underline">
            Browse the marketplace
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-bg-card p-4">
      <h2 className="mb-3 text-lg font-bold text-text-primary">Your Active Bids</h2>
      <div className="space-y-2">
        {activeBids.slice(0, 5).map((a) => {
          const isWinning = a.highestBidderId === user.id;
          return (
            <Link
              key={a.id}
              href={`/auction/${a.id}`}
              className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2 transition-colors hover:bg-bg-card-hover"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{a.title}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={isWinning ? "text-accent-green font-medium" : "text-accent-red font-medium"}>
                    {isWinning ? "Winning" : "Outbid"}
                  </span>
                  <span className="text-text-secondary">{formatCurrency(a.currentBid)}</span>
                </div>
              </div>
              <CountdownTimer endsAt={a.endsAt} size="sm" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
