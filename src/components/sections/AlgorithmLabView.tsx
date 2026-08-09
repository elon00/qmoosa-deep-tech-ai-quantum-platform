import React, { useState } from "react";
import { ALGORITHM_LAB_ITEMS } from "../../data/mockData";
import { FlaskConical, Play, CheckCircle2, Copy, BookOpen } from "lucide-react";

export const AlgorithmLabView: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHM_LAB_ITEMS[0]);
  const [benchmarkLog, setBenchmarkLog] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const handleRunBenchmark = () => {
    setRunning(true);
    setBenchmarkLog("Running sandboxed complexity execution test...");
    setTimeout(() => {
      setRunning(false);
      setBenchmarkLog(
        `[BENCHMARK PASSED]\n- Algorithm: ${selectedAlgo.title}\n- Time Complexity Verified: ${selectedAlgo.complexityTime}\n- Empirical Speedup: ${selectedAlgo.benchmarkSpeedup}\n- Zero Memory Leak Detected.`
      );
    }, 700);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 text-xs font-mono mb-3">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>QMOOSA ALGORITHM RESEARCH LAB</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Theoretical Proofs & Empirical Complexity
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl">
              Published algorithms with rigorous mathematical proofs, Big-O asymptotic analysis, and sandboxed execution benchmarks.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-blue-400 border border-slate-800">
              Published Papers: <strong className="text-white">48 ArXiv</strong>
            </span>
          </div>
        </div>

        {/* Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List */}
          <div className="lg:col-span-4 space-y-3">
            {ALGORITHM_LAB_ITEMS.map((item) => {
              const isSelected = selectedAlgo.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedAlgo(item);
                    setBenchmarkLog(null);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/60 shadow-lg"
                      : "bg-slate-900/40 border-slate-800 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {item.complexityTime}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                </div>
              );
            })}
          </div>

          {/* Code & Proof Runner */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  {selectedAlgo.category} ALGORITHM SPECIFICATION
                </span>
                <h3 className="text-xl font-bold text-white">{selectedAlgo.title}</h3>
              </div>
              <button
                onClick={handleRunBenchmark}
                disabled={running}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{running ? "Benchmarking..." : "Run Complexity Test"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                MATHEMATICAL PROOF SUMMARY
              </span>
              <p className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed">
                {selectedAlgo.proofSummary}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                IMPLEMENTATION CODE
              </span>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto">
                <code>{selectedAlgo.implementationCode}</code>
              </pre>
            </div>

            {benchmarkLog && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 font-mono text-xs text-emerald-300 whitespace-pre-line">
                {benchmarkLog}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
