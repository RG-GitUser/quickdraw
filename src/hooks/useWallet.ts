"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types";
import { getBalance, getTransactions, addFunds as addFundsLib } from "@/lib/wallet";
import { getSession } from "@/lib/auth";

export function useWallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refresh = useCallback(() => {
    setBalance(getBalance());
    const session = getSession();
    if (session) {
      setTransactions(getTransactions(session.userId));
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  const addFunds = useCallback(
    (amount: number) => {
      addFundsLib(amount);
      refresh();
    },
    [refresh]
  );

  return { balance, transactions, addFunds, refresh };
}
