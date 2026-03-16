"use client";

import Link from "next/link";
import { CardGenre } from "@/types";
import { GenreBadge } from "@/components/ui/Badge";

const allGenres: CardGenre[] = ["sports", "pokemon", "magic", "yugioh", "marvel", "vintage"];

export default function UserGenres({ interestedGenres }: { interestedGenres: CardGenre[] }) {
  const hasInterests = interestedGenres.length > 0;

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold">Your Genres</h2>
      <div className="rounded-xl border border-border bg-bg-card p-4">
        {hasInterests ? (
          <div className="flex flex-wrap gap-2">
            {allGenres.map((genre) => {
              const isInterested = interestedGenres.includes(genre);
              return (
                <div
                  key={genre}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-opacity ${
                    isInterested ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <GenreBadge genre={genre} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-text-muted mb-2">No genres discovered yet</p>
            <Link href="/swipe" className="text-sm text-accent-blue hover:underline">
              Swipe cards to discover genres you love!
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
