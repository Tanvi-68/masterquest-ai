import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ExamMode, ExamRecord } from './components/ExamMode';
import { PracticeMode } from './components/PracticeMode';
import { StateSpaceSandbox } from './components/StateSpaceSandbox';
import { QuestionBankView } from './components/QuestionBankView';
import { LeaderboardView } from './components/LeaderboardView';
import { AiProfessorDrawer } from './components/AiProfessorDrawer';
import { QuizQuestion } from './data/quizQuestions';
import { sounds } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('exam');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // AI Assistant Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [selectedQuestionForAi, setSelectedQuestionForAi] = useState<QuizQuestion | null>(null);

  // Leaderboard / Past Records in LocalStorage
  const [examRecords, setExamRecords] = useState<ExamRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ai_quiz_records');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const handleSaveRecord = (record: ExamRecord) => {
    setExamRecords(prev => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem('ai_quiz_records', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearRecords = () => {
    setExamRecords([]);
    try {
      localStorage.removeItem('ai_quiz_records');
    } catch {
      // ignore
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sounds.enabled = nextState;
  };

  const handleOpenAiTutorWithQuestion = (q: QuizQuestion) => {
    sounds.playClick();
    setSelectedQuestionForAi(q);
    setIsAiDrawerOpen(true);
  };

  return (
    <div
      style={{ backgroundColor: '#E8DFE0', color: '#8F5B34' }}
      className="min-h-screen flex flex-col font-sans selection:bg-[#DAB692]/40 selection:text-[#5C351B]"
    >
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAiAssistant={() => {
          sounds.playClick();
          setSelectedQuestionForAi(null);
          setIsAiDrawerOpen(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'exam' && (
          <ExamMode
            onOpenAiTutorWithQuestion={handleOpenAiTutorWithQuestion}
            onSaveRecord={handleSaveRecord}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeMode
            onOpenAiTutorWithQuestion={handleOpenAiTutorWithQuestion}
          />
        )}

        {activeTab === 'sandbox' && (
          <StateSpaceSandbox />
        )}

        {activeTab === 'bank' && (
          <QuestionBankView />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            records={examRecords}
            onClearRecords={handleClearRecords}
            onTakeExam={() => {
              sounds.playClick();
              setActiveTab('exam');
            }}
          />
        )}
      </main>

      {/* AI Professor Concept Explainer Drawer */}
      <AiProfessorDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        selectedQuestionForAi={selectedQuestionForAi}
      />

      {/* Clean Academic Footer */}
      <footer
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="border-t py-6 text-xs text-center"
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#5C351B]">Christ University</span>
            <span aria-hidden="true">·</span>
            <span>Artificial Intelligence (Units I &amp; II) Assessment</span>
          </div>
          <div className="text-[#8F5B34]">
            <span>62 Questions Repository</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span>Maximum Marks: 25.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
