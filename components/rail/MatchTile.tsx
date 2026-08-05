import Link from "next/link";
import { Clock, Eye, Play, Users } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_TINT_STYLES } from "@/constants/sports";
import { formatTimeJST, formatViewerCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * レールに並べる16:9のタイル。
 * ライブ・配信予定・アーカイブを1つのコンポーネントで扱い、
 * status に応じてバッジと遷移先だけを出し分ける。
 */
export function MatchTile({ match }: { match: Match }) {
  const isLive = match.status === "live";
  const isArchived = match.status === "archived";
  const href = isArchived ? `/archive/${match.id}` : `/live/${match.id}`;

  return (
    <Link
      href={href}
      className="group/tile block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-800">
        {/* サムネイル。MVPでは種目カラーを薄く敷いたプレースホルダー */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 transition duration-300 group-hover/tile:scale-105",
            SPORT_TINT_STYLES[match.sport]
          )}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* 再生アイコン(ホバー時) */}
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover/tile:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-950">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>

        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          {isLive && (
            <span className="flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
              <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
          )}
          {match.status === "upcoming" && (
            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-slate-200">
              {formatTimeJST(match.startTime)} 開始
            </span>
          )}
        </div>

        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          {isLive && match.viewerCount !== undefined && (
            <span className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
              <Users className="h-2.5 w-2.5" />
              {formatViewerCount(match.viewerCount)}
            </span>
          )}
          {match.archiveDurationLabel && (
            <span className="flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-slate-200">
              <Clock className="h-2.5 w-2.5" />
              {match.archiveDurationLabel}
            </span>
          )}
        </div>

        {isLive && match.score && (
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-black tabular-nums text-sky-400">
            {match.score.home}-{match.score.away}
          </span>
        )}
      </div>

      <div className="mt-2 space-y-0.5">
        <p className="truncate text-sm font-semibold text-slate-100 transition group-hover/tile:text-sky-400">
          {match.round ?? match.tournamentName}
        </p>
        <p className="truncate text-xs text-slate-500">
          {isArchived
            ? `${SPORT_LABELS[match.sport]}・${match.venue.prefecture}`
            : `${match.home.name} vs ${match.away.name}`}
        </p>
        {match.archiveViews !== undefined && (
          <p className="flex items-center gap-1 text-xs text-slate-600">
            <Eye className="h-3 w-3" />
            {formatViewerCount(match.archiveViews)} 回視聴
          </p>
        )}
      </div>
    </Link>
  );
}
