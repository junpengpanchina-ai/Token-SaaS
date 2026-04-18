import Link from "next/link";
import Container from "@/components/layout/Container";

/**
 * 首页底部 CTA：主 Get API Access（注册），次 Contact Sales（留资）。
 * 与 Hero 的 CTA 口径完全一致。
 */
export default function CTASection() {
  return (
    <section className="pb-20 pt-8">
      <Container>
        <div className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-8 py-10 text-center md:px-12 md:py-14">
          <h2 className="text-2xl font-semibold text-neutral-950 md:text-4xl">
            Start with access. Scale with a plan.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
            Sign up to get an API key. Talk to sales for team plans, custom
            pricing, or channel cooperation.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register" className="btn-apple">
              Get API access
            </Link>
            <Link href="/contact" className="btn-apple-ghost">
              Contact sales
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
