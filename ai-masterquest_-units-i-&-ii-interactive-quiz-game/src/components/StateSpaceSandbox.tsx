import React, { useState } from 'react';
import { sounds } from '../utils/audio';

export const StateSpaceSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'astar'>('blocks');

  const blockSteps = [
    {
      step: 1,
      h: -6,
      name: 'Initial State h(1) = -6',
      stacks: [['B', 'C', 'D', 'A']],
      description: 'Block B is on table (0). C is on B (-1). D is on C (-2). A is on D (-3). Total h = 0 + (-1) + (-2) + (-3) = -6.',
    },
    {
      step: 2,
      h: -3,
      name: 'Move A to Table h(2) = -3',
      stacks: [['B', 'C', 'D'], ['A']],
      description: 'A is moved to the table (0). Support under D is now clear. D rests on C (-2), C rests on B (-1). Total h = -3.',
    },
    {
      step: 3,
      h: -1,
      name: 'Move D to Table h(3) = -1',
      stacks: [['B', 'C'], ['A'], ['D']],
      description: 'D moved to table (0). Only C rests incorrectly on B (-1). Total h = -1.',
    },
    {
      step: 4,
      h: 0,
      name: 'All Blocks on Table h(4) = 0',
      stacks: [['B'], ['A'], ['D'], ['C']],
      description: 'All 4 blocks sit on table. No block has incorrect blocks underneath. Total h = 0.',
    },
    {
      step: 5,
      h: +1,
      name: 'Stack B on A h(5) = +1',
      stacks: [['A', 'B'], ['D'], ['C']],
      description: 'A is on table (0). B is correctly positioned on A (+1). Total h = +1.',
    },
    {
      step: 6,
      h: +3,
      name: 'Stack C on B h(6) = +3',
      stacks: [['A', 'B', 'C'], ['D']],
      description: 'A on table (0). B on A (+1). C on B (+2). Total h = 0 + 1 + 2 = +3.',
    },
    {
      step: 7,
      h: +6,
      name: 'Final Goal State h(7) = +6',
      stacks: [['A', 'B', 'C', 'D']],
      description: 'Goal state achieved! A on table (0), B on A (+1), C on B (+2), D on C (+3). Total h = +6.',
    },
  ];

  const [currentBlockStepIdx, setCurrentBlockStepIdx] = useState<number>(0);

  const aStarSteps = [
    {
      step: 1,
      exploring: 'S (Start)',
      closed: ['S'],
      open: [
        { node: 'A', g: 4, h: 8, f: 12 },
        { node: 'B', g: 10, h: 6, f: 16 },
        { node: 'C', g: 11, h: 5, f: 16 },
      ],
      currentBest: 'A (f=12)',
      explanation: 'S expanded. Children A (f=4+8=12), B (f=10+6=16), C (f=11+5=16) inserted into Priority Queue. Node A has lowest f(n) and is chosen next.',
    },
    {
      step: 2,
      exploring: 'A',
      closed: ['S', 'A'],
      open: [
        { node: 'D (via A)', g: 4+5, h: 5, f: 14 },
        { node: 'B (via S)', g: 10, h: 6, f: 16 },
        { node: 'C (via S)', g: 11, h: 5, f: 16 },
        { node: 'B (via A)', g: 4+8, h: 6, f: 18 },
      ],
      currentBest: 'D (f=14)',
      explanation: 'Node A expanded. Child D has g=9, h=5 -> f=14. D is currently top of the priority queue.',
    },
    {
      step: 3,
      exploring: 'D',
      closed: ['S', 'A', 'D'],
      open: [
        { node: 'F (via D)', g: 9+1, h: 3, f: 13 },
        { node: 'B (via S)', g: 10, h: 6, f: 16 },
        { node: 'C (via S)', g: 11, h: 5, f: 16 },
        { node: 'B (via A)', g: 12, h: 6, f: 18 },
        { node: 'H (via D)', g: 9+16, h: 7, f: 32 },
        { node: 'I (via D)', g: 9+20, h: 4, f: 33 },
      ],
      currentBest: 'F (f=13)',
      explanation: 'Node D expanded. Child F has g=10, h=3 -> f=13. F is now the most promising node in OPEN list.',
    },
    {
      step: 4,
      exploring: 'F',
      closed: ['S', 'A', 'D', 'F'],
      open: [
        { node: 'B (via S)', g: 10, h: 6, f: 16 },
        { node: 'C (via S)', g: 11, h: 5, f: 16 },
        { node: 'B (via A)', g: 12, h: 6, f: 18 },
        { node: 'G (Goal via F)', g: 10+13, h: 0, f: 23 },
        { node: 'H', g: 25, h: 7, f: 32 },
        { node: 'I', g: 29, h: 4, f: 33 },
      ],
      currentBest: 'B (f=16)',
      explanation: 'Node F expanded to generate Goal G with f=23. But A* does not stop immediately when goal is generated! It checks if any lower cost path exists in OPEN list. B (f=16) is explored next.',
    },
    {
      step: 5,
      exploring: 'B (via S)',
      closed: ['S', 'A', 'D', 'F', 'B'],
      open: [
        { node: 'C (via S)', g: 11, h: 5, f: 16 },
        { node: 'G (Goal via F)', g: 23, h: 0, f: 23 },
        { node: 'D (via B)', g: 10+15, h: 5, f: 30 },
      ],
      currentBest: 'C (f=16)',
      explanation: 'Exploring B shows children do not offer a shorter path. C (f=16) is explored next.',
    },
    {
      step: 6,
      exploring: 'C (via S)',
      closed: ['S', 'A', 'D', 'F', 'B', 'C'],
      open: [
        { node: 'G (Goal via F)', g: 23, h: 0, f: 23 },
        { node: 'E (via C)', g: 11+20, h: 3, f: 34 },
      ],
      currentBest: 'G (Goal, f=23)',
      explanation: 'Goal node G is now the top of the OPEN list! Since it is selected for expansion, the optimal lowest-cost path is guaranteed!',
    },
    {
      step: 7,
      exploring: 'G (GOAL REACHED)',
      closed: ['S', 'A', 'D', 'F', 'B', 'C', 'G'],
      open: [],
      currentBest: 'Optimal Path: S -> A -> D -> F -> G (Cost = 23)',
      explanation: 'Search terminates successfully. Backtracking from G produces the optimal route: S -> A -> D -> F -> G with total cost = 23.',
    },
  ];

  const [currentAStarStepIdx, setCurrentAStarStepIdx] = useState<number>(0);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="rounded-2xl border shadow-sm p-6 sm:p-8"
      >
        <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase block mb-1">
          Interactive AI Lecture Visualizer
        </span>
        <h1 className="text-2xl font-extrabold text-[#5C351B] tracking-tight">
          State-Space &amp; Algorithm Explorer
        </h1>
        <p className="text-xs text-[#8F5B34] mt-1">
          Directly interactive implementations of the Blocks World Hill Climbing heuristic and A* Search tree from the course slides.
        </p>

        {/* Tab Selector */}
        <div style={{ backgroundColor: '#F2E8E0' }} className="flex items-center gap-2 mt-5 p-1 rounded-xl max-w-md">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('blocks');
            }}
            style={{
              backgroundColor: activeTab === 'blocks' ? '#DAB692' : 'transparent',
              color: activeTab === 'blocks' ? '#5C351B' : '#8F5B34',
            }}
            className="flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Blocks World Heuristic (Slide 24-26)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('astar');
            }}
            style={{
              backgroundColor: activeTab === 'astar' ? '#DAB692' : 'transparent',
              color: activeTab === 'astar' ? '#5C351B' : '#8F5B34',
            }}
            className="flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            A* Priority Queue Trace (Slide 31-39)
          </button>
        </div>
      </div>

      {/* ----------------- TAB 1: BLOCKS WORLD ----------------- */}
      {activeTab === 'blocks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="lg:col-span-2 rounded-2xl border p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#5C351B]">
                  {blockSteps[currentBlockStepIdx].name}
                </h3>
                <span className="text-xs text-[#8F5B34]">Step {currentBlockStepIdx + 1} of 7</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#8F5B34] block font-medium">Heuristic Value</span>
                <span className={`text-2xl font-black tabular-nums ${
                  blockSteps[currentBlockStepIdx].h > 0 ? 'text-[#2D6A4F]' :
                  blockSteps[currentBlockStepIdx].h === 0 ? 'text-[#5C351B]' : 'text-[#C53030]'
                }`}>
                  {blockSteps[currentBlockStepIdx].h > 0 ? `+${blockSteps[currentBlockStepIdx].h}` : blockSteps[currentBlockStepIdx].h}
                </span>
              </div>
            </div>

            {/* Blocks Physical Table View */}
            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }}
              className="h-64 border rounded-xl p-6 flex flex-col justify-end items-center relative overflow-hidden"
            >
              <div
                style={{ borderColor: '#8F5B34' }}
                className="w-full flex items-end justify-center gap-8 border-b-4 pb-1"
              >
                {blockSteps[currentBlockStepIdx].stacks.map((stack, stackIdx) => (
                  <div key={stackIdx} className="flex flex-col-reverse items-center gap-1.5">
                    {stack.map((blockChar, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          backgroundColor:
                            blockChar === 'A' ? '#C53030' :
                            blockChar === 'B' ? '#8F5B34' :
                            blockChar === 'C' ? '#DAB692' : '#2D6A4F',
                          color: blockChar === 'C' ? '#5C351B' : '#FFFFFF',
                          borderColor: '#5C351B',
                        }}
                        className="w-14 h-12 rounded-xl flex items-center justify-center font-black text-base shadow-sm transition-all duration-300 border"
                      >
                        {blockChar}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="text-xs font-bold text-[#8F5B34] mt-2 uppercase tracking-wider">
                TABLE SURFACE (Goal Target: [A, B, C, D] on left)
              </div>
            </div>

            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="p-4 rounded-xl border text-xs leading-relaxed"
            >
              <span className="font-bold text-[#8F5B34] block mb-0.5">Calculation Rule:</span>
              {blockSteps[currentBlockStepIdx].description}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                disabled={currentBlockStepIdx === 0}
                onClick={() => {
                  sounds.playClick();
                  setCurrentBlockStepIdx(prev => Math.max(0, prev - 1));
                }}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#F2E8E0] disabled:opacity-30 cursor-pointer"
              >
                Previous State
              </button>

              <div className="flex gap-1.5">
                {blockSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentBlockStepIdx(idx);
                    }}
                    style={{
                      backgroundColor: idx === currentBlockStepIdx ? '#DAB692' : '#FFFFFF',
                      color: '#5C351B',
                      borderColor: '#DBC5B0',
                    }}
                    className="w-7 h-7 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentBlockStepIdx === blockSteps.length - 1}
                onClick={() => {
                  sounds.playClick();
                  setCurrentBlockStepIdx(prev => Math.min(blockSteps.length - 1, prev + 1));
                }}
                style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#CCA076] disabled:opacity-30 cursor-pointer"
              >
                Next State (Ascend)
              </button>
            </div>
          </div>

          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm space-y-4 text-xs"
          >
            <h4 className="font-bold text-[#5C351B] text-sm">Slide 24 Heuristic Definition</h4>
            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="p-3.5 rounded-xl border font-mono text-[11px] leading-relaxed"
            >
              h(x) = +1 for all blocks in support structure if correctly positioned;
              otherwise -1 for all blocks in support structure.
            </div>

            <div className="space-y-2 text-[#8F5B34]">
              <p>
                <strong className="text-[#5C351B]">Why Hill Climbing moves this way:</strong>
                Hill climbing is a greedy local search. At each step it selects the move that increases the objective function h(x).
              </p>
              <p>
                Notice how the value strictly ascends:
                <br />
                <span className="font-mono font-bold text-[#5C351B]">
                  -6 &rarr; -3 &rarr; -1 &rarr; 0 &rarr; +1 &rarr; +3 &rarr; +6
                </span>
              </p>
              <p className="text-[#2D6A4F] font-bold">
                When h reaches +6, the global maximum is found and the algorithm terminates!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- TAB 2: A* SEARCH TRACE ----------------- */}
      {activeTab === 'astar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="lg:col-span-2 rounded-2xl border p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#5C351B]">
                  A* Search Tree Traversal: Step {currentAStarStepIdx + 1}
                </h3>
                <span className="text-xs text-[#8F5B34]">Exploring: {aStarSteps[currentAStarStepIdx].exploring}</span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#8F5B34] block font-medium">Formula</span>
                <span className="text-sm font-mono font-bold text-[#5C351B]">f(n) = g(n) + h(n)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border">
                <div className="text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-2 flex justify-between items-center">
                  <span>OPEN List (Priority Queue)</span>
                  <span className="text-[11px] font-normal text-[#8F5B34]">Ordered by min f(n)</span>
                </div>
                {aStarSteps[currentAStarStepIdx].open.length === 0 ? (
                  <div className="text-xs text-[#8F5B34] italic py-4 text-center">Empty (Goal Expanded)</div>
                ) : (
                  <div className="space-y-1.5">
                    {aStarSteps[currentAStarStepIdx].open.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: idx === 0 ? '#DAB692' : '#FFFFFF',
                          borderColor: idx === 0 ? '#C59B74' : '#DBC5B0',
                          color: '#5C351B',
                        }}
                        className={`p-2 rounded-lg border text-xs flex justify-between items-center font-mono ${
                          idx === 0 ? 'font-bold' : ''
                        }`}
                      >
                        <span>{item.node}</span>
                        <span>g:{item.g} + h:{item.h} = <strong>f:{item.f}</strong></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border">
                <div className="text-xs font-bold text-[#5C351B] uppercase tracking-wider mb-2">
                  CLOSED List (Evaluated Nodes)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aStarSteps[currentAStarStepIdx].closed.map((nodeName, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: '#DAB692', borderColor: '#C59B74', color: '#5C351B' }}
                      className="px-2.5 py-1 rounded-md border text-xs font-mono font-bold"
                    >
                      {nodeName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }}
              className="p-4 rounded-xl border text-xs leading-relaxed"
            >
              <span className="font-bold block mb-0.5 text-[#8F5B34]">Execution Step Analysis:</span>
              {aStarSteps[currentAStarStepIdx].explanation}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                disabled={currentAStarStepIdx === 0}
                onClick={() => {
                  sounds.playClick();
                  setCurrentAStarStepIdx(prev => Math.max(0, prev - 1));
                }}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#F2E8E0] disabled:opacity-30 cursor-pointer"
              >
                Previous Step
              </button>

              <div className="flex gap-1.5">
                {aStarSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playClick();
                      setCurrentAStarStepIdx(idx);
                    }}
                    style={{
                      backgroundColor: idx === currentAStarStepIdx ? '#DAB692' : '#FFFFFF',
                      color: '#5C351B',
                      borderColor: '#DBC5B0',
                    }}
                    className="w-7 h-7 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentAStarStepIdx === aStarSteps.length - 1}
                onClick={() => {
                  sounds.playClick();
                  setCurrentAStarStepIdx(prev => Math.min(aStarSteps.length - 1, prev + 1));
                }}
                style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
                className="px-4 py-2 text-xs font-bold rounded-xl border hover:bg-[#CCA076] disabled:opacity-30 cursor-pointer"
              >
                Next Step
              </button>
            </div>
          </div>

          <div
            style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }}
            className="rounded-2xl border p-6 shadow-sm space-y-4 text-xs"
          >
            <h4 className="font-bold text-[#5C351B] text-sm">Slide 30 Algorithm Principles</h4>
            <div className="space-y-2 text-[#8F5B34] leading-relaxed">
              <p>
                <strong className="text-[#5C351B]">Why not terminate when Goal G is generated?</strong>
                Notice in Step 4, Goal G is created with cost 23. But A* does NOT terminate until G is popped from the top of the OPEN list!
              </p>
              <p>
                Because another node (like B or C) might lead to a cheaper path. Only when G has the lowest f-value among ALL frontier nodes does A* guarantee optimality.
              </p>
              <div
                style={{ backgroundColor: '#EBF4EE', borderColor: '#2D6A4F', color: '#1B4332' }}
                className="p-3 border rounded-xl font-bold"
              >
                Final Optimal Path: S &rarr; A &rarr; D &rarr; F &rarr; G<br />
                Optimal Cost: 23
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
