import React from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Home } from 'lucide-react';
import { sounds } from '../utils/audio';

export type NavTab = 'home' | 'exam' | 'grumpy' | 'practice' | 'sandbox' | 'bank' | 'leaderboard';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAiAssistant: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAiAssistant,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header
      style={{ backgroundColor: 'rgba(250, 246, 243, 0.95)', borderColor: '#DBC5B0' }}
      className="sticky top-0 z-40 backdrop-blur-sm border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (links to Home) */}
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('home');
          }}
          className="text-left font-bold tracking-tight text-[#5C351B] text-lg hover:text-[#8F5B34] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>AI MasterQuest</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-medium text-[#8F5B34]">
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('home');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('exam');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'exam'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            Quiz It
          </button>

          {/* Grumpy Uncle Daily Challenge Tab */}
          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('grumpy');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grumpy'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            <span>Grumpy Uncle</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              Daily
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('practice');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'practice'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            Unit Practice
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('sandbox');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            Search Visualizer
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('bank');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'bank'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            Question Bank
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onSelectTab('leaderboard');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'text-[#5C351B] font-bold border-b-2 border-[#DAB692] pb-0.5'
                : 'hover:text-[#5C351B]'
            }`}
          >
            Results Log
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            className="p-2 text-[#8F5B34] hover:text-[#5C351B] rounded-lg hover:bg-[#F2E8E0] transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>

          <button
            type="button"
            onClick={onOpenAiAssistant}
            style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#8F5B34' }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-[#E8DCCF] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8F5B34]" />
            <span>AI Tutor</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onSelectTab('exam');
            }}
            style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
            className="px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#CCA076] shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer border border-[#C59B74]"
          >
            Take a quiz
          </button>
        </div>
      </div>

      {/* Mobile Nav strip */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="md:hidden flex items-center justify-around border-t px-2 py-2 overflow-x-auto text-xs gap-1"
      >
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('home');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'home' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('exam');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'exam' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Quiz It
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('grumpy');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'grumpy' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          <span>Uncle</span>
          <span className="text-[10px]">🔥</span>
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('practice');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'practice' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Practice
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('sandbox');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'sandbox' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Visualizer
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('bank');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'bank' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Q-Bank
        </button>
        <button
          onClick={() => {
            sounds.playClick();
            onSelectTab('leaderboard');
          }}
          className={`px-2 py-1 rounded whitespace-nowrap ${
            activeTab === 'leaderboard' ? 'font-bold text-[#5C351B] bg-[#DAB692]/30' : 'text-[#8F5B34]'
          }`}
        >
          Results
        </button>
      </div>
    </header>
  );
};
