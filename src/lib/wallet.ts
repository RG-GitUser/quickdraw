import { Transaction, TransactionType } from "@/types";
import { getItem, setItem } from "./storage";
import { generateId } from "./utils";
import { getCurrentUser, updateUser } from "./auth";

export function getTransactions(userId?: string): Transaction[] {
  const all = getItem<Transaction[]>("transactions") || [];
  if (!userId) return all;
  return all.filter((t) => t.userId === userId);
}

export function addTransaction(
  userId: string,
  type: TransactionType,
  amount: number,
  description: string,
  relatedAuctionId?: string
): Transaction {
  const tx: Transaction = {
    id: generateId(),
    userId,
    type,
    amount,
    description,
    timestamp: new Date().toISOString(),
    relatedAuctionId,
  };
  const all = getItem<Transaction[]>("transactions") || [];
  all.unshift(tx);
  setItem("transactions", all);
  return tx;
}

export function addFunds(amount: number): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  user.balance += amount;
  updateUser(user);
  addTransaction(user.id, "deposit", amount, `Added ${(amount / 100).toFixed(2)} to wallet`);
  return true;
}

export function getBalance(): number {
  const user = getCurrentUser();
  return user?.balance ?? 0;
}
