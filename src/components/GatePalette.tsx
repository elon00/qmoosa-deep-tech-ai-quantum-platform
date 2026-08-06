import React from 'react';
import { GateType } from '../lib/quantumEngine';

interface GatePaletteProps {
  unlockedGates: string[];
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType | null) => void;
  onClearCircuit: () => void;
  onOpenSavedModal?: () => void;
}

interface GateDef {
  type: GateType;
  label: string;
  name: string;
  color: string;
  description: string;
  category: 'single' | 'multi' | 'measure';
}

const ALL_GATES: GateDef[] = [
  {
    type: 'H',
    label: 'H',
    name: 'Hadamard Gate',
    color: 'from-cyan-500 to-blue-600 border-cyan-400 text-white',
    description: 'Creates equal quantum superposition (|0⟩ → (|0⟩+|1⟩)/√2). Basis of quantum randomness.',
    category: 'single',
  },
  {
    type: 'X',
    label: 'X',
    name: 'Pauli-X (NOT)',
    color: 'from-emerald-500 to-teal-600 border-emerald-400 text-white',
    description: 'Quantum Bit-Flip gate. Flips |0⟩ to |1⟩ and |1⟩ to |0⟩.',
    category: 'single',
  },
  {
    type: 'Z',
    label: 'Z',
    name: 'Pauli-Z (Phase)',
    color: 'from-purple-500 to-indigo-600 border-purple-400 text-white',
    description: 'Phase-flip gate. Flips phase of |1⟩ state by π radians.',
    category: 'single',
  },
  {
    type: 'S',
    label: 'S',
    name: 'S Gate (Phase π/2)',
    color: 'from-amber-500 to-orange-600 border-amber-400 text-white',
    description: 'Adds π/2 phase shift to |1⟩ state (√Z gate).',
    category: 'single',
  },
  {
    type: 'T',
    label: 'T',
    name: 'T Gate (Phase π/4)',
    color: 'from-pink-500 to-rose-600 border-pink-400 text-white',
    description: 'Adds π/4 phase shift to |1⟩ state. Essential for universal fault-tolerant computing.',
    category: 'single',
  },
  {
    type: 'CX',
    label: 'CX',
    name: 'CNOT (Controlled-X)',
    color: 'from-blue-600 to-indigo-700 border-blue-400 text-white',
    description: 'Flips target qubit if control qubit is |1⟩. Core gate for quantum entanglement!',
    category: 'multi',
  },
  {
    type: 'CZ',
    label: 'CZ',
    name: 'Controlled-Z',
    color: 'from-violet-600 to-purple-800 border-violet-400 text-white',
    description: 'Flips phase of |11⟩ state. Used as Oracle operator in Grover’s search algorithm.',
    category: 'multi',
  },
  {
    type: 'CCX',
    label: 'CCX',
    name: 'Toffoli (Controlled-Controlled-X)',
    color: 'from-fuchsia-600 to-pink-700 border-fuchsia-400 text-white',
    description: 'Universal 3-qubit gate. Flips target qubit if BOTH control qubits are |1⟩.',
    category: 'multi',
  },
  {
    type: 'SWAP',
    label: 'SWAP',
    name: 'SWAP Gate',
    color: 'from-sky-600 to-cyan-700 border-sky-400 text-white',
    description: 'Swaps quantum states between two qubits.',
    category: 'multi',
  },
  {
    type: 'MEASURE',
    label: 'M',
    name: 'Measurement',
    color: 'from-rose-600 to-red-700 border-rose-400 text-white',
    description: 'Collapses quantum state into classical 0 or 1 bit in Z-basis.',
    category: 'measure',
  },
];

export const GatePalette: React.FC<GatePaletteProps> = ({
  unlockedGates,
  selectedGate,
  onSelectGate,
  onClearCircuit,
  onOpenSavedModal,
}) => {
  const availableGates = ALL_GATES.filter((g) => unlockedGates.includes(g.type));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-300">
            QUANTUM GATE TOOLBOX
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSavedModal && (
            <button
              onClick={onOpenSavedModal}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition-all flex items-center gap-1 font-bold"
            >
              💾 Saved Circuits
            </button>
          )}
          <button
            onClick={onClearCircuit}
            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900 transition-all"
          >
            Clear Grid
          </button>
        </div>
      </div>

      {/* Gates Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
        {availableGates.map((gate) => {
          const isSelected = selectedGate === gate.type;
          return (
            <button
              key={gate.type}
              onClick={() => onSelectGate(isSelected ? null : gate.type)}
              title={`${gate.name}: ${gate.description}`}
              className={`group relative p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                isSelected
                  ? `bg-gradient-to-b ${gate.color} ring-2 ring-cyan-400 scale-105 shadow-lg shadow-cyan-500/30`
                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-700 hover:bg-slate-800/80'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-sm shadow-inner ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-900 text-cyan-400 group-hover:text-cyan-300'
                }`}
              >
                {gate.label}
              </div>
              <span
                className={`text-[10px] font-mono truncate max-w-full ${
                  isSelected ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {gate.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Gate Info Bar */}
      {selectedGate && (
        <div className="mt-2.5 p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-xs font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-300 font-bold">
              {selectedGate}
            </span>
            <span className="text-slate-300">
              {ALL_GATES.find((g) => g.type === selectedGate)?.description}
            </span>
          </div>
          <span className="text-[10px] text-cyan-400 whitespace-nowrap">
            Click grid cell to place
          </span>
        </div>
      )}
    </div>
  );
};
