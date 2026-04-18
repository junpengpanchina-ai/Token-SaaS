export type PlanId = "starter" | "pro" | "channel";

export type CtaType = "checkout" | "contact";

export type PricingPlan = {
  id: PlanId;
  name: string;
  price: string;
  priceNote?: string;
  audience: string;
  desc: string;
  features: string[];
  ctaType: CtaType;
  ctaLabel: string;
  highlight?: boolean;
};
