import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Apple-style navbar（Server Component）：
 * - 48px 高
 * - 厚 blur + 半透明
 * - 根据 Supabase session 切换右上角的 CTA
 */
export default async function Navbar() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-divider/60 bg-bg/72 backdrop-blur-nav">
      <nav className="mx-auto flex h-12 max-w-apple-wide items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-ink"
        >
          YourBrand
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/models"
            className="text-[13px] text-ink/85 transition-opacity hover:opacity-60"
          >
            Models
          </Link>
          <Link
            href="/pricing"
            className="text-[13px] text-ink/85 transition-opacity hover:opacity-60"
          >
            Pricing
          </Link>
          <Link
            href="/docs"
            className="text-[13px] text-ink/85 transition-opacity hover:opacity-60"
          >
            Docs
          </Link>
          <Link
            href="/contact"
            className="text-[13px] text-ink/85 transition-opacity hover:opacity-60"
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden text-[13px] text-ink/85 transition-opacity hover:opacity-60 sm:inline-flex"
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="btn-apple !px-4 !py-1.5 !text-[13px]"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] text-ink/85 transition-opacity hover:opacity-60 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-apple !px-4 !py-1.5 !text-[13px]"
              >
                Get access
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
