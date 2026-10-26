import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuestionCard } from './QuestionCard';
import {
  Clock,
  RotateCcw,
  Printer,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  Zap,
  Sparkles,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export interface ExamRecord {
  id: string;
  studentName: string;
  rollNumber: string;
  department: string;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  date: string;
  durationSeconds: number;
  unit1Score: number;
  unit2Score: number;
}

interface ExamModeProps {
  onOpenAiTutorWithQuestion: (q: QuizQuestion) => void;
  onSaveRecord: (rec: ExamRecord) => void;
}

function generateRandom10Questions(): QuizQuestion[] {
  const unit1 = QUIZ_QUESTIONS.filter(q => q.unit === 'Unit I');
  const unit2 = QUIZ_QUESTIONS.filter(q => q.unit === 'Unit II');

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const u1Scenarios = shuffle(unit1.filter(q => q.isRealWorldScenario));
  const u1General = shuffle(unit1.filter(q => !q.isRealWorldScenario));
  const u2Problems = shuffle(unit2.filter(q => q.isSearchProblemSolving));
  const u2General = shuffle(unit2.filter(q => !q.isSearchProblemSolving));

  const chosen: QuizQuestion[] = [];

  if (u1Scenarios.length >= 2) chosen.push(u1Scenarios[0], u1Scenarios[1]);
  else chosen.push(...u1Scenarios);

  chosen.push(u1General[0], u1General[1], u1General[2]);

  if (u2Problems.length >= 2) chosen.push(u2Problems[0], u2Problems[1]);
  else chosen.push(...u2Problems);

  const needed = 10 - chosen.length;
  for (let i = 0; i < needed && i < u2General.length; i++) {
    chosen.push(u2General[i]);
  }

  if (chosen.length < 10) {
    const remaining = shuffle(QUIZ_QUESTIONS.filter(q => !chosen.some(c => c.id === q.id)));
    while (chosen.length < 10 && remaining.length > 0) {
      chosen.push(remaining.pop()!);
    }
  }

  return shuffle(chosen);
}

export const ExamMode: React.FC<ExamModeProps> = ({
  onOpenAiTutorWithQuestion,
  onSaveRecord,
}) => {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [rollNumber, setRollNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('B.Sc / B.Tech Computer Science - AI');
  const [timerDurationMinutes, setTimerDurationMinutes] = useState<number>(15);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);

  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState<Record<string, boolean>>({});
  const [eliminatedMap, setEliminatedMap] = useState<Record<string, number[]>>({});
  const [hintsMap, setHintsMap] = useState<Record<string, string>>({});
  const [hintLoading, setHintLoading] = useState<boolean>(false);

  const [resultRecord, setResultRecord] = useState<ExamRecord | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const startExam = () => {
    if (!studentName.trim()) return;
    const selected = generateRandom10Questions();
    setQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setFiftyFiftyUsed({});
    setEliminatedMap({});
    setHintsMap({});
    setTimeLeft(timerDurationMinutes * 60);
    startTimeRef.current = Date.now();
    setIsFinished(false);
    setIsRegistered(true);
    setShowSubmitConfirm(false);
    sounds.playClick();
  };

  useEffect(() => {
    if (!isRegistered || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRegistered, isFinished, questions]);

  const handleAnswer = (answer: any) => {
    const q = questions[currentIndex];
    if (!q) return;
    setUserAnswers(prev => ({
      ...prev,
      [q.id]: answer,
    }));
  };

  const toggleMarkReview = () => {
    const q = questions[currentIndex];
    if (!q) return;
    setMarkedForReview(prev => ({
      ...prev,
      [q.id]: !prev[q.id],
    }));
    sounds.playClick();
  };

  const handleUse5050 = () => {
    const q = questions[currentIndex];
    if (!q || !q.options || q.options.length <= 2) return;
    if (fiftyFiftyUsed[q.id]) return;

    sounds.playClick();
    const correctIdx = Number(q.correctAnswer);
    const incorrectIndices = q.options
      .map((_, i) => i)
      .filter(i => i !== correctIdx);

    const shuffledWrong = [...incorrectIndices].sort(() => Math.random() - 0.5);
    const eliminated = shuffledWrong.slice(0, 2);

    setEliminatedMap(prev => ({ ...prev, [q.id]: eliminated }));
    setFiftyFiftyUsed(prev => ({ ...prev, [q.id]: true }));
  };

  const handleRequestHint = async () => {
    const q = questions[currentIndex];
    if (!q) return;
    if (hintsMap[q.id]) return;

    setHintLoading(true);
    sounds.playClick();

    try {
      const res = await fetch('/api/ai-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.question,
          topic: q.topic,
          format: q.format,
          options: q.options,
        }),
      });

      const data = await res.json();
      setHintsMap(prev => ({
        ...prev,
        [q.id]: data.hint || q.hint,
      }));
    } catch {
      setHintsMap(prev => ({
        ...prev,
        [q.id]: q.hint,
      }));
    } finally {
      setHintLoading(false);
    }
  };

  const finishExam = () => {
    let totalMarks = 0;
    let unit1Marks = 0;
    let unit2Marks = 0;

    questions.forEach(q => {
      const userAns = userAnswers[q.id];
      let correct = false;

      if (userAns !== undefined && userAns !== null && userAns !== '') {
        if (q.format === 'fill-blank') {
          const formatted = String(userAns).trim().toLowerCase();
          const acceptable = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
          correct = acceptable.includes(formatted) || formatted === String(q.correctAnswer).toLowerCase();
        } else if (q.format === 'match') {
          const totalPairs = q.matchPairs?.length || 0;
          const userPairs = userAns as Record<number, number>;
          const keys = Object.keys(userPairs || {}).map(Number);
          if (keys.length === totalPairs) {
            correct = keys.every(k => userPairs[k] === k);
          }
        } else {
          correct = userAns === q.correctAnswer;
        }
      }

      if (correct) {
        totalMarks += q.marks;
        if (q.unit === 'Unit I') unit1Marks += q.marks;
        if (q.unit === 'Unit II') unit2Marks += q.marks;
      }
    });

    const percentage = Math.round((totalMarks / 25.0) * 100);
    let grade = 'F';
    if (percentage >= 90) grade = 'O (Outstanding)';
    else if (percentage >= 80) grade = 'A+ (Excellent)';
    else if (percentage >= 70) grade = 'A (Very Good)';
    else if (percentage >= 60) grade = 'B+ (Good)';
    else if (percentage >= 50) grade = 'B (Above Average)';
    else if (percentage >= 40) grade = 'Pass';

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    const record: ExamRecord = {
      id: 'exam-' + Date.now(),
      studentName: studentName.trim() || 'Student',
      rollNumber: rollNumber.trim() || '23-CS-AI-001',
      department,
      score: totalMarks,
      maxScore: 25.0,
      percentage,
      grade,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationSeconds,
      unit1Score: unit1Marks,
      unit2Score: unit2Marks,
    };

    setResultRecord(record);
    setIsFinished(true);
    setShowSubmitConfirm(false);
    onSaveRecord(record);

    if (percentage >= 60) {
      sounds.playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      sounds.playIncorrect();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // VIEW 1: REGISTRATION & INSTRUCTIONS
  // -------------------------------------------------------------
  if (!isRegistered) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
          className="rounded-2xl border shadow-sm p-6 sm:p-10"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase mb-1 block">
              Christ University · Department of Computer Science
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C351B] tracking-tight">
              Artificial Intelligence Quiz Evaluation
            </h1>
            <p className="mt-2 text-sm text-[#8F5B34]">
              Units I &amp; II Assessment · Maximum Marks: 25.0
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border">
              <div className="text-xs font-bold text-[#8F5B34] uppercase">Evaluation Scheme</div>
              <div className="text-xl font-bold text-[#5C351B] mt-1">10 Questions</div>
              <div className="text-xs text-[#8F5B34] mt-0.5">2.5 marks each = 25 Marks</div>
            </div>
            <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border">
              <div className="text-xs font-bold text-[#8F5B34] uppercase">Syllabus Coverage</div>
              <div className="text-xl font-bold text-[#5C351B] mt-1">Units I &amp; II</div>
              <div className="text-xs text-[#8F5B34] mt-0.5">Agents, PEAS, Search, CSP, MEA</div>
            </div>
            <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border">
              <div className="text-xs font-bold text-[#8F5B34] uppercase">Assessment Format</div>
              <div className="text-xl font-bold text-[#5C351B] mt-1">Multi-Modal</div>
              <div className="text-xs text-[#8F5B34] mt-0.5">MCQ, Match, Reason, Scenarios</div>
            </div>
          </div>

          {/* Student Registration Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              startExam();
            }}
            className="space-y-5 max-w-xl mx-auto"
          >
            <div>
              <label className="block text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-1.5">
                Student Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8F5B34] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Tanvi Khatri "
                  style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-[#DAB692] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-1.5">
                  Roll / Register Number *
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2441468"
                  style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-[#DAB692] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-1.5">
                  Timer Duration
                </label>
                <select
                  value={timerDurationMinutes}
                  onChange={(e) => setTimerDurationMinutes(Number(e.target.value))}
                  style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-[#DAB692] focus:outline-none"
                >
                  <option value={10}>10 Minutes (Standard Fast)</option>
                  <option value={15}>15 Minutes (Recommended)</option>
                  <option value={20}>20 Minutes (Extended)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-1.5">
                Department / Program
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-[#DAB692] focus:outline-none"
              />
            </div>

            <div
              style={{ borderColor: '#E2D3C4' }}
              className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="text-xs text-[#8F5B34] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5C351B]" />
                <span>Verified Christ University Units I &amp; II Curriculum Bank</span>
              </div>

              <button
                type="submit"
                style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                className="w-full sm:w-auto px-6 py-3 text-sm font-bold rounded-xl border hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
              >
                Start Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: EXAM RESULTS & OFFICIAL CERTIFICATE
  // -------------------------------------------------------------
  if (isFinished && resultRecord) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        <div
          id="printable-certificate"
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
          className="rounded-2xl border shadow-sm p-6 sm:p-10 relative overflow-hidden"
        >
          <div style={{ borderColor: '#DBC5B0' }} className="border-b pb-6 mb-6 text-center relative">
            <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase block mb-1">
              Department of Computer Science · Christ University
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5C351B] tracking-tight">
              Official Assessment Scorecard
            </h1>
            <p className="text-xs text-[#8F5B34] mt-1">
              Artificial Intelligence (Units I &amp; II) · Max Marks: 25.0
            </p>
          </div>

          <div
            style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border text-xs mb-8"
          >
            <div>
              <span className="text-[#8F5B34] block">Candidate Name</span>
              <span className="font-bold text-[#5C351B] text-sm">{resultRecord.studentName}</span>
            </div>
            <div>
              <span className="text-[#8F5B34] block">Roll / Reg Number</span>
              <span className="font-bold text-[#5C351B] text-sm font-mono">{resultRecord.rollNumber}</span>
            </div>
            <div>
              <span className="text-[#8F5B34] block">Date of Assessment</span>
              <span className="font-medium text-[#5C351B]">{resultRecord.date}</span>
            </div>
            <div>
              <span className="text-[#8F5B34] block">Time Elapsed</span>
              <span className="font-medium text-[#5C351B] tabular-nums">
                {Math.floor(resultRecord.durationSeconds / 60)}m {resultRecord.durationSeconds % 60}s
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              style={{ backgroundColor: '#DAB692', borderColor: '#C59B74', color: '#5C351B' }}
              className="p-6 rounded-xl border text-center flex flex-col justify-center shadow-xs"
            >
              <span className="text-xs font-bold uppercase tracking-wider">Score Obtained</span>
              <div className="text-4xl font-black my-1 tabular-nums">
                {resultRecord.score.toFixed(1)} <span className="text-lg font-bold">/ 25.0</span>
              </div>
              <span className="text-xs font-semibold">{resultRecord.percentage}% Overall Score</span>
            </div>

            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
              className="p-6 rounded-xl border text-center flex flex-col justify-center"
            >
              <span className="text-xs font-bold text-[#8F5B34] uppercase tracking-wider">Awarded Grade</span>
              <div className="text-2xl font-bold text-[#5C351B] my-1">
                {resultRecord.grade}
              </div>
              <span className="text-xs text-[#8F5B34]">Academic Standing</span>
            </div>

            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
              className="p-6 rounded-xl border text-center flex flex-col justify-center"
            >
              <span className="text-xs font-bold text-[#8F5B34] uppercase tracking-wider">Unit-Wise Breakdown</span>
              <div className="text-xs space-y-1.5 mt-2 text-[#5C351B] text-left">
                <div className="flex justify-between">
                  <span>Unit I (Foundations &amp; Agents):</span>
                  <span className="font-bold tabular-nums">{resultRecord.unit1Score.toFixed(1)} M</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit II (Search &amp; CSP/MEA):</span>
                  <span className="font-bold tabular-nums">{resultRecord.unit2Score.toFixed(1)} M</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ borderColor: '#E2D3C4' }}
            className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t print:hidden"
          >
            <button
              onClick={() => window.print()}
              style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border hover:bg-[#F2E8E0] font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#8F5B34]" />
              <span>Print Official Grade Report</span>
            </button>

            <button
              onClick={startExam}
              style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border font-bold text-xs hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Exam (New 10 Questions)</span>
            </button>
          </div>
        </div>

        {/* Detailed Review of All 10 Questions */}
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border shadow-sm p-6 sm:p-10 space-y-6"
        >
          <div style={{ borderColor: '#DBC5B0' }} className="border-b pb-4">
            <h2 className="text-xl font-bold text-[#5C351B]">Comprehensive Question-by-Question Review</h2>
            <p className="text-xs text-[#8F5B34] mt-0.5">
              Review correct answers, pedagogical explanations, and lecture slide citations.
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              let isCorrect = false;

              if (userAns !== undefined && userAns !== null && userAns !== '') {
                if (q.format === 'fill-blank') {
                  const formatted = String(userAns).trim().toLowerCase();
                  const acceptable = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
                  isCorrect = acceptable.includes(formatted) || formatted === String(q.correctAnswer).toLowerCase();
                } else if (q.format === 'match') {
                  const totalPairs = q.matchPairs?.length || 0;
                  const userPairs = userAns as Record<number, number>;
                  const keys = Object.keys(userPairs || {}).map(Number);
                  if (keys.length === totalPairs) {
                    isCorrect = keys.every(k => userPairs[k] === k);
                  }
                } else {
                  isCorrect = userAns === q.correctAnswer;
                }
              }

              return (
                <div
                  key={q.id}
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0' }}
                  className="p-5 rounded-xl border space-y-3"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-[#5C351B]">Question {idx + 1} of 10</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8F5B34]">{q.unit} · {q.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-bold ${isCorrect ? 'text-[#2D6A4F]' : 'text-[#C53030]'}`}>
                        {isCorrect ? `+${q.marks} Marks` : `0 / ${q.marks} Marks`}
                      </span>
                    </div>
                  </div>

                  <p className="font-bold text-[#5C351B] text-sm sm:text-base">{q.question}</p>

                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = userAns === oIdx;
                        const isExpected = q.correctAnswer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-lg border ${
                              isExpected
                                ? 'bg-[#EBF4EE] border-[#2D6A4F] text-[#1B4332] font-bold'
                                : isChosen
                                ? 'bg-[#FDEEEF] border-[#C53030] text-[#742A2A]'
                                : 'bg-[#FAF6F3] border-[#E2D3C4] text-[#8F5B34] opacity-80'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                            {isChosen && !isExpected && <span className="ml-2 text-[#C53030] font-bold">(Your Answer)</span>}
                            {isExpected && <span className="ml-2 text-[#2D6A4F] font-bold">(Correct)</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div
                    style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
                    className="mt-3 p-3.5 rounded-xl border text-xs leading-relaxed"
                  >
                    <span className="font-bold block mb-0.5">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: ACTIVE TEST TAKING SCREEN
  // -------------------------------------------------------------
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentAnswer = userAnswers[currentQuestion.id];
  const isMarked = !!markedForReview[currentQuestion.id];
  const currentEliminated = eliminatedMap[currentQuestion.id] || [];
  const currentHintText = hintsMap[currentQuestion.id] || null;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Test Banner */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="rounded-2xl border shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
          >
            {currentIndex + 1}/10
          </div>
          <div>
            <div className="text-sm font-bold text-[#5C351B]">{studentName}</div>
            <div className="text-xs text-[#8F5B34] font-mono">{rollNumber} · 25 Marks Assessment</div>
          </div>
        </div>

        {/* Lifelines */}
        <div className="flex items-center gap-2">
          {currentQuestion.options && currentQuestion.options.length > 2 && (
            <button
              type="button"
              onClick={handleUse5050}
              disabled={fiftyFiftyUsed[currentQuestion.id]}
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border hover:bg-[#E8DCCF] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#8F5B34]" />
              <span>50:50 Lifeline</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRequestHint}
            disabled={hintLoading || !!currentHintText}
            style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border hover:bg-[#E8DCCF] transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8F5B34]" />
            <span>{hintLoading ? 'Thinking...' : currentHintText ? 'Hint Active' : 'AI Hint'}</span>
          </button>
        </div>

        {/* Timer */}
        <div
          style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold tabular-nums ${
            timeLeft <= 120 ? 'animate-pulse text-[#C53030]' : ''
          }`}
        >
          <Clock className="w-4 h-4 text-[#8F5B34]" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Main Split Layout: Question Card (Left) + Question Palette (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 space-y-4">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={currentAnswer}
            onAnswer={handleAnswer}
            isSubmitted={false}
            showFeedbackImmediately={false}
            eliminatedOptions={currentEliminated}
            currentHint={currentHintText}
            hintLoading={hintLoading}
            onRequestHint={handleRequestHint}
            onAskAiTutor={onOpenAiTutorWithQuestion}
          />

          {/* Navigation Controls */}
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMarkReview}
                style={{
                  backgroundColor: isMarked ? '#DAB692' : '#FFFFFF',
                  borderColor: '#DBC5B0',
                  color: '#5C351B',
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(prev => Math.max(0, prev - 1));
                }}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border text-xs font-bold hover:bg-[#F2E8E0] disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
                  }}
                  style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border font-bold text-xs hover:bg-[#CCA076] transition-colors cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                  className="inline-flex items-center gap-1 px-5 py-2 rounded-xl border text-xs font-extrabold hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
                >
                  <span>Review &amp; Submit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette Matrix */}
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="lg:col-span-1 rounded-2xl border p-5 shadow-sm space-y-4"
        >
          <div>
            <div className="text-xs font-extrabold text-[#5C351B] uppercase tracking-wider">Question Palette</div>
            <div className="text-xs text-[#8F5B34] mt-0.5">Click number to jump</div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, qIdx) => {
              const answered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null && userAnswers[q.id] !== '';
              const marked = !!markedForReview[q.id];
              const isCurrent = qIdx === currentIndex;

              let btnBg = '#FFFFFF';
              let btnColor = '#5C351B';
              let btnBorder = '#DBC5B0';

              if (answered && marked) {
                btnBg = '#DAB692';
                btnBorder = '#8F5B34';
              } else if (answered) {
                btnBg = '#DAB692';
                btnBorder = '#C59B74';
              } else if (marked) {
                btnBg = '#F2E8E0';
                btnBorder = '#8F5B34';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIndex(qIdx);
                  }}
                  style={{
                    backgroundColor: btnBg,
                    color: btnColor,
                    borderColor: btnBorder,
                  }}
                  className={`h-9 rounded-xl border text-xs font-bold transition-all relative ${
                    isCurrent ? 'ring-2 ring-[#8F5B34] ring-offset-1' : ''
                  }`}
                >
                  {qIdx + 1}
                  {marked && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8F5B34]" />}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div
            style={{ borderColor: '#E2D3C4' }}
            className="pt-3 border-t text-xs space-y-2 text-[#8F5B34]"
          >
            <div className="flex items-center gap-2">
              <span style={{ backgroundColor: '#DAB692', borderColor: '#C59B74' }} className="w-3.5 h-3.5 rounded border" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ backgroundColor: '#F2E8E0', borderColor: '#8F5B34' }} className="w-3.5 h-3.5 rounded border" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0' }} className="w-3.5 h-3.5 rounded border" />
              <span>Not Answered</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
            className="w-full py-2.5 px-4 rounded-xl border font-bold text-xs hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-[#5C351B]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl max-w-md w-full p-6 shadow-xl border space-y-4"
          >
            <h3 className="text-lg font-bold text-[#5C351B]">Confirm Exam Submission?</h3>
            <p className="text-sm text-[#8F5B34] leading-relaxed">
              You have answered <span className="font-bold text-[#5C351B]">{Object.keys(userAnswers).length}</span> out of <span className="font-bold text-[#5C351B]">10</span> questions.
              Once submitted, your final marks out of 25 will be computed immediately.
            </p>
            <div
              style={{ borderColor: '#E2D3C4' }}
              className="flex justify-end gap-3 pt-3 border-t"
            >
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="px-4 py-2 text-xs font-bold border hover:bg-[#F2E8E0] rounded-xl transition-colors cursor-pointer"
              >
                Continue Answering
              </button>
              <button
                type="button"
                onClick={finishExam}
                style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                className="px-4 py-2 text-xs font-bold border hover:bg-[#CCA076] rounded-xl transition-colors cursor-pointer"
              >
                Yes, Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
