"use client";

import { useState } from "react";
import { Auction } from "@/types";
import { placeBid, getMinIncrement } from "@/lib/auction";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface PlaceBidFormProps {
  auction: Auction;
  onBidPlaced: () => void;
  userBalance: number;
}

export default function PlaceBidForm({ auction, onBidPlaced, userBalance }: PlaceBidFormProps) {
  const increment = getMinIncrement(auction.currentBid);
  const minBid = auction.currentBid > 0 ? auction.currentBid + increment : auction.startingPrice;
  const [amount, setAmount] = useState(minBid);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const quickBids = [
    { label: `+${formatCurrency(increment)}`, value: minBid },
    { label: `+${formatCurrency(increment * 2)}`, value: minBid + increment },
    { label: `+${formatCurrency(increment * 5)}`, value: minBid + increment * 4 },
    { label: `+${formatCurrency(increment * 10)}`, value: minBid + increment * 9 },
  ];

  function handleBid() {
    setError("");
    setSuccess("");

    const result = placeBid(auction.id, amount);
    if (result.success) {
      setSuccess("Bid placed!");
      setTimeout(() => setSuccess(""), 3000);
      onBidPlaced();
    } else {
      setError(result.error || "Failed to place bid");
    }
  }

  const isEnded = auction.status === "sold" || auction.status === "expired" || auction.status === "cancelled";

  if (isEnded) {
    return (
      <div className="rounded-lg bg-bg-elevated p-4 text-center text-sm text-text-secondary">
        This auction has ended
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">Min bid:</span>
        <span className="font-medium text-text-primary">{formatCurrency(minBid)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">Your balance:</span>
        <span className="font-medium text-text-primary">{formatCurrency(userBalance)}</span>
      </div>

      {/* Quick bid buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickBids.map((qb) => (
          <button
            key={qb.label}
            onClick={() => setAmount(qb.value)}
            className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors ${
              amount === qb.value
                ? "border-accent-blue bg-accent-blue/20 text-accent-blue"
                : "border-border bg-bg-elevated text-text-secondary hover:border-accent-blue/50"
            }`}
          >
            {qb.label}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
        <input
          type="number"
          value={(amount / 100).toFixed(2)}
          onChange={(e) => setAmount(Math.round(parseFloat(e.target.value || "0") * 100))}
          min={(minBid / 100).toFixed(2)}
          step="0.01"
          className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 pl-7 text-text-primary focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </div>

      {error && (
        <p className="text-sm text-accent-red">{error}</p>
      )}
      {success && (
        <p className="text-sm text-accent-green">{success}</p>
      )}

      <Button onClick={handleBid} className="w-full" disabled={amount < minBid || userBalance < amount}>
        Place Bid — {formatCurrency(amount)}
      </Button>
    </div>
  );
}
