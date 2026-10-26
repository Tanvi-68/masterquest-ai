# CHRIST (DEEMED TO BE UNIVERSITY)
### Department of Computer Science
**Coursework Assessment: Interactive AI Quiz Game (Units I & II)**  
**Maximum Marks: 25.0** | Random 10-Question Evaluation  

---

## Word Documents Available in Repository:
- **`PROJECT_DOCUMENTATION.docx`**: Official Microsoft Word (.docx) complete project report, architecture rationale, and multi-device setup guide.
- **`QUESTION_BANK_WITH_ANSWERS.docx`**: Official Microsoft Word (.docx) complete question bank with all 62 questions, correct answers, and lecture citations.
- **`PROJECT_DOCUMENTATION.doc`**: HTML-formatted Word document compatible with older Word processors and LibreOffice.

---

## 1. Executive Summary
This project is an interactive, academic Quiz Game built for evaluating concepts from Units I and II of Artificial Intelligence. The system satisfies all coursework criteria by implementing a bank of **62 comprehensive questions** across 7 diverse formats:
1. Multiple Choice (MCQs)
2. True / False
3. Assertion – Reason
4. Fill in the Blanks
5. Match the Following
6. Real-World Application Scenarios (12+ questions)
7. Search / State-Space Problem Solving (8+ questions)

The application features an **Official 25-Mark Examination mode** where 10 randomized questions (2.5 marks each) are presented with a countdown timer, lifelines (50:50 and AI Proctor hints), instant grading, and generation of a printable assessment certificate and scorecard.

---

## 2. Technologies Used & Architectural Justification

| Technology | Role | Why It Was Chosen |
| :--- | :--- | :--- |
| **React 19 & TypeScript** | Frontend UI & State Machine | Guarantees strict type safety across 7 complex question schemas (matching pairs, fill-in validation, multi-choice). Eliminates runtime undefined bugs, providing sub-millisecond responsive interaction without page reloads. |
| **Vite 8** | Build Tool & Dev Server | Provides instant server start, near-instantaneous HMR, and ultra-optimized tree-shaken static production bundles. |
| **Tailwind CSS 4** | Styling & Typography Engine | Follows anti-slop design discipline with 60-30-10 color allocation, high WCAG contrast, unboxed metadata, and print-ready CSS for official certificates. |
| **Node.js & Express 4** | Full-Stack Server & API Proxy | Serves the app on port 3000 and hosts secure server-side proxy routes (`/api/ai-explain` and `/api/ai-hint`). Ensures user API keys are never exposed to the client browser. |
| **Google Gemini 3.8 Flash SDK** | AI Concept Tutor & Proctor | Powers the "Ask AI Professor" interactive explainer and real-time subtle lifeline hints using the modern `@google/genai` SDK, with offline fallbacks. |
| **Web Audio API** | Audio Synthesizer | Generates real-time auditory feedback (positive chord chimes, error tones, clock alerts) natively via browser oscillator nodes without external MP3 asset downloads. |
| **Canvas Confetti** | Celebration FX | Lightweight GPU-accelerated particle animation triggered when a student scores $\ge 60\%$ in the 25-mark examination. |

---

## 3. Comparative Evaluation vs. Alternative Platforms

- **Over Google / Microsoft Forms**: Forms are static surveys that lack dynamic random 10-question sampling per student, cannot provide interactive 50:50 or AI lifelines, lack step-by-step state-space visualizers, and cannot generate instant official university certificates.
- **Over Streamlit / Gradio**: Streamlit executes a complete script rerun from top to bottom on every user input or radio click. This causes noticeable lag, UI flickering, and fragile session state in multi-step tests. React provides client-side instant state transitions with 0ms latency.
- **Over Kahoot / Quizizz**: Kahoot requires third-party accounts, does not support custom syllabi diagrams or math formulas, and cannot run standalone in offline local university lab environments.

---

## 4. How to Set Up & Run on Another Device

### Prerequisites:
- Node.js version 18.0.0 or higher ([https://nodejs.org](https://nodejs.org))
- npm (installed automatically with Node.js)

### Step 1: Clone or Unzip Project
```bash
cd ai-quiz-game
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables (Optional for Live Gemini AI)
```bash
cp .env.example .env
# Edit .env and enter:
# GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```
*(Note: The quiz game and question bank work 100% fully offline with built-in academic explanations even without an API key).*

### Step 4: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:3000`

### Step 5: Production Build (Optional)
```bash
npm run build
npm start
```

---

## 5. Class Demonstration & Viva Guide
- **Demonstrating 25-Mark Exam**: Enter Student Name and Roll No., show the 10 randomized questions with timer and 50:50/AI lifelines, submit to generate the printable Christ University Certificate.
- **Demonstrating Blocks World Visualizer**: Navigate to the Search Visualizer to demonstrate how Hill Climbing ascends from $h=-6$ to $h=+6$ step by step (Slide 24–26).
- **Demonstrating A* Search Tree Trace**: Show the step-by-step expansion of nodes, priority queue ordering of OPEN list ($f=g+h$), and how the goal node $G$ (Cost 23) is reached with verified optimality (Slide 31–39).
