import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const { secret } = await searchParams;
  if (!secret || secret !== process.env.ADMIN_SECRET) return notFound();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from("pending_stories")
    .select("id, title, slug, summary, category, score, source, created_at, status")
    .eq("status", "pending")
    .order("score", { ascending: false })
    .order("created_at", { ascending: false });

  return <AdminPanel initialStories={data ?? []} adminSecret={secret} />;
}
