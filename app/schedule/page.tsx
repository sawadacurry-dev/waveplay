import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScheduleList } from "@/components/match/ScheduleList";
import { getHomeStats, getTodaySchedule } from "@/lib/api/matches";
import { formatDateJST } from "@/lib/utils";

export default async function SchedulePage() {
  const [schedule, stats] = await Promise.all([
    getTodaySchedule(),
    getHomeStats(),
  ]);

  return (
    <>
      <Header liveCount={stats.liveCount} />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="mb-1 text-2xl font-bold text-slate-100">
            本日の試合スケジュール
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            {formatDateJST(new Date(), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <ScheduleList matches={schedule} />
        </div>
      </main>

      <Footer />
    </>
  );
}
