export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    // Check for standard API Key names
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    // Defaulting to the Gemini 1.5 Flash if ID is missing
    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-1.5-flash';

    if (!apiKey) {
      return res.status(500).json({ error: 'API Key is missing in Vercel settings' });
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || 'Gemini API rejected the request.'
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
