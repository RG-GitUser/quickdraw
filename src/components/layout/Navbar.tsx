"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import NotificationBell from "@/components/auction/NotificationBell";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/packs", label: "Packs" },
  { href: "/sell", label: "Sell" },
  { href: "/bids", label: "My Bids" },
  { href: "/collection", label: "Collection" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-gold">
            <span className="text-lg font-black text-bg-primary">Q</span>
          </div>
          <span className="text-lg font-bold text-text-primary">
            Quick<span className="text-accent-gold">Draw</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-bg-card text-accent-gold"
                  : "text-text-secondary hover:bg-bg-card hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User section */}
        <div className="hidden items-center gap-2 md:flex">
          {user && (
            <>
              <NotificationBell />
              <Link
                href="/wallet"
                className="rounded-full bg-accent-gold/10 px-3 py-1 text-sm font-semibold text-accent-gold hover:bg-accent-gold/20 transition-colors"
              >
                {formatCurrency(user.balance)}
              </Link>
              <Link
                href="/profile"
                className="rounded-lg px-2 py-1.5 text-sm text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
              >
                {user.username}
              </Link>
              <Link
                href="/settings"
                className="rounded-lg p-2 text-text-secondary hover:bg-bg-card hover:text-text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
              <button
                onClick={logout}
                className="rounded-lg px-3 py-1.5 text-sm text-text-muted hover:bg-bg-card hover:text-text-primary transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1 md:hidden"
        >
          <span className={`block h-0.5 w-5 bg-text-primary transition-transform ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-text-primary transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-text-primary transition-transform ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-bg-primary p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-bg-card text-accent-gold"
                    : "text-text-secondary hover:bg-bg-card"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/wallet" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card">
              Wallet
            </Link>
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card">
              Profile
            </Link>
            <Link href="/settings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-card">
              Settings
            </Link>
            {user && (
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">{user.username}</span>
                  <span className="text-sm font-semibold text-accent-gold">{formatCurrency(user.balance)}</span>
                </div>
                <button onClick={logout} className="text-sm text-text-muted hover:text-text-primary">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
