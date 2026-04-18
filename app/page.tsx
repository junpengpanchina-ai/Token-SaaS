import Link from "next/link";
import Hero from "@/components/sections/Hero";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ModelGrid from "@/components/sections/ModelGrid";
import UseCaseSection from "@/components/sections/UseCaseSection";
import CTASection from "@/components/sections/CTASection";
import Container from "@/components/layout/Container";
import { models } from "@/data/models";

export default function HomePage() {
  // 首页只展示头 6 个模型，引流到 /models
  const featured = models.slice(0, 6);

  return (
    <main>
      <Hero />
      <FeatureGrid />

      {/* Featured models 预览区 */}
      <section className="py-20 md:py-28">
        <Container width="wide">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:mb-14 md:flex-row md:items-end">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[44px]">
                Every model, one API.
              </h2>
              <p className="mt-3 max-w-[52ch] text-[15px] text-ink-secondary md:text-[17px]">
                Text, image, video, and embeddings — on OpenAI-compatible
                endpoints.
              </p>
            </div>
            <Link href="/models" className="link-apple">
              Browse all models
            </Link>
          </div>
          <ModelGrid models={featured} />
        </Container>
      </section>

      <UseCaseSection />
      <CTASection />
    </main>
  );
}
