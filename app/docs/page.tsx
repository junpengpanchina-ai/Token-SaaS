import Container from "@/components/layout/Container";

export default function DocsPage() {
  return (
    <main className="py-16 md:py-20">
      <Container>
        <h1 className="text-3xl font-semibold md:text-5xl">Docs</h1>
        <div className="mt-8 space-y-6 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <div>
            <h2 className="text-lg font-semibold">Base URL</h2>
            <p className="mt-2 font-mono text-sm text-neutral-700">
              https://api.yourdomain.com/v1
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-neutral-600">
              Use your API key in the Authorization header.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">cURL Example</h2>
            <pre className="mt-2 overflow-x-auto rounded-2xl bg-white p-4 text-sm text-neutral-700">
{`curl https://api.yourdomain.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'`}
            </pre>
          </div>
        </div>
      </Container>
    </main>
  );
}
