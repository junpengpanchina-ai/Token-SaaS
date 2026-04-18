import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/dashboard");

  const name =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email;

  return (
    <main className="py-16 md:py-20">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-white p-8">
          <h1 className="text-2xl font-semibold">Welcome, {name}</h1>
          <p className="mt-3 text-sm text-ink-secondary">
            User ID: <code className="font-mono">{user.id}</code>
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Email: <code className="font-mono">{user.email}</code>
          </p>

          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-[13px] font-medium text-ink transition hover:bg-neutral-50"
            >
              Sign out
            </button>
          </form>

          <p className="mt-8 text-sm text-ink-secondary">
            V1 占位 —— API keys、用量、账单会接到这里。
          </p>
        </div>
      </Container>
    </main>
  );
}
