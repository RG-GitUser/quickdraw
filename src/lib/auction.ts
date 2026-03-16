import { Auction, Bid, User } from "@/types";
import { getItem, setItem } from "./storage";
import { generateId } from "./utils";
import { getCurrentUser, getUsers, updateUser } from "./auth";
import { addTransaction } from "./wallet";
import { addNotification } from "./notifications";

// ─── Getters ───

export function getAuctions(): Auction[] {
  return getItem<Auction[]>("auctions") || [];
}

export function getAuction(id: string): Auction | null {
  return getAuctions().find((a) => a.id === id) || null;
}

export function getBids(auctionId: string): Bid[] {
  const all = getItem<Bid[]>("bids") || [];
  return all.filter((b) => b.auctionId === auctionId).sort((a, b) => b.amount - a.amount);
}

export function getAllBids(): Bid[] {
  return getItem<Bid[]>("bids") || [];
}

function saveAuctions(auctions: Auction[]): void {
  setItem("auctions", auctions);
}

function saveBids(bids: Bid[]): void {
  setItem("bids", bids);
}

// ─── Place Bid (escrow model) ───

export function placeBid(
  auctionId: string,
  amount: number
): { success: boolean; error?: string } {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Not logged in" };

  const auctions = getAuctions();
  const auction = auctions.find((a) => a.id === auctionId);
  if (!auction) return { success: false, error: "Auction not found" };

  if (auction.status !== "active" && auction.status !== "ending_soon") {
    return { success: false, error: "Auction is no longer active" };
  }

  if (new Date(auction.endsAt).getTime() <= Date.now()) {
    return { success: false, error: "Auction has ended" };
  }

  const minBid = auction.currentBid > 0
    ? auction.currentBid + getMinIncrement(auction.currentBid)
    : auction.startingPrice;

  if (amount < minBid) {
    return { success: false, error: `Minimum bid is $${(minBid / 100).toFixed(2)}` };
  }

  if (auction.highestBidderId === user.id) {
    return { success: false, error: "You are already the highest bidder" };
  }

  if (user.balance < amount) {
    return { success: false, error: "Insufficient balance" };
  }

  // Refund previous highest bidder (escrow release)
  if (auction.highestBidderId && auction.highestBidderId !== user.id) {
    refundBidder(auction.highestBidderId, auction.currentBid, auctionId);
  }

  // Deduct from current bidder (escrow hold)
  user.balance -= amount;
  if (!user.activeBidAuctionIds.includes(auctionId)) {
    user.activeBidAuctionIds.push(auctionId);
  }
  updateUser(user);

  addTransaction(user.id, "bid_placed", -amount, `Bid on: ${auction.title}`, auctionId);

  // Create bid record
  const allBids = getItem<Bid[]>("bids") || [];
  const bid: Bid = {
    id: generateId(),
    auctionId,
    bidderId: user.id,
    bidderName: user.username,
    amount,
    timestamp: new Date().toISOString(),
    isAutoBid: false,
  };
  allBids.unshift(bid);
  saveBids(allBids);

  // Update auction
  auction.currentBid = amount;
  auction.bidCount += 1;
  auction.highestBidderId = user.id;
  auction.highestBidderName = user.username;

  // Anti-sniping: extend by 2 min if bid within final 2 min
  if (auction.extendOnBid) {
    const timeLeft = new Date(auction.endsAt).getTime() - Date.now();
    if (timeLeft < 120000) {
      auction.endsAt = new Date(Date.now() + 120000).toISOString();
    }
  }

  saveAuctions(auctions);

  return { success: true };
}

// ─── Simulator bid (from fake bidders) ───

export function placeSimulatorBid(
  auctionId: string,
  bidderId: string,
  bidderName: string,
  amount: number
): void {
  const auctions = getAuctions();
  const auction = auctions.find((a) => a.id === auctionId);
  if (!auction) return;

  if (auction.status !== "active" && auction.status !== "ending_soon") return;
  if (new Date(auction.endsAt).getTime() <= Date.now()) return;

  const prevBidderId = auction.highestBidderId;
  const prevBid = auction.currentBid;

  // Refund previous real-user bidder
  if (prevBidderId && !prevBidderId.startsWith("bot-")) {
    refundBidder(prevBidderId, prevBid, auctionId);
    addNotification(
      prevBidderId,
      "outbid",
      auctionId,
      `You were outbid on "${auction.title}" by ${bidderName}!`
    );
  }

  // Create bid
  const allBids = getItem<Bid[]>("bids") || [];
  allBids.unshift({
    id: generateId(),
    auctionId,
    bidderId,
    bidderName,
    amount,
    timestamp: new Date().toISOString(),
    isAutoBid: true,
  });
  saveBids(allBids);

  // Update auction
  auction.currentBid = amount;
  auction.bidCount += 1;
  auction.highestBidderId = bidderId;
  auction.highestBidderName = bidderName;

  if (auction.extendOnBid) {
    const timeLeft = new Date(auction.endsAt).getTime() - Date.now();
    if (timeLeft < 120000) {
      auction.endsAt = new Date(Date.now() + 120000).toISOString();
    }
  }

  saveAuctions(auctions);
}

// ─── Create peer listing ───

