import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, StepForward, Info, Layers, Eye, Cpu, Sliders } from "lucide-react";

interface CircuitCanvasProps {
  targetN?: number;
  coprimeA?: number;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ targetN = 15, coprimeA = 7 }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1200);
  const [selectedGate, setSelectedGate] = useState<any | null>(null);

  // Circuit stages definition
  const totalStages = 6;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalStages - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const stagesData = [
    {
      index: 0,
      title: "Ground State Initialization",
      qubitState: "|0000⟩_ctrl ⊗ |0001⟩_target",
      description: "Control register initialized to |0000⟩. Auxiliary/target register initialized to |1⟩ = |0001⟩ via single X gate.",
      activeSection: "init",
    },
    {
      index: 1,
      title: "Hadamard Transformation H^⊗4",
      qubitState: "1/√16 (|0000⟩ + |0001⟩ + ... + |1111⟩)",
      description: "Hadamard gates applied to all 4 counting qubits, generating a uniform 16-state superposition of candidate exponents.",
      activeSection: "hadamard",
    },
    {
      index: 2,
      title: "Controlled-U^(2^0) = 7^1 mod 15",
      qubitState: "Entangled state: ∑ |x_0⟩ |(7^x_0) mod 15⟩",
      description: "First controlled modular unitary applies multiplication by a^1 mod N, entangling control qubit 0 with target register.",
      activeSection: "cu0",
    },
    {
      index: 3,
      title: "Controlled-U^(2^j) Modular Cascade",
      qubitState: "Periodic periodic wave pattern in target register",
      description: "Successive controlled operations apply 7^2 ≡ 4 mod 15, 7^4 ≡ 1 mod 15, encoding the exact period r=4 into the quantum phase.",
      activeSection: "cu_all",
    },
    {
      index: 4,
      title: "Inverse Quantum Fourier Transform (QFT†)",
      qubitState: "Interference: Constructive peaks at phase s/r",
      description: "Controlled-phase rotations and Hadamards interfere destructively on off-peak phases and constructively at s/4 (0, 4, 8, 12).",
      activeSection: "iqft",
    },
    {
      index: 5,
      title: "Register Measurement & Collapse",
      qubitState: "Collapsed into state |0000⟩, |0100⟩, |1000⟩, or |1100⟩",
      description: "Measurement collapses the statevector into phase multiples y ∈ {0, 4, 8, 12}/16 = {0, 1/4, 1/2, 3/4}, proving period r=4.",
      activeSection: "measure",
    },
  ];

  return (
    <div id="circuit-canvas-container" className="space-y-6">
      {/* Studio Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Quantum Circuit Studio & Visualizer
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Step through the 8-qubit period-finding quantum circuit for N=15, inspect unitary matrix transformations, and watch quantum state collapse live.
            </p>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            <button
              id="circuit-prev-btn"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Previous Step"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="circuit-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "Pause" : "Run Step-by-Step"}</span>
            </button>

            <button
              id="circuit-next-btn"
              onClick={() => setCurrentStep((prev) => Math.min(totalStages - 1, prev + 1))}
              disabled={currentStep === totalStages - 1}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Next Step"
            >
              <StepForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playback Stage Indicator */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Stage {currentStep + 1}: {stagesData[currentStep].title}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Active State: <span className="text-purple-300 font-semibold">{stagesData[currentStep].qubitState}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 flex">
            {stagesData.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 h-full cursor-pointer transition-all border-r border-slate-900 last:border-0 ${
                  idx <= currentStep
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 shadow-sm"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
            {stagesData[currentStep].description}
          </p>
        </div>
      </div>

      {/* Main Circuit Board Canvas (SVG / Visual Wire Layout) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto">
        <div className="min-w-[760px] space-y-6">
          {/* Section: Control Register (q0 - q3) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 border-b border-slate-800/80 pb-1">
              <span>Control Register (Counting Qubits for Phase Estimation)</span>
              <span className="text-[10px] text-slate-500 font-mono">Register Size: 4 Qubits (2^4 = 16 States)</span>
            </div>

            {/* Qubit 0 Wire */}
            <div className="flex items-center gap-3 relative py-2">
              <span className="w-12 text-xs font-mono text-cyan-300 font-bold">|q₀⟩</span>
              <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                {/* Gate H */}
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 1
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  H
                </div>

                {/* Controlled Unitary 2^0 */}
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 2
                      ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  ●
                </div>

                {/* QFT Block */}
                <div
                  className={`w-16 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 4
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  QFT†
                </div>

                {/* Measurement Gate */}
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 5
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  M
                </div>
              </div>
            </div>

            {/* Qubit 1 Wire */}
            <div className="flex items-center gap-3 relative py-2">
              <span className="w-12 text-xs font-mono text-cyan-300 font-bold">|q₁⟩</span>
              <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 1
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  H
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 3
                      ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  ●
                </div>

                <div
                  className={`w-16 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 4
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  QFT†
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 5
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  M
                </div>
              </div>
            </div>

            {/* Qubit 2 Wire */}
            <div className="flex items-center gap-3 relative py-2">
              <span className="w-12 text-xs font-mono text-cyan-300 font-bold">|q₂⟩</span>
              <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 1
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  H
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 3
                      ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  ●
                </div>

                <div
                  className={`w-16 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 4
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  QFT†
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 5
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  M
                </div>
              </div>
            </div>

            {/* Qubit 3 Wire */}
            <div className="flex items-center gap-3 relative py-2">
              <span className="w-12 text-xs font-mono text-cyan-300 font-bold">|q₃⟩</span>
              <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 1
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  H
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 3
                      ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  ●
                </div>

                <div
                  className={`w-16 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 4
                      ? "bg-indigo-500/20 text-indigo-300 border-indigo-500 shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  QFT†
                </div>

                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 5
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  M
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-800 my-4" />

          {/* Section: Target Register (t0 - t3) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-400 border-b border-slate-800/80 pb-1">
              <span>Target Register (Modular Exponentiation |f(x)⟩)</span>
              <span className="text-[10px] text-slate-500 font-mono">Holds |7^x mod 15⟩</span>
            </div>

            {/* Target Qubit 0 */}
            <div className="flex items-center gap-3 relative py-2">
              <span className="w-12 text-xs font-mono text-purple-300 font-bold">|t₀⟩</span>
              <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 0
                      ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  X
                </div>

                <div
                  className={`w-28 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                    currentStep >= 2
                      ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                      : "bg-slate-900 text-slate-400 border-slate-700"
                  }`}
                >
                  7^x mod 15
                </div>

                <div className="w-20 h-0.5" />
                <div className="w-9 h-0.5" />
              </div>
            </div>

            {/* Target Qubits 1, 2, 3 */}
            {[1, 2, 3].map((t) => (
              <div key={t} className="flex items-center gap-3 relative py-2">
                <span className="w-12 text-xs font-mono text-purple-300 font-bold">|t{t}⟩</span>
                <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-[10px] text-slate-600 font-mono">
                    |0⟩
                  </div>

                  <div
                    className={`w-28 h-9 rounded-lg border flex items-center justify-center text-xs font-bold font-mono transition-all z-10 ${
                      currentStep >= 2
                        ? "bg-purple-500/20 text-purple-300 border-purple-500 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/40"
                        : "bg-slate-900 text-slate-400 border-slate-700"
                    }`}
                  >
                    Modular Mul
                  </div>

                  <div className="w-20 h-0.5" />
                  <div className="w-9 h-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
