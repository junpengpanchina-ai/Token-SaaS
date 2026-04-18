import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/layout/Container";
import LeadForm from "@/components/forms/LeadForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Contact Sales — ${siteConfig.fullName}`,
  description:
    "Talk to our team about team plans, channel cooperation, white-label, or custom pricing.",
};

const topics = [
  {
    key: "team",
    label: "Team access",
    desc: "Multi-developer plans with shared billing.",
  },
  {
    key: "reseller",
    label: "Reseller",
    desc: "Upstream access for resellers and affiliate-style partners.",
  },
  {
    key: "whitelabel",
    label: "White-label",
    desc: "Run our gateway under your own brand.",
  },
  {
    key: "channel",
    label: "Channel cooperation",
    desc: "Volume-based custom pricing and dedicated onboarding.",
  },
];

export default function ContactPage() {
  return (
    <main className="py-20 md:py-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <h1 className="text-display-sm font-semibold tracking-tight text-ink md:text-display">
              Let&apos;s talk.
            </h1>
            <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.5] text-ink-secondary md:text-[18px]">
              Team access, channel cooperation, white-label, or custom
              pricing — we&apos;ll reply within one business day.
            </p>

            <div className="mt-10 space-y-3 text-[14px] text-ink-secondary">
              <div>
                <span className="text-ink-tertiary">Email · </span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-ink hover:opacity-70"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <span className="text-ink-tertiary">Telegram · </span>
                <span className="text-ink">{siteConfig.telegram}</span>
              </div>
              <div>
                <span className="text-ink-tertiary">Hours · </span>
                <span className="text-ink">Mon – Sun, async-first</span>
              </div>
            </div>

            <div className="mt-12">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-tertiary">
                What we can help with
              </div>
              <ul className="mt-4 space-y-3">
                {topics.map((t) => (
                  <li
                    key={t.key}
                    className="rounded-2xl border border-neutral-200 bg-white p-4"
                  >
                    <div className="text-[14px] font-medium text-ink">
                      {t.label}
                    </div>
                    <div className="mt-1 text-[13px] text-ink-secondary">
                      {t.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="rounded-3xl border border-neutral-200 bg-white p-7 text-sm text-ink-tertiary">
                Loading…
              </div>
            }
          >
            <LeadForm source="contact-page" />
          </Suspense>
        </div>
      </Container>
    </main>
  );
}
