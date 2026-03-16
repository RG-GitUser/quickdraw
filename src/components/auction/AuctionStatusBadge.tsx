"use client";

import { AuctionStatus } from "@/types";

const statusStyles: Record<AuctionStatus, string> = {
  active: "bg-accent-green/20 text-accent-green",
  ending_soon: "bg-accent-red/20 text-accent-red",
  sold: "bg-accent-blue/20 text-accent-blue",
  expired: "bg-bg-card text-text-secondary",
  cancelled: "bg-bg-card text-text-secondary",
};

const statusLabels: Record<AuctionStatus, string> = {
  active: "Active",
  ending_soon: "Ending Soon",
  sold: "Sold",
  expired: "Expired",
  cancelled: "Cancelled",
};

export default function AuctionStatusBadge({ status }: { status: AuctionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
