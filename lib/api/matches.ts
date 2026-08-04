import { SPORT_LABELS, type HomeStats, type Match } from "@/types/match";

/**
 * MVP段階ではモックデータを返す。
 * Phase2で実APIに差し替える際は、この関数のシグネチャ(戻り値の型)を
 * 変えずに中身だけ fetch() 呼び出しに置き換えれば良いように設計している。
 */

// AWSが公式に公開しているデモ用の再生URL(動作確認用フォールバック)
const IVS_DEMO_PLAYBACK_URL =
  "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8";

// ジャクソンさんの実チャンネル(動作確認用)
const MY_CHANNEL_PLAYBACK_URL =
  "https://45bff89f2ab3.ap-northeast-1.playback.live-video.net/api/video/v1/ap-northeast-1.804838452628.channel.tQFfTvwCNMoC.m3u8";

const MOCK_MATCHES: Match[] = [
  {
    id: "match-001",
    sport: "beach-volleyball",
    tournamentName: "ジャパンビーチバレーツアー 2024 決勝",
    status: "live",
    startTime: "2024-07-10T10:00:00+09:00",
    home: { id: "c-tanaka-suzuki", name: "田中 / 鈴木" },
    away: { id: "c-yamada-sato", name: "山田 / 佐藤" },
    score: { home: 21, away: 18, periodLabel: "第2セット" },
    venue: { prefecture: "神奈川", name: "湘南海岸" },
    viewerCount: 4821,
    playbackUrl: MY_CHANNEL_PLAYBACK_URL,
  },
  {
    id: "match-002",
    sport: "beach-volleyball",
    tournamentName: "関東オープン",
    round: "関東オープン準決勝A",
    status: "live",
    startTime: "2024-07-10T13:00:00+09:00",
    home: { id: "c-nakamura-takahashi", name: "中村 / 髙橋" },
    away: { id: "c-ito-watanabe", name: "伊藤 / 渡辺" },
    score: { home: 15, away: 12, periodLabel: "第1セット" },
    venue: { prefecture: "千葉", name: "幕張" },
    viewerCount: 1247,
    playbackUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "match-003",
    sport: "beach-tennis",
    tournamentName: "全日本選手権",
    round: "全日本ビーチテニス選手権 QF",
    status: "live",
    startTime: "2024-07-10T13:30:00+09:00",
    home: { id: "c-kobayashi", name: "小林 香" },
    away: { id: "c-matsumoto", name: "松本 結" },
    score: { home: 6, away: 4, periodLabel: "第1セット" },
    venue: { prefecture: "静岡", name: "熱海" },
    viewerCount: 892,
    playbackUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "match-004",
    sport: "footvolley",
    tournamentName: "FJ CUP",
    round: "FOOTVOLLEY JAPAN CUP グループB",
    status: "live",
    startTime: "2024-07-10T14:00:00+09:00",
    home: { id: "c-fc-sanzu", name: "FC サンズ" },
    away: { id: "c-naminori-fc", name: "波乗り FC" },
    score: { home: 3, away: 2, periodLabel: "後半12分" },
    venue: { prefecture: "沖縄", name: "那覇" },
    viewerCount: 634,
    playbackUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "match-005",
    sport: "beach-soccer",
    tournamentName: "BS関西リーグ",
    round: "BS関西リーグ 第4節",
    status: "live",
    startTime: "2024-07-10T14:30:00+09:00",
    home: { id: "c-osaka-wave", name: "大阪ウェーブ" },
    away: { id: "c-kobe-surf", name: "神戸サーフ" },
    score: { home: 5, away: 3, periodLabel: "第3ピリオド" },
    venue: { prefecture: "大阪", name: "南港" },
    viewerCount: 503,
    playbackUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "match-006",
    sport: "beach-volleyball",
    tournamentName: "関東オープン",
    status: "archived",
    startTime: "2024-07-10T10:00:00+09:00",
    home: { id: "c-tanaka-suzuki", name: "田中 / 鈴木" },
    away: { id: "c-yamada-sato", name: "山田 / 佐藤" },
    venue: { prefecture: "神奈川", name: "湘南海岸" },
  },
  {
    id: "match-007",
    sport: "beach-tennis",
    tournamentName: "全日本選手権",
    status: "archived",
    startTime: "2024-07-10T11:30:00+09:00",
    home: { id: "c-nakamura-kaori", name: "中村 香" },
    away: { id: "c-takahashi-mi", name: "髙橋 美" },
    venue: { prefecture: "静岡", name: "熱海" },
  },
  {
    id: "match-008",
    sport: "beach-volleyball",
    tournamentName: "湘南カップ",
    status: "upcoming",
    startTime: "2024-07-10T15:30:00+09:00",
    home: { id: "c-matsuda-kawaguchi", name: "松田 / 川口" },
    away: { id: "c-hashimoto-ishii", name: "橋本 / 石井" },
    venue: { prefecture: "神奈川", name: "湘南海岸" },
  },
];

