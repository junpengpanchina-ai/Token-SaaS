import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Docs — ${siteConfig.fullName}`,
  description:
    "OpenAI-compatible API docs. Base URL, authentication, and example requests in curl and Python.",
};

export default function DocsPage() {
  const base = siteConfig.apiBaseUrl;

  const curlSample = `curl ${base}/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`;

  const pythonSample = `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${base}",
)

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)`;

  return (
    <main className="py-20 md:py-28">
      <Container>
        {/* Hero */}
        <div className="max-w-3xl">
          <div className="mb-4 flex items-center gap-2">
            <Badge tone="info">OpenAI-compatible</Badge>
            <Badge tone="neutral">v1</Badge>
          </div>
          <h1 className="text-display-sm font-semibold tracking-tight text-ink md:text-display">
            Quickstart
          </h1>
          <p className="mt-5 max-w-[60ch] text-[16px] leading-[1.5] text-ink-secondary md:text-[18px]">
            {siteConfig.fullName} exposes OpenAI-compatible endpoints. If you
            already use the OpenAI SDK, switch one string and you&apos;re
            done.
          </p>
        </div>

        {/* Content */}
        <div className="mt-14 grid gap-10 md:grid-cols-[220px_1fr]">
          {/* Left nav */}
          <aside className="hidden md:block">
            <nav className="sticky top-20 space-y-1 text-[13px]">
              <DocLink href="#base-url">Base URL</DocLink>
              <DocLink href="#auth">Authentication</DocLink>
              <DocLink href="#curl">Example · curl</DocLink>
              <DocLink href="#python">Example · Python</DocLink>
              <DocLink href="#compat">OpenAI compatibility</DocLink>
              <DocLink href="#next">Next steps</DocLink>
            </nav>
          </aside>

          {/* Main */}
          <div className="space-y-12">
            <Section id="base-url" title="Base URL">
              <p>
                All requests go through a single gateway. The path layout
                mirrors OpenAI&apos;s REST API.
              </p>
              <CodeBlock>{base}</CodeBlock>
            </Section>

            <Section id="auth" title="Authentication">
              <p>
                Pass your API key via the <Code>Authorization</Code> header. Keys
                are issued after account review — see{" "}
                <Link href="/pricing" className="link-apple">
                  Pricing
                </Link>
                .
              </p>
              <CodeBlock>Authorization: Bearer YOUR_API_KEY</CodeBlock>
            </Section>

            <Section id="curl" title="Example · curl">
              <CodeBlock>{curlSample}</CodeBlock>
            </Section>

            <Section id="python" title="Example · Python">
              <p>
                Works with the official <Code>openai</Code> SDK. Point{" "}
                <Code>base_url</Code> at our gateway:
              </p>
              <CodeBlock>{pythonSample}</CodeBlock>
            </Section>

            <Section id="compat" title="OpenAI compatibility">
              <p>
                We implement the OpenAI REST contract for the following
                endpoint families:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-secondary">
                <li>
                  <Code>/v1/chat/completions</Code> — text + vision models
                </li>
                <li>
                  <Code>/v1/images/generations</Code> — image models
                </li>
                <li>
                  <Code>/v1/videos/generations</Code> — video models (preview
                  on some providers)
                </li>
                <li>
                  <Code>/v1/embeddings</Code> — embedding models
                </li>
              </ul>
              <p className="mt-3">
                Streaming, tool calls, and JSON mode follow the OpenAI spec
                where the upstream provider supports them.
              </p>
            </Section>

            <Section id="next" title="Next steps">
              <div className="flex flex-wrap gap-3">
                <Link href="/models" className="btn-apple-ghost">
                  Browse models
                </Link>
                <Link href="/pricing" className="btn-apple-ghost">
                  View pricing
                </Link>
                <Link href="/contact" className="btn-apple">
                  Contact sales
                </Link>
              </div>
              <p className="mt-6 text-[13px] text-ink-tertiary">
                Access is activated after a short review. Full SDK reference
                and per-model guides are rolling out.
              </p>
            </Section>
          </div>
        </div>
      </Container>
    </main>
  );
}

/* ========== 小零件 ========== */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[22px] font-semibold tracking-tight text-ink md:text-[26px]">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[14px] leading-6 text-ink-secondary md:text-[15px]">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-2xl border border-ink-divider/60 bg-ink-faint p-4 font-mono text-[12.5px] leading-[1.55] text-ink md:text-[13px]">
      {children}
    </pre>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-ink-faint px-1.5 py-0.5 font-mono text-[12.5px] text-ink">
      {children}
    </code>
  );
}

function DocLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="block rounded-md px-3 py-1.5 text-ink-secondary transition-colors hover:bg-ink-faint hover:text-ink"
    >
      {children}
    </a>
  );
}
