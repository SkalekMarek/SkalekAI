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
      console.error('Save Prompt Error: Environment variables are missing or undefined');
      return NextResponse.json({ error: 'Database configuration missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error } = await supabaseAdmin.from('profiles').upsert(
      { clerk_id: userId, system_prompt: systemPrompt || null },
      { onConflict: 'clerk_id' }
    );

    if (error) {
      console.error('Supabase upsert error details:', error);
      return NextResponse.json({ error: error.message || 'Database rejection' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Fatal error in save-prompt route:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
