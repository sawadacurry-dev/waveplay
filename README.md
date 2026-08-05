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

## 実際に映像を配信するには

OBSからAWS IVSへ配信する手順は **[docs/streaming-setup.md](docs/streaming-setup.md)** に
まとめてあります(チャンネル作成 → OBS設定 → 環境変数 → 切り分け方法)。

視聴側は実装済みなので、アプリのコード変更は不要です。

## 再生URLの切り替え

デフォルトでは、AWSが公式に公開しているデモ用の再生URLを使うため、
設定なしでプレイヤーの動作確認ができます。

自分のチャンネルに切り替える場合は、AWSコンソールでIVSチャンネルを作成し、
発行された `Playback URL` を `.env.local` に設定してください。

```bash
cp .env.example .env.local
# NEXT_PUBLIC_IVS_PLAYBACK_URL に Playback URL を貼り付ける
```

プレイヤー側 (`components/player/IVSPlayer.tsx`) の実装は変更不要です。
試合ごとに別チャンネルを割り当てたい場合は、各 `Match` オブジェクトの
`playbackUrl` に直接URLを設定します。

## 現在の実装状況

### 画面(全12ルート)

| ルート | 内容 | データ |
|---|---|---|
| `/` | トップ(ビルボード + カテゴリ別の横スクロールレール) | モック |
| `/live/[matchId]` | ライブ視聴。AWS IVS Player SDKによる**実再生**、配信待機表示・全画面・画質切替、スコア・ライブコメント | 配信は実、その他モック |
| `/schedule` | スケジュール一覧(スポーツ種目タブで絞り込み) | モック |
| `/archive` | アーカイブ一覧 | モック |
| `/archive/[videoId]` | アーカイブ詳細(**再生は未実装**、プレースホルダー表示) | モック |
| `/search` | 大会名・選手名・会場名の横断検索(デバウンス250ms、URLに`?q=`反映) | モック配列の部分一致 |
| `/login` | ログインフォーム | 疑似認証 |
| `/account` | アカウント情報・契約プラン表示 | 疑似認証 |
| `/pricing` | 料金プラン(ベーシック ¥980 / プレミアム ¥1,980) | 静的 |
| `/checkout` | 決済確認画面 | **決済は発生しない**(800msのダミー処理) |
| `/tournaments` | 大会一覧(スポーツ種目タブで絞り込み、カードから検索経由で試合一覧へ) | モック |

レスポンシブ対応、キーボードフォーカスの可視化は全画面で対応済み。

### モックである箇所(Phase2で差し替え)

いずれも「差し替え時にUI側を変更せずに済む」形に切り出してあります。

- **データ取得** — `lib/api/matches.ts`。関数のシグネチャ(戻り値の型)を変えずに、
  中身だけ `fetch()` 呼び出しに置き換えれば実API化できる。
- **認証** — `lib/auth/AuthProvider.tsx`。メールアドレスを受け取って localStorage に
  保存するだけで、パスワード検証も有効期限もない。NextAuth.js / Amazon Cognito /
  Clerk 等に置き換える際は、このファイルの実装だけを差し替える。
- **決済** — `components/pricing/CheckoutView.tsx`。`setTimeout` でプラン契約状態を
  書き換えるのみ。本番はStripe Checkout Sessionへのリダイレクト方式を想定
  (カード番号の入力欄を自前で持たず、PCI DSS対応範囲を最小化する)。
- **ライブコメント** — `components/live/LiveCommentPanel.tsx`。そのブラウザタブの中で
  完結するローカル状態で、他の視聴者には共有されない。リアルタイム共有には
  WebSocket(API Gateway WebSocket API等)やPub/Subのバックエンドが別途必要。
- **通知** — `lib/api/notifications.ts` が試合データから通知を組み立てている。
  実際は「フォローした大会・選手」に紐づくサーバー側の通知テーブルを引くことになる。
  既読状態は `components/layout/NotificationBell.tsx` のローカル状態で、リロードで戻る。
- **大会** — 大会を独立したエンティティとして持たず、試合の `tournamentName` で
  グルーピングして `getTournaments()` が組み立てている。
- **通知登録** — `components/match/NotifyButton.tsx`。押した状態はローカル state のみで
  リロードすると戻る。Phase2で「フォロー」APIへのPOSTに差し替える。

