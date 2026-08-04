import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchView } from "@/components/search/SearchView";
import { getHomeStats } from "@/lib/api/matches";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const [{ q }, stats] = await Promise.all([searchParams, getHomeStats()]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="mb-6 text-2xl font-bold text-slate-100">検索</h1>
          <SearchView initialQuery={q ?? ""} />
        </div>
      </main>

      <Footer />
    </>
  );
}
