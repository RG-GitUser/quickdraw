import { getAuctions, placeSimulatorBid, getMinIncrement } from "./auction";

const FAKE_BIDDERS = [
  { id: "bot-1", name: "CardShark99" },
  { id: "bot-2", name: "GrailChaser" },
  { id: "bot-3", name: "VaultKeeper" },
  { id: "bot-4", name: "HoloHunter" },
  { id: "bot-5", name: "MintCondition" },
  { id: "bot-6", name: "SlabKing" },
  { id: "bot-7", name: "PackRipper88" },
  { id: "bot-8", name: "WaxBreaker" },
];

let simulatorInterval: ReturnType<typeof setInterval> | null = null;

export function startSimulator(): void {
  if (simulatorInterval) return;

  simulatorInterval = setInterval(() => {
    const auctions = getAuctions();
    const active = auctions.filter(
      (a) =>
        (a.status === "active" || a.status === "ending_soon") &&
        new Date(a.endsAt).getTime() > Date.now()
    );

    if (active.length === 0) return;

    // ~30% chance a bot bids each tick
    if (Math.random() > 0.3) return;

    const auction = active[Math.floor(Math.random() * active.length)];

    // Pick a bot that isn't already the highest bidder
    const eligible = FAKE_BIDDERS.filter((b) => b.id !== auction.highestBidderId);
    if (eligible.length === 0) return;

    const bot = eligible[Math.floor(Math.random() * eligible.length)];
    const increment = getMinIncrement(auction.currentBid);
    const multiplier = 1 + Math.floor(Math.random() * 3); // 1x-3x increment
    const bidAmount = auction.currentBid > 0
      ? auction.currentBid + increment * multiplier
      : auction.startingPrice;

    placeSimulatorBid(auction.id, bot.id, bot.name, bidAmount);
  }, 10000); // every 10 seconds
}

export function stopSimulator(): void {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
  }
}
