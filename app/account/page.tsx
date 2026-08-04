import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountView } from "@/components/auth/AccountView";
import { getHomeStats } from "@/lib/api/matches";

export default async function AccountPage() {
  const stats = await getHomeStats();

  return (
    <>
      <Header liveCount={stats.liveCount} />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <AccountView />
        </div>
      </main>
      <Footer />
    </>
  );
}
