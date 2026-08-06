import React from 'react';
import { QuantumSimulationResult } from '../lib/quantumEngine';
import { BarChart3, Zap, Activity } from 'lucide-react';

interface MeasurementHistogramProps {
  simulationResult: QuantumSimulationResult;
  totalShots: number;
  onShotsChange: (shots: number) => void;
  noiseLevel: number;
  onNoiseLevelChange: (noise: number) => void;
  executionMode: 'simulator' | 'ibm_hardware';
}

export const MeasurementHistogram: React.FC<MeasurementHistogramProps> = ({
  simulationResult,
  totalShots,
  onShotsChange,
  noiseLevel,
  onNoiseLevelChange,
  executionMode,
}) => {
  const { basisStates, probabilities, shotCounts, hasEntanglement, entanglementFidelity } =
    simulationResult;

  const maxProb = Math.max(...probabilities, 0.01);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Histogram Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-300">
            QUANTUM MEASUREMENT SPECTRUM ({totalShots} SHOTS)
          </h2>
          {hasEntanglement && (
            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-[10px] font-mono text-purple-300 animate-pulse">
              ENTANGLED STATE (|Φ+⟩)
            </span>
          )}
        </div>

        {/* Shot & Noise Controls */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Shot Count Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Shots:</span>
            <select
              value={totalShots}
              onChange={(e) => onShotsChange(parseInt(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg px-2 py-1"
            >
              <option value={256}>256</option>
              <option value={1024}>1024</option>
              <option value={4096}>4096</option>
              <option value={8192}>8192</option>
            </select>
          </div>

          {/* Environmental Noise Slider */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Qubit Noise:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={noiseLevel}
              onChange={(e) => onNoiseLevelChange(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 cursor-pointer"
            />
            <span className="text-amber-400 font-bold w-8 text-right">
              {(noiseLevel * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 my-2">
        {basisStates.map((stateLabel, idx) => {
          const prob = probabilities[idx] || 0;
          const count = shotCounts[stateLabel] || 0;
          const heightPercent = Math.max(8, (prob / maxProb) * 100);

          return (
            <div
              key={stateLabel}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex flex-col items-center justify-end h-48 relative group hover:border-cyan-600 transition-all"
            >
              {/* Tooltip on hover */}
              <div className="text-[10px] font-mono text-cyan-300 mb-1 font-bold">
                {(prob * 100).toFixed(1)}%
              </div>

              {/* Bar */}
              <div className="w-full bg-slate-900 rounded-lg overflow-hidden flex flex-col justify-end h-32 relative">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full transition-all duration-500 rounded-t-lg bg-gradient-to-t ${
                    prob > 0.4
                      ? 'from-cyan-600 via-blue-500 to-indigo-400 shadow-lg shadow-cyan-500/30'
                      : prob > 0.1
                      ? 'from-blue-700 to-cyan-600'
                      : 'from-slate-800 to-slate-700'
                  }`}
                />
              </div>

              {/* Basis State Label */}
              <div className="mt-2 pt-1 border-t border-slate-900 w-full text-center">
                <span className="text-xs font-mono font-bold text-slate-200">
                  |{stateLabel}⟩
                </span>
                <p className="text-[9px] font-mono text-slate-500">{count} shots</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Footer */}
      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3.5 h-3.5" /> Engine: {executionMode === 'ibm_hardware' ? 'IBM Quantum Hardware' : 'Web Statevector Engine'}
          </span>
          <span>
            Fidelity: <strong className="text-emerald-400">{(entanglementFidelity * 100).toFixed(2)}%</strong>
          </span>
        </div>

        <span className="text-slate-500">
          Superposition statevector length: 2^{simulationResult.numQubits} = {simulationResult.stateVector.length} basis amplitudes
        </span>
      </div>
    </div>
  );
};
