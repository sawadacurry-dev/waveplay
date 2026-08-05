import Link from "next/link";

/**
 * トップページの各セクション見出し。
 * 左にアクセントバーを立てて、セクションの切れ目を分かりやすくする。
 */
export function SectionHeading({
  title,
  description,
  moreHref,
  moreLabel = "すべて見る",
}: {
  title: string;
  description?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
      <div className="flex gap-3">
        <span
          aria-hidden
          className="mt-1 w-1 shrink-0 rounded-full bg-gradient-to-b from-sky-400 to-sky-600"
        />
        <div>
          <h2 className="text-xl font-bold text-slate-100">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {moreHref && (
        <Link
          href={moreHref}
          className="rounded text-sm text-sky-400 transition hover:text-sky-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          {moreLabel} &rsaquo;
        </Link>
      )}
    </div>
  );
}
