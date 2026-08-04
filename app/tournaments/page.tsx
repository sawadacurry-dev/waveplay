import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getHomeStats } from "@/lib/api/matches";

// MVPではプレースホルダー。Phase2で大会一覧・詳細・組み合わせ表を実装する。
export default async function TournamentsPage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="mb-2 text-xl font-bold text-slate-100">大会情報</h1>
          <p className="text-sm text-slate-500">
            大会一覧・組み合わせ表はPhase2で実装予定です。
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
