import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing messages array' });
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: error.error?.message || 'OpenAI API error' });
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
} 