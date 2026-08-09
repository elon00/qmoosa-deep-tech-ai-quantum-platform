import React, { useState } from "react";
import { ALGORITHM_LAB_ITEMS } from "../../data/mockData";
import { NavigationTab } from "../../types";
import { FlaskConical, Play, ArrowRight } from "lucide-react";

interface ResearchLabPreviewProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const ResearchLabPreview: React.FC<ResearchLabPreviewProps> = ({ setCurrentTab }) => {
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHM_LAB_ITEMS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [runLog, setRunLog] = useState<string | null>(null);

  const handleRunAlgorithm = () => {
    setIsRunning(true);
    setRunLog("Executing algorithm on QMoosa Sandboxed Runtime...");
    setTimeout(() => {
      setIsRunning(false);
      setRunLog(
        `[SUCCESS] Execution completed in 14.2ms.\nState Vector Convergence: 99.98%\nSpeedup Benchmark: ${selectedAlgo.benchmarkSpeedup}`
      );
    }, 800);
  };

  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/[0.03] text-[#00F0FF] border border-white/10 text-[10px] uppercase tracking-widest mb-3">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>ALGORITHM RESEARCH LAB</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Empirical Proofs & Complexity
          </h2>
          <p className="mt-4 text-neutral-400 text-xs uppercase tracking-widest font-sans">
            Inspect published algorithms, mathematical proofs, and run live performance benchmarks in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Algo Picker */}
          <div className="lg:col-span-4 space-y-3 font-mono-code">
            {ALGORITHM_LAB_ITEMS.map((algo) => {
              const isSelected = selectedAlgo.id === algo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => {
                    setSelectedAlgo(algo);
                    setRunLog(null);
                  }}
                  className={`w-full text-left p-4 transition border ${
                    isSelected
                      ? "bg-white text-black border-white font-bold"
                      : "bg-white/[0.02] border-white/10 text-neutral-300 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 border ${
                      isSelected ? "border-black bg-black/10 text-black" : "border-white/10 text-[#00F0FF]"
                    }`}>
                      {algo.category}
                    </span>
                    <span className={`text-xs ${isSelected ? "text-black font-bold" : "text-[#00FF41]"}`}>
                      {algo.complexityTime}
                    </span>
                  </div>
                  <h4 className={`text-sm ${isSelected ? "text-black font-bold" : "text-white font-light"} font-display mt-2`}>
                    {algo.title}
                  </h4>
                  <p className={`text-xs font-sans line-clamp-2 mt-1 ${isSelected ? "text-neutral-800" : "text-neutral-400"}`}>
                    {algo.problem}
                  </p>
                </button>
              );
            })}

            <button
              onClick={() => setCurrentTab("algorithms")}
              className="w-full py-3.5 text-xs font-mono-code uppercase tracking-widest bg-black hover:bg-white hover:text-black text-white border border-white/20 transition flex items-center justify-center space-x-2"
            >
              <span>Explore All Benchmarks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Runner Display */}
          <div className="lg:col-span-8 border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono-code">
              <div>
                <span className="text-[10px] text-[#00F0FF] uppercase tracking-widest font-bold">
                  {selectedAlgo.category} ALGORITHM
                </span>
                <h3 className="text-2xl font-display font-light text-white">{selectedAlgo.title}</h3>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="px-2.5 py-1 bg-black text-neutral-300 border border-white/10">
                  Time: <strong className="text-[#00F0FF]">{selectedAlgo.complexityTime}</strong>
                </span>
                <span className="px-2.5 py-1 bg-black text-neutral-300 border border-white/10">
                  Space: <strong className="text-[#00FF41]">{selectedAlgo.complexitySpace}</strong>
                </span>
              </div>
            </div>

            {/* Proof summary */}
            <div className="font-mono-code">
              <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-2">
                MATHEMATICAL PROOF & CONVERGENCE
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed bg-black p-4 border border-white/10">
                {selectedAlgo.proofSummary}
              </p>
            </div>

            {/* Code & Runner */}
            <div className="font-mono-code">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  IMPLEMENTATION CODE
                </h4>
                <button
                  onClick={handleRunAlgorithm}
                  disabled={isRunning}
                  className="px-4 py-1.5 text-xs uppercase tracking-widest font-bold bg-[#00FF41] text-black hover:bg-[#00F0FF] transition flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? "Simulating..." : "Run Benchmark"}</span>
                </button>
              </div>

              <div className="bg-black border border-white/10 p-4 text-xs overflow-x-auto text-neutral-300 max-h-56">
                <code>{selectedAlgo.implementationCode}</code>
              </div>

              {runLog && (
                <div className="mt-4 p-3 bg-white/5 border border-[#00FF41]/40 text-xs text-[#00FF41] whitespace-pre-line font-mono-code">
                  {runLog}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
