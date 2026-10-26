import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QuizQuestion, QUIZ_QUESTIONS } from '../data/quizQuestions';
import { GrumpyUncleAvatar } from './GrumpyUncleAvatar';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  Share2,
  Calendar,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { ExamRecord } from './ExamMode';

interface GrumpyUncleChallengeProps {
  onNavigateToPractice: () => void;
  onNavigateToBank: () => void;
  onOpenAiTutor: (q: QuizQuestion) => void;
  onSaveRecord: (rec: ExamRecord) => void;
}

// Helper to strip any slide numbers and lecture citations
function cleanSlideText(text: string): string {
  if (!text) return '';
  let cleaned = text
    // Remove (as shown in Slide 25) or (Unit 1 Part 2 Slide 37) or (Slide 21) or (Slide 22-23)
    .replace(/\s*\((?:as shown in\s+)?(?:Unit\s+\d+(?:\s+Part\s+\d+)?\s+)?Slide\s+[\d\-&,\s]+\)/gi, '')
    // Remove "According to Unit 1 Part 1 Slide 11, " or "According to Slide 24, "
    .replace(/According to\s+(?:Unit\s+\d+(?:\s+Part\s+\d+)?\s+)?(?:Slide|Slides)\s+[\d\-&,\s]+,?\s*/gi, '')
    // Remove "In Unit 1 Part 1 Slide 14 & 15: " or "In Slide 12: "
    .replace(/(?:In|As highlighted in|As explained in|Per)\s+(?:Unit\s+\d+(?:\s+Part\s+\d+)?\s+)?Slide\s+[\d\-&,\s]+(?::\s*|\s+states:\s*|\s*,\s*)?/gi, '')
    // Remove "Unit X Part Y Slides? Z[-W]*"
    .replace(/Unit\s+\d+\s+Part\s+\d+\s+Slides?\s+[\d\-&,\s]+(?::|\s+classify)?\s*/gi, 'In the AI curriculum: ')
    // Remove leftover standalone "Slide \d+" or "Slides \d+"
    .replace(/\s*\(?Slides?\s+\d+(?:-\d+)?\)?/gi, '')
    .replace(/\bSlides?\s+\d+(?:-\d+)?\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

// Filter out questions that inherently depend on a visual slide diagram or slide execution table
function isSlideDependentQuestion(q: QuizQuestion): boolean {
  const combined = (q.question + ' ' + (q.explanation || '')).toLowerCase();
  return (
    combined.includes('execution table') ||
    combined.includes('as shown in slide') ||
    combined.includes('dialogue example in slide') ||
    combined.includes('diagnosis production system on slide') ||
    combined.includes('status of the fifo queue') ||
    combined.includes('sequence of nodes visited in iteration 2') ||
    combined.includes('what exact sequence are the three operators') ||
    combined.includes('which node is removed from open and placed in closed')
  );
}

function sanitizeQuestionForGrumpyUncle(q: QuizQuestion): QuizQuestion {
  return {
    ...q,
    question: cleanSlideText(q.question),
    assertion: q.assertion ? cleanSlideText(q.assertion) : undefined,
    reason: q.reason ? cleanSlideText(q.reason) : undefined,
    options: q.options ? q.options.map(opt => cleanSlideText(opt)) : undefined,
    hint: cleanSlideText(q.hint || ''),
    explanation: cleanSlideText(q.explanation || ''),
  };
}

// Generate seeded daily questions based on date string (YYYY-MM-DD)
// Guarantees pure conceptual questions with ZERO slide numbers or slide citations!
function getDailyQuestions(seedStr: string, count: number = 10): QuizQuestion[] {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  // Simple pseudo-random generator
  const seededRandom = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };

  // Only take questions that do not depend on slide images/diagrams, and sanitize all slide references
  const cleanPool = QUIZ_QUESTIONS
    .filter(q => !isSlideDependentQuestion(q))
    .map(q => sanitizeQuestionForGrumpyUncle(q));

  // Fisher-Yates shuffle with seed
  for (let i = cleanPool.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [cleanPool[i], cleanPool[j]] = [cleanPool[j], cleanPool[i]];
  }

  return cleanPool.slice(0, count);
}

const UNCLE_PRAISES = [
  "Shabash! Even Sharma ji's son took 2 hours to figure that out!",
  "Acha! Slay beta! You actually know the difference between informed and uninformed search!",
  "Not bad at all! Keep this up and maybe Uncle will treat you to samosas & chai.",
  "SLAY! That answer was crisp, mathematically sound, and pure genius!",
  "Wah beta wah! Rational agent behavior at its finest! Uncle is impressed!",
  "Look at that heuristic! You're making Uncle proud in front of the whole colony!",
  "Sharma ji is crying in the corner right now! Fantastic reasoning, beta!",
];

const UNCLE_TAUNTS = [
  "Tsk tsk! Did you formulate state space with your eyes closed?!",
  "Sharma ji ka beta solved this in standard 2nd grade! What is this performance?!",
  "Even a vacuum cleaner with 2 dirty rooms has higher rational agency than this answer!",
  "Heuristic is inadmissible! Overestimating like your semester GPA expectations!",
  "Arey yaar beta! Nilsson, Turing, and Russell & Norvig are weeping right now!",
  "Concentration kahan hai?! Instagram reels band karo aur syllabus dekho!",
  "Is this how you're going to clear the Christ University assessment?! Tauba tauba!",
];

export const GrumpyUncleChallenge: React.FC<GrumpyUncleChallengeProps> = ({
  onNavigateToPractice,
  onNavigateToBank,
  onOpenAiTutor,
  onSaveRecord,
}) => {
  // Today's date string
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const formattedDate = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, []);

  // Challenge Seed (defaults to today's date, can be incremented for replay)
  const [challengeSeed, setChallengeSeed] = useState<string>(todayStr);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => getDailyQuestions(todayStr, 10));

  // Current state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mood, setMood] = useState<number>(0); // -5 to +5, starts neutral (0)
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [answeredResults, setAnsweredResults] = useState<Record<number, boolean>>({});
  const [blankInput, setBlankInput] = useState<string>('');
  const [matchSelections, setMatchSelections] = useState<Record<number, number>>({});
  const [uncleQuote, setUncleQuote] = useState<string>(
    "Namaste beta! I am Uncle Sharma. Let's see if you actually studied Units I & II or just scrolled reels. 10 questions. Prove yourself!"
  );
  const [isChallengeFinished, setIsChallengeFinished] = useState<boolean>(false);

  // Student details for saving record
  const [studentName, setStudentName] = useState<string>('Student');
  const [rollNumber, setRollNumber] = useState<string>('CU-AI-01');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Daily Streak
  const [streak, setStreak] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('grumpy_uncle_streak_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.streak || 1;
      }
    } catch {
      // ignore
    }
    return 1;
  });

  const currentQ = questions[currentIndex];
  const isCurrentAnswered = userAnswers[currentIndex] !== undefined;

  // Sound and confetti on completion
  useEffect(() => {
    if (isChallengeFinished) {
      const correctCount = Object.values(answeredResults).filter(Boolean).length;
      const isHappy = correctCount >= 7 || mood > 0;

      if (isHappy) {
        sounds.playUncleCheers();
        confetti({
          particleCount: 130,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#DAB692', '#8F5B34', '#5C351B', '#F3ECE6', '#CCA076'],
        });
        setUncleQuote("SLAYYY BETA! 🎉 Uncle is officially overjoyed! You made me proud! Sharma ji's house is in mourning!");

        // Update streak
        try {
          const stored = localStorage.getItem('grumpy_uncle_streak_data');
          const data = stored ? JSON.parse(stored) : {};
          if (data.lastDate !== todayStr) {
            const newStreak = (data.streak || 0) + 1;
            localStorage.setItem('grumpy_uncle_streak_data', JSON.stringify({ streak: newStreak, lastDate: todayStr }));
            setStreak(newStreak);
          }
        } catch {
          // ignore
        }
      } else {
        sounds.playGrumpyGrumble();
        setUncleQuote("KYA YAAR BETA! 😤 You made Uncle furious! Even a simple reflex agent has better accuracy! Go practice immediately!");
      }
    }
  }, [isChallengeFinished, mood, todayStr]);

  // Sync input fields when navigating questions
  useEffect(() => {
    if (currentQ?.format === 'fill-blank') {
      const existing = userAnswers[currentIndex];
      setBlankInput(typeof existing === 'string' ? existing : '');
    } else if (currentQ?.format === 'match') {
      const existing = userAnswers[currentIndex];
      setMatchSelections(typeof existing === 'object' && existing !== null ? existing : {});
    }
  }, [currentIndex, currentQ?.id, userAnswers]);

  const handleAnswer = (answer: any) => {
    if (isCurrentAnswered) return;

    let isCorrect = false;

    if (currentQ.format === 'fill-blank') {
      const userAnswer = String(answer).trim().toLowerCase();
      const acceptable = currentQ.acceptableAnswers?.map(a => a.toLowerCase()) || [];
      const primary = String(currentQ.correctAnswer).toLowerCase();
      isCorrect = acceptable.includes(userAnswer) || userAnswer === primary;
    } else if (currentQ.format === 'match') {
      const totalPairs = currentQ.matchPairs?.length || 0;
      const selections = (answer || {}) as Record<number, number>;
      const keys = Object.keys(selections).map(Number);
      if (keys.length === totalPairs) {
        isCorrect = keys.every(k => selections[k] === k);
      }
    } else {
      isCorrect = answer === currentQ.correctAnswer;
    }

    setUserAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    setAnsweredResults(prev => ({ ...prev, [currentIndex]: isCorrect }));

    if (isCorrect) {
      sounds.playUncleHappy();
      setMood(prev => Math.min(5, prev + 1));
      const randomPraise = UNCLE_PRAISES[Math.floor(Math.random() * UNCLE_PRAISES.length)];
      setUncleQuote(randomPraise);
    } else {
      sounds.playGrumpyGrumble();
      setMood(prev => Math.max(-5, prev - 1));
      const randomTaunt = UNCLE_TAUNTS[Math.floor(Math.random() * UNCLE_TAUNTS.length)];
      setUncleQuote(randomTaunt);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsChallengeFinished(true);
    }
  };


  const handleRestart = (newBatch: boolean = false) => {
    sounds.playClick();
    const newSeed = newBatch ? `${todayStr}-${Date.now()}` : challengeSeed;
    setChallengeSeed(newSeed);
    setQuestions(getDailyQuestions(newSeed, 10));
    setCurrentIndex(0);
    setMood(0);
    setUserAnswers({});
    setAnsweredResults({});
    setBlankInput('');
    setMatchSelections({});
    setIsChallengeFinished(false);
    setIsSaved(false);
    setUncleQuote("Round 2! Uncle's spectacles are polished. Show me what you've got!");
  };

  const handleSaveToLeaderboard = () => {
    if (isSaved) return;
    sounds.playClick();

    const correctCount = Object.values(answeredResults).filter(Boolean).length;
    const finalScore = correctCount * 2.5; // 25 marks max
    const percentage = Math.round((correctCount / 10) * 100);
    const isHappy = correctCount >= 7 || mood > 0;

    const rec: ExamRecord = {
      id: `uncle-daily-${Date.now()}`,
      studentName: studentName.trim() || 'AI Challenger',
      rollNumber: rollNumber.trim() || 'CU-DAILY',
      department: isHappy ? 'Uncle Slay Master 🌟' : 'Uncle Grumpy Practice 😤',
      score: finalScore,
      maxScore: 25.0,
      percentage,
      grade: isHappy ? 'Slay Approved (A+)' : 'Needs Revision (C)',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationSeconds: 180,
      unit1Score: correctCount * 1.25,
      unit2Score: correctCount * 1.25,
    };

    onSaveRecord(rec);
    setIsSaved(true);
  };

  const handleCopyShare = () => {
    sounds.playClick();
    const correctCount = Object.values(answeredResults).filter(Boolean).length;
    const isHappy = correctCount >= 7 || mood > 0;
    const moodStr = mood > 0 ? `+${mood} (Pure Slay! 🥳)` : mood < 0 ? `${mood} (Grumpy 😤)` : 'Neutral 😐';
    const text = `🎯 I played Grumpy Uncle Daily Challenge in AI MasterQuest!\nScore: ${correctCount}/10 (${correctCount * 2.5}/25 marks)\nUncle's Mood: ${moodStr}\nOutcome: ${isHappy ? 'I made Uncle Sharma Slay! 🌟' : 'Uncle Sharma made me practice more! ☕'}`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const correctCount = Object.values(answeredResults).filter(Boolean).length;
  const isHappyOutcome = correctCount >= 7 || mood > 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Banner: Daily Challenge Info */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="rounded-2xl border shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#DAB692]/30 rounded-xl text-2xl">
            👴🏽
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C351B]">
                Daily AI Challenge
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                Streak: {streak} {streak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#5C351B] tracking-tight">
              Grumpy Uncle Sharma
            </h1>
            <p className="text-xs text-[#8F5B34] mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate} Challenge</span>
              <span>·</span>
              <span>10 Questions</span>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleRestart(true)}
            title="Get a new set of 10 questions"
            style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
            className="px-3 py-1.5 rounded-lg border text-xs font-bold hover:bg-[#E8DCCF] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Shuffle New Batch</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {!isChallengeFinished ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Uncle Sharma Live Avatar & Mood Meter (5 Cols) */}
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="md:col-span-5 rounded-2xl border p-5 shadow-sm flex flex-col items-center justify-center sticky top-20 text-center"
          >
            <GrumpyUncleAvatar
              mood={mood}
              size="md"
              speechBubbleText={uncleQuote}
            />

            {/* Dynamic Mood Gauge */}
            <div className="w-full mt-5 pt-4 border-t border-[#E8DCCF] text-xs">
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-[#8F5B34]">
                <span className="text-red-700">😡 Boiling Grumpy</span>
                <span className="text-[#8F5B34]">😐 Neutral</span>
                <span className="text-purple-700">🥳 Slay Uncle!</span>
              </div>

              {/* Visual meter track */}
              <div className="h-3 w-full bg-[#E8DFE0] rounded-full overflow-hidden p-0.5 relative border border-[#DBC5B0]">
                {/* 0-marker line in middle */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-[#8F5B34] z-10 opacity-40" />

                {/* Filled gauge based on mood (-5 to 5 maps to 0% to 100%) */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    mood < 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-gradient-to-r from-emerald-500 to-purple-600'
                  }`}
                  style={{
                    width: `${((mood + 5) / 10) * 100}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-center mt-2 text-[11px] text-[#8F5B34]">
                <span className="font-bold text-[#5C351B]">
                  Uncle's Mood: {mood > 0 ? `+${mood}` : mood} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Question Card & Answering Area (7 Cols) */}
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="md:col-span-7 rounded-2xl border p-5 sm:p-6 shadow-sm space-y-5"
          >
            {/* Progress Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCF]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#DAB692]/30 text-[#5C351B]">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-medium text-[#8F5B34]">
                  {currentQ.unit} · {currentQ.topic}
                </span>
              </div>

              {/* Mini Dots */}
              <div className="flex items-center gap-1">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-4 bg-[#8F5B34]'
                        : answeredResults[idx] === true
                        ? 'bg-emerald-500'
                        : answeredResults[idx] === false
                        ? 'bg-red-500'
                        : 'bg-[#DBC5B0]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Context & Text */}
            <div className="space-y-3">
              {currentQ.scenarioContext && (
                <div className="p-3.5 bg-[#F2E8E0] rounded-xl border border-[#DBC5B0] text-xs text-[#5C351B] leading-relaxed">
                  <span className="font-bold block mb-1 uppercase tracking-wider text-[11px] text-[#8F5B34]">
                    Scenario Description:
                  </span>
                  <p>{currentQ.scenarioContext}</p>
                </div>
              )}

              <h2 className="text-base sm:text-lg font-bold text-[#5C351B] leading-snug">
                {currentQ.question}
              </h2>

              {currentQ.assertion && currentQ.reason && (
                <div className="p-3 bg-[#F2E8E0] rounded-xl text-xs space-y-1.5 text-[#5C351B] border border-[#DBC5B0]">
                  <p><span className="font-bold">Assertion (A):</span> {currentQ.assertion}</p>
                  <p><span className="font-bold">Reason (R):</span> {currentQ.reason}</p>
                </div>
              )}
            </div>

            {/* Dynamic Options / Input Area based on Format */}
            <div className="pt-2">
              {/* Format 1: Fill in the blank / Written Question Answer */}
              {currentQ.format === 'fill-blank' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (blankInput.trim() && !isCurrentAnswered) {
                      sounds.playClick();
                      handleAnswer(blankInput.trim());
                    }
                  }}
                  className="space-y-3"
                >
                  <label className="text-xs font-bold text-[#8F5B34] block">
                    Write your answer below:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      disabled={isCurrentAnswered}
                      value={blankInput}
                      onChange={(e) => setBlankInput(e.target.value)}
                      placeholder="Type your answer here..."
                      className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-[#DBC5B0] bg-white text-[#5C351B] focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
                    />
                    <button
                      type="submit"
                      disabled={!blankInput.trim() || isCurrentAnswered}
                      style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                      className="px-5 py-3 rounded-xl text-xs font-bold hover:bg-[#CCA076] disabled:opacity-40 transition-colors cursor-pointer border border-[#C59B74] whitespace-nowrap"
                    >
                      Confirm Answer
                    </button>
                  </div>
                  {isCurrentAnswered && (
                    <div className="p-3 bg-[#F2E8E0] rounded-xl border border-[#DBC5B0] text-xs space-y-0.5">
                      <span className="font-bold text-[#5C351B]">Expected Answer: </span>
                      <span className="font-mono text-emerald-800 font-bold">{String(currentQ.correctAnswer)}</span>
                      {currentQ.acceptableAnswers && currentQ.acceptableAnswers.length > 1 && (
                        <span className="text-[#8F5B34] block text-[11px] mt-0.5">
                          (Also accepted: {currentQ.acceptableAnswers.join(', ')})
                        </span>
                      )}
                    </div>
                  )}
                </form>
              )}

              {/* Format 2: Match the Following */}
              {currentQ.format === 'match' && currentQ.matchPairs && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#8F5B34] uppercase tracking-wider">
                    Pair each item from Column A with its match from Column B:
                  </div>
                  <div className="space-y-2.5">
                    {currentQ.matchPairs.map((pair, leftIdx) => {
                      const selectedRightIdx = matchSelections[leftIdx];
                      const isPairCorrect = isCurrentAnswered && selectedRightIdx === leftIdx;

                      return (
                        <div
                          key={pair.id || leftIdx}
                          className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
                            isCurrentAnswered
                              ? isPairCorrect
                                ? 'bg-emerald-50 border-emerald-300'
                                : 'bg-red-50 border-red-300'
                              : 'bg-white border-[#DBC5B0]'
                          }`}
                        >
                          <div className="font-medium text-[#5C351B] sm:w-1/2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-[#DAB692] text-[#5C351B] font-bold flex items-center justify-center text-xs shrink-0">
                              {leftIdx + 1}
                            </span>
                            <span className="leading-snug">{pair.left}</span>
                          </div>

                          <div className="sm:w-1/2 flex items-center gap-2">
                            <select
                              disabled={isCurrentAnswered}
                              value={selectedRightIdx !== undefined ? selectedRightIdx : ''}
                              onChange={(e) => {
                                const val = e.target.value === '' ? undefined : Number(e.target.value);
                                setMatchSelections(prev => {
                                  const updated = { ...prev };
                                  if (val === undefined) {
                                    delete updated[leftIdx];
                                  } else {
                                    updated[leftIdx] = val;
                                  }
                                  return updated;
                                });
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-[#DBC5B0] bg-[#FAF6F3] text-xs font-medium text-[#5C351B] focus:outline-none focus:ring-1 focus:ring-[#DAB692]"
                            >
                              <option value="">-- Choose match --</option>
                              {currentQ.matchPairs?.map((rPair, rIdx) => (
                                <option key={rIdx} value={rIdx}>
                                  {String.fromCharCode(65 + rIdx)}: {rPair.right}
                                </option>
                              ))}
                            </select>
                            {isCurrentAnswered && (
                              isPairCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!isCurrentAnswered && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        disabled={
                          Object.keys(matchSelections).length !== (currentQ.matchPairs?.length || 0) ||
                          Object.values(matchSelections).some(v => v === undefined || isNaN(v))
                        }
                        onClick={() => {
                          sounds.playClick();
                          handleAnswer(matchSelections);
                        }}
                        style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#CCA076] disabled:opacity-40 transition-colors cursor-pointer border border-[#C59B74]"
                      >
                        Submit All Matches
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Format 3: Multiple Choice, True/False, Assertion-Reason, Scenario Options */}
              {currentQ.format !== 'fill-blank' && currentQ.format !== 'match' && currentQ.options && (
                <div className="space-y-2.5">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    const isAnswerCorrect = currentQ.correctAnswer === optIdx;

                    let btnStyles = 'bg-[#FCFAF8] hover:bg-[#F3ECE6] border-[#DBC5B0] text-[#5C351B]';

                    if (isCurrentAnswered) {
                      if (isSelected && isAnswerCorrect) {
                        btnStyles = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                      } else if (isSelected && !isAnswerCorrect) {
                        btnStyles = 'bg-red-100 border-red-400 text-red-950 font-bold';
                      } else if (isAnswerCorrect) {
                        btnStyles = 'bg-emerald-50 border-emerald-300 text-emerald-900 border-dashed';
                      } else {
                        btnStyles = 'opacity-50 border-[#E2D3C4] text-stone-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isCurrentAnswered}
                        onClick={() => {
                          sounds.playClick();
                          handleAnswer(optIdx);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 cursor-pointer ${btnStyles}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs shrink-0 border ${
                            isSelected
                              ? isAnswerCorrect
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-red-600 text-white border-red-600'
                              : 'bg-[#FAF6F3] text-[#8F5B34] border-[#DBC5B0]'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 pt-0.5 leading-relaxed">{option}</span>
                        {isCurrentAnswered && isSelected && (
                          <span className="shrink-0 pt-0.5">
                            {isAnswerCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Post-Answer Feedback & Explanation */}
            {isCurrentAnswered && (
              <div
                style={{
                  backgroundColor: answeredResults[currentIndex] ? '#ECFDF5' : '#FEF2F2',
                  borderColor: answeredResults[currentIndex] ? '#A7F3D0' : '#FECACA',
                }}
                className="p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-300"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      answeredResults[currentIndex] ? 'text-emerald-800' : 'text-red-800'
                    }`}
                  >
                    {answeredResults[currentIndex] ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Uncle's Mood Rose! (+1)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Uncle's Grumpiness Rose! (-1)</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => onOpenAiTutor(currentQ)}
                    style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
                    className="px-2.5 py-1 rounded-md border text-[11px] font-semibold hover:bg-[#F2E8E0] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#8F5B34]" />
                    <span>Explain Concept</span>
                  </button>
                </div>

                <p className="text-stone-700 leading-relaxed font-sans">
                  <span className="font-semibold text-stone-900">Academic Explanation: </span>
                  {currentQ.explanation}
                </p>

                {/* Continue button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                    className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#CCA076] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#C59B74]"
                  >
                    <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'See Uncle’s Verdict'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* End of Challenge: Grumpy vs Slay Verdict Screen */
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border shadow-md p-6 sm:p-10 text-center space-y-8 animate-in zoom-in-95 duration-400"
        >
          {/* Animated Avatar in final state */}
          <div className="flex justify-center">
            <GrumpyUncleAvatar
              mood={mood}
              size="lg"
              speechBubbleText={uncleQuote}
            />
          </div>

          {/* Outcome Headline */}
          <div className="space-y-2 max-w-lg mx-auto">
            {isHappyOutcome ? (
              <>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                  🎉 VICTORY · UNCLE WON OVER
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#5C351B] tracking-tight">
                  SLAY! You Made Uncle Happy! 🥳
                </h2>
                <p className="text-sm text-[#8F5B34] leading-relaxed">
                  Uncle Sharma has put his cup of chai down to give you a standing ovation! You
                  proved your mastery over rational agents, state-space search, and heuristics.
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
                  😤 DEFEAT · UNCLE IS FURIOUS
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#5C351B] tracking-tight">
                  Oh No! You Made Uncle Angry! ☕
                </h2>
                <p className="text-sm text-[#8F5B34] leading-relaxed">
                  Uncle Sharma's spectacles almost fell into his chai! He says your state-space formulation
                  has too many loops and zero heuristics. Don't worry—you can practice more to cheer him up!
                </p>
              </>
            )}
          </div>

          {/* Score & Mood Summary Chips */}
          <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
            <div className="p-3 bg-[#F2E8E0] rounded-xl border border-[#DBC5B0] text-center">
              <span className="text-[11px] text-[#8F5B34] font-medium block">Correct</span>
              <span className="text-xl font-black text-[#5C351B]">{correctCount} / 10</span>
            </div>
            <div className="p-3 bg-[#F2E8E0] rounded-xl border border-[#DBC5B0] text-center">
              <span className="text-[11px] text-[#8F5B34] font-medium block">Marks</span>
              <span className="text-xl font-black text-[#5C351B]">{(correctCount * 2.5).toFixed(1)} / 25</span>
            </div>
            <div className="p-3 bg-[#F2E8E0] rounded-xl border border-[#DBC5B0] text-center">
              <span className="text-[11px] text-[#8F5B34] font-medium block">Final Mood</span>
              <span
                className={`text-xl font-black ${
                  mood > 0 ? 'text-purple-700' : mood < 0 ? 'text-red-700' : 'text-stone-700'
                }`}
              >
                {mood > 0 ? `+${mood}` : mood}
              </span>
            </div>
          </div>

          {/* If Uncle is Angry: Direct Remediation Cards! */}
          {!isHappyOutcome && (
            <div className="max-w-xl mx-auto bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-left space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Uncle Sharma's Prescription: "Go Practice More!"</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Before challenging Uncle again, use the dedicated practice tools already available in this applet:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  onClick={onNavigateToPractice}
                  className="p-3.5 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 group-hover:bg-amber-200">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#5C351B] group-hover:text-amber-900">
                      Unit Practice Mode
                    </h3>
                    <p className="text-[11px] text-[#8F5B34] mt-0.5">
                      Filter questions by Unit I, Unit II, or search heuristics.
                    </p>
                  </div>
                </button>

                <button
                  onClick={onNavigateToBank}
                  className="p-3.5 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0 group-hover:bg-amber-200">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#5C351B] group-hover:text-amber-900">
                      Complete Question Bank
                    </h3>
                    <p className="text-[11px] text-[#8F5B34] mt-0.5">
                      Review all 62 questions with answers & lecture slides references.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Save Result to Leaderboard Form */}
          <div className="max-w-md mx-auto pt-4 border-t border-[#E8DCCF] text-left space-y-3">
            <span className="text-xs font-bold text-[#5C351B] block">
              Log Result to Academic Results Log:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Student Name"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                disabled={isSaved}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#DBC5B0] bg-white text-[#5C351B] focus:outline-none focus:ring-1 focus:ring-[#DAB692]"
              />
              <input
                type="text"
                placeholder="Roll No"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                disabled={isSaved}
                className="w-full sm:w-28 px-3 py-2 text-xs rounded-lg border border-[#DBC5B0] bg-white text-[#5C351B] focus:outline-none focus:ring-1 focus:ring-[#DAB692]"
              />
              <button
                onClick={handleSaveToLeaderboard}
                disabled={isSaved}
                style={{ backgroundColor: isSaved ? '#E8DCCF' : '#DAB692', color: '#5C351B' }}
                className="px-4 py-2 text-xs font-bold rounded-lg border border-[#C59B74] whitespace-nowrap cursor-pointer transition-colors"
              >
                {isSaved ? 'Saved! ✓' : 'Save Result'}
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleRestart(false)}
              style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
              className="px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-[#CCA076] transition-colors flex items-center gap-2 cursor-pointer shadow-xs border border-[#C59B74]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Challenge Again</span>
            </button>

            <button
              onClick={handleCopyShare}
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="px-4 py-2.5 text-xs font-bold rounded-xl border hover:bg-[#E8DCCF] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#8F5B34]" />
              <span>{copiedLink ? 'Copied to Clipboard! ✓' : 'Share Result'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
