import { GoogleGenAI } from '@google/genai';
import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  const { questionText, topic, format, options } = await req.json().catch(() => ({}));
  try {
    const ai = new GoogleGenAI({});

    const prompt = `You are a supportive AI Quiz Game Proctor.
A student is stuck on this question in an Artificial Intelligence exam quiz:
Question: "${questionText}"
Topic: "${topic}"
Format: "${format}"
Options: ${JSON.stringify(options || [])}

Provide a smart, gentle hint (1 to 2 sentences) that nudges their reasoning without directly giving away the letter or exact final answer. Be concise and sharp.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return Response.json({
      hint: response.text?.trim() || 'Focus on the operational definition given in the lecture.',
      isFallback: false,
    });
  } catch (err) {
    console.error('Gemini hint error:', err);
    return Response.json({
      hint: 'Examine the key criteria: how does the agent or algorithm decide the next transition state?',
      isFallback: true,
    });
  }
};

export const config: Config = {
  path: '/api/ai-hint',
  method: 'POST',
};
