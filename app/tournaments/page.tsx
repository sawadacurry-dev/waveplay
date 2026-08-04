import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TournamentList } from "@/components/tournament/TournamentList";
import { getHomeStats, getTournaments } from "@/lib/api/matches";

export default async function TournamentsPage() {
  const [tournaments, stats] = await Promise.all([
    getTournaments(),
    getHomeStats(),
  ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="mb-1 text-2xl font-bold text-slate-100">大会情報</h1>
          <p className="mb-6 text-sm text-slate-500">
            WAVEPLAYで配信中・配信予定の大会一覧
          </p>

          <TournamentList tournaments={tournaments} />

          <p className="mt-10 text-center text-xs text-slate-600">
            ※ 組み合わせ表・順位表を含む大会詳細ページはPhase2で対応予定です。
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
