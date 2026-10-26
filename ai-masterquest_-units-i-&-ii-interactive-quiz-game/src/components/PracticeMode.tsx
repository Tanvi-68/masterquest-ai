import React, { useState, useMemo } from 'react';
import { QuizQuestion, QUIZ_QUESTIONS } from '../data/quizQuestions';
import { QuestionCard } from './QuestionCard';
import { Search, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PracticeModeProps {
  onOpenAiTutorWithQuestion: (q: QuizQuestion) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({ onOpenAiTutorWithQuestion }) => {
  const [selectedUnit, setSelectedUnit] = useState<'All' | 'Unit I' | 'Unit II'>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single' | 'list'>('single');

  const filteredQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter(q => {
      if (selectedUnit !== 'All' && q.unit !== selectedUnit) return false;
      if (selectedFormat === 'scenarios' && !q.isRealWorldScenario) return false;
      if (selectedFormat === 'problem-solving' && !q.isSearchProblemSolving) return false;
      if (selectedFormat !== 'all' && selectedFormat !== 'scenarios' && selectedFormat !== 'problem-solving') {
        if (q.format !== selectedFormat) return false;
      }
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic.toLowerCase().includes(query);
        const matchesExpl = q.explanation.toLowerCase().includes(query);
        if (!matchesText && !matchesTopic && !matchesExpl) return false;
      }
      return true;
    });
  }, [selectedUnit, selectedFormat, selectedDifficulty, searchQuery]);

  const safeIndex = Math.min(activeQuestionIndex, Math.max(0, filteredQuestions.length - 1));

  const stats = useMemo(() => {
    let attempted = 0;
    let correct = 0;

    Object.keys(userAnswers).forEach(qId => {
      const q = QUIZ_QUESTIONS.find(item => item.id === qId);
      if (!q) return;
      attempted++;

      const userAns = userAnswers[qId];
      if (q.format === 'fill-blank') {
        const formatted = String(userAns).trim().toLowerCase();
        const acceptable = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
        if (acceptable.includes(formatted) || formatted === String(q.correctAnswer).toLowerCase()) {
          correct++;
        }
      } else if (q.format === 'match') {
        const totalPairs = q.matchPairs?.length || 0;
        const userPairs = userAns as Record<number, number>;
        const keys = Object.keys(userPairs || {}).map(Number);
        if (keys.length === totalPairs && keys.every(k => userPairs[k] === k)) {
          correct++;
        }
      } else {
        if (userAns === q.correctAnswer) correct++;
      }
    });

    return { attempted, correct, accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0 };
  }, [userAnswers]);

  const handleAnswer = (qId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
    const q = QUIZ_QUESTIONS.find(item => item.id === qId);
    if (!q) return;

    let isCorrect = false;
    if (q.format === 'fill-blank') {
      const formatted = String(answer).trim().toLowerCase();
      const acceptable = q.acceptableAnswers?.map(a => a.toLowerCase()) || [];
      isCorrect = acceptable.includes(formatted) || formatted === String(q.correctAnswer).toLowerCase();
    } else if (q.format === 'match') {
      const totalPairs = q.matchPairs?.length || 0;
      const userPairs = answer as Record<number, number>;
      const keys = Object.keys(userPairs || {}).map(Number);
      isCorrect = keys.length === totalPairs && keys.every(k => userPairs[k] === k);
    } else {
      isCorrect = answer === q.correctAnswer;
    }

    if (isCorrect) sounds.playCorrect();
    else sounds.playIncorrect();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="rounded-2xl border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase block mb-1">
            Curriculum Practice Mode
          </span>
          <h1 className="text-2xl font-extrabold text-[#5C351B] tracking-tight">
            Units I &amp; II Question Repository
          </h1>
          <p className="text-xs text-[#8F5B34] mt-1">
            Practice across all 62 syllabus questions with immediate feedback, slide citations, and AI explanations.
          </p>
        </div>

        {/* Live Practice Stats */}
        <div
          style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
          className="flex items-center gap-4 border rounded-xl p-3 sm:px-5 shrink-0 text-xs"
        >
          <div>
            <span className="text-[#8F5B34] block font-medium">Attempted</span>
            <span className="text-lg font-bold text-[#5C351B] tabular-nums">
              {stats.attempted} <span className="text-xs font-normal opacity-70">/ {filteredQuestions.length}</span>
            </span>
          </div>
          <div style={{ backgroundColor: '#DBC5B0' }} className="w-px h-8" />
          <div>
            <span className="text-[#8F5B34] block font-medium">Correct</span>
            <span className="text-lg font-bold text-[#2D6A4F] tabular-nums">{stats.correct}</span>
          </div>
          <div style={{ backgroundColor: '#DBC5B0' }} className="w-px h-8" />
          <div>
            <span className="text-[#8F5B34] block font-medium">Accuracy</span>
            <span className="text-lg font-bold text-[#5C351B] tabular-nums">{stats.accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="rounded-2xl border shadow-sm p-4 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div style={{ backgroundColor: '#F2E8E0' }} className="flex items-center gap-1 p-1 rounded-xl">
            {(['All', 'Unit I', 'Unit II'] as const).map(unit => (
              <button
                key={unit}
                onClick={() => {
                  sounds.playClick();
                  setSelectedUnit(unit);
                  setActiveQuestionIndex(0);
                }}
                style={{
                  backgroundColor: selectedUnit === unit ? '#DAB692' : 'transparent',
                  color: selectedUnit === unit ? '#5C351B' : '#8F5B34',
                }}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {unit === 'All' ? 'All Units (62 Qs)' : unit}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div style={{ backgroundColor: '#F2E8E0' }} className="flex items-center gap-1 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('single')}
              style={{
                backgroundColor: viewMode === 'single' ? '#DAB692' : 'transparent',
                color: viewMode === 'single' ? '#5C351B' : '#8F5B34',
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Step-by-Step
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                backgroundColor: viewMode === 'list' ? '#DAB692' : 'transparent',
                color: viewMode === 'list' ? '#5C351B' : '#8F5B34',
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Browse All
            </button>
          </div>
        </div>

        {/* Secondary Filter Dropdowns & Search */}
        <div
          style={{ borderColor: '#E2D3C4' }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t text-xs"
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8F5B34] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveQuestionIndex(0);
              }}
              placeholder="Search concepts (e.g. A*, PEAS, BFS)..."
              style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
            />
          </div>

          <select
            value={selectedFormat}
            onChange={(e) => {
              setSelectedFormat(e.target.value);
              setActiveQuestionIndex(0);
            }}
            style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
          >
            <option value="all">All Formats</option>
            <option value="mcq">Multiple Choice</option>
            <option value="true-false">True / False</option>
            <option value="assertion-reason">Assertion – Reason</option>
            <option value="fill-blank">Fill in the Blank</option>
            <option value="match">Match the Following</option>
            <option value="scenarios">Real-World Scenarios (10+)</option>
            <option value="problem-solving">State-Space Problems (5+)</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setActiveQuestionIndex(0);
            }}
            style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
            className="w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredQuestions.length === 0 ? (
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border p-12 text-center space-y-3"
        >
          <BookOpen className="w-8 h-8 text-[#8F5B34] mx-auto opacity-60" />
          <h3 className="text-base font-bold text-[#5C351B]">No questions match your current filter</h3>
          <p className="text-xs text-[#8F5B34] max-w-sm mx-auto">
            Try resetting your search query or selecting "All Units" and "All Formats".
          </p>
          <button
            onClick={() => {
              setSelectedUnit('All');
              setSelectedFormat('all');
              setSelectedDifficulty('all');
              setSearchQuery('');
            }}
            style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
            className="px-4 py-2 text-xs font-bold border rounded-xl hover:bg-[#CCA076] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'single' ? (
        <div className="space-y-4">
          <QuestionCard
            question={filteredQuestions[safeIndex]}
            questionNumber={safeIndex + 1}
            totalQuestions={filteredQuestions.length}
            selectedAnswer={userAnswers[filteredQuestions[safeIndex].id]}
            onAnswer={(ans) => handleAnswer(filteredQuestions[safeIndex].id, ans)}
            isSubmitted={userAnswers[filteredQuestions[safeIndex].id] !== undefined}
            showFeedbackImmediately={true}
            onAskAiTutor={onOpenAiTutorWithQuestion}
          />

          {/* Stepper Footer */}
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-4 shadow-sm flex items-center justify-between gap-4"
          >
            <button
              disabled={safeIndex === 0}
              onClick={() => {
                sounds.playClick();
                setActiveQuestionIndex(prev => Math.max(0, prev - 1));
              }}
              style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#F2E8E0] disabled:opacity-30 transition-colors cursor-pointer"
            >
              Previous Question
            </button>

            <span className="text-xs font-mono font-bold text-[#5C351B] tabular-nums">
              Question {safeIndex + 1} of {filteredQuestions.length}
            </span>

            <button
              disabled={safeIndex >= filteredQuestions.length - 1}
              onClick={() => {
                sounds.playClick();
                setActiveQuestionIndex(prev => Math.min(filteredQuestions.length - 1, prev + 1));
              }}
              style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
              className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#CCA076] disabled:opacity-30 transition-colors cursor-pointer"
            >
              Next Question
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={idx + 1}
              totalQuestions={filteredQuestions.length}
              selectedAnswer={userAnswers[q.id]}
              onAnswer={(ans) => handleAnswer(q.id, ans)}
              isSubmitted={userAnswers[q.id] !== undefined}
              showFeedbackImmediately={true}
              onAskAiTutor={onOpenAiTutorWithQuestion}
            />
          ))}
        </div>
      )}
    </div>
  );
};