### 未実装(意図的にスコープ外)

- アーカイブの実再生
- 大会詳細ページ(組み合わせ表・順位表)。一覧カードは検索画面に大会名を渡す形で代用
- 選手プロフィール、ヘルプ、プライバシー、利用規約、お問い合わせの各ページ
  (フッターでは「準備中」と表示し、リンクにしていない)
- 視聴履歴、お気に入り、フォロー

### 実装上の注意

- **日時は必ず `lib/utils.ts` の `formatTimeJST()` / `formatDateJST()` を使う。**
  `toLocaleTimeString` を直接呼ぶと実行環境のタイムゾーンで描画され、UTCで動く
  Vercel上では9時間ずれる。開発機は日本時間なのでローカルでは再現しない。
- **ページ内リンクは `<a>` ではなく `next/link` の `<Link>` を使う。**
  `<a>` だとフルリロードになりクライアント遷移の利点が消える。
- **`?redirect=` のようなURL由来の遷移先は必ず検証する。**
  外部URLをそのまま `router.push()` に渡すとオープンリダイレクトになる
  (`components/auth/LoginForm.tsx` の `safeRedirect()` 参照)。

## ディレクトリ構成

```
app/            ルーティング(App Router)
components/
  ui/           汎用UIパーツ(Button, Badge, Card)
  layout/       Header, Footer, HeaderAuthArea, NotificationBell, BottomTabBar
  rail/         ContentRail, MatchTile (トップページの横スクロールレール)
  player/       IVSPlayer, ViewerCount
  match/        BillboardHero, LiveMatchCard, ScoreBoard, ScheduleRow, StatsBar等
  archive/      ArchiveCard
  auth/         LoginForm, AccountView
  pricing/      PricingTable, CheckoutView
  search/       SearchView
  live/         LiveCommentPanel
  tournament/   TournamentCard, TournamentList
lib/
  ivs/          IVS Player SDK初期化ヘルパー
  api/          データ取得(現在はモック、将来API化)
  auth/         疑似認証コンテキスト(AuthProvider)
  utils.ts      cn()等の共通関数
hooks/
  useIVSPlayer.ts  プレイヤーの状態管理フック
types/          Match, Tournament, IVSPlayer, User/Plan, AppNotification等の型定義
constants/      スポーツ種目のラベル・カラー定義
```

## デザインシステム

### UXの方針

大手スポーツ配信サービスで一般的な**コンテンツ先行型**の構成を採っている。

- **ビルボード** — トップ最上部に注目試合を全幅・大きく置き、下端を背景へ溶かして
  レールへ繋げる(`components/match/BillboardHero.tsx`)
- **レール** — カテゴリごとにタイルを横一列に並べ、横スクロールで送る
  (`components/rail/ContentRail.tsx`)。タッチはスワイプ、デスクトップは端の矢印、
  キーボードはスクロールコンテナ自体をフォーカスして矢印キーで操作できる
- **16:9タイル** — ライブ・配信予定・アーカイブを1つのコンポーネントで扱い、
  status に応じてバッジと遷移先だけ出し分ける(`components/rail/MatchTile.tsx`)
- **ボトムタブ** — md未満では画面下部に固定タブを置く
  (`components/layout/BottomTabBar.tsx`)。片手で届き、ハンバーガーのように
  「開く」操作を挟まない

### 配色

背景は色味を持たないニュートラルな黒基調(`#08090b`)。背景が無彩色に近いほど
サムネイル映像の色が濁らず、コンテンツが主役になる。アクセントはターコイズ、
差し色に夕焼けのコーラルを一点だけ使う。

各コンポーネントは `slate-*` / `sky-*` のユーティリティを直接使っているため、
`app/globals.css` の `@theme` で**スケールそのものを上書き**することで、個々の
ファイルを触らずに全画面のトーンを切り替えている。配色を戻したい場合は
この `@theme` ブロックを消せばよい。

フォントは英数字用に Inter、日本語用に Noto Sans JP を `next/font/google` で
最適化配信。スポーツ種目ごとのバッジ色は `constants/sports.ts` に集約。

## 開発時の確認コマンド

```bash
npm run lint          # ESLint
npx tsc --noEmit      # 型チェック
npm run build         # 本番ビルド
```
