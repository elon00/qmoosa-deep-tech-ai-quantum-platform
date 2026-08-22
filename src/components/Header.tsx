import React from "react";
import { Cpu, Wallet, Award, Coins, Code2, Globe2, Sparkles, Terminal } from "lucide-react";
import { QuantumBackend, SolanaPlayerProfile } from "../types";

interface HeaderProps {
  player: SolanaPlayerProfile;
  activeTab: "shor_lab" | "circuit_studio" | "bitcoin_arena" | "solana_relayer" | "anna_executa";
  setActiveTab: (tab: "shor_lab" | "circuit_studio" | "bitcoin_arena" | "solana_relayer" | "anna_executa") => void;
  selectedBackend: QuantumBackend;
  setSelectedBackend: (b: QuantumBackend) => void;
  onOpenCodeExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  activeTab,
  setActiveTab,
  selectedBackend,
  setSelectedBackend,
  onOpenCodeExport,
}) => {
  const backendLabels: Record<QuantumBackend, string> = {
    qiskit: "IBM Qiskit Runtime",
    pennylane: "Xanadu PennyLane",
    classiq: "Classiq Engine",
    qniverse: "Qniverse Quantum",
    cirq: "Google Cirq",
    simulator: "Local Statevector (64-Qubit)",
  };

  return (
    <header id="main-header" className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-cyan-950/60 to-purple-950/60 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            SOLANA DEVNET SYNC
          </span>
          <span>
            Global Quantum Simulation Bridge & On-Chain Solana Relayer Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Global Backend Selector */}
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Backend:</span>
            <select
              id="quantum-backend-select"
              value={selectedBackend}
              onChange={(e) => setSelectedBackend(e.target.value as QuantumBackend)}
              className="bg-slate-900 text-cyan-300 border border-slate-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(backendLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Code Export Button */}
          <button
            id="open-code-export-btn"
            onClick={onOpenCodeExport}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
          >
            <Code2 className="w-3 h-3" />
            <span>Export Code</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Omniver Quantum Decoder</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Shor's Algorithm & Bitcoin Cryptanalysis Simulator
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            id="tab-shor-lab"
            onClick={() => setActiveTab("shor_lab")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "shor_lab"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shor's Lab</span>
          </button>

          <button
            id="tab-circuit-studio"
            onClick={() => setActiveTab("circuit_studio")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "circuit_studio"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Circuit Studio</span>
          </button>

          <button
            id="tab-bitcoin-arena"
            onClick={() => setActiveTab("bitcoin_arena")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "bitcoin_arena"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Bitcoin Arena</span>
          </button>

          <button
            id="tab-solana-relayer"
            onClick={() => setActiveTab("solana_relayer")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "solana_relayer"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Solana Bridge</span>
          </button>

          <button
            id="tab-anna-executa"
            onClick={() => setActiveTab("anna_executa")}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === "anna_executa"
                ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Anna Executa</span>
          </button>
        </nav>

        {/* Player Profile & Solana Status */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-mono">
                {player.publicKey.substring(0, 4)}...{player.publicKey.substring(player.publicKey.length - 4)}
              </div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <span>Lvl {player.level}</span>
                <span className="text-[10px] text-purple-400 font-normal">({player.experience % 100}/100 XP)</span>
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold" title="Q-Bits Tokens Earned">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>{player.qBitsTokens}</span>
            <span className="text-[10px] text-amber-400/80 font-normal">Q-Bits</span>
          </div>
        </div>
      </div>
    </header>
  );
};
