"use client";

import { useState, useEffect, useCallback } from "react";
import { Auction, Bid } from "@/types";
import { getAuction, getBids, checkAndResolveExpired } from "@/lib/auction";

export function useAuction(auctionId: string) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);

  const refresh = useCallback(() => {
    checkAndResolveExpired();
    setAuction(getAuction(auctionId));
    setBids(getBids(auctionId));
  }, [auctionId]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 1000);
    return () => clearInterval(id);
  }, [refresh]);

  return { auction, bids, refresh };
}
