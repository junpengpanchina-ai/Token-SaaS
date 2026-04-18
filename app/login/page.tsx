import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { getSession } from "@/lib/auth/session";
import { siteConfig } from "@/data/site";

type SearchParams = { next?: string; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user, mode } = await getSession();
  if (user) redirect(searchParams?.next || "/dashboard");

  const demoMode = mode === "demo";

  return (
    <main className="py-20 md:py-28">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-[26px] font-semibold tracking-tight text-ink">
              Sign in
            </h1>
            <p className="mt-2 text-[14px] text-ink-secondary">
              Use your Google account to continue.
            </p>

            {searchParams?.error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">
                {searchParams.error}
              </p>
            )}

            {demoMode ? (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[12.5px] leading-5 text-amber-900">
                Preview mode — auth is not connected here. You can still{" "}
                <Link href="/dashboard" className="font-medium underline">
                  preview the dashboard
                </Link>{" "}
                or{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium underline"
                >
                  email sales
                </a>
                .
              </div>
            ) : null}

            <div className="mt-6">
              <GoogleSignInButton
                next={searchParams?.next || "/dashboard"}
                disabled={demoMode}
              />
            </div>

            <p className="mt-6 text-center text-[13px] text-ink-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="link-apple">
                Get access
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
