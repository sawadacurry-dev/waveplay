import Link from "next/link";
import { Info, MapPin, Play, Users } from "lucide-react";
import type { Match } from "@/types/match";
import { SPORT_LABELS } from "@/types/match";
import { SPORT_TINT_STYLES } from "@/constants/sports";
import { formatViewerCount } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * トップ最上部のビルボード。
 * 従来のカード型ヒーローと違い、画面幅いっぱいに背景を敷いて
 * 下端をページ背景へグラデーションで溶かし、レールへ自然に繋げる。
 */
export function BillboardHero({ match }: { match: Match }) {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden sm:min-h-[70vh]">
      {/* 背景。MVPでは実映像ではなく種目カラーを敷いたグラデーション */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
      <div
        className={cn(
          "absolute inset-0 opacity-40",
          SPORT_TINT_STYLES[match.sport]
        )}
      />
      <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-coral-500/10 blur-3xl" />

      {/* 下端と左端を背景色に溶かして、文字の可読性とレールへの繋がりを作る */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/30 to-transparent" />

      {/*
        下余白(pb)は、トップページでレールを重ねる負のマージンより必ず大きくすること。
        小さいとレールのコンテナがCTAの上に乗り、ボタンが押せなくなる。
        現在: 重なり -mt-12(48px) / -mt-16(64px) に対して pb-24(96px) / pb-28(112px)。
      */}
      <div className="relative flex min-h-[60vh] items-end px-4 pb-24 pt-24 sm:min-h-[70vh] sm:px-6 sm:pb-28 lg:px-10">
        <div className="max-w-2xl">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-[11px] font-bold tracking-wide text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              LIVE
            </span>
            <span className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur">
              {SPORT_LABELS[match.sport]}
            </span>
            {match.viewerCount !== undefined && (
              <span className="flex items-center gap-1 text-xs text-slate-300">
                <Users className="h-3.5 w-3.5" />
                {formatViewerCount(match.viewerCount)}人が視聴中
              </span>
            )}
          </div>

          {/*
            スペースを明示的に入れているのは、読み上げ時に
            「鈴木vs山田」と繋がって聞こえるのを避けるため
          */}
          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            {match.home.name}{" "}
            <span className="mx-1 text-xl font-bold text-slate-400 sm:text-3xl">
              vs
            </span>{" "}
            {match.away.name}
          </h1>

          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            {match.tournamentName}
          </p>

          {match.score && (
            <p className="mt-4 flex items-center gap-3 text-2xl font-black tabular-nums text-sky-400 sm:text-3xl">
              {match.score.home}
              <span className="text-slate-500">-</span>
              {match.score.away}
              {match.score.periodLabel && (
                <span className="rounded bg-white/5 px-2 py-1 text-xs font-semibold text-slate-300">
                  {match.score.periodLabel}
                </span>
              )}
            </p>
          )}

          <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-4 w-4" />
            {match.venue.prefecture}・{match.venue.name}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/live/${match.id}`}
              className="flex items-center gap-2 rounded bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              <Play className="h-4 w-4 fill-current" />
              今すぐ視聴
            </Link>
            <Link
              href="/schedule"
              className="flex items-center gap-2 rounded bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              <Info className="h-4 w-4" />
              番組表
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
