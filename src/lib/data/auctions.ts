import { Auction, Bid } from "@/types";

const now = Date.now();
const min = 60000;
const hour = 3600000;
const day = 86400000;

export const mockAuctions: Auction[] = [
  // ===== HOUSE AUCTIONS (featured) =====
  { id: "auc-h01", cardId: "pk-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Charizard 1st Edition Base Set", startingPrice: 1000000, reservePrice: null, currentBid: 3800000, bidCount: 34, highestBidderId: "bot-1", highestBidderName: "CardShark99", status: "active", featured: true, createdAt: new Date(now - 5 * day).toISOString(), endsAt: new Date(now + 2 * day + 4 * hour).toISOString(), extendOnBid: true },
  { id: "auc-h02", cardId: "mg-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Black Lotus Alpha PSA 9", startingPrice: 2000000, reservePrice: null, currentBid: 5100000, bidCount: 28, highestBidderId: "bot-2", highestBidderName: "GrailChaser", status: "active", featured: true, createdAt: new Date(now - 3 * day).toISOString(), endsAt: new Date(now + 1 * day + 6 * hour).toISOString(), extendOnBid: true },
  { id: "auc-h03", cardId: "vt-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "1952 Topps Mickey Mantle #311", startingPrice: 5000000, reservePrice: null, currentBid: 11500000, bidCount: 52, highestBidderId: "bot-3", highestBidderName: "VaultKeeper", status: "active", featured: true, createdAt: new Date(now - 7 * day).toISOString(), endsAt: new Date(now + 45 * min).toISOString(), extendOnBid: true },
  { id: "auc-h04", cardId: "sp-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Michael Jordan 1986 Fleer Rookie PSA 10", startingPrice: 1500000, reservePrice: null, currentBid: 4600000, bidCount: 38, highestBidderId: "bot-4", highestBidderName: "HoloHunter", status: "active", featured: true, createdAt: new Date(now - 4 * day).toISOString(), endsAt: new Date(now + 3 * hour + 20 * min).toISOString(), extendOnBid: true },
  { id: "auc-h05", cardId: "pk-002", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Pikachu Illustrator Promo PSA 9", startingPrice: 3000000, reservePrice: null, currentBid: 5800000, bidCount: 41, highestBidderId: "bot-5", highestBidderName: "MintCondition", status: "active", featured: false, createdAt: new Date(now - 6 * day).toISOString(), endsAt: new Date(now + 5 * day).toISOString(), extendOnBid: true },
  { id: "auc-h06", cardId: "yg-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Blue-Eyes White Dragon LOB 1st Ed PSA 10", startingPrice: 200000, reservePrice: null, currentBid: 460000, bidCount: 19, highestBidderId: "bot-6", highestBidderName: "SlabKing", status: "active", featured: false, createdAt: new Date(now - 2 * day).toISOString(), endsAt: new Date(now + 8 * hour).toISOString(), extendOnBid: true },
  { id: "auc-h07", cardId: "vt-002", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "T206 Honus Wagner - The Holy Grail", startingPrice: 4000000, reservePrice: null, currentBid: 7000000, bidCount: 45, highestBidderId: "bot-1", highestBidderName: "CardShark99", status: "active", featured: false, createdAt: new Date(now - 8 * day).toISOString(), endsAt: new Date(now + 15 * min).toISOString(), extendOnBid: true },
  { id: "auc-h08", cardId: "mv-001", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Spider-Man #1 Chrome PSA 10", startingPrice: 30000, reservePrice: null, currentBid: 78000, bidCount: 14, highestBidderId: "bot-7", highestBidderName: "PackRipper88", status: "active", featured: false, createdAt: new Date(now - 1 * day).toISOString(), endsAt: new Date(now + 4 * day).toISOString(), extendOnBid: false },

  // ===== MORE ENDING SOON (house) =====
  { id: "auc-h09", cardId: "pk-003", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Blastoise Base Set Holo PSA 8", startingPrice: 20000, reservePrice: null, currentBid: 42000, bidCount: 12, highestBidderId: "bot-7", highestBidderName: "PackRipper88", status: "active", featured: false, createdAt: new Date(now - 3 * day).toISOString(), endsAt: new Date(now + 1 * hour + 50 * min).toISOString(), extendOnBid: true },
  { id: "auc-h10", cardId: "yg-003", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Exodia the Forbidden One LOB 1st Ed PSA 8", startingPrice: 200000, reservePrice: null, currentBid: 340000, bidCount: 22, highestBidderId: "bot-2", highestBidderName: "GrailChaser", status: "active", featured: false, createdAt: new Date(now - 5 * day).toISOString(), endsAt: new Date(now + 2 * hour + 15 * min).toISOString(), extendOnBid: true },
  { id: "auc-h11", cardId: "mg-002", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Ancestral Recall Alpha PSA 8", startingPrice: 400000, reservePrice: null, currentBid: 720000, bidCount: 31, highestBidderId: "bot-5", highestBidderName: "MintCondition", status: "active", featured: false, createdAt: new Date(now - 6 * day).toISOString(), endsAt: new Date(now + 4 * hour + 30 * min).toISOString(), extendOnBid: true },
  { id: "auc-h12", cardId: "sp-006", type: "house", sellerId: null, sellerName: "QuickDraw House", title: "Wayne Gretzky 1979 OPC Rookie PSA 7", startingPrice: 400000, reservePrice: null, currentBid: 680000, bidCount: 18, highestBidderId: "bot-8", highestBidderName: "WaxBreaker", status: "active", featured: false, createdAt: new Date(now - 4 * day).toISOString(), endsAt: new Date(now + 5 * hour + 10 * min).toISOString(), extendOnBid: true },

  // ===== PEER AUCTIONS =====
  { id: "auc-p01", cardId: "sp-007", type: "peer", sellerId: "peer-1", sellerName: "MavsFan77", title: "Luka Doncic 2018 Prizm Silver PSA 10", startingPrice: 50000, reservePrice: 65000, currentBid: 68000, bidCount: 8, highestBidderId: "bot-3", highestBidderName: "VaultKeeper", status: "active", featured: false, createdAt: new Date(now - 1 * day).toISOString(), endsAt: new Date(now + 1 * day + 2 * hour).toISOString(), extendOnBid: true },
  { id: "auc-p02", cardId: "pk-005", type: "peer", sellerId: "peer-2", sellerName: "PokeMaster42", title: "Mewtwo GX Rainbow Secret Rare PSA 10", startingPrice: 8000, reservePrice: null, currentBid: 13500, bidCount: 6, highestBidderId: "bot-8", highestBidderName: "WaxBreaker", status: "active", featured: false, createdAt: new Date(now - 12 * hour).toISOString(), endsAt: new Date(now + 5 * hour).toISOString(), extendOnBid: false },
  { id: "auc-p03", cardId: "mg-007", type: "peer", sellerId: "peer-3", sellerName: "PlaneswalkerX", title: "Liliana of the Veil Innistrad PSA 9", startingPrice: 6000, reservePrice: 10000, currentBid: 11000, bidCount: 5, highestBidderId: "bot-2", highestBidderName: "GrailChaser", status: "active", featured: false, createdAt: new Date(now - 6 * hour).toISOString(), endsAt: new Date(now + 18 * hour).toISOString(), extendOnBid: true },
  { id: "auc-p04", cardId: "yg-002", type: "peer", sellerId: "peer-4", sellerName: "DuelKing", title: "Dark Magician LOB 1st Edition PSA 9", startingPrice: 50000, reservePrice: 80000, currentBid: 92000, bidCount: 11, highestBidderId: "bot-5", highestBidderName: "MintCondition", status: "active", featured: false, createdAt: new Date(now - 2 * day).toISOString(), endsAt: new Date(now + 30 * min).toISOString(), extendOnBid: true },
  { id: "auc-p05", cardId: "sp-004", type: "peer", sellerId: "peer-5", sellerName: "GridironGuru", title: "Tom Brady 2000 Contenders Auto PSA 8", startingPrice: 150000, reservePrice: null, currentBid: 320000, bidCount: 16, highestBidderId: "bot-4", highestBidderName: "HoloHunter", status: "active", featured: false, createdAt: new Date(now - 3 * day).toISOString(), endsAt: new Date(now + 12 * hour).toISOString(), extendOnBid: true },
  { id: "auc-p06", cardId: "pk-008", type: "peer", sellerId: "peer-6", sellerName: "GhostPulls", title: "Gengar VMAX Alt Art Fusion Strike PSA 9", startingPrice: 10000, reservePrice: null, currentBid: 18500, bidCount: 7, highestBidderId: "bot-6", highestBidderName: "SlabKing", status: "active", featured: false, createdAt: new Date(now - 8 * hour).toISOString(), endsAt: new Date(now + 2 * day).toISOString(), extendOnBid: false },
];

export const mockBids: Bid[] = [
  // House auction bids (auc-h01 - Charizard)
  { id: "bid-001", auctionId: "auc-h01", bidderId: "bot-7", bidderName: "PackRipper88", amount: 1200000, timestamp: new Date(now - 4.5 * day).toISOString(), isAutoBid: true },
  { id: "bid-002", auctionId: "auc-h01", bidderId: "bot-2", bidderName: "GrailChaser", amount: 1800000, timestamp: new Date(now - 4 * day).toISOString(), isAutoBid: true },
  { id: "bid-003", auctionId: "auc-h01", bidderId: "bot-5", bidderName: "MintCondition", amount: 2500000, timestamp: new Date(now - 3 * day).toISOString(), isAutoBid: true },
  { id: "bid-004", auctionId: "auc-h01", bidderId: "bot-1", bidderName: "CardShark99", amount: 3200000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-005", auctionId: "auc-h01", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 3500000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-006", auctionId: "auc-h01", bidderId: "bot-1", bidderName: "CardShark99", amount: 3800000, timestamp: new Date(now - 6 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h03 - Mickey Mantle, ending soon)
  { id: "bid-010", auctionId: "auc-h03", bidderId: "bot-4", bidderName: "HoloHunter", amount: 6000000, timestamp: new Date(now - 6 * day).toISOString(), isAutoBid: true },
  { id: "bid-011", auctionId: "auc-h03", bidderId: "bot-1", bidderName: "CardShark99", amount: 7500000, timestamp: new Date(now - 5 * day).toISOString(), isAutoBid: true },
  { id: "bid-012", auctionId: "auc-h03", bidderId: "bot-8", bidderName: "WaxBreaker", amount: 9000000, timestamp: new Date(now - 3 * day).toISOString(), isAutoBid: true },
  { id: "bid-013", auctionId: "auc-h03", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 10500000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-014", auctionId: "auc-h03", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 11500000, timestamp: new Date(now - 2 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h04 - Jordan)
  { id: "bid-020", auctionId: "auc-h04", bidderId: "bot-6", bidderName: "SlabKing", amount: 2000000, timestamp: new Date(now - 3 * day).toISOString(), isAutoBid: true },
  { id: "bid-021", auctionId: "auc-h04", bidderId: "bot-2", bidderName: "GrailChaser", amount: 3000000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-022", auctionId: "auc-h04", bidderId: "bot-4", bidderName: "HoloHunter", amount: 4000000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-023", auctionId: "auc-h04", bidderId: "bot-4", bidderName: "HoloHunter", amount: 4600000, timestamp: new Date(now - 4 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h09 - Blastoise)
  { id: "bid-060", auctionId: "auc-h09", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 25000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-061", auctionId: "auc-h09", bidderId: "bot-7", bidderName: "PackRipper88", amount: 35000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-062", auctionId: "auc-h09", bidderId: "bot-7", bidderName: "PackRipper88", amount: 42000, timestamp: new Date(now - 5 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h10 - Exodia)
  { id: "bid-063", auctionId: "auc-h10", bidderId: "bot-6", bidderName: "SlabKing", amount: 250000, timestamp: new Date(now - 4 * day).toISOString(), isAutoBid: true },
  { id: "bid-064", auctionId: "auc-h10", bidderId: "bot-1", bidderName: "CardShark99", amount: 300000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-065", auctionId: "auc-h10", bidderId: "bot-2", bidderName: "GrailChaser", amount: 340000, timestamp: new Date(now - 8 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h11 - Ancestral Recall)
  { id: "bid-066", auctionId: "auc-h11", bidderId: "bot-4", bidderName: "HoloHunter", amount: 500000, timestamp: new Date(now - 5 * day).toISOString(), isAutoBid: true },
  { id: "bid-067", auctionId: "auc-h11", bidderId: "bot-8", bidderName: "WaxBreaker", amount: 620000, timestamp: new Date(now - 3 * day).toISOString(), isAutoBid: true },
  { id: "bid-068", auctionId: "auc-h11", bidderId: "bot-5", bidderName: "MintCondition", amount: 720000, timestamp: new Date(now - 12 * hour).toISOString(), isAutoBid: true },

  // House auction bids (auc-h12 - Gretzky)
  { id: "bid-069", auctionId: "auc-h12", bidderId: "bot-1", bidderName: "CardShark99", amount: 500000, timestamp: new Date(now - 3 * day).toISOString(), isAutoBid: true },
  { id: "bid-070", auctionId: "auc-h12", bidderId: "bot-8", bidderName: "WaxBreaker", amount: 620000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-071", auctionId: "auc-h12", bidderId: "bot-8", bidderName: "WaxBreaker", amount: 680000, timestamp: new Date(now - 6 * hour).toISOString(), isAutoBid: true },

  // Peer auction bids (auc-p01 - Luka)
  { id: "bid-030", auctionId: "auc-p01", bidderId: "bot-8", bidderName: "WaxBreaker", amount: 55000, timestamp: new Date(now - 20 * hour).toISOString(), isAutoBid: true },
  { id: "bid-031", auctionId: "auc-p01", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 62000, timestamp: new Date(now - 12 * hour).toISOString(), isAutoBid: true },
  { id: "bid-032", auctionId: "auc-p01", bidderId: "bot-3", bidderName: "VaultKeeper", amount: 68000, timestamp: new Date(now - 3 * hour).toISOString(), isAutoBid: true },

  // Peer auction bids (auc-p04 - Dark Magician, ending soon)
  { id: "bid-040", auctionId: "auc-p04", bidderId: "bot-7", bidderName: "PackRipper88", amount: 60000, timestamp: new Date(now - 1.5 * day).toISOString(), isAutoBid: true },
  { id: "bid-041", auctionId: "auc-p04", bidderId: "bot-1", bidderName: "CardShark99", amount: 75000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-042", auctionId: "auc-p04", bidderId: "bot-5", bidderName: "MintCondition", amount: 85000, timestamp: new Date(now - 8 * hour).toISOString(), isAutoBid: true },
  { id: "bid-043", auctionId: "auc-p04", bidderId: "bot-5", bidderName: "MintCondition", amount: 92000, timestamp: new Date(now - 1 * hour).toISOString(), isAutoBid: true },

  // Peer auction bids (auc-p05 - Brady)
  { id: "bid-050", auctionId: "auc-p05", bidderId: "bot-2", bidderName: "GrailChaser", amount: 180000, timestamp: new Date(now - 2 * day).toISOString(), isAutoBid: true },
  { id: "bid-051", auctionId: "auc-p05", bidderId: "bot-6", bidderName: "SlabKing", amount: 250000, timestamp: new Date(now - 1 * day).toISOString(), isAutoBid: true },
  { id: "bid-052", auctionId: "auc-p05", bidderId: "bot-4", bidderName: "HoloHunter", amount: 290000, timestamp: new Date(now - 6 * hour).toISOString(), isAutoBid: true },
  { id: "bid-053", auctionId: "auc-p05", bidderId: "bot-4", bidderName: "HoloHunter", amount: 320000, timestamp: new Date(now - 1 * hour).toISOString(), isAutoBid: true },
];
