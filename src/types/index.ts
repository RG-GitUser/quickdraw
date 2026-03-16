export type CardRarity = "common" | "uncommon" | "rare" | "ultra-rare" | "legendary";
export type CardGenre = "sports" | "pokemon" | "magic" | "yugioh" | "marvel" | "vintage";
export type PSAGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null;

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  genre: CardGenre;
  rarity: CardRarity;
  year: number;
  psaGrade: PSAGrade;
  estimatedValue: number;
  artist: string;
  setName: string;
  trendScore: number;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  genre: CardGenre | "mixed";
  price: number;
  cardCount: number;
  guaranteedRarity: CardRarity;
  availableCardIds: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  balance: number;
  collection: string[];
  likedCardIds: string[];
  dislikedCardIds: string[];
  interestedGenres: CardGenre[];
  createdAt: string;
  activeBidAuctionIds: string[];
  listedAuctionIds: string[];
  wonAuctionIds: string[];
  avatarUrl: string;
  bio: string;
  totalSales: number;
  totalPurchases: number;
}

export type AuctionType = "house" | "peer";
export type AuctionStatus = "active" | "ending_soon" | "sold" | "expired" | "cancelled";

export interface Auction {
  id: string;
  cardId: string;
  type: AuctionType;
  sellerId: string | null;
  sellerName: string;
  title: string;
  startingPrice: number;
  reservePrice: number | null;
  currentBid: number;
  bidCount: number;
  highestBidderId: string | null;
  highestBidderName: string | null;
  status: AuctionStatus;
  featured: boolean;
  createdAt: string;
  endsAt: string;
  extendOnBid: boolean;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  isAutoBid: boolean;
}

export type NotificationType = "outbid" | "won" | "sold" | "expired" | "ending_soon";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  auctionId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type TransactionType =
  | "deposit"
  | "bid_placed"
  | "bid_refund"
  | "auction_won"
  | "auction_sold"
  | "pack_purchase";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
  relatedAuctionId?: string;
}

export interface UserSettings {
  theme: "dark" | "midnight" | "amoled";
  notifyOutbid: boolean;
  notifyWon: boolean;
  notifySold: boolean;
  notifyEndingSoon: boolean;
}

export interface AuthSession {
  userId: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

// Keep for backward compat but unused
export interface Trade {
  id: string;
  cardId: string;
  sellerName: string;
  askingPrice: number;
  highestBid: number;
  bidCount: number;
  status: "open" | "completed" | "expired";
  createdAt: string;
  expiresAt: string;
}
