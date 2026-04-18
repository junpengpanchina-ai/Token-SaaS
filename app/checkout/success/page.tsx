import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Payment received",
};

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { plan?: string };
}) {
  const plan = searchParams?.plan;

  return (
    <main className="py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center md:p-12">
          <Badge tone="success">Payment received</Badge>
          <h1 className="mt-5 text-[30px] font-semibold tracking-tight text-emerald-950 md:text-[36px]">
            Thanks for subscribing{plan ? ` to ${capitalize(plan)}` : ""}.
          </h1>
          <p className="mx-auto mt-4 max-w-[50ch] text-[15px] leading-6 text-emerald-900 md:text-[16px]">
            Our team will review and activate your account within one business
            day. You&apos;ll receive your API key and base URL by email.
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-white p-5 text-left text-[13px] leading-6 text-ink">
            <div className="font-semibold text-ink">What happens next</div>
            <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-ink-secondary">
              <li>We verify payment and provision your key.</li>
              <li>You receive an activation email with the key + docs link.</li>
              <li>
                Your dashboard updates from{" "}
                <span className="font-medium text-ink">Pending</span> to{" "}
                <span className="font-medium text-ink">Active</span>.
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className="btn-apple">
              Go to dashboard
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="link-apple text-emerald-900"
            >
              Need help? Email {siteConfig.email}
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
