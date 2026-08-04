import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SportBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatViewerCount } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function ArchiveCard({ match }: { match: Match }) {
  return (
    <Link href={`/archive/${match.id}`}>
      <Card className="group overflow-hidden transition hover:border-sky-500/40 hover:bg-slate-900">
        <div className="relative flex aspect-video items-end justify-end bg-gradient-to-br from-slate-700 to-slate-900 p-3">
          {match.archiveDurationLabel && (
            <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-slate-200">
              <Clock className="h-3 w-3" />
              {match.archiveDurationLabel}
            </span>
          )}
        </div>

        <div className="space-y-2 p-4">
          <SportBadge
            label={SPORT_LABELS[match.sport]}
            className={SPORT_BADGE_STYLES[match.sport]}
          />
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-100">
            {match.tournamentName}
          </h3>
          {match.round && <p className="truncate text-xs text-slate-500">{match.round}</p>}

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>{formatDate(match.startTime)}</span>
            {match.archiveViews !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatViewerCount(match.archiveViews)} 回視聴
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
