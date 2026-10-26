import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../data/quizQuestions';
import { Sparkles, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: any;
  onAnswer: (answer: any) => void;
  isSubmitted?: boolean;
  showFeedbackImmediately?: boolean;
  eliminatedOptions?: number[]; // for 50:50 lifeline
  onAskAiTutor?: (question: QuizQuestion) => void;
  onRequestHint?: () => void;
  currentHint?: string | null;
  hintLoading?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  isSubmitted = false,
  showFeedbackImmediately = false,
  eliminatedOptions = [],
  onAskAiTutor,
  onRequestHint,
  currentHint,
  hintLoading = false,
}) => {
  const [blankInput, setBlankInput] = useState<string>('');
  const [matchSelections, setMatchSelections] = useState<Record<number, number>>({});

  useEffect(() => {
    if (question.format === 'fill-blank') {
      setBlankInput(typeof selectedAnswer === 'string' ? selectedAnswer : '');
    } else if (question.format === 'match') {
      setMatchSelections(typeof selectedAnswer === 'object' && selectedAnswer !== null ? selectedAnswer : {});
    }
  }, [question.id, selectedAnswer]);

  const handleMcqSelect = (idx: number) => {
    if (isSubmitted && showFeedbackImmediately) return;
    sounds.playClick();
    onAnswer(idx);
  };

  const handleFillBlankSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted && showFeedbackImmediately) return;
    const trimmed = blankInput.trim();
    if (trimmed) {
      sounds.playClick();
      onAnswer(trimmed);
    }
  };

  const handleMatchSelect = (leftIdx: number, rightIdx: number) => {
    if (isSubmitted && showFeedbackImmediately) return;
    const updated = { ...matchSelections, [leftIdx]: rightIdx };
    setMatchSelections(updated);
    sounds.playClick();
    onAnswer(updated);
  };

  // Determine correctness for feedback display
  const isAnswerGiven = selectedAnswer !== undefined && selectedAnswer !== null && selectedAnswer !== '';
  let isCorrect = false;

  if (isAnswerGiven) {
    if (question.format === 'fill-blank') {
      const userAnswer = String(selectedAnswer).trim().toLowerCase();
      const acceptable = question.acceptableAnswers?.map(a => a.toLowerCase()) || [];
      const primary = String(question.correctAnswer).toLowerCase();
      isCorrect = acceptable.includes(userAnswer) || userAnswer === primary;
    } else if (question.format === 'match') {
      const totalPairs = question.matchPairs?.length || 0;
      const matchedKeys = Object.keys(matchSelections).map(Number);
      if (matchedKeys.length === totalPairs) {
        isCorrect = matchedKeys.every(k => matchSelections[k] === k);
      }
    } else {
      isCorrect = selectedAnswer === question.correctAnswer;
    }
  }

  const formatBadgeText = () => {
    switch (question.format) {
      case 'mcq': return 'Multiple Choice';
      case 'true-false': return 'True / False';
      case 'assertion-reason': return 'Assertion – Reason';
      case 'fill-blank': return 'Fill in the Blank';
      case 'match': return 'Match the Following';
      case 'scenario': return 'Real-World Scenario';
      case 'problem-solving': return 'State-Space Calculation';
      default: return 'Question';
    }
  };

  return (
    <div
      style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
      className="rounded-2xl border shadow-sm p-6 sm:p-8 transition-all"
    >
      {/* Question Header Metadata */}
      <div
        style={{ borderColor: '#E2D3C4' }}
        className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b text-xs text-[#8F5B34]"
      >
        <div className="flex items-center gap-2 font-medium">
          <span className="text-[#5C351B] font-bold">{question.unit}</span>
          <span aria-hidden="true">·</span>
          <span>{question.topic}</span>
          {question.subtopic && (
            <>
              <span aria-hidden="true">·</span>
              <span className="hidden sm:inline">{question.subtopic}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>{formatBadgeText()}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-[#5C351B]">{question.difficulty}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-bold text-[#5C351B]">{question.marks} Marks</span>
        </div>
      </div>

      {/* Scenario / Context Banner if present */}
      {question.scenarioContext && (
        <div
          style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
          className="mb-5 p-4 rounded-xl border text-sm leading-relaxed"
        >
          <div className="text-xs font-bold text-[#8F5B34] uppercase tracking-wider mb-1">Context / Problem Formulation</div>
          <div className="whitespace-pre-line">{question.scenarioContext}</div>
        </div>
      )}

      {/* Question Title */}
      <div className="mb-6">
        <div className="text-xs font-bold text-[#8F5B34] mb-1 uppercase tracking-wider">
          QUESTION {questionNumber} OF {totalQuestions}
        </div>
        <h2 className="text-lg sm:text-xl font-extrabold text-[#5C351B] leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Assertion - Reason Context if present */}
      {question.format === 'assertion-reason' && question.assertion && question.reason && (
        <div
          style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
          className="space-y-3 mb-6 p-4 rounded-xl border text-sm"
        >
          <div>
            <span className="font-bold text-[#5C351B] mr-2">Assertion (A):</span>
            <span>{question.assertion}</span>
          </div>
          <div>
            <span className="font-bold text-[#5C351B] mr-2">Reason (R):</span>
            <span>{question.reason}</span>
          </div>
        </div>
      )}

      {/* Interactive Options Area based on Format */}
      <div className="mt-4 mb-6">
        {question.options && question.options.length > 0 && (
          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isEliminated = eliminatedOptions.includes(idx);
              const isCorrectOption = question.correctAnswer === idx;

              let customStyle: React.CSSProperties = {
                backgroundColor: '#FFFFFF',
                borderColor: '#DBC5B0',
                color: '#5C351B',
              };
              let badgeBg = '#F2E8E0';
              let badgeColor = '#5C351B';

              if (showFeedbackImmediately && isSubmitted) {
                if (isCorrectOption) {
                  customStyle = { backgroundColor: '#EBF4EE', borderColor: '#2D6A4F', color: '#1B4332' };
                  badgeBg = '#2D6A4F';
                  badgeColor = '#FFFFFF';
                } else if (isSelected && !isCorrectOption) {
                  customStyle = { backgroundColor: '#FDEEEF', borderColor: '#C53030', color: '#742A2A' };
                  badgeBg = '#C53030';
                  badgeColor = '#FFFFFF';
                } else {
                  customStyle = { backgroundColor: '#FAF6F3', borderColor: '#E2D3C4', color: '#A37957', opacity: 0.6 };
                }
              } else if (isSelected) {
                customStyle = { backgroundColor: '#DAB692', borderColor: '#C59B74', color: '#5C351B', fontWeight: 'bold' };
                badgeBg = '#5C351B';
                badgeColor = '#FFFFFF';
              }

              if (isEliminated) {
                customStyle = { borderColor: '#E2D3C4', opacity: 0.3, textDecoration: 'line-through', cursor: 'not-allowed' };
              }

              return (
                <button
                  key={idx}
                  type="button"
                  style={customStyle}
                  disabled={isEliminated || (showFeedbackImmediately && isSubmitted)}
                  onClick={() => handleMcqSelect(idx)}
                  className="w-full flex items-start text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer shadow-xs hover:border-[#C59B74]"
                >
                  <span
                    style={{ backgroundColor: badgeBg, color: badgeColor }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 mr-3.5 mt-0.5"
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-sm sm:text-base leading-relaxed">
                    {option}
                  </span>
                  {showFeedbackImmediately && isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 ml-2 mt-0.5" />
                  )}
                  {showFeedbackImmediately && isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-[#C53030] shrink-0 ml-2 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank */}
        {question.format === 'fill-blank' && (
          <form onSubmit={handleFillBlankSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={blankInput}
                disabled={showFeedbackImmediately && isSubmitted}
                onChange={(e) => setBlankInput(e.target.value)}
                placeholder="Type your answer here..."
                style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#DAB692] text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={!blankInput.trim() || (showFeedbackImmediately && isSubmitted)}
                style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                className="px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#CCA076] disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer border border-[#C59B74]"
              >
                Confirm Input
              </button>
            </div>
            {isAnswerGiven && !showFeedbackImmediately && (
              <p className="text-xs text-[#8F5B34]">
                Recorded response: <span className="font-bold text-[#5C351B] font-mono">"{selectedAnswer}"</span>
              </p>
            )}
            {showFeedbackImmediately && isSubmitted && (
              <div
                style={{
                  backgroundColor: isCorrect ? '#EBF4EE' : '#FDEEEF',
                  borderColor: isCorrect ? '#2D6A4F' : '#C53030',
                  color: isCorrect ? '#1B4332' : '#742A2A',
                }}
                className="p-3.5 rounded-xl border text-sm"
              >
                <div className="font-bold">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                <div className="text-xs mt-0.5">
                  Expected answer: <span className="font-bold font-mono">{question.correctAnswer}</span>
                  {question.acceptableAnswers && question.acceptableAnswers.length > 1 && (
                    <span> (Also accepted: {question.acceptableAnswers.join(', ')})</span>
                  )}
                </div>
              </div>
            )}
          </form>
        )}

        {/* Match the Following */}
        {question.format === 'match' && question.matchPairs && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#8F5B34] uppercase tracking-wider">
              Pair each item from Column A with Column B:
            </div>
            <div className="space-y-3">
              {question.matchPairs.map((pair, leftIdx) => {
                const selectedRightIdx = matchSelections[leftIdx];
                const isItemCorrect = selectedRightIdx === leftIdx;

                return (
                  <div
                    key={pair.id}
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0' }}
                    className="p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="font-medium text-sm text-[#5C351B] md:w-1/2">
                      <span
                        style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                        className="inline-block w-5 h-5 text-center rounded text-xs leading-5 font-bold mr-2"
                      >
                        {leftIdx + 1}
                      </span>
                      {pair.left}
                    </div>

                    <div className="md:w-1/2">
                      <select
                        value={selectedRightIdx !== undefined ? selectedRightIdx : ''}
                        disabled={showFeedbackImmediately && isSubmitted}
                        onChange={(e) => handleMatchSelect(leftIdx, Number(e.target.value))}
                        style={{ borderColor: '#DBC5B0', backgroundColor: '#FAF6F3', color: '#5C351B' }}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border focus:ring-2 focus:ring-[#DAB692]"
                      >
                        <option value="">-- Select Matching Option --</option>
                        {question.matchPairs!.map((rp, rightIdx) => (
                          <option key={rp.id} value={rightIdx}>
                            {String.fromCharCode(65 + rightIdx)}. {rp.right}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lifeline and Hint Display */}
      {currentHint && (
        <div
          style={{ backgroundColor: '#F4ECE4', borderColor: '#DAB692', color: '#5C351B' }}
          className="mb-5 p-4 rounded-xl border text-sm flex items-start gap-3"
        >
          <Lightbulb className="w-5 h-5 text-[#8F5B34] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#8F5B34] block text-xs uppercase tracking-wider mb-0.5">Hint Lifeline</span>
            <span>{currentHint}</span>
          </div>
        </div>
      )}

      {/* Detailed Feedback & Pedagogical Explanation */}
      {showFeedbackImmediately && isSubmitted && (
        <div
          style={{ borderColor: '#E2D3C4' }}
          className="mt-6 pt-5 border-t space-y-3"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {isCorrect ? (
              <span className="flex items-center gap-1.5 text-[#2D6A4F]">
                <CheckCircle2 className="w-4 h-4" /> Correct (+{question.marks} marks)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[#C53030]">
                <XCircle className="w-4 h-4" /> Incorrect (0 / {question.marks} marks)
              </span>
            )}
          </div>

          <div
            style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
            className="p-4 rounded-xl border text-sm leading-relaxed space-y-2"
          >
            <div className="font-bold text-[#8F5B34] text-xs uppercase tracking-wider">Concept Explanation &amp; Lecture Reference</div>
            <p>{question.explanation}</p>
          </div>

          {onAskAiTutor && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onAskAiTutor(question)}
                style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold border hover:bg-[#CCA076] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5C351B]" />
                Ask AI Professor to Explain This Deeper
              </button>
            </div>
          )}
        </div>
      )}

      {/* Card Action Strip */}
      {!isSubmitted && (
        <div
          style={{ borderColor: '#E2D3C4' }}
          className="pt-4 mt-2 border-t flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2">
            {onRequestHint && (
              <button
                type="button"
                onClick={onRequestHint}
                disabled={hintLoading || !!currentHint}
                style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold hover:bg-[#E8DCCF] transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-[#8F5B34]" />
                <span>{hintLoading ? 'Generating hint...' : currentHint ? 'Hint Revealed' : 'Get Lifeline Hint'}</span>
              </button>
            )}
          </div>

          {onAskAiTutor && (
            <button
              type="button"
              onClick={() => onAskAiTutor(question)}
              className="inline-flex items-center gap-1.5 text-[#8F5B34] hover:text-[#5C351B] font-bold transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Concept Tutor</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
