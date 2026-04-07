export default async function handler(req, res) {
    // Security check to only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const { messages } = req.body;
  
      // This calls Gemini using the new key
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer AIzaSyCsgBX0MAP9FjwwknCnUVuPgsjizWIbQFc`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-3.1-flash-lite',
          messages: messages,
        }),
      });
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Server Error' });
    }
  }