import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, Check, Copy } from 'lucide-react';
import { QuizQuestion } from '../data/quizQuestions';
import { sounds } from '../utils/audio';

interface AiProfessorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestionForAi: QuizQuestion | null;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  topic?: string;
}

export const AiProfessorDrawer: React.FC<AiProfessorDrawerProps> = ({
  isOpen,
  onClose,
  selectedQuestionForAi,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Concept Professor for Artificial Intelligence (Units I & II). Feel free to ask about Rational Agents, PEAS, Search Algorithms, Hill Climbing, A*, CSPs, or Means-Ends Analysis!',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (selectedQuestionForAi && isOpen) {
      handleAskQuestionContext(selectedQuestionForAi);
    }
  }, [selectedQuestionForAi, isOpen]);

  const handleAskQuestionContext = async (q: QuizQuestion) => {
    const studentPrompt = `Please explain the concept behind: "${q.question}" from ${q.unit} (${q.topic}).`;
    const newMsgs: Message[] = [
      ...messages,
      { sender: 'user', text: studentPrompt, topic: q.topic },
    ];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: q.topic,
          unit: q.unit,
          questionText: q.question,
          studentQuery: 'Explain this concept and pedagogical logic in detail with lecture references.',
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: data.text || q.explanation,
          topic: q.topic,
        },
      ]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: `Explanation for ${q.topic} (${q.unit}):\n\n${q.explanation}`,
          topic: q.topic,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCustomQuery = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const query = inputQuery.trim();
    setInputQuery('');
    sounds.playClick();

    const newMsgs: Message[] = [
      ...messages,
      { sender: 'user', text: query },
    ];
    setMessages(newMsgs);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Artificial Intelligence Concepts',
          unit: 'Units I & II',
          studentQuery: query,
        }),
      });

      const data = await res.json();
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: data.text || 'Unable to generate response at this moment.',
        },
      ]);
    } catch {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: 'In Units I & II of Artificial Intelligence, concepts revolve around rational agents interacting with environments (PEAS) and systematic state space search (Uninformed vs Informed Heuristic Search, CSPs, and MEA). Refer to lecture slides for detailed proofs.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputQuery(promptText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#5C351B]/40 backdrop-blur-xs flex justify-end">
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
        className="w-full max-w-lg h-full shadow-2xl flex flex-col border-l"
      >
        {/* Drawer Header */}
        <div
          style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
          className="p-4 sm:p-5 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
              className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold"
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#5C351B]">AI Concept Professor</h2>
              <span className="text-[11px] text-[#8F5B34] block">Powered by Gemini 3.8 Flash</span>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 text-[#8F5B34] hover:text-[#5C351B] rounded-lg hover:bg-[#E8DCCF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Questions Pills */}
        <div
          style={{ backgroundColor: '#FAF6F3', borderColor: '#E2D3C4' }}
          className="p-3 border-b flex gap-2 overflow-x-auto text-[11px]"
        >
          <button
            onClick={() => handleQuickPrompt('Why does IDDFS have O(bd) memory complexity?')}
            style={{ backgroundColor: '#F2E8E0', color: '#5C351B', borderColor: '#DBC5B0' }}
            className="px-2.5 py-1 rounded-lg border hover:bg-[#DAB692] shrink-0 transition-colors cursor-pointer font-medium"
          >
            IDDFS Space Complexity
          </button>
          <button
            onClick={() => handleQuickPrompt('Explain Operator Subgoaling in Means-Ends Analysis with an example.')}
            style={{ backgroundColor: '#F2E8E0', color: '#5C351B', borderColor: '#DBC5B0' }}
            className="px-2.5 py-1 rounded-lg border hover:bg-[#DAB692] shrink-0 transition-colors cursor-pointer font-medium"
          >
            MEA Subgoaling
          </button>
          <button
            onClick={() => handleQuickPrompt('Why must a heuristic function be admissible for A* optimality?')}
            style={{ backgroundColor: '#F2E8E0', color: '#5C351B', borderColor: '#DBC5B0' }}
            className="px-2.5 py-1 rounded-lg border hover:bg-[#DAB692] shrink-0 transition-colors cursor-pointer font-medium"
          >
            A* Admissibility
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div
                  style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                style={{
                  backgroundColor: msg.sender === 'user' ? '#DAB692' : '#F2E8E0',
                  borderColor: msg.sender === 'user' ? '#C59B74' : '#DBC5B0',
                  color: '#5C351B',
                }}
                className="max-w-[85%] rounded-2xl p-3.5 border text-xs sm:text-sm leading-relaxed"
              >
                {msg.topic && (
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#8F5B34] mb-1">
                    {msg.topic}
                  </div>
                )}
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'ai' && (
                  <div style={{ borderColor: '#DBC5B0' }} className="mt-2 pt-2 border-t flex justify-end">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.text);
                        setCopiedIdx(idx);
                        setTimeout(() => setCopiedIdx(null), 1500);
                      }}
                      className="text-[11px] text-[#8F5B34] hover:text-[#5C351B] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-[#2D6A4F]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div
                  style={{ backgroundColor: '#F2E8E0', color: '#5C351B', borderColor: '#DBC5B0' }}
                  className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs"
                >
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div
                style={{ backgroundColor: '#DAB692', color: '#5C351B' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div
                style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#8F5B34' }}
                className="p-3 border rounded-xl text-xs"
              >
                AI Professor is formulating explanation...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendCustomQuery}
          style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
          className="p-4 border-t"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an AI concept question..."
              style={{ borderColor: '#DBC5B0', backgroundColor: '#FFFFFF', color: '#5C351B' }}
              className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#DAB692]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
              className="p-2.5 rounded-xl border hover:bg-[#CCA076] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
