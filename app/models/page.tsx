import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ModelGrid from "@/components/sections/ModelGrid";
import { models } from "@/data/models";
import type { ModelCategory } from "@/types/model";

export const metadata: Metadata = {
  title: "Models — YourBrand",
  description:
    "Every leading AI model through one OpenAI-compatible API. Text, image, video, embeddings.",
};

const CATEGORY_ORDER: { key: ModelCategory; label: string; blurb: string }[] = [
  {
    key: "text",
    label: "Text",
    blurb: "Frontier reasoning, coding, and long-context models.",
  },
  {
    key: "image",
    label: "Image",
    blurb: "High-fidelity text-to-image and image-to-image generation.",
  },
  {
    key: "video",
    label: "Video",
    blurb: "Production-ready video generation. More models rolling out.",
  },
  {
    key: "embedding",
    label: "Embeddings",
    blurb: "Vector models for RAG, search, and semantic clustering.",
  },
];

export default function ModelsPage() {
  const grouped = new Map<ModelCategory, typeof models>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat.key, []);
  for (const m of models) {
    if (!grouped.has(m.category)) grouped.set(m.category, []);
    grouped.get(m.category)!.push(m);
  }

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="pb-10 pt-24 md:pb-16 md:pt-32">
        <Container>
          <div className="text-center">
            <h1 className="text-display-sm font-semibold tracking-tight text-ink md:text-display">
              Every leading model,
              <br />
              one API.
            </h1>
            <p className="mx-auto mt-6 max-w-[52ch] text-[17px] leading-[1.5] text-ink-secondary md:text-[19px] md:leading-[1.4]">
              Drop-in OpenAI-compatible endpoints. Switch providers by changing
              a single string. Priced transparently, per token or per call.
            </p>
          </div>
        </Container>
      </section>

      {/* ===== Category nav ===== */}
      <section className="sticky top-12 z-30 -mx-0 border-y border-ink-divider/60 bg-bg/80 backdrop-blur-nav">
        <Container width="wide">
          <nav className="flex items-center justify-center gap-1 py-3 md:gap-2">
            {CATEGORY_ORDER.map((cat) => {
              const count = grouped.get(cat.key)?.length ?? 0;
              if (count === 0) return null;
              return (
                <a
                  key={cat.key}
                  href={`#${cat.key}`}
                  className="group flex items-center gap-2 rounded-full px-4 py-2 text-[13px] text-ink-secondary transition-all duration-200 ease-apple hover:bg-black/[0.04] hover:text-ink"
                >
                  <span>{cat.label}</span>
                  <span className="font-mono text-[11px] text-ink-tertiary transition-colors group-hover:text-ink-secondary">
                    {count}
                  </span>
                </a>
              );
            })}
          </nav>
        </Container>
      </section>

      {/* ===== Category sections ===== */}
      <div className="pb-32 pt-16 md:pt-24">
        <Container width="wide">
          <div className="space-y-24 md:space-y-32">
            {CATEGORY_ORDER.map((cat) => {
              const list = grouped.get(cat.key);
              if (!list || list.length === 0) return null;
              return (
                <section
                  key={cat.key}
                  id={cat.key}
                  className="scroll-mt-32"
                >
                  <div className="mb-8 flex items-end justify-between border-b border-ink-divider/60 pb-5">
                    <div>
                      <h2 className="text-[28px] font-semibold tracking-tight text-ink md:text-[32px]">
                        {cat.label}
                      </h2>
                      <p className="mt-1 text-[14px] text-ink-secondary">
                        {cat.blurb}
                      </p>
                    </div>
                    <div className="hidden text-right md:block">
                      <div className="font-mono text-[28px] font-medium text-ink">
                        {list.length}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-tertiary">
                        Models
                      </div>
                    </div>
                  </div>

                  <ModelGrid models={list} />
                </section>
              );
            })}
          </div>
        </Container>
      </div>
    </main>
  );
}
