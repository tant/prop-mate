const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGemini(prompt: string, apiKey: string) {
  if (!prompt || prompt.trim().length < 20) {
    throw new Error('Prompt is too short or empty. Not processing request.');
  }
  if (!apiKey) {
    throw new Error('Missing Gemini API key');
  }
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch from Gemini.');
  }
}
