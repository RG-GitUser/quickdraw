"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/types";
import { useAuction } from "@/hooks/useAuction";
import { useWallet } from "@/hooks/useWallet";
import { getItem } from "@/lib/storage";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "@/components/auction/CountdownTimer";
import AuctionStatusBadge from "@/components/auction/AuctionStatusBadge";
import BidHistory from "@/components/auction/BidHistory";
import PlaceBidForm from "@/components/auction/PlaceBidForm";
import { getSession } from "@/lib/auth";

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { auction, bids, refresh } = useAuction(id);
  const { balance, refresh: refreshWallet } = useWallet();
  const cards = getItem<Card[]>("cards") || [];
  const session = getSession();

  if (!auction) {
    return (
      <div className="py-12 text-center text-text-secondary">
        Auction not found.{" "}
        <Link href="/marketplace" className="text-accent-blue hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  const card = cards.find((c) => c.id === auction.cardId);
  const isOwnAuction = session && auction.sellerId === session.userId;
  const isHighestBidder = session && auction.highestBidderId === session.userId;

  function handleBidPlaced() {
    refresh();
    refreshWallet();
  }

  return (
    <div className="space-y-6">
      <Link href="/marketplace" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary">
        &larr; Back to marketplace
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Card image */}
        <div className="flex flex-col items-center">
          <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            {card ? (
              <Image src={card.imageUrl} alt={auction.title} fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-text-secondary">
                No image
              </div>
            )}
          </div>
          {card && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-bg-card px-3 py-1 text-xs text-text-secondary capitalize">
                {card.genre}
              </span>
              <span className="rounded-full bg-bg-card px-3 py-1 text-xs text-text-secondary capitalize">
                {card.rarity}
              </span>
              {card.psaGrade && (
                <span className="rounded-full bg-accent-gold/20 px-3 py-1 text-xs font-bold text-accent-gold">
                  PSA {card.psaGrade}
                </span>
              )}
              <span className="rounded-full bg-bg-card px-3 py-1 text-xs text-text-secondary">
                {card.setName} ({card.year})
              </span>
            </div>
          )}
        </div>

        {/* Right: Auction info */}
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <AuctionStatusBadge status={auction.status} />
              {auction.type === "house" && (
                <span className="rounded-full bg-accent-gold/20 px-2 py-0.5 text-xs font-bold text-accent-gold">
                  HOUSE AUCTION
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{auction.title}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Listed by <span className="text-text-primary font-medium">{auction.sellerName}</span>
            </p>
          </div>

          {/* Price block */}
          <div className="rounded-xl border border-border bg-bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {auction.bidCount > 0 ? "Current bid" : "Starting price"}
              </span>
              <CountdownTimer endsAt={auction.endsAt} />
            </div>
            <p className="text-3xl font-bold text-accent-green">
              {formatCurrency(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
            </p>
            <p className="text-sm text-text-secondary">
              {auction.bidCount} bid{auction.bidCount !== 1 ? "s" : ""}
              {auction.reservePrice && auction.currentBid < auction.reservePrice && (
                <span className="ml-2 text-accent-red">Reserve not met</span>
              )}
            </p>
            {isHighestBidder && (
              <div className="rounded-lg bg-accent-green/10 border border-accent-green/30 px-3 py-2 text-sm text-accent-green font-medium">
                You are the highest bidder!
              </div>
            )}
          </div>

          {/* Bid form */}
          {!isOwnAuction && session && (
            <div className="rounded-xl border border-border bg-bg-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-text-primary">Place a Bid</h2>
              <PlaceBidForm auction={auction} onBidPlaced={handleBidPlaced} userBalance={balance} />
            </div>
          )}

          {isOwnAuction && (
            <div className="rounded-lg bg-accent-blue/10 border border-accent-blue/30 px-4 py-3 text-sm text-accent-blue">
              This is your listing
            </div>
          )}

          {/* Bid history */}
          <div className="rounded-xl border border-border bg-bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">
              Bid History ({bids.length})
            </h2>
            <BidHistory bids={bids} maxItems={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
