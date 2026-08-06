import React, { useState } from 'react';
import { GatePlacement, GateType } from '../lib/quantumEngine';
import { Trash2, Plus, Minus } from 'lucide-react';

interface QuantumCircuitGridProps {
  numQubits: number;
  onNumQubitsChange: (num: number) => void;
  gates: GatePlacement[];
  selectedGate: GateType | null;
  onAddGate: (gate: GatePlacement) => void;
  onRemoveGate: (gateId: string) => void;
  maxSteps?: number;
  onOpenSavedModal?: () => void;
}

export const QuantumCircuitGrid: React.FC<QuantumCircuitGridProps> = ({
  numQubits,
  onNumQubitsChange,
  gates,
  selectedGate,
  onAddGate,
  onRemoveGate,
  maxSteps = 8,
  onOpenSavedModal,
}) => {
  const [controlQubit, setControlQubit] = useState<number>(0);
  const [controlQubit2, setControlQubit2] = useState<number>(1);

  const steps = Array.from({ length: maxSteps }, (_, i) => i);
  const qubits = Array.from({ length: numQubits }, (_, i) => i);

  const handleCellClick = (qubit: number, step: number) => {
    // If there is an existing gate at this qubit & step, remove it
    const existing = gates.find((g) => g.qubit === qubit && g.step === step);
    if (existing) {
      onRemoveGate(existing.id);
      return;
    }

    if (!selectedGate) return;

    // Check if gate is controlled
    let ctrl = controlQubit;
    if (selectedGate === 'CX' || selectedGate === 'CZ') {
      if (ctrl === qubit) {
        ctrl = qubit === 0 ? 1 : 0;
      }
    }

    const newGate: GatePlacement = {
      id: `gate-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: selectedGate,
      qubit,
      controlQubit: ['CX', 'CZ', 'CCX'].includes(selectedGate) ? ctrl : undefined,
      controlQubit2: selectedGate === 'CCX' ? controlQubit2 : undefined,
      step,
    };

    onAddGate(newGate);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Grid Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold tracking-wider text-slate-300">
            CIRCUIT CANVAS ({numQubits} QUBITS)
          </span>

          {/* Qubit Count Controls */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => onNumQubitsChange(Math.max(1, numQubits - 1))}
              disabled={numQubits <= 1}
              className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded-lg"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-400 px-2">
              q[{numQubits}]
            </span>
            <button
              onClick={() => onNumQubitsChange(Math.min(5, numQubits + 1))}
              disabled={numQubits >= 5}
              className="p-1 hover:bg-slate-800 text-slate-400 disabled:opacity-30 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {onOpenSavedModal && (
            <button
              onClick={onOpenSavedModal}
              className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow"
            >
              💾 Save / Load Circuits
            </button>
          )}
        </div>

        {/* Multi-Qubit Control Selector Settings */}
        {selectedGate && ['CX', 'CZ', 'CCX'].includes(selectedGate) && numQubits > 1 && (
          <div className="flex items-center gap-2 bg-slate-950 border border-cyan-800/80 px-2.5 py-1 rounded-xl text-xs font-mono">
            <span className="text-cyan-400">Control Wire:</span>
            <select
              value={controlQubit}
              onChange={(e) => setControlQubit(parseInt(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-1.5 py-0.5"
            >
              {qubits.map((q) => (
                <option key={q} value={q}>
                  q[{q}]
                </option>
              ))}
            </select>
            {selectedGate === 'CCX' && (
              <>
                <span className="text-cyan-400">Control 2:</span>
                <select
                  value={controlQubit2}
                  onChange={(e) => setControlQubit2(parseInt(e.target.value))}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-1.5 py-0.5"
                >
                  {qubits.map((q) => (
                    <option key={q} value={q}>
                      q[{q}]
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        )}
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto relative min-h-[220px]">
        <div className="flex flex-col gap-5 min-w-[620px] py-2 relative">
          {qubits.map((qubit) => (
            <div key={qubit} className="flex items-center gap-2 relative">
              {/* Qubit Label Wire Header */}
              <div className="w-16 flex items-center justify-between px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs">
                <span className="text-cyan-400 font-bold">q[{qubit}]</span>
                <span className="text-[10px] text-slate-500">|0⟩</span>
              </div>

              {/* Wire Line */}
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-0 right-0 h-[2px] bg-cyan-900/60 z-0" />

                {/* Steps Cells */}
                <div className="grid grid-cols-8 gap-3 w-full z-10">
                  {steps.map((step) => {
                    const gate = gates.find((g) => g.qubit === qubit && g.step === step);
                    const isControl = gates.some(
                      (g) => (g.controlQubit === qubit || g.controlQubit2 === qubit) && g.step === step
                    );

                    return (
                      <div
                        key={step}
                        onClick={() => handleCellClick(qubit, step)}
                        className={`h-12 rounded-xl border border-dashed transition-all flex items-center justify-center cursor-pointer relative group ${
                          gate
                            ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/20'
                            : isControl
                            ? 'bg-purple-950/40 border-purple-500'
                            : 'border-slate-800 hover:border-cyan-700 hover:bg-cyan-950/20'
                        }`}
                      >
                        {/* Render Gate */}
                        {gate && (
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 border border-cyan-400 flex items-center justify-center font-mono font-bold text-white shadow-lg text-sm group-hover:ring-2 group-hover:ring-cyan-300">
                            {gate.type}
                          </div>
                        )}

                        {/* Render Control Node */}
                        {!gate && isControl && (
                          <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 ring-4 ring-cyan-950" />
                        )}

                        {/* Hover Prompt */}
                        {!gate && selectedGate && (
                          <div className="opacity-0 group-hover:opacity-40 transition-opacity text-[10px] font-mono text-cyan-400">
                            + {selectedGate}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Draw Connection Vertical Lines for CX/CZ/CCX gates */}
          {gates.map((g) => {
            if (g.controlQubit !== undefined) {
              const minQ = Math.min(g.qubit, g.controlQubit);
              const maxQ = Math.max(g.qubit, g.controlQubit);
              if (minQ === maxQ) return null;

              // Calculate positioning
              const topOffset = minQ * 68 + 24; // approx wire row height
              const height = (maxQ - minQ) * 68;
              const leftPercent = (g.step / maxSteps) * 100 + 6.5;

              return (
                <div
                  key={`line-${g.id}`}
                  style={{
                    top: `${topOffset}px`,
                    height: `${height}px`,
                    left: `calc(80px + ${g.step * 12.5}% + 24px)`,
                  }}
                  className="absolute w-[2px] bg-cyan-400 shadow-glow pointer-events-none z-20 animate-pulse"
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
