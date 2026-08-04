import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckoutView } from "@/components/pricing/CheckoutView";
import { getHomeStats } from "@/lib/api/matches";

export default async function CheckoutPage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header liveCount={stats.liveCount} />
      <main className="flex-1">
        <div className="mx-auto max-w-md px-6 py-16">
          <Suspense>
            <CheckoutView />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
