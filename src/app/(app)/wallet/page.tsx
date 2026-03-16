"use client";

import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";
import Button from "@/components/ui/Button";

const fundAmounts = [
  { label: "$10", cents: 1000 },
  { label: "$25", cents: 2500 },
  { label: "$50", cents: 5000 },
  { label: "$100", cents: 10000 },
];

const txTypeLabels: Record<TransactionType, string> = {
  deposit: "Deposit",
  bid_placed: "Bid Placed",
  bid_refund: "Bid Refund",
  auction_won: "Auction Won",
  auction_sold: "Auction Sold",
  pack_purchase: "Pack Purchase",
};

const txTypeColors: Record<TransactionType, string> = {
  deposit: "text-accent-green",
  bid_placed: "text-accent-red",
  bid_refund: "text-accent-green",
  auction_won: "text-accent-blue",
  auction_sold: "text-accent-green",
  pack_purchase: "text-accent-red",
};

type FilterType = "all" | TransactionType;

export default function WalletPage() {
  const { balance, transactions, addFunds } = useWallet();
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = filter === "all"
    ? transactions
    : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">Wallet</h1>

      {/* Balance */}
      <div className="rounded-xl border border-border bg-bg-card p-6 text-center">
        <p className="text-sm text-text-secondary">Available Balance</p>
        <p className="mt-1 text-4xl font-bold text-accent-green">{formatCurrency(balance)}</p>
      </div>

      {/* Add Funds */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Add Funds</h2>
        <div className="grid grid-cols-4 gap-3">
          {fundAmounts.map((f) => (
            <Button
              key={f.cents}
              variant="secondary"
              onClick={() => addFunds(f.cents)}
              className="w-full"
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary">Transaction History</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="rounded-lg border border-border bg-bg-elevated px-2 py-1 text-xs text-text-primary focus:border-accent-blue focus:outline-none"
          >
            <option value="all">All</option>
            <option value="deposit">Deposits</option>
            <option value="bid_placed">Bids</option>
            <option value="bid_refund">Refunds</option>
            <option value="auction_won">Won</option>
            <option value="auction_sold">Sold</option>
            <option value="pack_purchase">Packs</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-secondary">
            No transactions yet
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.slice(0, 50).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2"
              >
                <div>
                  <span className={`text-xs font-medium ${txTypeColors[tx.type]}`}>
                    {txTypeLabels[tx.type]}
                  </span>
                  <p className="text-sm text-text-primary">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                    {tx.amount >= 0 ? "+" : ""}{formatCurrency(Math.abs(tx.amount))}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
