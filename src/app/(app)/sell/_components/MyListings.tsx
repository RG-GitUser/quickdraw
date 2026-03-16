"use client";

import { Auction } from "@/types";
import { cancelListing } from "@/lib/auction";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "@/components/auction/CountdownTimer";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import Link from "next/link";

interface MyListingsProps {
  listings: Auction[];
  onCancel: () => void;
}

export default function MyListings({ listings, onCancel }: MyListingsProps) {
  function handleCancel(auctionId: string) {
    const result = cancelListing(auctionId);
    if (result.success) onCancel();
  }

  if (listings.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-text-secondary">
        You have no active listings.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="flex items-center justify-between rounded-xl border border-border bg-bg-card p-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/auction/${listing.id}`} className="font-medium text-text-primary hover:text-accent-blue">
                {listing.title}
              </Link>
              <AuctionStatusBadge status={listing.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>
                {listing.bidCount > 0
                  ? `${formatCurrency(listing.currentBid)} (${listing.bidCount} bids)`
                  : `Starting ${formatCurrency(listing.startingPrice)}`}
              </span>
              {(listing.status === "active" || listing.status === "ending_soon") && (
                <CountdownTimer endsAt={listing.endsAt} size="sm" />
              )}
            </div>
          </div>
          {listing.bidCount === 0 && (listing.status === "active" || listing.status === "ending_soon") && (
            <button
              onClick={() => handleCancel(listing.id)}
              className="ml-4 rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-1.5 text-xs font-medium text-accent-red hover:bg-accent-red/20 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
