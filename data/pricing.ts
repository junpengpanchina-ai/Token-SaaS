import type { PricingPlan } from "@/types/pricing";

/**
 * 三档方案口径：
 * - Starter  —— 给开发者 / 个人 / 早期测试（自助）
 * - Pro      —— 给团队 / 持续调用（自助或半人工）
 * - Channel  —— 给渠道 / 白标 / 定制（纯人工）
 *
 * ctaType=checkout 会尝试跳 Stripe Payment Link（env 未配置时自动 fallback 到 /contact）
 * ctaType=contact  直接跳 /contact?plan=xxx
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Starting from $29",
    priceNote: "per month",
    audience: "Developers & early testing",
    desc: "Small-volume access for individuals and prototypes.",
    features: [
      "OpenAI-compatible API",
      "Shared routing across top models",
      "Email support",
      "Pay-as-you-go top-ups",
    ],
    ctaType: "checkout",
    ctaLabel: "Get access",
  },
  {
    id: "pro",
    name: "Pro",
    price: "Starting from $99",
    priceNote: "per month",
    audience: "Teams & production use",
    desc: "Higher limits and priority access for teams shipping real products.",
    features: [
      "Priority routing",
      "Team billing & multi-key support",
      "Business support",
      "Flexible model mix",
    ],
    ctaType: "checkout",
    ctaLabel: "Get access",
    highlight: true,
  },
  {
    id: "channel",
    name: "Channel / Custom",
    price: "Custom pricing",
    audience: "Resellers, white-label & channel partners",
    desc: "Manual onboarding and custom deals for large or resale use cases.",
    features: [
      "Custom pricing",
      "Manual onboarding",
      "White-label options",
      "Dedicated contact",
    ],
    ctaType: "contact",
    ctaLabel: "Talk to sales",
  },
];
