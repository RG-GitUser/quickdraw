import { getItem, setItem } from "../storage";
import { mockCards } from "./cards";
import { mockPacks } from "./packs";
import { mockAuctions, mockBids } from "./auctions";

export function initializeData(): void {
  if (!getItem("cards")) {
    setItem("cards", mockCards);
  }
  if (!getItem("packs")) {
    setItem("packs", mockPacks);
  }
  if (!getItem("users")) {
    setItem("users", []);
  }
  if (!getItem("auctions")) {
    setItem("auctions", mockAuctions);
  }
  if (!getItem("bids")) {
    setItem("bids", mockBids);
  }
  if (!getItem("notifications")) {
    setItem("notifications", []);
  }
  if (!getItem("transactions")) {
    setItem("transactions", []);
  }
}
