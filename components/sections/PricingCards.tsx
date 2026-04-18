"use client";

import Link from "next/link";
import { pricingPlans } from "@/data/pricing";
import { siteConfig } from "@/data/site";
import Badge from "@/components/ui/Badge";
import type { PricingPlan } from "@/types/pricing";

/**
 * 决定每个 plan 的跳转地址。
 * - checkout 档：优先 Stripe Payment Link；没配 env 就回退到 /contact?plan=xxx（不让按钮失效）
 * - contact 档：始终走 /contact?plan=xxx
 */
function resolveHref(plan: PricingPlan): {
  href: string;
  external: boolean;
  note?: string;
} {
  if (plan.ctaType === "checkout") {
    const link =
      plan.id === "starter"
        ? siteConfig.stripeLinks.starter
        : plan.id === "pro"
        ? siteConfig.stripeLinks.pro
        : "";
    if (link) {
      return { href: link, external: true };
    }
    return {
      href: `/contact?plan=${plan.id}`,
      external: false,
      note: "Checkout opens soon — contact sales to get activated now.",
    };
  }
  return { href: `/contact?plan=${plan.id}`, external: false };
}

export default function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {pricingPlans.map((plan) => {
        const { href, external, note } = resolveHref(plan);
        return (
          <div
            key={plan.id}
            className={`flex flex-col rounded-3xl border bg-white p-7 shadow-sm transition ${
              plan.highlight
                ? "border-ink ring-1 ring-ink/10"
                : "border-neutral-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-ink">{plan.name}</div>
              {plan.highlight ? (
                <Badge tone="dark">Recommended</Badge>
              ) : null}
            </div>

            <div className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-tertiary">
              {plan.audience}
            </div>

            <div className="mt-5 flex items-baseline gap-1.5">
              <div className="text-[28px] font-semibold tracking-tight text-ink">
                {plan.price}
              </div>
              {plan.priceNote ? (
                <div className="text-[13px] text-ink-tertiary">
                  {plan.priceNote}
                </div>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-6 text-ink-secondary">
              {plan.desc}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-ink-secondary">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-[7px] inline-block h-1 w-1 rounded-full bg-ink-tertiary"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    plan.highlight ? "btn-apple w-full" : "btn-apple-ghost w-full"
                  }
                >
                  {plan.ctaLabel}
                </a>
              ) : (
                <Link
                  href={href}
                  className={
                    plan.highlight ? "btn-apple w-full" : "btn-apple-ghost w-full"
                  }
                >
                  {plan.ctaLabel}
                </Link>
              )}
              {note ? (
                <p className="mt-3 text-center text-[11px] leading-4 text-ink-tertiary">
                  {note}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
