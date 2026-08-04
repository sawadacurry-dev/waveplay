import Link from "next/link";
import { CalendarDays, ChevronRight, MapPin, Tv } from "lucide-react";
import type { Tournament } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { LiveBadge, SportBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  });
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    // 大会詳細ページはPhase2。今は検索画面に大会名を渡して、その大会の試合を
    // 横断表示する(既にある検索機能をそのまま再利用している)。
    <Link
      href={`/search?q=${encodeURIComponent(tournament.name)}`}
      className="rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
    >
      <Card className="group h-full p-5 transition hover:border-sky-500/40 hover:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <SportBadge
            label={SPORT_LABELS[tournament.sport]}
            className={SPORT_BADGE_STYLES[tournament.sport]}
          />
          {tournament.liveCount > 0 && (
            <LiveBadge label={`${tournament.liveCount}試合 配信中`} />
          )}
        </div>

        <h2 className="mb-3 text-base font-bold text-slate-100">
          {tournament.name}
        </h2>

        <div className="space-y-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {tournament.venue.prefecture}・{tournament.venue.name}
            {tournament.venueCount > 1 && ` 他${tournament.venueCount - 1}会場`}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(tournament.startTime)}開幕
          </span>
          <span className="flex items-center gap-1.5">
            <Tv className="h-3.5 w-3.5" />
            全{tournament.matchCount}試合
          </span>
        </div>

        <span className="mt-4 flex items-center gap-0.5 text-xs font-semibold text-sky-400">
          試合一覧を見る
          <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </Card>
    </Link>
  );
}
