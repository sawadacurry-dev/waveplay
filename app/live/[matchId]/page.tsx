import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IVSPlayer } from "@/components/player/IVSPlayer";
import { ViewerCount } from "@/components/player/ViewerCount";
import { ScoreBoard } from "@/components/match/ScoreBoard";
import { LiveBadge, SportBadge } from "@/components/ui/Badge";
import { LiveCommentPanel } from "@/components/live/LiveCommentPanel";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SPORT_LABELS } from "@/types/match";
import { getHomeStats, getMatchById } from "@/lib/api/matches";

interface LivePageProps {
  params: Promise<{ matchId: string }>;
}

export default async function LivePage({ params }: LivePageProps) {
  const { matchId } = await params;
  const [match, stats] = await Promise.all([
    getMatchById(matchId),
    getHomeStats(),
  ]);

  if (!match) {
    notFound();
  }

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_320px]">
          <div>
            {match.playbackUrl ? (
              <IVSPlayer playbackUrl={match.playbackUrl} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-slate-500">
                現在この試合の配信はありません
              </div>
            )}

            <div className="mt-6 space-y-4">
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

              <p className="text-sm font-semibold text-sky-400">
                {match.round ?? match.tournamentName}
              </p>

              <ScoreBoard
                home={match.home}
                away={match.away}
                score={match.score}
                size="md"
              />

              <span className="flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-4 w-4" />
                {match.venue.prefecture}・{match.venue.name}
              </span>
            </div>
          </div>

          <LiveCommentPanel />
        </div>
      </main>

      <Footer />
    </>
  );
}
