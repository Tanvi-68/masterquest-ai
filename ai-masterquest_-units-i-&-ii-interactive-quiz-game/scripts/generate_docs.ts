import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { QUIZ_QUESTIONS } from '../src/data/quizQuestions.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function generateDocumentationDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'CHRIST (DEEMED TO BE UNIVERSITY)',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Department of Computer Science',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Coursework Assessment: Interactive AI Quiz Game (Units I & II)',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Maximum Marks: 25.0 | Random 10 Questions Evaluation',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Section 1: Executive Summary
          new Paragraph({
            text: '1. Executive Summary',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'This project is a high-performance, academic interactive Quiz Game developed for evaluating concepts from Units I and II of Artificial Intelligence. The system satisfies all prescribed requirements by incorporating a comprehensive question bank of 62 curated questions across 7 distinct multi-modal formats (MCQs, True/False, Assertion-Reason, Fill in the Blanks, Match the Following, Real-World Application Scenarios, and State-Space Problem Solving).',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'The application features an official 25-Mark Examination mode where 10 randomized questions (2.5 marks each) are dynamically presented to each student with a countdown timer, lifelines (50:50 and AI Proctor hints), instant grading, and generation of a printable Christ University assessment certificate and scorecard.',
            spacing: { after: 200 },
          }),

          // Section 2: Technology Stack Used & Why It Is Used
          new Paragraph({
            text: '2. Technologies Used & Architectural Justification',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'The table below details every technology incorporated into the system, its specific role, and why it was selected over traditional alternatives such as Streamlit, Gradio, or Google Forms:',
            spacing: { after: 160 },
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Technology', style: 'bold' })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Role in Project', style: 'bold' })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Why It Was Chosen (Justification)', style: 'bold' })],
                    shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'React 19 & TypeScript' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Client-side reactive state machine & UI components' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Guarantees strict type safety across 7 complex question schemas (matching pairs, fill-in validation, multi-choice). Eliminates runtime undefined bugs, providing sub-millisecond responsive interaction without page reloads.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Vite 8 Build Tool' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'High-speed bundler & dev server' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Provides instant cold-start server start, near-instantaneous HMR, and ultra-optimized tree-shaken static production bundles.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Tailwind CSS 4' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Atomic styling & typography engine' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Follows anti-slop design discipline with 60-30-10 color allocation, high WCAG contrast, unboxed metadata, and print-ready CSS for official certificates.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Node.js & Express 4' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Full-stack application backend & proxy' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Serves the app on port 3000 and hosts secure server-side proxy routes (/api/ai-explain and /api/ai-hint). Ensures user API keys are never exposed to the client browser.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Google Gemini 3.8 Flash SDK' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Server-side Generative AI Tutor & Proctor' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Provides dynamic, step-by-step conceptual explanations and pedagogical hints using the modern @google/genai SDK with automated graceful fallbacks.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Web Audio API' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Procedural sound effects synthesizer' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Generates real-time auditory feedback (positive chord chimes, error tones, clock alerts) natively via browser oscillator nodes without external MP3 asset downloads.' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Canvas Confetti' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Celebratory milestone animation' })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Lightweight GPU-accelerated particle animation triggered when a student scores >= 60% in the 25-mark examination.' })] }),
                ],
              }),
            ],
          }),

          // Section 3: Comparative Analysis vs Other Tools
          new Paragraph({
            text: '3. Comparative Advantage Over Other Platforms',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'While the coursework guidelines permit Streamlit, Gradio, Google Forms, or Kahoot, this custom React + Express application provides distinct advantages for a university exam environment:',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: '• Over Google Forms / MS Forms: Forms are static surveys that lack dynamic random 10-question sampling per student, cannot provide interactive 50:50 or AI lifelines, lack step-by-step state-space visualizers, and cannot generate instant official university certificates.',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• Over Streamlit / Gradio: Streamlit executes a complete script rerun from top to bottom on every user input or radio click. This causes noticeable lag, UI flickering, and fragile session state in multi-step tests. React provides client-side instant state transitions with 0ms latency.',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• Over Kahoot / Quizizz: Kahoot requires third-party accounts, does not support custom syllabi diagrams or math formulas, and cannot run standalone in offline local university lab environments.',
            spacing: { after: 200 },
          }),

          // Section 4: Setup Guide on Another Device
          new Paragraph({
            text: '4. Step-by-Step Guide: How to Set Up & Run on Another Device',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'The application is engineered for zero-friction setup on any operating system (Windows, macOS, or Linux). Follow these sequential steps:',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 1: Verify Prerequisites\nEnsure Node.js version 18.0.0 or higher is installed on your computer. You can download it freely from https://nodejs.org. In your command line (Command Prompt, PowerShell, or Terminal), run:\nnode -v\nnpm -v',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 2: Unzip or Clone Project Directory\nOpen the terminal and navigate into the project folder:\ncd ai-quiz-game',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 3: Install All Project Dependencies\nRun npm install to populate all required packages:\nnpm install',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 4: Configure Environment Variables (Optional for AI Tutor)\nCopy the example environment template:\ncp .env.example .env\nOpen the .env file in any text editor. If you have a Google Gemini API key, add it:\nGEMINI_API_KEY="YOUR_KEY_HERE"\nNote: The quiz game and question bank work 100% fully offline with built-in academic explanations even without an API key.',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 5: Launch the Development Server\nRun the development command:\nnpm run dev\nOpen your web browser and navigate to: http://localhost:3000',
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Step 6: Build for Production Deployment (Optional)\nTo create an optimized production build:\nnpm run build\nnpm start',
            spacing: { after: 200 },
          }),

          // Section 5: Game Design & Pedagogical Structure
          new Paragraph({
            text: '5. Game Design & Pedagogical Principles',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: '• Randomized 10-Question Exam Sampling: Ensures every student receives an individual, balanced test containing a verified distribution of Unit I foundations, Unit II search problems, real-world application scenarios, and algorithm traces.',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• 25-Mark Scoring Rubric: Each question is worth exactly 2.5 marks (10 × 2.5 = 25.0 Marks). The result report displays marks, percentage, and standardized grades (O, A+, A, B+, B, Pass, Fail).',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• Lifeline Assistance: Students have access to a 50:50 lifeline (eliminates two distractors) and an AI Proctor Hint lifeline (nudges reasoning without spoiling answers).',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• Class Demonstration & Viva Visualizers: The system includes interactive visualizers for Blocks World Hill Climbing (Slide 24-26, showing heuristic ascent from -6 to +6) and A* Search Priority Queue tracing (Slide 31-39, showing OPEN list f=g+h ordering and CLOSED list node expansions).',
            spacing: { after: 200 },
          }),

          // Section 6: Syllabus Mapping Matrix
          new Paragraph({
            text: '6. Curriculum Syllabus Mapping Matrix',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: '• Unit I: Foundations of AI (John McCarthy 1960), Four Quadrants (Acting/Thinking Humanly & Rationally), Turing Test (1950 Imitation Game, 4 criteria, 30% prediction, limitations), Intelligent Agents, Rationality vs Perfection, Information Gathering, PEAS Framework, Nature of Environments (Observable, Deterministic, Episodic, Static, Discrete, Single/Multi-Agent, Known), 5 Agent Types (Simple Reflex, Model-based, Goal-based, Utility-based, Learning Agent with Critic & Problem Generator).',
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: '• Unit II: Problems & Problem Formulation (Initial State, Successor Function, Goal Test, Path Cost, Indian Traveller Pune to Chennai), State Space Search Graphs, Production Systems (IF-THEN, Working Memory, Control Strategy, Inference Engine), 5 Problem Characteristics (Decomposable, Ignorable/Recoverable/Irrecoverable, Predictability, Absolute vs Relative, Consistent Knowledge Base), Search Program Design Issues (Completeness, Optimality, Time/Space Complexity, Repeated States CLOSED list, Memory Management), Uninformed Search (BFS, DFS, Iterative Deepening IDDFS, Uniform Cost), Informed Search (Heuristics, Admissibility h<=h*, Greedy Best-First, Hill Climbing landscapes & variations, Blocks World heuristic), A* Search (f=g+h, OPEN/CLOSED lists, optimality proof), Constraint Satisfaction Problems (CSP triad <X, D, C>, Map Coloring, Sudoku, Cryptarithmetic), and Means-Ends Analysis (GPS 1961, difference reduction, operator subgoaling, O-Start & O-Result).',
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.resolve(rootDir, 'PROJECT_DOCUMENTATION.docx'), buffer);
  console.log('Generated PROJECT_DOCUMENTATION.docx');
}

