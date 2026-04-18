"use client";

import Container from "@/components/layout/Container";

export default function CTASection() {
  return (
    <section className="pb-20 pt-8">
      <Container>
        <div className="rounded-[32px] border border-neutral-200 bg-neutral-50 px-8 py-10 text-center md:px-12 md:py-14">
          <h2 className="text-2xl font-semibold text-neutral-950 md:text-4xl">
            Ready to turn a working gateway into a real business front
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-600 md:text-base">
            V1 focuses on credibility, onboarding, and a sales-ready front stage.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white hover:opacity-90"
              onClick={() => console.log("TODO: start payment")}
            >
              Start with Access
            </button>

            <button
              className="rounded-2xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-white"
              onClick={() => console.log("TODO: talk to sales")}
            >
              Talk to Sales
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
