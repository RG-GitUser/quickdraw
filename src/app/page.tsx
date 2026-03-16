"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";
import { initializeData } from "@/lib/data/init";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    initializeData();
    const session = getSession();
    router.replace(session?.isAuthenticated ? "/dashboard" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-gold border-t-transparent" />
    </div>
  );
}
