"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { PLANS } from "@/types/user";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PricingTable() {
  const { user } = useAuth();
  const router = useRouter();

  function handleSelect(planId: string) {
    const target = `/checkout?plan=${planId}`;
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    router.push(target);
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "flex flex-col p-8 text-left",
            plan.highlighted && "border-sky-500/40 ring-1 ring-sky-500/20"
          )}
        >
          {plan.highlighted && (
            <span className="mb-3 w-fit rounded-full bg-sky-500/15 px-2.5 py-1 text-xs font-semibold text-sky-400 ring-1 ring-inset ring-sky-500/30">
              おすすめ
            </span>
          )}

          <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
          <p className="mb-4 text-sm text-slate-500">{plan.description}</p>

          <p className="mb-6">
            <span className="text-3xl font-black text-slate-100">
              ¥{plan.priceMonthly.toLocaleString()}
            </span>
            <span className="text-sm text-slate-500"> / 月(税込)</span>
          </p>

          <ul className="mb-8 flex-1 space-y-2.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            onClick={() => handleSelect(plan.id)}
            variant={plan.highlighted ? "primary" : "secondary"}
            className="w-full justify-center"
          >
            このプランを選ぶ
          </Button>
        </Card>
      ))}
    </div>
  );
}
