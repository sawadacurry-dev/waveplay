import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroMatchCard } from "@/components/match/HeroMatchCard";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { ScheduleRow } from "@/components/match/ScheduleRow";
import { StatsBar } from "@/components/match/StatsBar";
import {
  getHeroMatch,
  getHomeStats,
  getLiveMatches,
  getTodaySchedule,
} from "@/lib/api/matches";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [heroMatch, liveMatches, todaySchedule, stats] = await Promise.all([
    getHeroMatch(),
    getLiveMatches(),
    getTodaySchedule(),
    getHomeStats(),
  ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        {heroMatch && <HeroMatchCard match={heroMatch} />}

        {/* ヒーローが無いときは重ねる相手がいないので、負のマージンを外す */}
        <div
          className={cn(
            "mx-auto max-w-6xl px-6",
            heroMatch ? "-mt-8" : "pt-10"
          )}
        >
          <StatsBar stats={stats} />
        </div>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">ライブ配信中</h2>
            <Link href="/schedule" className="text-sm text-sky-400 hover:underline">
              すべて見る &rsaquo;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">本日の試合スケジュール</h2>
            <Link href="/schedule" className="text-sm text-sky-400 hover:underline">
              すべて見る &rsaquo;
            </Link>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4">
            {todaySchedule.slice(0, 6).map((match) => (
              <ScheduleRow key={match.id} match={match} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
