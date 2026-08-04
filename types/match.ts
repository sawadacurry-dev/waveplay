// スポーツ種目のカテゴリ
export type SportCategory =
  | "beach-volleyball"
  | "beach-tennis"
  | "beach-soccer"
  | "footvolley"
  | "surfing";

export const SPORT_LABELS: Record<SportCategory, string> = {
  "beach-volleyball": "ビーチバレーボール",
  "beach-tennis": "ビーチテニス",
  "beach-soccer": "ビーチサッカー",
  footvolley: "フットバレー",
  surfing: "サーフィン",
};

// 配信ステータス
export type BroadcastStatus = "live" | "upcoming" | "archived";

// 試合の1チーム/選手ペア
export interface Competitor {
  id: string;
  name: string;
}

// スコア(セット制スポーツ想定。単一スコアの場合はcurrentのみ使用)
export interface Score {
  home: number;
  away: number;
  periodLabel?: string; // 例: "第2セット", "後半12分", "第3ピリオド"
}

// 会場情報
export interface Venue {
  prefecture: string;
  name: string;
}

// 試合(配信)のメインエンティティ
export interface Match {
  id: string;
  sport: SportCategory;
  tournamentName: string; // 例: "ジャパンビーチバレーツアー 2024 決勝"
  round?: string; // 例: "関東オープン準決勝A"
  status: BroadcastStatus;
  startTime: string; // ISO8601
  home: Competitor;
  away: Competitor;
  score?: Score;
  venue: Venue;
  viewerCount?: number;
  thumbnailUrl?: string;
  // AWS IVS再生用
  playbackUrl?: string; // https://xxxx.m3u8 (ライブ)
  archiveUrl?: string; // アーカイブ動画URL
  archiveDurationLabel?: string; // 例: "47分"
  archiveViews?: number;
}

// トップページ集計統計
export interface HomeStats {
  liveCount: number;
  todayMatchCount: number;
  registeredSportsCount: number;
  totalViewers: number;
}
