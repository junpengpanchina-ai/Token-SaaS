import Link from "next/link";
import Container from "@/components/layout/Container";

/**
 * Apple-style footer:
 * - 顶部一条细分隔
 * - 字号压到 12px
 * - 列间距大，呼吸给足
 * - 底部版权细小、次级色
 */
export default function Footer() {
  return (
    <footer className="mt-32 border-t border-ink-divider/60 bg-bg">
      <Container width="wide">
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="text-[13px] font-semibold text-ink">YourBrand</div>
            <p className="mt-3 text-[12px] leading-5 text-ink-secondary">
              One API. Every model.
            </p>
          </div>

          <FooterCol title="Product">
            <FooterLink href="/models">Models</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/docs">Docs</FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/contact?topic=channel">Channel</FooterLink>
            <FooterLink href="/contact?topic=whitelabel">White label</FooterLink>
          </FooterCol>

          <FooterCol title="Account">
            <FooterLink href="/login">Sign in</FooterLink>
            <FooterLink href="/register">Get access</FooterLink>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
          </FooterCol>
        </div>

        <div className="flex flex-col gap-2 border-t border-ink-divider/60 py-5 text-[11px] text-ink-tertiary md:flex-row md:items-center md:justify-between">
          <p>Copyright © {new Date().getFullYear()} YourBrand. All rights reserved.</p>
          <p>sales@yourdomain.com</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[12px] font-semibold text-ink">{title}</div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block text-[12px] text-ink-secondary transition-opacity hover:opacity-60"
    >
      {children}
    </Link>
  );
}
