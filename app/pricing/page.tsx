import type { Metadata } from "next";
import Link from "next/link";
import PricingCards from "@/components/sections/PricingCards";
import Container from "@/components/layout/Container";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Pricing — ${siteConfig.fullName}`,
  description:
    "Simple plans for developers, teams, and channel partners. OpenAI-compatible API with manual or self-serve onboarding.",
};

export default function PricingPage() {
  return (
    <main className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-display-sm font-semibold tracking-tight text-ink md:text-display">
            Pricing that fits how you ship.
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[16px] leading-[1.5] text-ink-secondary md:text-[18px]">
            Self-serve for individuals and teams. Custom deals for resellers
            and channel partners. Access is activated after a short review.
          </p>
        </div>

        <div className="mt-14 md:mt-16">
          <PricingCards />
        </div>

        <div className="mt-20 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center md:p-10">
          <div className="text-sm font-medium text-ink">
            Not sure which plan fits?
          </div>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink-secondary">
            Tell us what you&apos;re building and expected volume. We&apos;ll
            reply with the best fit, usually within one business day.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-apple">
              Contact sales
            </Link>
            <a href={`mailto:${siteConfig.email}`} className="link-apple">
              Email {siteConfig.email}
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
