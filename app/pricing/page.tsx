import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PricingTable } from "@/components/pricing/PricingTable";
import { getHomeStats } from "@/lib/api/matches";

export default async function PricingPage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header liveCount={stats.liveCount} />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h1 className="mb-3 text-3xl font-bold text-slate-100">
            すべてのビーチスポーツを、ライブで
          </h1>
          <p className="mb-12 text-slate-500">
            いつでも解約可能。まずは7日間の無料トライアルからお試しください。
          </p>

          <PricingTable />
        </div>
      </main>
      <Footer />
    </>
  );
}