async function generateQuestionBankDocx() {
  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ text: 'Q#', style: 'bold' })],
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Unit & Topic', style: 'bold' })],
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Question & Context', style: 'bold' })],
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
        }),
        new TableCell({
          children: [new Paragraph({ text: 'Correct Answer & Explanation', style: 'bold' })],
          shading: { fill: 'E2E8F0', type: ShadingType.CLEAR, color: 'auto' },
        }),
      ],
    }),
  ];

  QUIZ_QUESTIONS.forEach((q, idx) => {
    let ansText = '';
    if (q.options && typeof q.correctAnswer === 'number') {
      ansText = `${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}`;
    } else if (q.format === 'match' && q.matchPairs) {
      ansText = q.matchPairs.map((p, i) => `${i + 1}. ${p.left} -> ${p.right}`).join('\n');
    } else {
      ansText = String(q.correctAnswer);
    }

    const questionFull = q.scenarioContext
      ? `[Context]: ${q.scenarioContext}\n\n${q.question}`
      : q.assertion
      ? `Assertion (A): ${q.assertion}\nReason (R): ${q.reason}\n\n${q.question}`
      : q.question;

    tableRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: `Q${idx + 1}` })] }),
          new TableCell({ children: [new Paragraph({ text: `${q.unit}\n${q.topic} (${q.format})` })] }),
          new TableCell({ children: [new Paragraph({ text: questionFull })] }),
          new TableCell({
            children: [
              new Paragraph({ text: `Correct Answer:\n${ansText}\n\nExplanation:\n${q.explanation}` }),
            ],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'CHRIST (DEEMED TO BE UNIVERSITY)',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Artificial Intelligence (Units I & II) - Complete Question Bank with Answer Keys',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
          }),
          new Paragraph({
            text: `Total Questions: ${QUIZ_QUESTIONS.length} | Maximum Marks Scheme: 25.0`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.resolve(rootDir, 'QUESTION_BANK_WITH_ANSWERS.docx'), buffer);
  console.log('Generated QUESTION_BANK_WITH_ANSWERS.docx');
}

async function main() {
  await generateDocumentationDocx();
  await generateQuestionBankDocx();
}

main().catch(err => {
  console.error('Docx generation error:', err);
  process.exit(1);
});
