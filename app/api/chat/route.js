import { auth } from '@clerk/nextjs/server';
import { getSystemPrompt } from '../../../backend/db';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { messages, chatId } = await req.json();
    const { userId } = await auth();

    const apiKey = process.env.GOOGLE_API_KEY;
    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-3.1-flash-lite-preview';

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing.' }, { status: 500 });
    }

    let activeChatId = chatId;

    // ── Manage Chat Session ────────────────────────────────────────────────
    if (userId) {
      if (!activeChatId) {
        // Create a new chat session
        const { data: newChat, error: chatError } = await supabaseAdmin
          .from('chats')
          .insert({ clerk_id: userId, title: 'New Chat' })
          .select()
          .single();
        if (chatError) throw chatError;
        activeChatId = newChat.id;
      }

      // Save user message to DB
      const latestUserMsg = messages[messages.length - 1];
      await supabaseAdmin.from('chat_messages').insert({
        chat_id: activeChatId,
        role: 'user',
        content: latestUserMsg.content
      });
    }

    // ── Resolve system prompt ──────────────────────────────────────────────
    const coreSystemPrompt = `You are Skalek AI, an advanced programming assistant.
Always use markdown code blocks with language identifiers. Be helpful and precise.`;

    let finalSystemPrompt = coreSystemPrompt;
    if (userId) {
      const customPrompt = await getSystemPrompt(userId);
      if (customPrompt) finalSystemPrompt += `\n\n### Custom Preferences:\n${customPrompt}`;
    }

    const allMessages = (messages || []).filter(m => m.role !== 'system');
    allMessages.unshift({ role: 'system', content: finalSystemPrompt });

    // ── Call Gemini ────────────────────────────────────────────────────────
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelId, messages: allMessages }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return NextResponse.json({ error: data.error?.message || 'API Error' }, { status: response.status });
    }

    const aiMessageContent = data.choices[0].message.content;

    // ── Persist AI Message & Auto-Title ──────────────────────────────────
    if (userId && activeChatId) {
      await supabaseAdmin.from('chat_messages').insert({
        chat_id: activeChatId,
        role: 'assistant',
        content: aiMessageContent
      });

      // Auto-title logic if it's the first message
      if (messages.length <= 1) {
        // Just use the first 5 words of user prompt as title for now
        const firstMsg = messages[0].content;
        const title = firstMsg.split(' ').slice(0, 5).join(' ') + (firstMsg.split(' ').length > 5 ? '...' : '');
        await supabaseAdmin.from('chats').update({ title }).eq('id', activeChatId);
      }
    }

    return NextResponse.json({ ...data, chatId: activeChatId });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
