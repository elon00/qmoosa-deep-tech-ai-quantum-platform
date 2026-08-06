import React, { useState } from 'react';
import { Mission } from '../data/missions';
import { QuantumSimulationResult, GatePlacement, GateType } from '../lib/quantumEngine';
import {
  HelpCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Zap,
  Code2,
  ArrowRight,
  BookOpen,
  Award,
  Terminal,
  Play,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Sliders
} from 'lucide-react';

interface QuantumGameHubProps {
  currentMission: Mission;
  simulationResult: QuantumSimulationResult;
  gates: GatePlacement[];
  onSendMessage: (msg: string) => void;
  onApplySolutionGates?: (gates: GatePlacement[], numQubits: number) => void;
  onVerifyMission: () => void;
  verificationResult: { success: boolean; feedback: string; score: number } | null;
  numQubits: number;
}

export const QuantumGameHub: React.FC<QuantumGameHubProps> = ({
  currentMission,
  simulationResult,
  gates,
  onSendMessage,
  onApplySolutionGates,
  onVerifyMission,
  verificationResult,
  numQubits,
}) => {
  const [activeBox, setActiveBox] = useState<'ask' | 'seek' | 'find' | 'problem' | 'solution'>('problem');
  const [askQuery, setAskQuery] = useState('');
  const [seekFilter, setSeekFilter] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Quantum concept database for SEEK box
  const quantumConcepts = [
    { title: 'Superposition (H Gate)', desc: 'Puts qubit in equal combination of |0⟩ and |1⟩', tag: 'Foundation' },
    { title: 'Entanglement (Bell Pairs)', desc: 'Non-local correlation between qubits via CNOT gate', tag: 'Cryptography' },
    { title: 'Grover Search Algorithm', desc: 'Quadratic speedup O(√N) for unsorted database lookup', tag: 'Algorithms' },
    { title: 'Phase Kickback (CZ / Z)', desc: 'Flips relative phase angle φ without changing probability amplitude', tag: 'Quantum Mechanics' },
    { title: 'Density Matrix & Decohere', desc: 'Simulates environment noise and fidelity decay on real NISQ hardware', tag: 'Hardware' },
    { title: 'OpenQASM 2.0 Syntax', desc: 'Standard quantum assembly language used by IBM Quantum Experience', tag: 'Programming' },
  ];

  const filteredConcepts = quantumConcepts.filter(
    (c) => c.title.toLowerCase().includes(seekFilter.toLowerCase()) || c.desc.toLowerCase().includes(seekFilter.toLowerCase())
  );

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;
    onSendMessage(askQuery);
    setAskQuery('');
  };

  const handleCopySolutionCode = () => {
    navigator.clipboard.writeText(simulationResult.qiskitCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Preset suggested gates for 1-click solution loading on current mission
  const getMissionPresetSolution = (): { gates: GatePlacement[]; numQubits: number; explanation: string } => {
    if (currentMission.id === 1) {
      return {
        numQubits: 1,
        gates: [{ id: 'sol-1', type: 'H', qubit: 0, step: 0 }],
        explanation: 'Apply Hadamard (H) gate on Qubit 0 to create |+⟩ superposition.',
      };
    } else if (currentMission.id === 2) {
      return {
        numQubits: 2,
        gates: [
          { id: 'sol-1', type: 'H', qubit: 0, step: 0 },
          { id: 'sol-2', type: 'CX', qubit: 1, controlQubit: 0, step: 1 },
        ],
        explanation: 'Apply H gate to Qubit 0, then CNOT with Control Q0 and Target Q1 to generate Bell State |Φ+⟩.',
      };
    } else {
      return {
        numQubits: 2,
        gates: [
          { id: 'sol-1', type: 'H', qubit: 0, step: 0 },
          { id: 'sol-2', type: 'H', qubit: 1, step: 0 },
          { id: 'sol-3', type: 'CZ', qubit: 1, controlQubit: 0, step: 1 },
          { id: 'sol-4', type: 'H', qubit: 0, step: 2 },
          { id: 'sol-5', type: 'H', qubit: 1, step: 2 },
          { id: 'sol-6', type: 'X', qubit: 0, step: 3 },
          { id: 'sol-7', type: 'X', qubit: 1, step: 3 },
          { id: 'sol-8', type: 'CZ', qubit: 1, controlQubit: 0, step: 4 },
          { id: 'sol-9', type: 'X', qubit: 0, step: 5 },
          { id: 'sol-10', type: 'X', qubit: 1, step: 5 },
          { id: 'sol-11', type: 'H', qubit: 0, step: 6 },
          { id: 'sol-12', type: 'H', qubit: 1, step: 6 },
        ],
        explanation: 'Build Grover Search Operator: Superposition -> CZ Oracle -> Phase Diffusion Operator (H, X, CZ, X, H).',
      };
    }
  };

  const solutionPreset = getMissionPresetSolution();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
      {/* Interactive Box Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-lg text-white font-bold text-xs shadow">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">
              RESEARCHER & STUDENT GAME HUB
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Interactive Ask, Seek, Find, Problem & Solution Engine
            </p>
          </div>
        </div>

        {/* 5 Box Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveBox('problem')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeBox === 'problem'
                ? 'bg-red-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-300" /> Problem Box
          </button>

          <button
            onClick={() => setActiveBox('ask')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeBox === 'ask'
                ? 'bg-cyan-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-300" /> Ask Box
          </button>

          <button
            onClick={() => setActiveBox('seek')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeBox === 'seek'
                ? 'bg-purple-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-purple-300" /> Seek Box
          </button>

          <button
            onClick={() => setActiveBox('find')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeBox === 'find'
                ? 'bg-emerald-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-300" /> Find Box
          </button>

          <button
            onClick={() => setActiveBox('solution')}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
              activeBox === 'solution'
                ? 'bg-amber-600 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> Solution Box
          </button>
        </div>
      </div>

      {/* BOX 1: PROBLEM BOX */}
      {activeBox === 'problem' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between bg-red-950/40 border border-red-900/60 p-3 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-900/80 rounded-lg text-red-300 font-bold">
                Level {currentMission.id}
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">{currentMission.title}</h4>
                <p className="text-[11px] text-red-300">{currentMission.subtitle}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400">XP REWARD</span>
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> +{currentMission.id * 150} PTS
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Problem Statement */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-red-400 font-bold flex items-center gap-1.5 text-xs">
                <AlertCircle className="w-4 h-4" /> Challenge Objective
              </span>
              <p className="text-slate-200 text-xs leading-relaxed font-sans">
                {currentMission.description}
              </p>
              <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400">
                <strong className="text-slate-300">Target State:</strong> {currentMission.targetStateDescription}
              </div>
            </div>

            {/* Academic & Story Context */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                <BookOpen className="w-4 h-4" /> Academic & Q-Day Context
              </span>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">
                {currentMission.storyContext}
              </p>
              <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Available Qubits: <strong>{currentMission.numQubits}</strong></span>
                <span>Unlocked Gates: <strong className="text-cyan-400">{currentMission.unlockedGates.join(', ')}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onVerifyMission}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Execute Circuit & Submit Solution
            </button>
            {verificationResult && (
              <span className={`font-mono text-xs font-bold ${verificationResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {verificationResult.success ? '✓ VERIFIED PASSED' : '✗ VERIFICATION FAILED'} ({verificationResult.score}/100)
              </span>
            )}
          </div>
        </div>
      )}

      {/* BOX 2: ASK BOX */}
      {activeBox === 'ask' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3 bg-cyan-950/40 border border-cyan-900/60 rounded-xl text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-4 h-4" /> Ask Q-Core AI Assistant
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ask any quantum mechanics question, hypothesis test, or algorithm explanation. Powered by Gemini 3.6 Flash.
            </p>
          </div>

          <form onSubmit={handleAskSubmit} className="flex gap-2">
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              placeholder="e.g., Why does Hadamard gate transform |0⟩ into (|0⟩+|1⟩)/√2?"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-slate-500 outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              Ask AI <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Preset Academic Questions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              SUGGESTED RESEARCH PROMPTS:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {[
                'Explain Bell state entanglement math',
                'How does Grover diffusion operator amplify probability?',
                'What is the matrix representation of Pauli-Z gate?',
                'How to run OpenQASM 2.0 on real IBM Quantum hardware?',
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(prompt)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 rounded-lg text-[11px] transition-all"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOX 3: SEEK BOX */}
      {activeBox === 'seek' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono">
            <Search className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={seekFilter}
              onChange={(e) => setSeekFilter(e.target.value)}
              placeholder="Seek concepts, gate mechanics, papers (e.g. Bell, Grover, Superposition)..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
            {filteredConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/50 rounded-xl space-y-1 transition-all cursor-pointer group"
                onClick={() => onSendMessage(`Explain ${concept.title} in depth for researchers`)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 group-hover:text-purple-200">
                    {concept.title}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
                    {concept.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {concept.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOX 4: FIND BOX */}
      {activeBox === 'find' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {/* Live Telemetry Card 1 */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                <Zap className="w-4 h-4" /> Entanglement & Fidelity
              </span>
              <div className="text-slate-300 text-[11px] space-y-1">
                <div>State: <strong className={simulationResult.hasEntanglement ? 'text-purple-400' : 'text-slate-400'}>{simulationResult.hasEntanglement ? 'ENTANGLED (|Φ+⟩)' : 'SEPARABLE'}</strong></div>
                <div>Fidelity Score: <strong className="text-emerald-400">{(simulationResult.entanglementFidelity * 100).toFixed(1)}%</strong></div>
                <div>Active Qubits: <strong className="text-cyan-400">{numQubits}</strong></div>
              </div>
            </div>

            {/* Live Telemetry Card 2 */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                <Sliders className="w-4 h-4" /> Statevector Inspection
              </span>
              <div className="text-slate-300 text-[11px] space-y-1 max-h-20 overflow-y-auto pr-1">
                {simulationResult.basisStates.map((state, i) => {
                  const prob = simulationResult.probabilities[i] || 0;
                  const comp = simulationResult.statevector[i] || { re: 0, im: 0 };
                  return (
                    <div key={state} className="flex justify-between border-b border-slate-900 pb-0.5">
                      <span>|{state}⟩: {(prob * 100).toFixed(1)}%</span>
                      <span className="text-slate-500">[{comp.re.toFixed(2)}{comp.im >= 0 ? '+' : ''}{comp.im.toFixed(2)}i]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Telemetry Card 3 */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                <Terminal className="w-4 h-4" /> Gate Count & Steps
              </span>
              <div className="text-slate-300 text-[11px] space-y-1">
                <div>Total Gates Placed: <strong className="text-amber-400">{gates.length}</strong></div>
                <div>Noise Level: <strong className="text-red-400">{(simulationResult.noiseLevel * 100).toFixed(0)}%</strong></div>
                <div>Hardware Ready: <strong className="text-emerald-400">YES (OpenQASM 2.0)</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOX 5: SOLUTION BOX */}
      {activeBox === 'solution' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Verified Mission Solution Guide
              </span>
              {onApplySolutionGates && (
                <button
                  onClick={() => onApplySolutionGates(solutionPreset.gates, solutionPreset.numQubits)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-mono text-[11px] font-bold rounded-lg shadow flex items-center gap-1 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Auto-Load Solution Gates to Canvas
                </button>
              )}
            </div>
            <p className="text-slate-300 text-xs font-sans leading-relaxed">
              {solutionPreset.explanation}
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Executable Qiskit Code (IBM Quantum Ready)
              </span>
              <button
                onClick={handleCopySolutionCode}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <pre className="p-2.5 bg-black/80 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto leading-tight max-h-32">
              {simulationResult.qiskitCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
