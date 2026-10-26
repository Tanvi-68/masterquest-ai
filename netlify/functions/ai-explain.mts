import { GoogleGenAI } from '@google/genai';
import type { Config } from '@netlify/functions';

export default async (req: Request) => {
  const { topic, questionText, studentQuery, unit } = await req.json().catch(() => ({}));
  try {
    const ai = new GoogleGenAI({});

    const prompt = `You are an expert AI Professor at a premier university teaching Artificial Intelligence (Unit I: Foundations, Turing Test, Rational Agents, Environments & Unit II: Problem Formulation, State Space Search, Production Systems, BFS/DFS/IDDFS, Hill Climbing, A* Search, CSP, Means-End Analysis).

Topic: ${topic || 'AI Core Concept'}
Unit: ${unit || 'Units I & II'}
Question Context: ${questionText || 'Conceptual Understanding'}
Student Question: ${studentQuery || 'Explain this concept and why this answer is correct.'}

Provide an authoritative, encouraging, and clear pedagogical explanation:
1. Short core definition & fundamental logic.
2. Step-by-step breakdown or formula (e.g. f(n) = g(n) + h(n), O(b^d), PEAS breakdown, or MEA subgoaling).
3. Exam tip or real-world example.
Keep the explanation structured, crystal clear, concise (around 150-250 words), and student-friendly. Use clean bullet points where helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return Response.json({
      text: response.text || 'Explanation unavailable.',
      isFallback: false,
    });
  } catch (err) {
    console.error('Gemini explanation error:', err);
    return Response.json({
      text: `Concept summary for ${topic || 'the selected concept'}: Review the formal definitions from the curriculum lecture slides, observing the differences in state expansion, heuristics, and agent rationality.`,
      isFallback: true,
    });
  }
};

export const config: Config = {
  path: '/api/ai-explain',
  method: 'POST',
};
