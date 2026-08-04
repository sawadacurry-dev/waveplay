"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function HeaderAuthArea() {
  const { user, isLoading } = useAuth();

  // 初回読み込み中はレイアウトシフトを避けるため、ログイン済みボタンと
  // 同じサイズのプレースホルダーを表示しておく
  if (isLoading) {
    return <div className="h-9 w-9 rounded-full bg-white/5" />;
  }

  if (user) {
    return (
      <Link
        href="/account"
        aria-label="マイアカウント"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-sm font-bold text-sky-300 ring-1 ring-inset ring-sky-500/30 transition hover:bg-sky-500/30"
      >
        {user.avatarInitial}
      </Link>
    );
  }

  return (
    <Link href="/login">
      <Button className="hidden sm:inline-flex">視聴登録</Button>
    </Link>
  );
}
