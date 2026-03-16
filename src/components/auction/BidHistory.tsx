"use client";

import { Bid } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getSession } from "@/lib/auth";

interface BidHistoryProps {
  bids: Bid[];
  maxItems?: number;
}

export default function BidHistory({ bids, maxItems }: BidHistoryProps) {
  const session = getSession();
  const displayed = maxItems ? bids.slice(0, maxItems) : bids;

  if (displayed.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-text-secondary">
        No bids yet. Be the first!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {displayed.map((bid, i) => {
        const isUser = session && bid.bidderId === session.userId;
        const isTop = i === 0;
        return (
          <div
            key={bid.id}
            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
              isUser
                ? "bg-accent-blue/10 border border-accent-blue/30"
                : isTop
                ? "bg-accent-green/10 border border-accent-green/30"
                : "bg-bg-elevated"
            }`}
          >
            <div className="flex items-center gap-2">
              {isTop && (
                <span className="text-accent-green text-xs">&#9650;</span>
              )}
              <span className={`font-medium ${isUser ? "text-accent-blue" : "text-text-primary"}`}>
                {bid.bidderName}
                {isUser && " (You)"}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-text-primary">
                {formatCurrency(bid.amount)}
              </span>
              <span className="ml-2 text-xs text-text-secondary">
                {formatTimeAgo(bid.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
