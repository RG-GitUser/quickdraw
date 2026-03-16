"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { initializeData } from "@/lib/data/init";
import { startSimulator, stopSimulator } from "@/lib/auction-simulator";
import { checkAndResolveExpired } from "@/lib/auction";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeData();
    const session = getSession();
    if (!session?.isAuthenticated) {
      router.replace("/login");
    } else {
      setReady(true);
      // Start auction simulator and expired-check interval
      startSimulator();
      const expiredCheck = setInterval(checkAndResolveExpired, 5000);
      return () => {
        stopSimulator();
        clearInterval(expiredCheck);
      };
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
