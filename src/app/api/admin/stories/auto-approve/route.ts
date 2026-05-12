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
  return (
    pw === process.env.ADMIN_PASSWORD ||
    secret === process.env.ADMIN_SECRET
  );
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('pending_stories')
    .update({ status: 'approved' })
    .eq('status', 'pending')
    .gte('score', 8)
    .select('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ approved: data?.length ?? 0 });
}
