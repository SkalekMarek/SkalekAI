export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Pulling the API Key from your specific Vercel Key
    const apiKey = process.env.GEMINI_3_1_FLASH_LITE;

    // Pulling the Model ID (defaulting to the lite-preview version)
    const modelId = process.env.GEMINI_MODEL_ID || 'gemini-3.1-flash-lite';

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
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}