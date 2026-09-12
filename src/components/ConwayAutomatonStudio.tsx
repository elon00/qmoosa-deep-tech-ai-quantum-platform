import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Shuffle,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Activity,
  Sliders,
  Award,
  Info
} from 'lucide-react';

const GRID_ROWS = 28;
const GRID_COLS = 44;

type CellState = 0 | 1 | 2; // 0 = Dead, 1 = Alive, 2 = Quantum Superposition

interface AutomatonStats {
  generation: number;
  aliveCount: number;
  superpositionCount: number;
  entropyMetric: number;
}

export const ConwayAutomatonStudio: React.FC = () => {
  const [grid, setGrid] = useState<CellState[][]>(() => createEmptyGrid());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [quantumMode, setQuantumMode] = useState<boolean>(true);
  const [speedMs, setSpeedMs] = useState<number>(180);
  const [stats, setStats] = useState<AutomatonStats>({
    generation: 0,
    aliveCount: 0,
    superpositionCount: 0,
    entropyMetric: 0
  });

  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  function createEmptyGrid(): CellState[][] {
    return Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(0));
  }

  // Update statistics
  const computeStats = useCallback((currentGrid: CellState[][], gen: number) => {
    let alive = 0;
    let sup = 0;
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (currentGrid[r][c] === 1) alive++;
        if (currentGrid[r][c] === 2) sup++;
      }
    }
    const totalActive = alive + sup;
    const entropy = totalActive > 0 ? Number(((sup / (totalActive + 1)) * 1.44).toFixed(3)) : 0;
    setStats({
      generation: gen,
      aliveCount: alive,
      superpositionCount: sup,
      entropyMetric: entropy
    });
  }, []);

  // Compute next step based on Conway + Quantum Rules
  const stepForward = useCallback(() => {
    setGrid((prevGrid) => {
      const nextGrid = createEmptyGrid();

      const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          let classicalNeighbors = 0;
          let quantumNeighbors = 0;

          for (const [dr, dc] of neighbors) {
            const nr = (r + dr + GRID_ROWS) % GRID_ROWS;
            const nc = (c + dc + GRID_COLS) % GRID_COLS;
            if (prevGrid[nr][nc] === 1) classicalNeighbors++;
            if (prevGrid[nr][nc] === 2) quantumNeighbors++;
          }

          const current = prevGrid[r][c];

          if (quantumMode && quantumNeighbors > 0) {
            // Quantum interference rule: presence of quantum neighbor can induce superposition
            if (current === 0 && (classicalNeighbors === 2 || quantumNeighbors >= 2)) {
              nextGrid[r][c] = 2; // Collapse into superposition
            } else if (current === 2) {
              // Superposition decays or crystallizes
              nextGrid[r][c] = classicalNeighbors >= 2 && classicalNeighbors <= 4 ? 1 : 0;
            } else {
              // Standard Conway rule with quantum perturbation
              const total = classicalNeighbors + Math.round(quantumNeighbors * 0.5);
              nextGrid[r][c] = (current === 1 && (total === 2 || total === 3)) || (current === 0 && total === 3) ? 1 : 0;
            }
          } else {
            // Classic Conway's Game of Life rules (B3/S23)
            if (current === 1 && (classicalNeighbors === 2 || classicalNeighbors === 3)) {
              nextGrid[r][c] = 1;
            } else if (current === 0 && classicalNeighbors === 3) {
              nextGrid[r][c] = 1;
            } else {
              nextGrid[r][c] = 0;
            }
          }
        }
      }

      setStats((prev) => {
        computeStats(nextGrid, prev.generation + 1);
        return prev;
      });

      return nextGrid;
    });
  }, [quantumMode, computeStats]);

  // Simulation Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        stepForward();
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, speedMs, stepForward]);

  // Toggle cell on click
  const handleCellClick = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      if (quantumMode) {
        // Cycle: 0 -> 1 -> 2 -> 0
        next[r][c] = ((next[r][c] + 1) % 3) as CellState;
      } else {
        next[r][c] = next[r][c] === 1 ? 0 : 1;
      }
      computeStats(next, stats.generation);
      return next;
    });
  };

  // Preset Loaders
  const loadPreset = (type: 'glider' | 'pulsar' | 'quantum_cat' | 'random') => {
    const next = createEmptyGrid();
    const cr = Math.floor(GRID_ROWS / 2);
    const cc = Math.floor(GRID_COLS / 2);

    if (type === 'glider') {
      const coords = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
      for (const [dr, dc] of coords) {
        next[cr + dr - 2][cc + dc - 2] = 1;
      }
    } else if (type === 'pulsar') {
      const coords = [
        [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
        [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
        [1, -4], [1, -3], [1, -2], [1, 2], [1, 3], [1, 4],
        [6, -4], [6, -3], [6, -2], [6, 2], [6, 3], [6, 4],
        [-4, -6], [-3, -6], [-2, -6], [2, -6], [3, -6], [4, -6],
        [-4, -1], [-3, -1], [-2, -1], [2, -1], [3, -1], [4, -1],
        [-4, 1], [-3, 1], [-2, 1], [2, 1], [3, 1], [4, 1],
        [-4, 6], [-3, 6], [-2, 6], [2, 6], [3, 6], [4, 6]
      ];
      for (const [dr, dc] of coords) {
        if (cr + dr >= 0 && cr + dr < GRID_ROWS && cc + dc >= 0 && cc + dc < GRID_COLS) {
          next[cr + dr][cc + dc] = 1;
        }
      }
    } else if (type === 'quantum_cat') {
      // Create an entangling cluster with mixed states
      for (let r = cr - 4; r <= cr + 4; r++) {
        for (let c = cc - 6; c <= cc + 6; c++) {
          const rand = Math.random();
          if (rand > 0.65) next[r][c] = 2; // Superposition
          else if (rand > 0.45) next[r][c] = 1;
        }
      }
    } else if (type === 'random') {
      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const rand = Math.random();
          if (quantumMode && rand > 0.85) next[r][c] = 2;
          else if (rand > 0.75) next[r][c] = 1;
        }
      }
    }

    setGrid(next);
    computeStats(next, 0);
  };

  // Perform Born Rule Measurement Collapse
  const collapseSuperposition = () => {
    setGrid((prev) => {
      const next = prev.map((row) =>
        row.map((cell) => {
          if (cell === 2) {
            // Born rule probability 50/50 collapse
            return Math.random() > 0.5 ? 1 : 0;
          }
          return cell;
        })
      );
      computeStats(next, stats.generation);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-cyan-950/80 border border-purple-500/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Cellular Automaton & Conway Engine
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                QUANTUM ENHANCED (B3/S23)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>Quantum Conway Automaton</span>
              <span className="text-sm font-normal px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                2D Lattice Dynamics & Superposition Collapse
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Experience Conway's Game of Life expanded with quantum state superposition. Live cells mutate across $|0\rangle$, $|1\rangle$, and $(|0\rangle + |1\rangle)/\sqrt{2}$ with non-local neighborhood wave interference and Born rule collapse.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={collapseSuperposition}
              className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs text-purple-300 font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Wavefunction Collapse</span>
            </button>
            <button
              onClick={() => setQuantumMode(!quantumMode)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                quantumMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Quantum Mode: {quantumMode ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 font-medium">Generation</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stats.generation}</div>
          <div className="text-[10px] text-slate-500">Total discrete tick steps</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 font-medium">Classical Cells</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{stats.aliveCount}</div>
          <div className="text-[10px] text-emerald-500/80">Alive state |1⟩</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 font-medium">Superposition Cells</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{stats.superpositionCount}</div>
          <div className="text-[10px] text-cyan-500/80">Quantum state |ψ⟩</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 font-medium">Quantum Entropy</div>
          <div className="text-xl font-bold text-purple-400 font-mono mt-0.5">{stats.entropyMetric}</div>
          <div className="text-[10px] text-slate-500">von Neumann dispersion</div>
        </div>
      </div>

      {/* Control Bar & Presets */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause' : 'Start Simulation'}</span>
          </button>

          <button
            onClick={stepForward}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setGrid(createEmptyGrid());
              setStats({ generation: 0, aliveCount: 0, superpositionCount: 0, entropyMetric: 0 });
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
          <button
            onClick={() => loadPreset('glider')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all cursor-pointer"
          >
            Glider 🚀
          </button>
          <button
            onClick={() => loadPreset('pulsar')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all cursor-pointer"
          >
            Pulsar 💥
          </button>
          <button
            onClick={() => loadPreset('quantum_cat')}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 text-xs text-cyan-300 font-semibold transition-all cursor-pointer"
          >
            Quantum Cat ⚛️
          </button>
          <button
            onClick={() => loadPreset('random')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all cursor-pointer flex items-center gap-1"
          >
            <Shuffle className="w-3 h-3" />
            <span>Randomize</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl overflow-x-auto">
        <div
          className="grid gap-[2px] mx-auto select-none"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(14px, 1fr))`,
            maxWidth: '920px'
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`h-4 rounded-sm transition-colors cursor-pointer ${
                  cell === 1
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : cell === 2
                    ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse'
                    : 'bg-slate-950 hover:bg-slate-800/80 border border-slate-900'
                }`}
                title={`Row ${r}, Col ${c} (${cell === 1 ? 'Alive |1⟩' : cell === 2 ? 'Superposition |ψ⟩' : 'Dead |0⟩'})`}
              />
            ))
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span>Classical Alive |1⟩</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" />
              <span>Quantum Superposition (|0⟩ + |1⟩)/√2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-950 border border-slate-800" />
              <span>Dead |0⟩</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Click any cell to toggle state. Run simulation to observe non-local Conway dynamics.
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConwayAutomatonStudio;
