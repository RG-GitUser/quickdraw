"use client";

import { useState, useEffect } from "react";
import { UserSettings } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { getItem, setItem, removeItem } from "@/lib/storage";
import { updateUser } from "@/lib/auth";
import Button from "@/components/ui/Button";

const defaultSettings: UserSettings = {
  theme: "dark",
  notifyOutbid: true,
  notifyWon: true,
  notifySold: true,
  notifyEndingSoon: true,
};

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = getItem<UserSettings>("settings") || defaultSettings;
    setSettings(s);
    if (user) {
      setUsername(user.username);
      setBio(user.bio || "");
    }
  }, [user]);

  function saveSettings(updated: UserSettings) {
    setSettings(updated);
    setItem("settings", updated);
  }

  function saveProfile() {
    if (!user) return;
    user.username = username;
    user.bio = bio;
    updateUser(user);
    refresh();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearCollection() {
    if (!user) return;
    if (!confirm("Are you sure? This will remove all cards from your collection.")) return;
    user.collection = [];
    user.likedCardIds = [];
    user.dislikedCardIds = [];
    updateUser(user);
    refresh();
  }

  function handleResetAccount() {
    if (!user) return;
    if (!confirm("Are you sure? This will reset your entire account including balance and history.")) return;
    user.balance = 5000;
    user.collection = [];
    user.likedCardIds = [];
    user.dislikedCardIds = [];
    user.activeBidAuctionIds = [];
    user.listedAuctionIds = [];
    user.wonAuctionIds = [];
    user.totalSales = 0;
    user.totalPurchases = 0;
    user.bio = "";
    updateUser(user);
    removeItem("transactions");
    removeItem("notifications");
    refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      {/* Account */}
      <section className="rounded-xl border border-border bg-bg-card p-4 space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Account</h2>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-text-secondary">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-accent-blue focus:outline-none resize-none"
            placeholder="Tell others about yourself..."
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={saveProfile} size="sm">Save Profile</Button>
          {saved && <span className="text-sm text-accent-green">Saved!</span>}
        </div>
        {user && (
          <p className="text-xs text-text-secondary">Email: {user.email}</p>
        )}
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-bg-card p-4 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Notifications</h2>
        {[
          { key: "notifyOutbid" as const, label: "Outbid alerts" },
          { key: "notifyWon" as const, label: "Won auction alerts" },
          { key: "notifySold" as const, label: "Sold auction alerts" },
          { key: "notifyEndingSoon" as const, label: "Ending soon alerts" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-text-primary">{item.label}</span>
            <button
              onClick={() =>
                saveSettings({ ...settings, [item.key]: !settings[item.key] })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                settings[item.key] ? "bg-accent-blue" : "bg-bg-elevated border border-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  settings[item.key] ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </section>

      {/* Display */}
      <section className="rounded-xl border border-border bg-bg-card p-4 space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Display</h2>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">Theme</label>
          <div className="flex gap-2">
            {(["dark", "midnight", "amoled"] as const).map((t) => (
              <button
                key={t}
                onClick={() => saveSettings({ ...settings, theme: t })}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  settings.theme === t
                    ? "bg-accent-blue text-white"
                    : "bg-bg-elevated text-text-secondary hover:text-text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border border-accent-red/30 bg-accent-red/5 p-4 space-y-3">
        <h2 className="text-lg font-semibold text-accent-red">Danger Zone</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={handleClearCollection}>
            Clear Collection
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetAccount}>
            Reset Account
          </Button>
        </div>
      </section>
    </div>
  );
}
