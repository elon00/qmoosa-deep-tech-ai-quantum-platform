import React, { useState } from "react";
import { Cpu, Play, CheckCircle2, RotateCcw, Zap, Sparkles, Layers } from "lucide-react";

export const QuantumDivisionView: React.FC = () => {
  const [qubits, setQubits] = useState(3);
  const [circuitGates, setCircuitGates] = useState<string[]>(["H(q0)", "CX(q0,q1)", "H(q2)"]);
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addGate = (gate: string) => {
    setCircuitGates([...circuitGates, gate]);
  };

  const clearGates = () => {
    setCircuitGates([]);
    setSimResult(null);
  };

  const handleSimulateCircuit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/quantum/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qubits, gates: circuitGates }),
      });
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>QMOOSA QUANTUM COMPUTING DIVISION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              32-Qubit State Vector Simulator & OpenQASM 3.0
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl">
              Design quantum circuits, compute amplitude superposition, test VQE algorithms, and bridge directly to physical QPU cloud hardware.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800">
              Coherence T2: <strong className="text-white">120.5 µs</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
              Gate Fidelity: <strong className="text-white">99.84%</strong>
            </span>
          </div>
        </div>

        {/* Interactive Quantum Circuit Studio */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Interactive Quantum Circuit Composer</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Add gates to qubits and run real-time state vector simulation.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={clearGates}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSimulateCircuit}
                disabled={loading}
                className="px-6 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loading ? "Simulating QPU..." : "Execute Circuit"}</span>
              </button>
            </div>
          </div>

          {/* Qubit Gate Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-400 font-bold">ADD GATE:</span>
              <button
                onClick={() => addGate("H(q0)")}
                className="px-3 py-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900"
              >
                Hadamard (H)
              </button>
              <button
                onClick={() => addGate("CX(q0,q1)")}
                className="px-3 py-1.5 rounded bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900"
              >
                CNOT (CX)
              </button>
              <button
                onClick={() => addGate("X(q2)")}
                className="px-3 py-1.5 rounded bg-amber-950 text-amber-300 border border-amber-800 hover:bg-amber-900"
              >
                Pauli-X
              </button>
              <button
                onClick={() => addGate("T(q1)")}
                className="px-3 py-1.5 rounded bg-blue-950 text-blue-300 border border-blue-800 hover:bg-blue-900"
              >
                Phase T
              </button>
            </div>

            {/* Visual Circuit Grid */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 font-mono text-xs space-y-4 overflow-x-auto shadow-inner">
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                CIRCUIT WIRE REPRESENTATION
              </div>
              {Array.from({ length: qubits }).map((_, qIdx) => (
                <div key={qIdx} className="flex items-center space-x-3">
                  <span className="w-10 text-cyan-400 font-bold shrink-0">q[{qIdx}] ─</span>
                  <div className="flex-1 flex items-center space-x-3 border-b border-slate-800 py-2">
                    {circuitGates
                      .filter((g) => g.includes(`q${qIdx}`))
                      .map((gate, gIdx) => (
                        <span
                          key={gIdx}
                          className="px-3 py-1 rounded bg-slate-900 border border-cyan-500/50 text-cyan-300 text-xs shadow"
                        >
                          {gate}
                        </span>
                      ))}
                    <span className="text-slate-600">─────────────────────────────────────────────── M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Output Charts */}
          {simResult && (
            <div className="bg-slate-950 border border-cyan-800/80 rounded-xl p-6 font-mono space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  STATE VECTOR PROBABILITY DISTRIBUTION
                </span>
                <span className="text-xs text-emerald-400">
                  Execution Time: {simResult.executionTimeMs} ms
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {simResult.states.map((st: any, idx: number) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-sm font-bold text-white">{st.state}</div>
                    <div className="text-xs text-cyan-300 font-bold">
                      {(st.probability * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${st.probability * 100}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 pt-1">Amp: {st.amplitude}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
