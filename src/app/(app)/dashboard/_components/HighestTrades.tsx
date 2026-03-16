"use client";

import { Trade, Card } from "@/types";
import { formatCurrency, timeRemaining } from "@/lib/utils";

interface Props {
  trades: Trade[];
  cards: Card[];
}

export default function HighestTrades({ trades, cards }: Props) {
  const cardMap = new Map(cards.map((c) => [c.id, c]));
  const openTrades = trades
    .filter((t) => t.status === "open")
    .sort((a, b) => b.highestBid - a.highestBid)
    .slice(0, 8);

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">Highest Trades</h2>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-card text-left text-text-secondary">
              <th className="px-4 py-3 font-medium">Card</th>
              <th className="px-4 py-3 font-medium">Seller</th>
              <th className="px-4 py-3 font-medium text-right">Asking</th>
              <th className="px-4 py-3 font-medium text-right">Top Bid</th>
              <th className="px-4 py-3 font-medium text-center">Bids</th>
              <th className="px-4 py-3 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {openTrades.map((trade) => {
              const card = cardMap.get(trade.cardId);
              return (
                <tr key={trade.id} className="border-b border-border/50 hover:bg-bg-card/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {card?.name || "Unknown Card"}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{trade.sellerName}</td>
                  <td className="px-4 py-3 text-right text-text-primary">
                    {formatCurrency(trade.askingPrice)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-accent-gold">
                    {formatCurrency(trade.highestBid)}
                  </td>
                  <td className="px-4 py-3 text-center text-text-secondary">{trade.bidCount}</td>
                  <td className="px-4 py-3 text-right text-accent-green text-xs">
                    {timeRemaining(trade.expiresAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
