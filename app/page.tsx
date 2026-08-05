import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BillboardHero } from "@/components/match/BillboardHero";
import { ContentRail, RailItem } from "@/components/rail/ContentRail";
import { MatchTile } from "@/components/rail/MatchTile";
import { StatsBar } from "@/components/match/StatsBar";
import {
  getArchives,
  getHeroMatch,
  getHomeStats,
  getLiveMatches,
  getSportRails,
  getUpcomingMatches,
} from "@/lib/api/matches";

export default async function HomePage() {
  const [heroMatch, liveMatches, upcoming, archives, sportRails, stats] =
    await Promise.all([
      getHeroMatch(),
      getLiveMatches(),
      getUpcomingMatches(),
      getArchives(),
      getSportRails(),
      getHomeStats(),
    ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        {heroMatch && <BillboardHero match={heroMatch} />}

        {/*
          ビルボードの下端にレールを少し重ねて、スクロールできることを示す。
          ヒーローが無い場合は重ねる相手がいないので通常の余白にする。
        */}
        <div className={heroMatch ? "relative z-10 -mt-16 sm:-mt-24" : "pt-8"}>
          {liveMatches.length > 0 ? (
            <ContentRail title="ライブ配信中" moreHref="/schedule">
              {liveMatches.map((match) => (
                <RailItem key={match.id}>
                  <MatchTile match={match} />
                </RailItem>
              ))}
            </ContentRail>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-slate-500 sm:px-6 lg:px-10">
              現在配信中の試合はありません
            </p>
          )}

          {upcoming.length > 0 && (
            <ContentRail title="まもなく開始" moreHref="/schedule">
              {upcoming.map((match) => (
                <RailItem key={match.id}>
                  <MatchTile match={match} />
                </RailItem>
              ))}
            </ContentRail>
          )}

          {archives.length > 0 && (
            <ContentRail title="新着アーカイブ" moreHref="/archive">
              {archives.map((match) => (
                <RailItem key={match.id}>
                  <MatchTile match={match} />
                </RailItem>
              ))}
            </ContentRail>
          )}

          {sportRails.map((rail) => (
            <ContentRail
              key={rail.sport}
              title={rail.label}
              moreHref={`/schedule?sport=${rail.sport}`}
            >
              {rail.matches.map((match) => (
                <RailItem key={match.id}>
                  <MatchTile match={match} />
                </RailItem>
              ))}
            </ContentRail>
          ))}

          <div className="px-4 py-10 sm:px-6 lg:px-10">
            <StatsBar stats={stats} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
