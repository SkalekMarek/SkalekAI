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

    // 1. Try to fetch the existing row ID first, or just attempt an UPDATE based on clerk_id.
    // We avoid upsert because the 'id' column likely has a foreign key to auth.users which 
    // we aren't using (since we use Clerk).
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('clerk_id')
      .eq('clerk_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking existence:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 400 });
    }

    if (!existing) {
      // If the row doesn't exist, we MUST insert. 
      // But we will hit the profiles_id_fkey error if we don't have an auth.users entry.
      // We'll try a minimal insert and catch the specific foreign key error if it happens.
      const { error: insertError } = await supabaseAdmin.from('profiles').insert({
        clerk_id: userId,
        system_prompt: systemPrompt || null
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        if (insertError.message.includes('foreign key constraint')) {
          return NextResponse.json({ 
            error: 'Database Sync Error: Please go to Supabase SQL Editor and run: ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;' 
          }, { status: 400 });
        }
        return NextResponse.json({ error: insertError.message }, { status: 400 });
      }
    } else {
      // Row exists, just update the prompt. This avoids the 'id' constraint entirely.
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ system_prompt: systemPrompt || null })
        .eq('clerk_id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Fatal error in save-prompt route:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
