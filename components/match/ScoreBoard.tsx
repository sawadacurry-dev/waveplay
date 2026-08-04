import type { Competitor, Score } from "@/types/match";
import { cn } from "@/lib/utils";

interface ScoreBoardProps {
  home: Competitor;
  away: Competitor;
  score?: Score;
  size?: "lg" | "md";
}

export function ScoreBoard({ home, away, score, size = "lg" }: ScoreBoardProps) {
  const scoreTextSize = size === "lg" ? "text-6xl" : "text-3xl";

  return (
    <div className="flex items-end gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold text-slate-100 sm:text-2xl">
          {home.name}
        </span>
        {score && (
          <span className={cn("font-black tabular-nums text-sky-400", scoreTextSize)}>
            {score.home}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1 pb-2 text-slate-500">
        <span className="text-xs font-semibold uppercase tracking-widest">vs</span>
        {score?.periodLabel && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
            {score.periodLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-lg font-bold text-slate-100 sm:text-2xl">
          {away.name}
        </span>
        {score && (
          <span className={cn("font-black tabular-nums text-slate-400", scoreTextSize)}>
            {score.away}
          </span>
        )}
      </div>
    </div>
  );
}
