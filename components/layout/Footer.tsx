import Link from "next/link";
import { Waves } from "lucide-react";

/**
 * `comingSoon` が付いた項目はまだページが存在しない。リンクにすると404に
 * 飛んでしまうため、リンクではなく「準備中」のテキストとして描画する。
 * Phase2でページを作ったら、この印を消すだけでリンクに戻る。
 */
const FOOTER_COLUMNS = [
  {
    title: "サービス",
    links: [
      { href: "/", label: "ライブ中継" },
      { href: "/archive", label: "アーカイブ" },
      { href: "/tournaments", label: "大会情報" },
      { href: "/players", label: "選手プロフィール", comingSoon: true },
    ],
  },
  {
    title: "スポーツ",
    links: [
      { href: "/schedule?sport=beach-volleyball", label: "ビーチバレーボール" },
      { href: "/schedule?sport=beach-tennis", label: "ビーチテニス" },
      { href: "/schedule?sport=beach-soccer", label: "ビーチサッカー" },
      { href: "/schedule?sport=footvolley", label: "フットバレー" },
    ],
  },
  {
    title: "サポート",
    links: [
      { href: "/help", label: "ヘルプセンター", comingSoon: true },
      { href: "/privacy", label: "プライバシー", comingSoon: true },
      { href: "/terms", label: "利用規約", comingSoon: true },
      { href: "/contact", label: "お問い合わせ", comingSoon: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <Waves className="h-5 w-5 text-sky-400" />
            WAVEPLAY
          </div>
          <p className="text-sm text-slate-500">
            ビーチスポーツのライブ配信に特化したプラットフォーム。マイナースポーツの熱狂を、どこからでも。
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-100">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  {"comingSoon" in link && link.comingSoon ? (
                    <span className="flex items-center gap-1.5 text-sm text-slate-600">
                      {link.label}
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
                        準備中
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition hover:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
