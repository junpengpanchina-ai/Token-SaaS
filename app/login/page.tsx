import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchParams = { next?: string; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 已登录就直接跳 dashboard，没必要再看登录页
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(searchParams?.next || "/dashboard");

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

            <div className="mt-6">
              <GoogleSignInButton next={searchParams?.next || "/dashboard"} />
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
