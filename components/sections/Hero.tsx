import Link from "next/link";
import Container from "@/components/layout/Container";

/**
 * Hero 任务：10 秒内让客户知道我们是干什么的。
 * - 一句话定位：Unified LLM API
 * - 主 CTA: Get API Access（走 /register）
 * - 次 CTA: Contact Sales（走 /contact）
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pb-24 pt-28 md:pb-40 md:pt-36">
      <Container>
        <div className="text-center">
          <h1 className="mx-auto max-w-[20ch] text-display-sm font-semibold text-ink md:text-display-lg xl:text-display-xl">
            One API. Every model.
          </h1>

          <p className="mx-auto mt-6 max-w-[36ch] text-[17px] leading-[1.5] text-ink-secondary md:text-[21px] md:leading-[1.4]">
            Unified LLM API for teams, resellers, and global builders.
            <br className="hidden md:inline" />
            OpenAI-compatible. Cheaper access to frontier models.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/register" className="btn-apple">
              Get API access
            </Link>
            <Link href="/contact" className="btn-apple-ghost">
              Contact sales
            </Link>
          </div>

          <div className="mt-16 text-[12px] uppercase tracking-[0.18em] text-ink-tertiary">
            OpenAI · Anthropic · Google · DeepSeek · BFL
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-black/[0.02] to-transparent"
      />
    </section>
  );
}
