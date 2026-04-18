import Link from "next/link";
import Container from "@/components/layout/Container";

/**
 * Apple Jobs/Ive 风格 Hero：
 * - 一屏一件事
 * - 超大字，font-semibold（不是 bold）
 * - tracking 拧紧
 * - 居中、narrow container、呼吸给足
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pb-24 pt-28 md:pb-40 md:pt-36">
      <Container>
        <div className="text-center">
          <h1 className="mx-auto max-w-[20ch] text-display-sm font-semibold text-ink md:text-display-lg xl:text-display-xl">
            One API. Every model.
          </h1>

          <p className="mx-auto mt-6 max-w-[32ch] text-[17px] leading-[1.5] text-ink-secondary md:text-[21px] md:leading-[1.4]">
            A unified gateway for the world&apos;s leading AI models.
            <br className="hidden md:inline" />
            OpenAI-compatible. Built for teams, resellers, and global builders.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/register" className="btn-apple">
              Get API access
            </Link>
            <Link href="/docs" className="link-apple">
              Read the docs
            </Link>
          </div>

          <div className="mt-16 text-[12px] uppercase tracking-[0.18em] text-ink-tertiary">
            OpenAI · Anthropic · Google · DeepSeek · BFL
          </div>
        </div>
      </Container>

      {/* Apple 风格的极淡氛围光，0 颜色污染，只是让背景有一点点层次 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-to-b from-black/[0.02] to-transparent"
      />
    </section>
  );
}
