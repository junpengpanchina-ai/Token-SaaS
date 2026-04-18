import Container from "@/components/layout/Container";
import { features } from "@/data/features";

export default function FeatureGrid() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 text-lg font-semibold text-neutral-900">
                {item.title}
              </div>
              <p className="text-sm leading-6 text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
