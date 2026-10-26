import React from 'react';
import { ExamRecord } from './ExamMode';
import { Trophy, Trash2, Download } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LeaderboardViewProps {
  records: ExamRecord[];
  onClearRecords: () => void;
  onTakeExam: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  records,
  onClearRecords,
  onTakeExam,
}) => {
  const exportCsv = () => {
    if (records.length === 0) return;
    sounds.playClick();

    const headers = ['ID', 'Student Name', 'Roll Number', 'Score', 'Max Score', 'Percentage', 'Grade', 'Date', 'Time Seconds'];
    const rows = records.map(r => [
      r.id,
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      r.score,
      r.maxScore,
      `${r.percentage}%`,
      `"${r.grade}"`,
      `"${r.date}"`,
      r.durationSeconds,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_quiz_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAttempts = records.length;
  const avgScore = totalAttempts > 0 ? (records.reduce((acc, r) => acc + r.score, 0) / totalAttempts).toFixed(1) : '0';
  const highestScore = totalAttempts > 0 ? Math.max(...records.map(r => r.score)).toFixed(1) : '0';
  const passedCount = records.filter(r => r.percentage >= 40).length;
  const passRate = totalAttempts > 0 ? Math.round((passedCount / totalAttempts) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div
        style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0', color: '#8F5B34' }}
        className="rounded-2xl border shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <span className="text-xs font-bold text-[#8F5B34] tracking-wider uppercase block mb-1">
            Student Assessment Records
          </span>
          <h1 className="text-2xl font-extrabold text-[#5C351B] tracking-tight">
            Evaluation Log &amp; Class Standings
          </h1>
          <p className="text-xs text-[#8F5B34] mt-1">
            Official 25-mark evaluation attempts stored locally on this device.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {totalAttempts > 0 && (
            <>
              <button
                type="button"
                onClick={exportCsv}
                style={{ backgroundColor: '#FFFFFF', borderColor: '#DBC5B0', color: '#5C351B' }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold hover:bg-[#F2E8E0] transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all exam history?')) {
                    onClearRecords();
                  }
                }}
                style={{ backgroundColor: '#FDEEEF', borderColor: '#C53030', color: '#742A2A' }}
                className="p-2 rounded-xl border transition-colors cursor-pointer"
                title="Clear all records"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onTakeExam}
            style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
            className="px-4 py-2 text-xs font-extrabold rounded-xl border hover:bg-[#CCA076] shadow-xs transition-colors cursor-pointer"
          >
            Take Quiz
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border shadow-xs">
          <span className="text-xs font-medium text-[#8F5B34] block">Total Evaluations</span>
          <span className="text-2xl font-black text-[#5C351B] mt-1 tabular-nums">{totalAttempts}</span>
        </div>
        <div style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border shadow-xs">
          <span className="text-xs font-medium text-[#8F5B34] block">Average Score</span>
          <span className="text-2xl font-black text-[#8F5B34] mt-1 tabular-nums">
            {avgScore} <span className="text-xs font-normal opacity-70">/ 25</span>
          </span>
        </div>
        <div style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border shadow-xs">
          <span className="text-xs font-medium text-[#8F5B34] block">Highest Score</span>
          <span className="text-2xl font-black text-[#2D6A4F] mt-1 tabular-nums">
            {highestScore} <span className="text-xs font-normal opacity-70">/ 25</span>
          </span>
        </div>
        <div style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }} className="p-4 rounded-xl border shadow-xs">
          <span className="text-xs font-medium text-[#8F5B34] block">Pass Rate (&ge;40%)</span>
          <span className="text-2xl font-black text-[#5C351B] mt-1 tabular-nums">{passRate}%</span>
        </div>
      </div>

      {/* Records Table */}
      <div style={{ backgroundColor: '#FAF6F3', borderColor: '#DBC5B0' }} className="rounded-2xl border shadow-xs overflow-hidden">
        {records.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Trophy className="w-8 h-8 text-[#8F5B34] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#5C351B]">No Assessment Records Yet</h3>
            <p className="text-xs text-[#8F5B34] max-w-sm mx-auto">
              Complete quiz to view your grade, breakdown, and placement here.
            </p>
            <button
              onClick={onTakeExam}
              style={{ backgroundColor: '#DAB692', color: '#5C351B', borderColor: '#C59B74' }}
              className="px-4 py-2 text-xs font-bold border rounded-xl hover:bg-[#CCA076] transition-colors cursor-pointer"
            >
              Start New 10-Question Test
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead style={{ backgroundColor: '#F2E8E0', borderColor: '#DBC5B0', color: '#5C351B' }} className="font-bold border-b">
                <tr>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Roll Number</th>
                  <th className="p-3.5">Score / 25</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Grade</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Duration</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: '#E2D3C4' }} className="divide-y text-[#5C351B]">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F2E8E0]/70 transition-colors">
                    <td className="p-3.5 font-bold">{r.studentName}</td>
                    <td className="p-3.5 font-mono text-[#8F5B34]">{r.rollNumber}</td>
                    <td className="p-3.5 font-black tabular-nums">
                      {r.score.toFixed(1)} / 25.0
                    </td>
                    <td className="p-3.5 tabular-nums font-bold">{r.percentage}%</td>
                    <td className="p-3.5">
                      <span
                        style={{
                          backgroundColor:
                            r.percentage >= 80 ? '#EBF4EE' :
                            r.percentage >= 60 ? '#DAB692' :
                            r.percentage >= 40 ? '#F2E8E0' : '#FDEEEF',
                          color:
                            r.percentage >= 80 ? '#1B4332' :
                            r.percentage >= 60 ? '#5C351B' :
                            r.percentage >= 40 ? '#8F5B34' : '#742A2A',
                          borderColor: '#DBC5B0',
                        }}
                        className="px-2 py-0.5 rounded-lg border text-[11px] font-bold"
                      >
                        {r.grade}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#8F5B34]">{r.date}</td>
                    <td className="p-3.5 tabular-nums text-[#8F5B34]">
                      {Math.floor(r.durationSeconds / 60)}m {r.durationSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
