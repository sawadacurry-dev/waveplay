"use client";

import { useState } from "react";
import type { SportCategory, Tournament } from "@/types/match";
import { SPORT_FILTERS } from "@/constants/sports";
import { TournamentCard } from "@/components/tournament/TournamentCard";
import { cn } from "@/lib/utils";

export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
  const [activeFilter, setActiveFilter] = useState<SportCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? tournaments
      : tournaments.filter((t) => t.sport === activeFilter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {SPORT_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeFilter === filter.value
                ? "bg-sky-500 text-slate-950"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">
          該当する大会がありません
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </div>
  );
}
