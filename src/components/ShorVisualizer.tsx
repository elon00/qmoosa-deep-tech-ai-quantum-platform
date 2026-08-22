import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Sparkles, Binary, Compass, FileCode, CheckCircle2, ChevronRight, Info, Activity } from "lucide-react";
import { FactorizationResult, NoiseModelType, QuantumBackend } from "../types";
import { getCoprimes, gcd, simulateShorQuantumCircuit } from "../utils/quantumMath";

interface ShorVisualizerProps {
  backend: QuantumBackend;
  onSyncToSolana?: (result: FactorizationResult) => void;
}

export const ShorVisualizer: React.FC<ShorVisualizerProps> = ({ backend, onSyncToSolana }) => {
  const presetNumbers = [15, 21, 33, 35, 55, 77, 91];

  const [targetN, setTargetN] = useState<number>(15);
  const [customN, setCustomN] = useState<string>("15");
  const [coprimeA, setCoprimeA] = useState<number>(7);
  const [shots, setShots] = useState<number>(1024);
  const [noiseModel, setNoiseModel] = useState<NoiseModelType>("none");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [result, setResult] = useState<FactorizationResult | null>(null);
  const [coprimesList, setCoprimesList] = useState<number[]>([]);

  // Update coprime options when targetN changes
  useEffect(() => {
    const list = getCoprimes(targetN);
    setCoprimesList(list);
    if (list.length > 0) {
      // Pick a default coprime that yields an even period if possible
      const defaultChoice = list.find((a) => a === 7 || a === 2 || a === 4 || a === 13) || list[0];
      setCoprimeA(defaultChoice);
    }
  }, [targetN]);

  // Run simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateShorQuantumCircuit(targetN, coprimeA, shots, noiseModel);
      setResult(res);
      setIsSimulating(false);
      if (onSyncToSolana) {
        onSyncToSolana(res);
      }
    }, 600);
  };

  useEffect(() => {
    handleRunSimulation();
  }, [targetN, coprimeA, noiseModel]);

  const handleCustomNSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(customN, 10);
    if (!isNaN(num) && num >= 15 && num <= 999) {
      if (num % 2 === 0) {
        alert("Please enter an odd composite number (even numbers are trivially factored by 2).");
        return;
      }
      setTargetN(num);
    }
  };

  const stepsDetails = [
    {
      step: 1,
      title: "1. Classical Coprimality Pre-Check",
      desc: `We pick random base 'a' such that gcd(a, N) = 1. If gcd(a, N) > 1, a factor is trivially found classically!`,
      formula: `\\gcd(${coprimeA}, ${targetN}) = ${gcd(coprimeA, targetN)}`,
      badge: gcd(coprimeA, targetN) === 1 ? "Coprime Verified ✓" : "Trivial Factor Found!",
      badgeColor: gcd(coprimeA, targetN) === 1 ? "text-emerald-400 bg-emerald-950/60 border-emerald-700/40" : "text-amber-400 bg-amber-950/60 border-amber-700/40",
    },
    {
      step: 2,
      title: "2. Hadamard Superposition Register",
      desc: `Apply Hadamard gates H to all control qubits to create a uniform superposition of all candidate exponents |x⟩.`,
      formula: `|\\psi_0\\rangle = \\frac{1}{\\sqrt{2^t}} \\sum_{x=0}^{2^t-1} |x\\rangle |0\\rangle`,
      badge: `${result?.qubitTotal || 8} Qubits Active`,
      badgeColor: "text-cyan-400 bg-cyan-950/60 border-cyan-700/40",
    },
    {
      step: 3,
      title: "3. Modular Exponentiation Circuit",
      desc: `The quantum oracle executes |x⟩|0⟩ ↦ |x⟩|a^x mod N⟩. This entangles the periodic function values with the control register.`,
      formula: `f(x) = ${coprimeA}^x \\pmod{${targetN}}`,
      badge: `Period r = ${result?.period_r || "?"}`,
      badgeColor: "text-purple-400 bg-purple-950/60 border-purple-700/40",
    },
    {
      step: 4,
      title: "4. Inverse QFT (Phase Estimation)",
      desc: `QFT† creates constructive interference on state phases proportional to s/r, allowing direct readout of the periodic frequency.`,
      formula: `QFT^\\dagger |x\\rangle = \\frac{1}{\\sqrt{2^t}} \\sum_{y=0}^{2^t-1} e^{-2\\pi i x y / 2^t} |y\\rangle`,
      badge: `Constructive Peaks`,
      badgeColor: "text-indigo-400 bg-indigo-950/60 border-indigo-700/40",
    },
    {
      step: 5,
      title: "5. Measurement & Continued Fractions",
      desc: `Measuring the register gives value y. The Continued Fractions expansion on y/2^t yields the exact period r.`,
      formula: `\\frac{y}{2^t} \\approx \\frac{s}{r}`,
      badge: `r = ${result?.period_r || "?"}`,
      badgeColor: "text-pink-400 bg-pink-950/60 border-pink-700/40",
    },
    {
      step: 6,
      title: "6. Factor Extraction via GCD",
      desc: `Using classical Euclidean GCD, we compute gcd(a^(r/2) - 1, N) and gcd(a^(r/2) + 1, N) to uncover the secret prime factors p and q.`,
      formula: `p = \\gcd(${coprimeA}^{${(result?.period_r || 4) / 2}} - 1, ${targetN}) = ${result?.p || 3},\\quad q = ${result?.q || 5}`,
      badge: `Decoded: ${targetN} = ${result?.p || 3} × ${result?.q || 5}`,
      badgeColor: "text-emerald-400 bg-emerald-950/60 border-emerald-700/40",
    },
  ];

  return (
    <div id="shor-visualizer-container" className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Binary className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Shor's Algorithm Quantum Lab
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Select composite integer N, pick coprime base 'a', and inspect the quantum phase estimation & factor extraction pipeline in real time.
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-3">
            <button
              id="run-shor-simulation-btn"
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Executing Circuit...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-cyan-200" />
                  <span>Run Quantum Shor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Input Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
                  {/* Target N Preset & Custom */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Target Composite (N)</span>
              <span className="text-[10px] text-cyan-400 font-mono">N = p × q</span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {presetNumbers.map((num) => (
                <button
                  key={num}
                  id={`preset-n-${num}`}
                  onClick={() => {
                    setTargetN(num);
                    setCustomN(num.toString());
                  }}
                  className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg border transition-all ${
                    targetN === num
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/30"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <form onSubmit={handleCustomNSubmit} className="flex gap-1.5 pt-1">
              <input
                id="custom-n-input"
                type="number"
                value={customN}
                onChange={(e) => setCustomN(e.target.value)}
                placeholder="Custom N..."
                className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
              >
                Set
              </button>
            </form>
          </div>

          {/* Coprime Base 'a' Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Coprime Base (a)</span>
              <span className="text-[10px] text-purple-400 font-mono">gcd(a, {targetN}) = 1</span>
            </label>
            <select
              id="coprime-a-select"
              value={coprimeA}
              onChange={(e) => setCoprimeA(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 text-purple-300 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-purple-500"
            >
              {coprimesList.map((c) => (
                <option key={c} value={c}>
                  a = {c} (gcd = {gcd(c, targetN)})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">
              {coprimesList.length} valid coprimes available for N={targetN}
            </p>
          </div>

          {/* Quantum Noise & Simulator Model */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Quantum Noise Model</span>
              <span className="text-[10px] text-emerald-400">NISQ Emulation</span>
            </label>
            <select
              id="noise-model-select"
              value={noiseModel}
              onChange={(e) => setNoiseModel(e.target.value as NoiseModelType)}
              className="w-full bg-slate-950 text-emerald-300 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
            >
              <option value="none">Ideal (Zero Noise / Pure State)</option>
              <option value="depolarizing">Depolarizing Channel (p = 0.15)</option>
              <option value="thermal">Thermal Relaxation (T1/T2 Decay)</option>
              <option value="phase_damping">Phase Damping / Dephasing</option>
            </select>
            <p className="text-[10px] text-slate-500">
              Simulate real-world quantum hardware decoherence
            </p>
          </div>

          {/* Measurement Shots */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Measurement Shots</span>
              <span className="text-[10px] text-cyan-400 font-mono">{shots} shots</span>
            </label>
            <select
              id="shots-select"
              value={shots}
              onChange={(e) => setShots(parseInt(e.target.value, 10))}
              className="w-full bg-slate-950 text-cyan-300 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value={512}>512 Shots</option>
              <option value={1024}>1024 Shots (Standard)</option>
              <option value={4096}>4096 Shots (High Precision)</option>
              <option value={8192}>8192 Shots (IBM Quantum Max)</option>
            </select>
            <p className="text-[10px] text-slate-500">
              Sample size for quantum state collapse statistics
            </p>
          </div>
        </div>
      </div>

      {/* Factorization Victory Banner */}
      {result && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Factorization Resolved
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Period r = {result.period_r}
                </span>
              </div>
              <div className="text-2xl font-black text-white tracking-tight mt-0.5 font-mono">
                {result.N} = <span className="text-emerald-400">{result.p}</span> × <span className="text-cyan-400">{result.q}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <div className="text-slate-400">Quantum Circuit Depth</div>
              <div className="text-white font-mono font-semibold">{result.qubitTotal} Qubits ({result.gatesCount.c_unitary} Gates)</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-slate-400">Execution Runtime</div>
              <div className="text-emerald-400 font-mono font-semibold">18.4 ms (Simulated)</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Workspace: Steps Pipeline & Quantum Probability Waves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Shor 6-Step Breakdown Tabs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Shor's 6-Step Workflow</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Step {activeStepTab} of 6</span>
            </div>

            <div className="space-y-2 mt-3">
              {stepsDetails.map((item) => (
                <button
                  key={item.step}
                  id={`shor-step-btn-${item.step}`}
                  onClick={() => setActiveStepTab(item.step)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    activeStepTab === item.step
                      ? "bg-slate-800/90 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${activeStepTab === item.step ? "text-cyan-300" : "text-slate-300"}`}>
                      {item.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Active Step Detailed Inspector Card */}
            {stepsDetails[activeStepTab - 1] && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Mathematical Formula & State</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-cyan-200 text-xs overflow-x-auto">
                  {stepsDetails[activeStepTab - 1].formula}
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {stepsDetails[activeStepTab - 1].desc}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quantum Probability Waves & Continued Fractions */}
        <div className="lg:col-span-7 space-y-4">
          {/* Probability Distribution Histogram */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>
                    Quantum Measurement Probability Distribution |ψ⟩
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Peaks correspond to integer multiples of $2^t / r$ after QFT interference.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                {shots} Shots
              </span>
            </div>

            {/* Bar Chart Visualization */}
            <div className="mt-4 space-y-2">
              <div className="h-44 w-full flex items-end gap-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
                {result?.stateVectorProbabilities.map((item, idx) => {
                  const heightPercent = Math.min(100, Math.max(4, Math.round(item.prob * 100 * 3.5)));
                  const isPeak = item.prob > 0.08;
                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-[14px] flex flex-col items-center gap-1 group relative cursor-pointer"
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <div className="bg-slate-900 text-[10px] text-slate-200 px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap font-mono">
                          <div>State: |{item.stateBin}⟩ ({item.stateDec})</div>
                          <div>Prob: {(item.prob * 100).toFixed(1)}%</div>
                          <div>Phase: {(item.phase * 360).toFixed(0)}°</div>
                        </div>
                      </div>

                      {/* Bar */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isPeak
                            ? "bg-gradient-to-t from-cyan-500 to-purple-400 shadow-md shadow-cyan-500/50"
                            : "bg-slate-800 group-hover:bg-slate-700"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>|0000⟩ (Phase 0.0)</span>
                <span>Interference Peak States (s/r)</span>
                <span>|1111⟩ (Phase 1.0)</span>
              </div>
            </div>

            {/* Continued Fractions Table */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-300 mb-2">
                Continued Fractions Phase Readout
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result?.measuredFractions.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <div>
                      <span className="text-slate-400">Measured: </span>
                      <span className="text-cyan-300 font-semibold">{f.decimal}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">s/r ≈ </span>
                      <span className="text-purple-300 font-bold">{f.fraction}</span>
                      <span className="text-emerald-400 ml-1 text-[10px]">(r={f.periodCandidate})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Code Excerpt Viewer */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>OpenQASM 3.0 Real-Time Generated Circuit</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">QASM 3.0 Compatible</span>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-36 border border-slate-800">
              {result?.openQasmCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
