import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Payment cancelled",
};

export default function CheckoutCancelPage() {
  return (
    <main className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-neutral-200 bg-neutral-50 p-10 text-center md:p-12">
          <Badge tone="neutral">Payment not completed</Badge>
          <h1 className="mt-5 text-[30px] font-semibold tracking-tight text-ink md:text-[36px]">
            No charge was made.
          </h1>
          <p className="mx-auto mt-4 max-w-[50ch] text-[15px] leading-6 text-ink-secondary md:text-[16px]">
            You cancelled the checkout. You can try again or reach out to our
            team if you&apos;d like a different payment method or a custom
            plan.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pricing" className="btn-apple">
              Back to pricing
            </Link>
            <Link href="/contact" className="btn-apple-ghost">
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
