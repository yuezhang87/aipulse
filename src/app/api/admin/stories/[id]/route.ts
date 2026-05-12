import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function checkAuth(req: NextRequest) {
  const pw = req.headers.get('x-admin-password');
  const secret = req.headers.get('x-admin-secret');
  // Fall back through both env vars so a missing reload doesn't break auth
  const expectedPw =
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    'aipulse2026';
  console.log('[admin-api PATCH] x-admin-password received:', pw);
  console.log('[admin-api PATCH] ADMIN_PASSWORD env:', process.env.ADMIN_PASSWORD);
  console.log('[admin-api PATCH] match:', pw === expectedPw);
  return pw === expectedPw || secret === process.env.ADMIN_SECRET;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAuth(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.status !== undefined) updates.status = body.status;
  if (body.title !== undefined) updates.title = body.title;
  if (body.summary !== undefined) updates.summary = body.summary;
  if (body.content !== undefined) updates.content = body.content;
  if (body.spicy !== undefined) updates.spicy = body.spicy;

  const supabase = getSupabase();
  const { error } = await supabase
    .from('pending_stories')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
