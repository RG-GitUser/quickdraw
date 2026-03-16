import { Trade } from "@/types";

const now = Date.now();
const hour = 3600000;
const day = 86400000;

export const mockTrades: Trade[] = [
  { id: "tr-001", cardId: "pk-001", sellerName: "ChampCollector", askingPrice: 4200000, highestBid: 4100000, bidCount: 47, status: "open", createdAt: new Date(now - 3 * day).toISOString(), expiresAt: new Date(now + 2 * day).toISOString() },
  { id: "tr-002", cardId: "mg-001", sellerName: "MTGVault99", askingPrice: 5500000, highestBid: 5200000, bidCount: 32, status: "open", createdAt: new Date(now - 5 * day).toISOString(), expiresAt: new Date(now + 1 * day).toISOString() },
  { id: "tr-003", cardId: "vt-001", sellerName: "VintageKing", askingPrice: 12600000, highestBid: 11000000, bidCount: 58, status: "open", createdAt: new Date(now - 7 * day).toISOString(), expiresAt: new Date(now + 5 * day).toISOString() },
  { id: "tr-004", cardId: "sp-001", sellerName: "HoopsLegend", askingPrice: 5000000, highestBid: 4800000, bidCount: 41, status: "open", createdAt: new Date(now - 2 * day).toISOString(), expiresAt: new Date(now + 3 * day).toISOString() },
  { id: "tr-005", cardId: "yg-001", sellerName: "DuelMaster", askingPrice: 500000, highestBid: 480000, bidCount: 23, status: "open", createdAt: new Date(now - 1 * day).toISOString(), expiresAt: new Date(now + 4 * day).toISOString() },
  { id: "tr-006", cardId: "sp-002", sellerName: "KingJames23", askingPrice: 1500000, highestBid: 1450000, bidCount: 36, status: "open", createdAt: new Date(now - 4 * day).toISOString(), expiresAt: new Date(now + 1 * day).toISOString() },
  { id: "tr-007", cardId: "pk-006", sellerName: "EeveeTrainer", askingPrice: 35000, highestBid: 33000, bidCount: 18, status: "open", createdAt: new Date(now - 6 * hour).toISOString(), expiresAt: new Date(now + 2 * day).toISOString() },
  { id: "tr-008", cardId: "mv-002", sellerName: "MarvelFan42", askingPrice: 120000, highestBid: 115000, bidCount: 12, status: "open", createdAt: new Date(now - 12 * hour).toISOString(), expiresAt: new Date(now + 3 * day).toISOString() },
  { id: "tr-009", cardId: "mg-004", sellerName: "PlaneswalkerX", askingPrice: 15000, highestBid: 14000, bidCount: 8, status: "open", createdAt: new Date(now - 3 * hour).toISOString(), expiresAt: new Date(now + 6 * day).toISOString() },
  { id: "tr-010", cardId: "sp-003", sellerName: "KidGriffey", askingPrice: 250000, highestBid: 230000, bidCount: 15, status: "completed", createdAt: new Date(now - 10 * day).toISOString(), expiresAt: new Date(now - 3 * day).toISOString() },
  { id: "tr-011", cardId: "vt-002", sellerName: "OldSchoolCards", askingPrice: 7250000, highestBid: 7000000, bidCount: 62, status: "open", createdAt: new Date(now - 8 * day).toISOString(), expiresAt: new Date(now + 7 * day).toISOString() },
  { id: "tr-012", cardId: "pk-008", sellerName: "GhostPulls", askingPrice: 20000, highestBid: 19500, bidCount: 9, status: "open", createdAt: new Date(now - 1 * day).toISOString(), expiresAt: new Date(now + 5 * day).toISOString() },
  { id: "tr-013", cardId: "sp-007", sellerName: "MavsFan77", askingPrice: 75000, highestBid: 72000, bidCount: 14, status: "open", createdAt: new Date(now - 2 * day).toISOString(), expiresAt: new Date(now + 4 * day).toISOString() },
  { id: "tr-014", cardId: "yg-003", sellerName: "ExodiaCollector", askingPrice: 350000, highestBid: 340000, bidCount: 28, status: "open", createdAt: new Date(now - 4 * day).toISOString(), expiresAt: new Date(now + 2 * day).toISOString() },
  { id: "tr-015", cardId: "mg-002", sellerName: "PowerNine", askingPrice: 750000, highestBid: 720000, bidCount: 20, status: "open", createdAt: new Date(now - 6 * day).toISOString(), expiresAt: new Date(now + 1 * day).toISOString() },
];
