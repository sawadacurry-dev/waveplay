import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { getArchives, getHomeStats } from "@/lib/api/matches";

export default async function ArchivePage() {
  const [archives, stats] = await Promise.all([
    getArchives(),
    getHomeStats(),
  ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="mb-1 text-2xl font-bold text-slate-100">アーカイブ</h1>
          <p className="mb-6 text-sm text-slate-500">
            過去の試合をいつでも見返せます
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {archives.map((match) => (
              <ArchiveCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
