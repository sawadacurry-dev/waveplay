export type NotificationKind = "live-start" | "upcoming" | "archive";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  href: string; // クリック時の遷移先
  timeLabel: string; // 例: "3分前"
}
