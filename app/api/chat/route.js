import { auth } from '@clerk/nextjs/server';
import { getSystemPrompt } from '../../../backend/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-3.1-flash-lite-preview';

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is missing in environment settings.' }, { status: 500 });
    }

    // ── Resolve system prompt ──────────────────────────────────────────────
    let systemPrompt = '';

    // Verify Clerk Auth natively
    const { userId } = await auth();

    if (userId) {
      try {
        const customPrompt = await getSystemPrompt(userId);
        if (customPrompt) {
          systemPrompt = customPrompt;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, using default prompt:', err.message);
      }
    }

    // ── Build message array with system prompt prepended ──────────────────
    const allMessages = (messages || []).filter(m => m.role !== 'system');
    if (systemPrompt) {
      allMessages.unshift({ role: 'system', content: systemPrompt });
    }

    // ── Call Gemini via OpenAI-compatible endpoint ─────────────────────────
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
      return NextResponse.json({
        error: data.error?.message || 'Gemini API rejected the request.',
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
