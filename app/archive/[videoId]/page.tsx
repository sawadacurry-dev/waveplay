import { notFound } from "next/navigation";
import { MapPin, Eye, Clock } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SportBadge } from "@/components/ui/Badge";
import { SPORT_BADGE_STYLES } from "@/constants/sports";
import { SPORT_LABELS } from "@/types/match";
import { formatViewerCount } from "@/lib/utils";
import { getArchiveById, getHomeStats } from "@/lib/api/matches";

interface ArchivePageProps {
  params: Promise<{ videoId: string }>;
}

export default async function ArchiveVideoPage({ params }: ArchivePageProps) {
  const { videoId } = await params;
  const [match, stats] = await Promise.all([
    getArchiveById(videoId),
    getHomeStats(),
  ]);

  if (!match) {
    notFound();
  }

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/*
            MVPではアーカイブの実再生は対象外(Phase2)。
            ここでは同じIVSPlayerコンポーネントを使い回せる設計であることだけ示す。
          */}
          <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-sm text-slate-500">
            アーカイブ再生はPhase2で対応予定です
          </div>

          <div className="mt-6 space-y-3">
            <SportBadge
              label={SPORT_LABELS[match.sport]}
              className={SPORT_BADGE_STYLES[match.sport]}
            />
            <h1 className="text-xl font-bold text-slate-100">
              {match.tournamentName}
            </h1>
            {match.round && <p className="text-sm text-slate-400">{match.round}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {match.venue.prefecture}・{match.venue.name}
              </span>
              {match.archiveDurationLabel && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {match.archiveDurationLabel}
                </span>
              )}
              {match.archiveViews !== undefined && (
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {formatViewerCount(match.archiveViews)} 回視聴
                </span>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
