"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PLANS } from "@/types/user";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function AccountView() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="h-40 animate-pulse rounded-xl bg-white/5" />;
  }

  const currentPlan = PLANS.find((p) => p.id === user.planId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-500/20 text-2xl font-bold text-sky-300 ring-1 ring-inset ring-sky-500/30">
          {user.avatarInitial}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">{user.name}</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
          <CreditCard className="h-4 w-4" />
          契約プラン
        </h2>

        {currentPlan ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-100">{currentPlan.name}</p>
              <p className="text-sm text-slate-500">
                月額 ¥{currentPlan.priceMonthly.toLocaleString()}
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="secondary">プランを変更</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">現在、有料プランには加入していません</p>
            <Link href="/pricing">
              <Button>プランを見る</Button>
            </Link>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
          <UserIcon className="h-4 w-4" />
          アカウント情報
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">メールアドレス</dt>
            <dd className="text-slate-300">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">ユーザーID</dt>
            <dd className="text-slate-300">{user.id}</dd>
          </div>
        </dl>
      </Card>

      <button
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-red-400"
      >
        <LogOut className="h-4 w-4" />
        ログアウト
      </button>
    </div>
  );
}
