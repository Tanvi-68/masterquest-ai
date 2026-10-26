import React from 'react';
import { NavTab } from './Navbar';
import { sounds } from '../utils/audio';
import {
  GraduationCap,
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen,
  Compass,
  CheckCircle2,
  Trophy,
  Brain,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAiAssistant: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTab, onOpenAiAssistant }) => {
  const handleLaunch = (tab: NavTab) => {
    sounds.playClick();
    onSelectTab(tab);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Section */}
      <section
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="rounded-3xl border shadow-sm p-6 sm:p-12 relative overflow-hidden"
      >
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DAB692]/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8F5B34]/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Institution Header Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFE0] border border-[#DBC5B0] text-[#5C351B] text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#8F5B34]" />
            <span>Christ University · Artificial Intelligence (Units I &amp; II)</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#5C351B] tracking-tight leading-[1.1]">
              AI MasterQuest
            </h1>
            <p className="text-lg sm:text-xl font-medium text-[#8F5B34] leading-relaxed">
              Interactive Academic Quiz &amp; Concept Mastery Platform
            </p>
          </div>

          {/* Brief Description */}
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans max-w-2xl">
            Test and elevate your understanding of foundational Artificial Intelligence. From Turing
            Tests, Rational Agent Architectures, and PEAS Environment characterization to State-Space
            Formulations, Informed Heuristic Searches (A*, Hill Climbing), and Constraint Satisfaction Problems.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => handleLaunch('exam')}
              style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
              className="px-6 py-3.5 text-sm sm:text-base font-bold rounded-xl hover:bg-[#CCA076] shadow-sm transition-all flex items-center gap-2 cursor-pointer border border-[#C59B74] group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => handleLaunch('grumpy')}
              style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="px-5 py-3.5 text-sm font-bold rounded-xl border hover:bg-[#F2E8E0] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Grumpy Uncle Challenge</span>
              <span className="text-base">👴🏽</span>
              <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                Daily
              </span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#8F5B34' }}
              className="px-4 py-3.5 text-sm font-semibold rounded-xl border hover:bg-[#E8DCCF] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8F5B34]" />
              <span>AI Tutor</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Statistics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border p-4 sm:p-5 shadow-xs text-center space-y-1"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#5C351B]">62+</span>
          <span className="text-xs font-semibold text-[#8F5B34] block">Curriculum Questions</span>
        </div>

        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border p-4 sm:p-5 shadow-xs text-center space-y-1"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#5C351B]">2 Units</span>
          <span className="text-xs font-semibold text-[#8F5B34] block">Foundations &amp; Search</span>
        </div>

        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border p-4 sm:p-5 shadow-xs text-center space-y-1"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#5C351B]">25.0</span>
          <span className="text-xs font-semibold text-[#8F5B34] block">Maximum Marks Format</span>
        </div>

        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="rounded-2xl border p-4 sm:p-5 shadow-xs text-center space-y-1"
        >
          <span className="text-2xl sm:text-3xl font-black text-[#5C351B]">7 Formats</span>
          <span className="text-xs font-semibold text-[#8F5B34] block">MCQ, A-R, Match &amp; Fill</span>
        </div>
      </section>

      {/* Choose Your Mode Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8F5B34]">
              Select Your Learning Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#5C351B] tracking-tight">
              Explore Game &amp; Study Modes
            </h2>
          </div>
          <p className="text-xs text-[#8F5B34] max-w-sm">
            Choose how you want to prepare today. Everything is aligned with university lecture slides.
          </p>
        </div>

        {/* 6 Feature Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Quiz It (Exam Mode) */}
          <div
            onClick={() => handleLaunch('exam')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-[#CCA076] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#DAB692]/30 rounded-xl text-[#5C351B]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8DFE0] text-[#5C351B]">
                  Formal Test
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-[#8F5B34] transition-colors">
                Quiz It (Exam Mode)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Full 25-mark university simulation. 10 randomized balanced questions across Units I &amp; II
                with exam timer, 50:50 lifelines, review bookmarks, and instant certificate grading.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-[#5C351B]">
              <span>Take Quiz</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* 2. Grumpy Uncle Sharma */}
          <div
            onClick={() => handleLaunch('grumpy')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-100 rounded-xl text-2xl">
                  👴🏽
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Daily Challenge
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-amber-900 transition-colors">
                Grumpy Uncle Challenge
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Can you win over Uncle Sharma? Every correct answer brings him joy (+1), but wrong
                answers make him grumpier (-1). Reach peak Slay or face his hilarious taunts!
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-amber-900">
              <span>Challenge Uncle</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* 3. Unit Practice Mode */}
          <div
            onClick={() => handleLaunch('practice')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-[#CCA076] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#DAB692]/30 rounded-xl text-[#5C351B]">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8DFE0] text-[#5C351B]">
                  Self-Paced
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-[#8F5B34] transition-colors">
                Unit Practice
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Untimed practice with instant step-by-step explanations. Filter by Unit I or Unit II,
                question format, difficulty tier, or search specific keywords like heuristics or Turing test.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-[#5C351B]">
              <span>Practice Now</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* 4. Search Visualizer */}
          <div
            onClick={() => handleLaunch('sandbox')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-[#CCA076] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#DAB692]/30 rounded-xl text-[#5C351B]">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8DFE0] text-[#5C351B]">
                  Visual Tool
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-[#8F5B34] transition-colors">
                Search Visualizer
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Interactive State-Space sandbox. Experiment with 8-Puzzle tiles, Water Jug production rules,
                and step-by-step graph traversal algorithms comparing BFS, DFS, and A* expansions.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-[#5C351B]">
              <span>Open Visualizer</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* 5. Complete Question Bank */}
          <div
            onClick={() => handleLaunch('bank')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-[#CCA076] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#DAB692]/30 rounded-xl text-[#5C351B]">
                  <Brain className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8DFE0] text-[#5C351B]">
                  62 Questions
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-[#8F5B34] transition-colors">
                Question Bank
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Review the comprehensive academic question repository. Includes model answers, exact slide
                citations, hints, and curriculum learning notes for revision.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-[#5C351B]">
              <span>Explore Bank</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* 6. Results Log */}
          <div
            onClick={() => handleLaunch('leaderboard')}
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-[#CCA076] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-[#DAB692]/30 rounded-xl text-[#5C351B]">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E8DFE0] text-[#5C351B]">
                  Analytics
                </span>
              </div>
              <h3 className="text-lg font-black text-[#5C351B] group-hover:text-[#8F5B34] transition-colors">
                Results Log &amp; Records
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Track exam history, Uncle Challenge streaks, score percentages, and grade distributions.
                Export official CSV score sheets for faculty assessment reporting.
              </p>
            </div>
            <div className="pt-5 flex items-center justify-between text-xs font-bold text-[#8F5B34] group-hover:text-[#5C351B]">
              <span>View Results</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Coverage Summary */}
      <section
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="rounded-3xl border p-6 sm:p-8 space-y-4"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8F5B34]">
          <Zap className="w-4 h-4 text-[#8F5B34]" />
          <span>Curriculum Blueprint Overview</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-[#F2E8E0] rounded-2xl border border-[#DBC5B0] space-y-2">
            <h4 className="font-bold text-sm text-[#5C351B]">
              Unit I: Foundations &amp; Rational Agents
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 font-sans">
              <li>• Definitions of AI &amp; Historical Origins (McCarthy, Turing, Dartmouth)</li>
              <li>• Turing Test, Chinese Room Argument &amp; Operational Evaluation</li>
              <li>• Rational Agent Architectures (Reflex, Model-based, Goal, Utility, Learning)</li>
              <li>• PEAS Specification (Performance, Environment, Actuators, Sensors)</li>
              <li>• Environment Properties (Observable, Deterministic, Episodic, Static, Discrete)</li>
            </ul>
          </div>

          <div className="p-4 bg-[#F2E8E0] rounded-2xl border border-[#DBC5B0] space-y-2">
            <h4 className="font-bold text-sm text-[#5C351B]">
              Unit II: Problem Solving &amp; Heuristic Search
            </h4>
            <ul className="text-xs text-stone-700 space-y-1 font-sans">
              <li>• Problem Formulation &amp; State Space Search (8-Puzzle, Water Jug, Missionaries)</li>
              <li>• Uninformed Search: BFS, DFS, Depth-Limited, IDDFS, Uniform Cost</li>
              <li>• Informed Search: Best-First Search, Greedy, A* Algorithm (f = g + h)</li>
              <li>• Heuristic Properties: Admissibility, Consistency, Dominance</li>
              <li>• Local Search (Hill Climbing, Plateaus, Ridges, Local Maxima) &amp; CSP</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
