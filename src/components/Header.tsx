import React from 'react';
import { Cpu, Terminal, Sparkles, Volume2, VolumeX, Download, Key, Shield, HelpCircle } from 'lucide-react';

interface HeaderProps {
  currentMissionId: number;
  onSelectMission: (id: number) => void;
  executionMode: 'simulator' | 'ibm_hardware';
  onOpenHardwareModal: () => void;
  onOpenPythonModal: () => void;
  onOpenAiCopilot: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMissionId,
  onSelectMission,
  executionMode,
  onOpenHardwareModal,
  onOpenPythonModal,
  onOpenAiCopilot,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-cyan-900/50 bg-slate-950/90 backdrop-blur-md px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Vision */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 shadow-lg shadow-cyan-500/20">
            <Cpu className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400">
                OMNIVERSE QUANTUM DECODER
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400">
                Q-DAY READY
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <Shield className="w-3 h-3 text-cyan-400" /> Real Hardware Execution & Post-Quantum Cryptography Simulator
            </p>
          </div>
        </div>

        {/* Center: Mission Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onSelectMission(num)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                currentMissionId === num
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Mission 0{num}
            </button>
          ))}
        </div>

        {/* Right Actions & Hardware Engine Selector */}
        <div className="flex items-center gap-2">
          {/* IBM Quantum Hardware Badge / Selector */}
          <button
            onClick={onOpenHardwareModal}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              executionMode === 'ibm_hardware'
                ? 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-md shadow-purple-500/30'
                : 'bg-slate-900 border-slate-800 text-cyan-300 hover:border-cyan-700'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {executionMode === 'ibm_hardware' ? 'IBM Quantum Hardware ⚡' : 'Web Quantum Engine'}
            </span>
          </button>

          {/* Python Script Export */}
          <button
            onClick={onOpenPythonModal}
            title="Download omniverse_decoder.py for local IBM Quantum hardware execution"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-blue-700 text-slate-300 rounded-xl text-xs font-mono transition-all"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">.py Runner</span>
          </button>

          {/* AI Copilot */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-xl text-xs shadow-lg shadow-purple-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Q-AI Copilot</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
