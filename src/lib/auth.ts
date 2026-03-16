import { AuthSession, User } from "@/types";
import { getItem, setItem, removeItem } from "./storage";
import { simpleHash, generateId } from "./utils";

export function getSession(): AuthSession | null {
  return getItem<AuthSession>("session");
}

export function getUsers(): User[] {
  return getItem<User[]>("users") || [];
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  const user = users.find((u) => u.id === session.userId) || null;
  if (user) migrateUser(user);
  return user;
}

// Backfill new fields for users created before the auction update
function migrateUser(user: User): void {
  let changed = false;
  const defaults: Partial<User> = {
    activeBidAuctionIds: [],
    listedAuctionIds: [],
    wonAuctionIds: [],
    avatarUrl: "",
    bio: "",
    totalSales: 0,
    totalPurchases: 0,
  };
  for (const [key, value] of Object.entries(defaults)) {
    if ((user as Record<string, unknown>)[key] === undefined) {
      (user as Record<string, unknown>)[key] = value;
      changed = true;
    }
  }
  if (changed) updateUser(user);
}

export function updateUser(updated: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx >= 0) {
    users[idx] = updated;
    setItem("users", users);
  }
}

export function register(
  username: string,
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();

  if (users.some((u) => u.email === email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }
  if (users.some((u) => u.username === username.toLowerCase())) {
    return { success: false, error: "Username already taken" };
  }

  const newUser: User = {
    id: generateId(),
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash: simpleHash(password),
    balance: 5000, // $50.00 starting balance
    collection: [],
    likedCardIds: [],
    dislikedCardIds: [],
    interestedGenres: [],
    createdAt: new Date().toISOString(),
    activeBidAuctionIds: [],
    listedAuctionIds: [],
    wonAuctionIds: [],
    avatarUrl: "",
    bio: "",
    totalSales: 0,
    totalPurchases: 0,
  };

  users.push(newUser);
  setItem("users", users);

  const session: AuthSession = {
    userId: newUser.id,
    username: newUser.username,
    email: newUser.email,
    isAuthenticated: true,
  };
  setItem("session", session);

  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email.toLowerCase());

  if (!user || user.passwordHash !== simpleHash(password)) {
    return { success: false, error: "Invalid email or password" };
  }

  const session: AuthSession = {
    userId: user.id,
    username: user.username,
    email: user.email,
    isAuthenticated: true,
  };
  setItem("session", session);

  return { success: true };
}

export function logout(): void {
  removeItem("session");
}
