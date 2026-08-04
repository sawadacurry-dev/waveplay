import Link from "next/link";
import { CalendarDays, MapPin, Play } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SPORT_LABELS } from "@/types/match";
import { LiveBadge, SportBadge } from "@/components/ui/Badge";
import { ViewerCount } from "@/components/player/ViewerCount";
import { ScoreBoard } from "@/components/match/ScoreBoard";
import { Button } from "@/components/ui/Button";

export function HeroMatchCard({ match }: { match: Match }) {
  return (
    <section className="relative overflow-hidden">
      {/*
        MVPではヒーロー部分は静的な背景(グラデーション)にとどめる。
        常時ライブ映像をトップページに埋め込むと帯域・再生数を圧迫するため、
        実際の視聴はユーザーが /live/[matchId] に遷移してから開始する設計。
      */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 sm:py-24">
        <div className="flex items-center gap-3">
          <LiveBadge label="LIVE NOW" />
          <ViewerCount count={match.viewerCount ?? 0} />
        </div>

        <p className="text-sm font-semibold text-sky-400">{match.tournamentName}</p>

        <ScoreBoard home={match.home} away={match.away} score={match.score} />

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-4 w-4" />
            {match.venue.prefecture}・{match.venue.name}
          </span>
          <SportBadge
            label={SPORT_LABELS[match.sport]}
            className={SPORT_BADGE_STYLES[match.sport]}
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/live/${match.id}`}>
            <Button icon={<Play className="h-4 w-4 fill-current" />}>今すぐ視聴</Button>
          </Link>
          <Link href="/schedule">
            <Button variant="secondary" icon={<CalendarDays className="h-4 w-4" />}>
              スケジュール
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
