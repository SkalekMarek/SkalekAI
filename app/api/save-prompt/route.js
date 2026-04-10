import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { systemPrompt } = await req.json();

    // Use Service Role key to bypass Row Level Security since Clerk manages our Auth, not Supabase
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json({ error: 'Database environment variables missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error } = await supabaseAdmin.from('profiles').upsert(
      { clerk_id: userId, system_prompt: systemPrompt || null },
      { onConflict: 'clerk_id' }
    );

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving prompt:', err);
    return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 });
  }
}
