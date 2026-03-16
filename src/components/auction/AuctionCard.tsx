"use client";

import Link from "next/link";
import { Auction, Card } from "@/types";
import { formatCurrency } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";
import AuctionStatusBadge from "./AuctionStatusBadge";
import Image from "next/image";

interface AuctionCardProps {
  auction: Auction;
  card?: Card;
}

export default function AuctionCard({ auction, card }: AuctionCardProps) {
  const isEnded = auction.status === "sold" || auction.status === "expired" || auction.status === "cancelled";

  return (
    <Link href={`/auction/${auction.id}`} className="group block">
      <div className="rounded-xl border border-border bg-bg-card p-3 transition-all hover:border-accent-blue/50 hover:bg-bg-card-hover">
        {/* Thumbnail */}
        <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg bg-bg-elevated">
          {card ? (
            <Image
              src={card.imageUrl}
              alt={auction.title}
              fill
              unoptimized
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-secondary text-sm">
              No image
            </div>
          )}
          <div className="absolute left-2 top-2">
            <AuctionStatusBadge status={auction.status} />
          </div>
          {auction.type === "house" && (
            <div className="absolute right-2 top-2 rounded-full bg-accent-gold/20 px-2 py-0.5 text-xs font-bold text-accent-gold">
              HOUSE
            </div>
          )}
        </div>

        {/* Info */}
        <h3 className="mb-1 truncate text-sm font-semibold text-text-primary">
          {auction.title}
        </h3>
        <p className="mb-2 text-xs text-text-secondary">
          by {auction.sellerName}
        </p>

        {/* Price & Timer */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-text-secondary">
              {auction.bidCount > 0 ? "Current bid" : "Starting at"}
            </p>
            <p className="text-sm font-bold text-accent-green">
              {formatCurrency(auction.currentBid > 0 ? auction.currentBid : auction.startingPrice)}
            </p>
          </div>
          {!isEnded && <CountdownTimer endsAt={auction.endsAt} size="sm" />}
        </div>

        {/* Bid count */}
        <p className="mt-2 text-xs text-text-secondary">
          {auction.bidCount} bid{auction.bidCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}
