# WAVEPLAY (MVP)

ビーチスポーツ特化のライブ配信プラットフォーム。Figmaデザインを基にした
Next.js (App Router) + TypeScript + Tailwind CSS + AWS IVS のMVP実装。

## セットアップ

```bash
npm install
npm run dev
```

`npm install` 実行時に、AWS IVS Player SDK (`amazon-ivs-player`) が必要とする
ワーカー/wasmファイルを自動的に `public/ivs-player/` へコピーします
(`scripts/copy-ivs-assets.js`、`postinstall`で実行)。

http://localhost:3000 で確認できます。

## 実際のIVSチャンネルに繋ぐには

現在 `lib/api/matches.ts` 内の `IVS_DEMO_PLAYBACK_URL` は、
AWSが公式に公開しているデモ用の再生URLです(誰でも動作確認できます)。

自分のチャンネルに切り替える場合は、AWSコンソールでIVSチャンネルを作成し、
発行された `Playback URL` を同じ変数、または各 `Match` オブジェクトの
`playbackUrl` に設定してください。プレイヤー側 (`components/player/IVSPlayer.tsx`)
の実装は変更不要です。

## 現在のMVPスコープ

実装済み:
- トップページ(ヒーロー注目試合 / ライブ配信中カード一覧 / 本日のスケジュール / 統計バー)
- ライブ視聴ページ(AWS IVS Player SDKによる実再生、スコア・視聴者数表示)
- スケジュール一覧(スポーツ種目タブでの絞り込み)
- アーカイブ一覧・詳細ページ(モックデータ、実再生はPhase2)
- レスポンシブ対応、キーボードフォーカスの可視化

Phase2以降(未実装、意図的にスコープ外):
- 実データAPI連携(現在は `lib/api/matches.ts` のモック関数)
- アーカイブの実再生
- 有料プラン・決済、視聴登録の実処理
- 通知機能、検索機能
- 選手プロフィール、大会詳細ページ

## ディレクトリ構成

```
app/            ルーティング(App Router)
components/
  ui/           汎用UIパーツ(Button, Badge, Card)
  layout/       Header, Footer
  player/       IVSPlayer, ViewerCount
  match/        HeroMatchCard, LiveMatchCard, ScoreBoard, ScheduleRow等
  archive/      ArchiveCard
lib/
  ivs/          IVS Player SDK初期化ヘルパー
  api/          データ取得(現在はモック、将来API化)
  utils.ts      cn()等の共通関数
hooks/
  useIVSPlayer.ts  プレイヤーの状態管理フック
types/          Match, IVSPlayer等の型定義
constants/      スポーツ種目のラベル・カラー定義
```

## デザインシステム

`app/globals.css` の `@theme inline` にトークンを集約(Tailwind v4方式)。
フォントは英数字用に Inter、日本語用に Noto Sans JP を `next/font/google` で
最適化配信。カラーはFigmaのダークテーマ(ネイビー背景 + スカイブルーのアクセント)を
そのまま踏襲し、スポーツ種目ごとのバッジ色は `constants/sports.ts` に集約。