export function createListing(
  cardId: string,
  title: string,
  startingPrice: number,
  durationMs: number,
  reservePrice: number | null
): { success: boolean; auctionId?: string; error?: string } {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Not logged in" };

  if (!user.collection.includes(cardId)) {
    return { success: false, error: "You don't own this card" };
  }

  const auction: Auction = {
    id: generateId(),
    cardId,
    type: "peer",
    sellerId: user.id,
    sellerName: user.username,
    title,
    startingPrice,
    reservePrice,
    currentBid: 0,
    bidCount: 0,
    highestBidderId: null,
    highestBidderName: null,
    status: "active",
    featured: false,
    createdAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + durationMs).toISOString(),
    extendOnBid: true,
  };

  const auctions = getAuctions();
  auctions.push(auction);
  saveAuctions(auctions);

  // Remove card from collection while listed
  user.collection = user.collection.filter((c) => c !== cardId);
  user.listedAuctionIds.push(auction.id);
  updateUser(user);

  return { success: true, auctionId: auction.id };
}

// ─── Cancel listing ───

export function cancelListing(auctionId: string): { success: boolean; error?: string } {
  const user = getCurrentUser();
  if (!user) return { success: false, error: "Not logged in" };

  const auctions = getAuctions();
  const auction = auctions.find((a) => a.id === auctionId);
  if (!auction) return { success: false, error: "Auction not found" };

  if (auction.sellerId !== user.id) {
    return { success: false, error: "Not your listing" };
  }

  if (auction.bidCount > 0) {
    return { success: false, error: "Cannot cancel an auction with bids" };
  }

  auction.status = "cancelled";
  saveAuctions(auctions);

  // Return card to collection
  user.collection.push(auction.cardId);
  user.listedAuctionIds = user.listedAuctionIds.filter((id) => id !== auctionId);
  updateUser(user);

  return { success: true };
}

// ─── Resolve expired auctions ───

export function checkAndResolveExpired(): void {
  const auctions = getAuctions();
  let changed = false;

  for (const auction of auctions) {
    if (auction.status !== "active" && auction.status !== "ending_soon") continue;

    const timeLeft = new Date(auction.endsAt).getTime() - Date.now();

    // Mark ending soon
    if (timeLeft > 0 && timeLeft < 3600000 && auction.status === "active") {
      auction.status = "ending_soon";
      changed = true;

      // Notify bidders of ending soon
      if (auction.highestBidderId && !auction.highestBidderId.startsWith("bot-")) {
        addNotification(
          auction.highestBidderId,
          "ending_soon",
          auction.id,
          `"${auction.title}" is ending soon!`
        );
      }
    }

    // Resolve expired
    if (timeLeft <= 0) {
      changed = true;
      resolveAuction(auction, auctions);
    }
  }

  if (changed) saveAuctions(auctions);
}

function resolveAuction(auction: Auction, auctions: Auction[]): void {
  const reserveMet = !auction.reservePrice || auction.currentBid >= auction.reservePrice;

  if (auction.bidCount > 0 && reserveMet) {
    auction.status = "sold";

    // Transfer card to winner if they're a real user
    if (auction.highestBidderId && !auction.highestBidderId.startsWith("bot-")) {
      const users = getUsers();
      const winner = users.find((u) => u.id === auction.highestBidderId);
      if (winner) {
        winner.collection.push(auction.cardId);
        winner.activeBidAuctionIds = winner.activeBidAuctionIds.filter((id) => id !== auction.id);
        winner.wonAuctionIds.push(auction.id);
        winner.totalPurchases += 1;
        updateUser(winner);

        addTransaction(winner.id, "auction_won", 0, `Won: ${auction.title}`, auction.id);
        addNotification(winner.id, "won", auction.id, `You won "${auction.title}"!`);
      }
    }

    // Pay seller (peer auctions)
    if (auction.sellerId) {
      const users = getUsers();
      const seller = users.find((u) => u.id === auction.sellerId);
      if (seller) {
        seller.balance += auction.currentBid;
        seller.listedAuctionIds = seller.listedAuctionIds.filter((id) => id !== auction.id);
        seller.totalSales += 1;
        updateUser(seller);

        addTransaction(seller.id, "auction_sold", auction.currentBid, `Sold: ${auction.title}`, auction.id);
        addNotification(seller.id, "sold", auction.id, `Your "${auction.title}" sold for $${(auction.currentBid / 100).toFixed(2)}!`);
      }
    }
  } else {
    auction.status = "expired";

    // Refund highest bidder if reserve not met
    if (auction.highestBidderId && !auction.highestBidderId.startsWith("bot-")) {
      refundBidder(auction.highestBidderId, auction.currentBid, auction.id);
      addNotification(
        auction.highestBidderId,
        "expired",
        auction.id,
        `"${auction.title}" expired${auction.reservePrice ? " (reserve not met)" : ""}`
      );
    }

    // Return card to seller (peer auctions)
    if (auction.sellerId) {
      const users = getUsers();
      const seller = users.find((u) => u.id === auction.sellerId);
      if (seller) {
        seller.collection.push(auction.cardId);
        seller.listedAuctionIds = seller.listedAuctionIds.filter((id) => id !== auction.id);
        updateUser(seller);
        addNotification(seller.id, "expired", auction.id, `Your "${auction.title}" expired without meeting the reserve`);
      }
    }
  }
}

// ─── Helpers ───

function refundBidder(userId: string, amount: number, auctionId: string): void {
  const users = getUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return;
  user.balance += amount;
  updateUser(user);
  addTransaction(userId, "bid_refund", amount, "Outbid - funds returned", auctionId);
}

export function getMinIncrement(currentBid: number): number {
  if (currentBid < 10000) return 100; // $1
  if (currentBid < 100000) return 500; // $5
  if (currentBid < 1000000) return 1000; // $10
  return 2500; // $25
}
