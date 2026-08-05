import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { HeroMatchCard } from "@/components/match/HeroMatchCard";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { ScheduleRow } from "@/components/match/ScheduleRow";
import { StatsBar } from "@/components/match/StatsBar";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import {
  getArchives,
  getHeroMatch,
  getHomeStats,
  getLiveMatches,
  getTodaySchedule,
} from "@/lib/api/matches";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const [heroMatch, liveMatches, todaySchedule, archives, stats] =
    await Promise.all([
      getHeroMatch(),
      getLiveMatches(),
      getTodaySchedule(),
      getArchives(),
      getHomeStats(),
    ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        {heroMatch && <HeroMatchCard match={heroMatch} />}

        {/* ヒーローが無いときは重ねる相手がいないので、負のマージンを外す */}
        <div
          className={cn("mx-auto max-w-6xl px-6", heroMatch ? "-mt-8" : "pt-10")}
        >
          <StatsBar stats={stats} />
        </div>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <SectionHeading
            title="ライブ配信中"
            description="いま観られる試合"
            moreHref="/schedule"
          />

          {liveMatches.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-slate-900/40 py-16 text-center text-sm text-slate-500">
              現在配信中の試合はありません。次の配信予定はスケジュールをご覧ください。
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {liveMatches.map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-12">
          <SectionHeading
            title="本日の試合スケジュール"
            description="開始時刻順"
            moreHref="/schedule"
          />

          <div className="rounded-xl border border-white/10 bg-slate-900/40 px-4">
            {todaySchedule.slice(0, 6).map((match) => (
              <ScheduleRow key={match.id} match={match} />
            ))}
          </div>
        </section>

        {archives.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pb-16">
            <SectionHeading
              title="新着アーカイブ"
              description="見逃した試合をあとから"
              moreHref="/archive"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {archives.slice(0, 4).map((match) => (
                <ArchiveCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
