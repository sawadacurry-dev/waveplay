import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IVSPlayer } from "@/components/player/IVSPlayer";
import { ViewerCount } from "@/components/player/ViewerCount";
import { ScoreBoard } from "@/components/match/ScoreBoard";
import { LiveBadge, SportBadge } from "@/components/ui/Badge";
import { LiveCommentPanel } from "@/components/live/LiveCommentPanel";
import { ContentRail, RailItem } from "@/components/rail/ContentRail";
import { MatchTile } from "@/components/rail/MatchTile";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SPORT_LABELS } from "@/types/match";
import { getHomeStats, getLiveMatches, getMatchById } from "@/lib/api/matches";

interface LivePageProps {
  params: Promise<{ matchId: string }>;
}

export default async function LivePage({ params }: LivePageProps) {
  const { matchId } = await params;
  const [match, stats, liveMatches] = await Promise.all([
    getMatchById(matchId),
    getHomeStats(),
    getLiveMatches(),
  ]);

  if (!match) {
    notFound();
  }

  // 視聴中の試合は他の試合レールから除く
  const otherLive = liveMatches.filter((m) => m.id !== match.id);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        {/*
          プレイヤーは映像を主役にするため、左右の余白を詰めて幅いっぱいに置く。
          コメント欄は大画面では右に並べ、狭い画面では試合情報の下に回り込む。
          出し分けを display ではなくグリッドの配置で行っているのは、
          2つ描画するとコメントの状態が分裂して投稿が消えてしまうため。
        */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="bg-black">
              {match.playbackUrl ? (
                <IVSPlayer
                  playbackUrl={match.playbackUrl}
                  className="rounded-none"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-slate-900 text-slate-500">
                  現在この試合の配信はありません
                </div>
              )}
            </div>

            <div className="px-4 py-6 sm:px-6 lg:px-10">
              <div className="flex flex-wrap items-center gap-3">
                {match.status === "live" && <LiveBadge label="LIVE NOW" />}
                {match.viewerCount !== undefined && (
                  <ViewerCount count={match.viewerCount} />
                )}
                <SportBadge
                  label={SPORT_LABELS[match.sport]}
                  className={SPORT_BADGE_STYLES[match.sport]}
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-sky-400">
                {match.round ?? match.tournamentName}
              </p>

              <div className="mt-3">
                <ScoreBoard
                  home={match.home}
                  away={match.away}
                  score={match.score}
                  size="md"
                />
              </div>

              <span className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                {match.venue.prefecture}・{match.venue.name}
              </span>
            </div>
          </div>

          <div className="px-4 pb-6 sm:px-6 lg:px-0 lg:pb-0">
            <LiveCommentPanel />
          </div>
        </div>

        {otherLive.length > 0 && (
          <div className="mx-auto max-w-[1600px] pb-8">
            <ContentRail title="ほかのライブ配信" moreHref="/schedule">
              {otherLive.map((m) => (
                <RailItem key={m.id}>
                  <MatchTile match={m} />
                </RailItem>
              ))}
            </ContentRail>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
