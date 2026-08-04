"use client";

import { useState } from "react";
import type { Match, SportCategory } from "@/types/match";
import { SPORT_FILTERS } from "@/constants/sports";
import { ScheduleRow } from "@/components/match/ScheduleRow";
import { cn } from "@/lib/utils";

export function ScheduleList({ matches }: { matches: Match[] }) {
  const [activeFilter, setActiveFilter] = useState<SportCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? matches
      : matches.filter((m) => m.sport === activeFilter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
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

      <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">
            該当する試合がありません
          </p>
        ) : (
          filtered.map((match) => <ScheduleRow key={match.id} match={match} />)
        )}
      </div>
    </div>
  );
}