const MOCK_ARCHIVES: Match[] = [
  {
    id: "archive-001",
    sport: "beach-volleyball",
    tournamentName: "JBVツアー 準決勝ハイライト",
    round: "田中/鈴木 2-1 松田/川口",
    status: "archived",
    startTime: "2024-07-08T00:00:00+09:00",
    home: { id: "c-tanaka-suzuki", name: "田中 / 鈴木" },
    away: { id: "c-matsuda-kawaguchi", name: "松田 / 川口" },
    venue: { prefecture: "神奈川", name: "湘南海岸" },
    archiveDurationLabel: "47分",
    archiveViews: 12400,
    archiveUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "archive-002",
    sport: "beach-tennis",
    tournamentName: "全日本選手権 女子シングルスSF",
    round: "小林 香 6-4, 3-6, 7-5",
    status: "archived",
    startTime: "2024-07-07T00:00:00+09:00",
    home: { id: "c-kobayashi", name: "小林 香" },
    away: { id: "c-opponent", name: "対戦相手" },
    venue: { prefecture: "静岡", name: "熱海" },
    archiveDurationLabel: "1h 12分",
    archiveViews: 8700,
    archiveUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "archive-003",
    sport: "footvolley",
    tournamentName: "FJ CUP 2024 グループステージ特集",
    round: "グループA全試合収録",
    status: "archived",
    startTime: "2024-07-06T00:00:00+09:00",
    home: { id: "c-group-a-1", name: "グループA" },
    away: { id: "c-group-a-2", name: "参加チーム" },
    venue: { prefecture: "沖縄", name: "那覇" },
    archiveDurationLabel: "58分",
    archiveViews: 5200,
    archiveUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "archive-004",
    sport: "beach-soccer",
    tournamentName: "BS関西リーグ 第3節 全試合",
    round: "大阪ウェーブ首位独走",
    status: "archived",
    startTime: "2024-07-05T00:00:00+09:00",
    home: { id: "c-osaka-wave", name: "大阪ウェーブ" },
    away: { id: "c-others", name: "対戦チーム" },
    venue: { prefecture: "大阪", name: "南港" },
    archiveDurationLabel: "2h 03分",
    archiveViews: 4100,
    archiveUrl: IVS_DEMO_PLAYBACK_URL,
  },
  {
    id: "archive-005",
    sport: "beach-volleyball",
    tournamentName: "関東オープン 1回戦全試合",
    round: "16試合収録",
    status: "archived",
    startTime: "2024-07-04T00:00:00+09:00",
    home: { id: "c-kanto-open-1", name: "関東オープン" },
    away: { id: "c-kanto-open-2", name: "出場チーム" },
    venue: { prefecture: "千葉", name: "幕張" },
    archiveDurationLabel: "3h 20分",
    archiveViews: 9300,
    archiveUrl: IVS_DEMO_PLAYBACK_URL,
  },
];

// --- 公開API(モック実装) -------------------------------------------------

export async function getHeroMatch(): Promise<Match> {
  return MOCK_MATCHES.find((m) => m.status === "live")!;
}

export async function getLiveMatches(): Promise<Match[]> {
  return MOCK_MATCHES.filter((m) => m.status === "live");
}

export async function getTodaySchedule(): Promise<Match[]> {
  return MOCK_MATCHES;
}

export async function getMatchById(id: string): Promise<Match | undefined> {
  return MOCK_MATCHES.find((m) => m.id === id);
}

export async function getArchives(): Promise<Match[]> {
  return MOCK_ARCHIVES;
}

export async function getArchiveById(id: string): Promise<Match | undefined> {
  return MOCK_ARCHIVES.find((m) => m.id === id);
}

export async function searchAll(query: string): Promise<Match[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [live, archives] = await Promise.all([getTodaySchedule(), getArchives()]);
  const all = [...live, ...archives];

  return all.filter((m) => {
    const haystack = [
      m.tournamentName,
      m.round ?? "",
      m.home.name,
      m.away.name,
      m.venue.name,
      m.venue.prefecture,
      SPORT_LABELS[m.sport],
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export async function getHomeStats(): Promise<HomeStats> {
  return {
    liveCount: 4,
    todayMatchCount: 9,
    registeredSportsCount: 5,
    totalViewers: 7297,
  };
}
