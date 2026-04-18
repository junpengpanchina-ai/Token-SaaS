"use client";

import { pricingPlans } from "@/data/pricing";

export default function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {pricingPlans.map((plan) => (
        <div
          key={plan.name}
          className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="text-lg font-semibold text-neutral-900">{plan.name}</div>
          <div className="mt-2 text-3xl font-semibold">{plan.price}</div>
          <p className="mt-3 text-sm text-neutral-600">{plan.desc}</p>

          <ul className="mt-6 space-y-3 text-sm text-neutral-600">
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>

          <button
            className="mt-8 w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white hover:opacity-90"
            onClick={() => console.log(`TODO: checkout ${plan.name}`)}
          >
            Choose {plan.name}
          </button>
        </div>
      ))}
    </div>
  );
}
