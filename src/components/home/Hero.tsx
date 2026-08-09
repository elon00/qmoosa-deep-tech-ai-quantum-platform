import React from "react";
import { NavigationTab } from "../../types";
import { Bot, Cpu, Link as LinkIcon, Lock, ArrowRight } from "lucide-react";

interface HeroProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentTab }) => {
  return (
    <section className="relative overflow-hidden bg-[#050505] pt-16 pb-20 md:pt-24 md:pb-28 border-b border-white/10 text-[#F5F5F5]">
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00F0FF]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Live Ticker Badge */}
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 border border-white/10 bg-white/[0.02] font-mono-code text-[10px] uppercase tracking-[0.2em] mb-8 text-[#00F0FF]">
          <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full animate-ping" />
          <span className="text-white font-bold">
            QMOOSA PLATFORM V4.02 RELEASED
          </span>
          <span className="text-white/20">/</span>
          <span className="text-neutral-400">32-Qubit State Simulator & Solana Anchor Verifier</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-light tracking-tight text-white max-w-5xl mx-auto leading-[1.05]">
          Architecting Frontier <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#00F0FF]">Intelligence Systems</span>
        </h1>

        {/* Tech Focus Subheading */}
        <p className="mt-6 text-xs sm:text-sm font-mono-code text-[#00F0FF] uppercase tracking-[0.25em]">
          AI AGENTS • BLOCKCHAIN • QUANTUM • CRYPTOGRAPHY • WEB4
        </p>

        {/* Paragraph Description */}
        <p className="mt-6 text-base sm:text-lg font-light text-neutral-300 max-w-3xl mx-auto leading-relaxed">
          QMoosa engineers enterprise AI multi-agent orchestrators, post-quantum lattice cryptography, high-performance Solana smart contract tools, and 32-qubit state vector simulation engines for next-generation systems.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono-code text-xs uppercase tracking-widest">
          <button
            onClick={() => setCurrentTab("ai-workspace")}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold hover:bg-[#00F0FF] hover:text-black transition-all duration-200 flex items-center justify-center space-x-3 group"
          >
            <Bot className="w-4 h-4" />
            <span>Launch AI Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => setCurrentTab("quantum")}
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:border-white hover:bg-white/5 transition flex items-center justify-center space-x-2"
          >
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <span>Explore Division Suite</span>
          </button>
        </div>

        {/* Core Pillars Stats Strip */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left font-mono-code">
          <div className="p-5 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-2 text-[#00F0FF] mb-2 text-[10px] uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>AI Agentic OS</span>
            </div>
            <div className="text-3xl font-display font-normal text-white">13 Agents</div>
            <p className="text-[11px] text-neutral-400 mt-2 font-sans">Multi-agent orchestration with RAG & real-time tool execution.</p>
          </div>

          <div className="p-5 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-2 text-purple-400 mb-2 text-[10px] uppercase tracking-wider">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Solana & EVM</span>
            </div>
            <div className="text-3xl font-display font-normal text-white">65K+ TPS</div>
            <p className="text-[11px] text-neutral-400 mt-2 font-sans">Anchor program auditor & agentic wallet execution mesh.</p>
          </div>

          <div className="p-5 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-2 text-cyan-400 mb-2 text-[10px] uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Quantum Simulator</span>
            </div>
            <div className="text-3xl font-display font-normal text-white">32 Qubits</div>
            <p className="text-[11px] text-neutral-400 mt-2 font-sans">Qiskit/Cirq state vector analysis & OpenQASM 3.0 compiler.</p>
          </div>

          <div className="p-5 border border-white/10 bg-white/[0.02]">
            <div className="flex items-center space-x-2 text-amber-400 mb-2 text-[10px] uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Post-Quantum</span>
            </div>
            <div className="text-3xl font-display font-normal text-white">ML-KEM-768</div>
            <p className="text-[11px] text-neutral-400 mt-2 font-sans">NIST Category 3 lattice-based security & zero-knowledge shield.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
