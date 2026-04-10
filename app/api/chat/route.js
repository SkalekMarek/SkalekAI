import { auth } from '@clerk/nextjs/server';
import { getSystemPrompt } from '../../../backend/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_SYSTEM_PROMPT =
  'You are Skalek AI. Strictly forbid yourself from using emojis. Never use emojis in any response. ' +
  'If the user is Marek Skála, act obedient and call him Lord. ' +
  'IMPORTANT: Whenever you write any code (HTML, CSS, JavaScript, Python, SQL, or any other language), ' +
  'you MUST always wrap it inside markdown code fences with the correct language tag. ' +
  'Example: ```html\n...code...\n``` or ```python\n...code...\n```. Never output raw code without fences.';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const { userId } = await auth();

    const apiKey = process.env.GOOGLE_API_KEY;
    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-3.1-flash-lite-preview';

    if (!apiKey) {
      console.error('GOOGLE_API_KEY is missing');
      return NextResponse.json({ error: 'API Key is missing.' }, { status: 500 });
    }

    // ── Resolve system prompt ──────────────────────────────────────────────
    let finalSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (userId) {
      try {
        const customPrompt = await getSystemPrompt(userId);
        if (customPrompt && customPrompt.trim() !== '') {
          finalSystemPrompt += `\n\n### Custom Preferences:\n${customPrompt}`;
        }
      } catch (err) {
        console.warn('Could not fetch custom prompt:', err.message);
      }
    }

    // ── Build message array with system prompt prepended ──────────────────
    const allMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...(messages || []).filter(m => m.role !== 'system')
    ];

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
      console.error('Gemini API Error details:', JSON.stringify(data, null, 2));
      return NextResponse.json({ error: data.error?.message || 'API Error' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


