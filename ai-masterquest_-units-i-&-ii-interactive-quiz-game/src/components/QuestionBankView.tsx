import React, { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { Search, Printer, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

export const QuestionBankView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<'All' | 'Unit I' | 'Unit II'>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(true);

  const filteredQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter(q => {
      if (selectedUnit !== 'All' && q.unit !== selectedUnit) return false;
      if (selectedFormat === 'scenarios' && !q.isRealWorldScenario) return false;
      if (selectedFormat === 'problem-solving' && !q.isSearchProblemSolving) return false;
      if (selectedFormat !== 'all' && selectedFormat !== 'scenarios' && selectedFormat !== 'problem-solving') {
        if (q.format !== selectedFormat) return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.question.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          q.explanation.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedUnit, selectedFormat, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="rounded-2xl border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase block mb-1">
            Official Course Submission Repository
          </span>
          <h1 className="text-2xl font-extrabold text-[#5C351B] tracking-tight">
            Comprehensive Question Bank with Answer Keys
          </h1>
          <p className="text-xs text-[#8F5B34] mt-1">
            Complete repository of {QUIZ_QUESTIONS.length} curated questions spanning Units I &amp; II of Artificial Intelligence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowAllAnswers(!showAllAnswers);
            }}
            style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold hover:bg-[#F2E8E0] transition-colors cursor-pointer"
          >
            {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showAllAnswers ? 'Hide Answers' : 'Show All Answers'}</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-xs hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="rounded-2xl border shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden"
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8F5B34] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in question bank..."
              style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
            />
          </div>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value as any)}
            style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
            className="px-3 py-2 rounded-xl border text-xs font-medium"
          >
            <option value="All">All Units ({QUIZ_QUESTIONS.length})</option>
            <option value="Unit I">Unit I Only</option>
            <option value="Unit II">Unit II Only</option>
          </select>
        </div>

        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
          className="px-3 py-2 rounded-xl border text-xs font-medium w-full sm:w-auto"
        >
          <option value="all">All Formats</option>
          <option value="mcq">MCQ</option>
          <option value="true-false">True/False</option>
          <option value="assertion-reason">Assertion-Reason</option>
          <option value="fill-blank">Fill in Blank</option>
          <option value="match">Match Following</option>
          <option value="scenarios">Real-World Scenarios</option>
          <option value="problem-solving">State-Space Problems</option>
        </select>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3"
          >
            <div
              style={{ borderColor: '#E2D3C4' }}
              className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b text-[#8F5B34]"
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#5C351B]">Q{idx + 1}.</span>
                <span className="font-bold text-[#5C351B]">{q.unit} · {q.topic}</span>
                {q.subtopic && <span>({q.subtopic})</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="capitalize">{q.format}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums font-bold text-[#5C351B]">{q.marks} Marks</span>
              </div>
            </div>

            {q.scenarioContext && (
              <div
                style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="p-3 border rounded-xl text-xs leading-relaxed"
              >
                <span className="font-bold text-[#8F5B34] block mb-0.5">Problem / Scenario Context:</span>
                {q.scenarioContext}
              </div>
            )}

            <p className="font-bold text-[#5C351B] text-sm">{q.question}</p>

            {q.assertion && q.reason && (
              <div style={{ backgroundColor: '#F2E8E0' }} className="p-3 rounded-xl text-xs space-y-1 text-[#5C351B]">
                <div><span className="font-bold">Assertion (A):</span> {q.assertion}</div>
                <div><span className="font-bold">Reason (R):</span> {q.reason}</div>
              </div>
            )}

            {/* Options */}
            {q.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = q.correctAnswer === oIdx;
                  return (
                    <div
                      key={oIdx}
                      style={{
                        backgroundColor: showAllAnswers && isCorrect ? '#EBF4EE' : '#FFFFFF',
                        borderColor: showAllAnswers && isCorrect ? '#2D6A4F' : '#DBC5B0',
                        color: showAllAnswers && isCorrect ? '#1B4332' : '#5C351B',
                      }}
                      className="p-2.5 rounded-xl border flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                      </div>
                      {showAllAnswers && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 ml-1.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Match Pairs */}
            {q.format === 'match' && q.matchPairs && (
              <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-3 rounded-xl border text-xs space-y-1.5">
                <div className="font-bold text-[#5C351B]">Correct Pair Mappings:</div>
                {q.matchPairs.map((pair, pIdx) => (
                  <div key={pair.id} className="flex justify-between items-center text-[#5C351B]">
                    <span>{pIdx + 1}. {pair.left}</span>
                    <span className="text-[#8F5B34]">&rarr;</span>
                    <span className="font-bold text-[#2D6A4F]">{pair.right}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Answer & Explanation reveal */}
            {showAllAnswers && (
              <div
                style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="mt-3 p-3.5 rounded-xl border text-xs space-y-1"
              >
                {q.format === 'fill-blank' && (
                  <div>
                    <span className="font-bold text-[#2D6A4F] mr-2">Correct Blank:</span>
                    <span className="font-mono font-bold text-[#5C351B]">{q.correctAnswer}</span>
                  </div>
                )}
                <div>
                  <span className="font-bold text-[#8F5B34] mr-1.5">Lecture Slide Reference &amp; Explanation:</span>
                  <span>{q.explanation}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
