import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!chatId) return NextResponse.json({ error: 'Missing chatId' }, { status: 400 });

    // Verify chat belongs to user first
    const { data: chatData, error: chatError } = await supabaseAdmin
      .from('chats')
      .select('clerk_id')
      .eq('id', chatId)
      .single();

    if (chatError || chatData.clerk_id !== userId) {
      return NextResponse.json({ error: 'Chat not found or unauthorized' }, { status: 404 });
    }

    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Messages Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
