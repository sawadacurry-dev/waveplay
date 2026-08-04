import Link from "next/link";
import { Waves } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "サービス",
    links: [
      { href: "/", label: "ライブ中継" },
      { href: "/archive", label: "アーカイブ" },
      { href: "/tournaments", label: "大会情報" },
      { href: "/players", label: "選手プロフィール" },
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
      { href: "/help", label: "ヘルプセンター" },
      { href: "/privacy", label: "プライバシー" },
      { href: "/terms", label: "利用規約" },
      { href: "/contact", label: "お問い合わせ" },
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
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 transition hover:text-slate-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
