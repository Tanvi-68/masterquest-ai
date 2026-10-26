import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize server-side Gemini client if key is provided
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health and status endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasAiKey: !!apiKey,
      model: 'gemini-3.8-flash',
    });
  });

  // AI Concept Explainer endpoint
  app.post('/api/ai-explain', async (req, res) => {
    try {
      const { topic, questionText, studentQuery, unit } = req.body;
      if (!ai) {
        return res.json({
          text: `Concept Guidance: ${topic || 'Artificial Intelligence'}\n\nIn AI curriculum (${unit || 'Unit I & II'}), this topic addresses foundational agent architectures or systematic search methodologies. In exam assessments, ensure you state: 1) the formal mathematical or architectural definition, 2) time and space complexity or PEAS parameters, and 3) real-world application examples (such as Google Maps routing, autonomous driving, or 8-puzzle state transitions).`,
          isFallback: true,
        });
      }

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

      res.json({
        text: response.text || 'Explanation unavailable.',
        isFallback: false,
      });
    } catch (err: any) {
      console.error('Gemini explanation error:', err);
      res.json({
        text: `Concept summary for ${req.body.topic || 'the selected concept'}: Review the formal definitions from the curriculum lecture slides, observing the differences in state expansion, heuristics, and agent rationality.`,
        isFallback: true,
      });
    }
  });

  // AI Lifeline Hint endpoint
  app.post('/api/ai-hint', async (req, res) => {
    try {
      const { questionText, topic, format, options } = req.body;
      if (!ai) {
        return res.json({
          hint: 'Remember the core distinction in this topic: consider whether the search is informed or uninformed, and how the objective evaluation function behaves.',
          isFallback: true,
        });
      }

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

      res.json({
        hint: response.text?.trim() || 'Focus on the operational definition given in the lecture.',
        isFallback: false,
      });
    } catch (err: any) {
      console.error('Gemini hint error:', err);
      res.json({
        hint: 'Examine the key criteria: how does the agent or algorithm decide the next transition state?',
        isFallback: true,
      });
    }
  });

  // Mount Vite or static server
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

startServer();
