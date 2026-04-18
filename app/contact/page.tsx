import Container from "@/components/layout/Container";
import LeadForm from "@/components/forms/LeadForm";

export default function ContactPage() {
  return (
    <main className="py-16 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold md:text-5xl">Contact Sales</h1>
            <p className="mt-4 max-w-xl text-neutral-600">
              For reseller, team, white-label, and channel cooperation.
            </p>

            <div className="mt-8 space-y-3 text-sm text-neutral-600">
              <p>Email: sales@yourdomain.com</p>
              <p>Telegram: @yourbrand_support</p>
              <p>Business hours: Mon - Sun</p>
            </div>
          </div>

          <LeadForm />
        </div>
      </Container>
    </main>
  );
}
