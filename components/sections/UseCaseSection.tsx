import Container from "@/components/layout/Container";

const useCases = [
  "Resellers who need cheaper upstream access",
  "Teams that want unified LLM API integration",
  "Developers using OpenAI-compatible workflows",
  "White-label and channel partners",
];

export default function UseCaseSection() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-10 rounded-[32px] border border-neutral-200 bg-neutral-950 px-8 py-10 text-white md:grid-cols-2 md:px-12 md:py-14">
          <div>
            <div className="text-sm font-medium text-neutral-300">Who is this for</div>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              A practical V1 front stage for your API business
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300 md:text-base">
              You are building a credible front stage on top of a working gateway.
            </p>
          </div>

          <div className="space-y-4">
            {useCases.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-neutral-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
