/**
 * Single source of truth for brand / contact / API info.
 *
 * 所有页面、组件、邮件模板都从这里读。
 * 部署前只改 .env.local（或 Vercel env），不改代码。
 */
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "YourBrand";
const brandDomain = process.env.NEXT_PUBLIC_BRAND_DOMAIN || "yourdomain.com";
const salesEmail =
  process.env.NEXT_PUBLIC_SALES_EMAIL || `sales@${brandDomain}`;
const telegram = process.env.NEXT_PUBLIC_TELEGRAM || "@yourbrand_support";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || `https://api.${brandDomain}/v1`;

export const siteConfig = {
  name: brandName,
  fullName: `${brandName} API`,
  domain: brandDomain,
  description:
    "Unified LLM API for teams, resellers, and global builders. OpenAI-compatible.",
  tagline: "One API. Every model.",
  email: salesEmail,
  telegram,
  apiBaseUrl,

  // Stripe Payment Links —— Batch 2 生效，留空时 Pricing 按钮自动 fallback 到 /contact
  stripeLinks: {
    starter: process.env.NEXT_PUBLIC_STRIPE_LINK_STARTER || "",
    pro: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
