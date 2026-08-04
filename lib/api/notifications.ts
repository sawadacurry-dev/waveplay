import type { AppNotification } from "@/types/notification";
import { getArchives, getLiveMatches, getTodaySchedule } from "@/lib/api/matches";

/**
 * MVPではモックの試合データから通知を組み立てている。
 * 実際には「ユーザーがフォローした大会・選手」に紐づくサーバー側の通知テーブルを
 * 引くことになるため、Phase2では戻り値の型を変えずに中身をfetch()へ差し替える。
 *
 * timeLabel を実時刻から計算せず固定文字列にしているのは、この関数が静的
 * プリレンダリングされるページ(ヘッダー)から呼ばれるため。ビルド時刻を基準に
 * 「N分前」を算出すると、デプロイから時間が経つほど表示がズレていく。
 */
export async function getNotifications(): Promise<AppNotification[]> {
  const [live, schedule, archives] = await Promise.all([
    getLiveMatches(),
    getTodaySchedule(),
    getArchives(),
  ]);

  const notifications: AppNotification[] = [];

  const RECENT_LABELS = ["3分前", "25分前"];
  live.slice(0, RECENT_LABELS.length).forEach((match, i) => {
    notifications.push({
      id: `n-live-${match.id}`,
      kind: "live-start",
      title: "配信が始まりました",
      body: `${match.tournamentName} ${match.home.name} vs ${match.away.name}`,
      href: `/live/${match.id}`,
      timeLabel: RECENT_LABELS[i],
    });
  });

  const upcoming = schedule.find((m) => m.status === "upcoming");
  if (upcoming) {
    notifications.push({
      id: `n-upcoming-${upcoming.id}`,
      kind: "upcoming",
      title: "まもなく開始",
      body: `${upcoming.tournamentName} が ${formatTime(upcoming.startTime)} に開始予定です`,
      href: `/live/${upcoming.id}`,
      timeLabel: "1時間前",
    });
  }

  const [latestArchive] = archives;
  if (latestArchive) {
    notifications.push({
      id: `n-archive-${latestArchive.id}`,
      kind: "archive",
      title: "アーカイブが公開されました",
      body: latestArchive.tournamentName,
      href: `/archive/${latestArchive.id}`,
      timeLabel: "昨日",
    });
  }

  return notifications;
}

// サーバー側のタイムゾーンに左右されないよう、日本時間で固定して表示する
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  });
}
