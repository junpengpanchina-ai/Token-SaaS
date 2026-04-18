import PricingCards from "@/components/sections/PricingCards";
import Container from "@/components/layout/Container";

export default function PricingPage() {
  return (
    <main className="py-16 md:py-20">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-semibold md:text-5xl">Pricing</h1>
          <p className="mt-4 max-w-2xl text-neutral-600">
            V1 pricing is designed for teams, resellers, and channel partners.
          </p>
        </div>
        <PricingCards />
      </Container>
    </main>
  );
}
