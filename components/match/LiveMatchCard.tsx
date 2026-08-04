import Link from "next/link";
import { Eye, MapPin } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { LiveBadge, SportBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatViewerCount } from "@/lib/utils";

export function LiveMatchCard({ match }: { match: Match }) {
  return (
    <Link href={`/live/${match.id}`}>
      <Card className="group overflow-hidden transition hover:border-sky-500/40 hover:bg-slate-900">
        {/* サムネイル領域。MVPではグラデーションプレースホルダー */}
        <div className="relative flex aspect-video items-end justify-between bg-gradient-to-br from-slate-700 to-slate-900 p-3">
          <LiveBadge />
          <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-slate-200">
            <Eye className="h-3 w-3" />
            {formatViewerCount(match.viewerCount ?? 0)}
          </span>
        </div>

        <div className="space-y-2 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold text-slate-100">
              {match.home.name}
            </span>
            {match.score && (
              <span className="text-lg font-black tabular-nums text-sky-400">
                {match.score.home}-{match.score.away}
              </span>
            )}
            <span className="truncate text-sm font-semibold text-slate-100">
              {match.away.name}
            </span>
          </div>

          <p className="truncate text-xs text-slate-500">
            {match.round ?? match.tournamentName}
          </p>

          <div className="flex items-center justify-between pt-1">
            <SportBadge
              label={SPORT_LABELS[match.sport]}
              className={SPORT_BADGE_STYLES[match.sport]}
            />
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {match.venue.prefecture}・{match.venue.name}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
