import Link from "next/link";
import { Play, Video } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SportBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NotifyButton } from "@/components/match/NotifyButton";
import { cn, formatTimeJST } from "@/lib/utils";

export function ScheduleRow({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isArchived = match.status === "archived";

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-white/5 px-2 py-4 last:border-0 sm:px-0">
      <div className="flex w-16 items-center gap-2">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            isLive ? "bg-red-500" : isArchived ? "bg-slate-600" : "bg-sky-500"
          )}
        />
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            isLive ? "text-red-400" : "text-slate-300"
          )}
        >
          {formatTimeJST(match.startTime)}
        </span>
      </div>

      <SportBadge
        label={SPORT_LABELS[match.sport]}
        className={cn(SPORT_BADGE_STYLES[match.sport], "hidden sm:inline-flex")}
      />

      <span className="min-w-0 flex-1 truncate text-sm text-slate-100">
        {match.home.name} <span className="text-slate-500">vs</span> {match.away.name}
      </span>

      <span className="hidden text-xs text-slate-500 md:inline">
        {match.venue.prefecture}・{match.venue.name}
      </span>

      <div className="ml-auto">
        {isArchived && (
          <Button variant="ghost" icon={<Video className="h-4 w-4" />} disabled>
            録画
          </Button>
        )}
        {isLive && (
          <Link href={`/live/${match.id}`}>
            <Button icon={<Play className="h-3.5 w-3.5 fill-current" />}>視聴</Button>
          </Link>
        )}
        {match.status === "upcoming" && (
          <NotifyButton
            matchLabel={`${match.home.name} vs ${match.away.name}`}
          />
        )}
      </div>
    </div>
  );
}
