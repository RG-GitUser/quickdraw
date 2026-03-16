"use client";

import { Bid } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getItem } from "@/lib/storage";

export default function RecentActivity() {
  const bids = (getItem<Bid[]>("bids") || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  if (bids.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-bg-card p-4">
      <h2 className="mb-3 text-lg font-bold text-text-primary">Live Activity</h2>
      <div className="space-y-2">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2 text-sm"
          >
            <span className="text-text-secondary">
              <span className="font-medium text-text-primary">{bid.bidderName}</span> bid
            </span>
            <span className="font-bold text-accent-green">{formatCurrency(bid.amount)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
