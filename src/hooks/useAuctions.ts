"use client";

import { useState, useEffect, useCallback } from "react";
import { Auction } from "@/types";
import { getAuctions, checkAndResolveExpired } from "@/lib/auction";

export function useAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  const refresh = useCallback(() => {
    checkAndResolveExpired();
    setAuctions(getAuctions());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  return { auctions, refresh };
}
