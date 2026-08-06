import React from 'react';
import { BlochCoords } from '../lib/quantumEngine';

interface BlochSphereVisualizerProps {
  blochCoords: BlochCoords[];
}

export const BlochSphereVisualizer: React.FC<BlochSphereVisualizerProps> = ({ blochCoords }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          BLOCH SPHERE STATEVECTOR PROJECTION
        </h2>
        <span className="text-[10px] font-mono text-slate-400">
          |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {blochCoords.map((coord, qubitIdx) => {
          // Map 3D coords (x, y, z) to 2D SVG canvas
          // x: right, z: up, y: depth (diagonal)
          const radius = 50;
          const centerX = 65;
          const centerY = 65;

          const projX = centerX + coord.x * radius * 0.8 + coord.y * radius * 0.3;
          const projY = centerY - coord.z * radius * 0.8 + coord.y * radius * 0.3;

          const thetaDeg = ((coord.theta * 180) / Math.PI).toFixed(1);
          const phiDeg = ((coord.phi * 180) / Math.PI).toFixed(1);

          return (
            <div
              key={qubitIdx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col items-center relative group hover:border-cyan-700 transition-all"
            >
              <div className="w-full flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="text-cyan-400 font-bold">q[{qubitIdx}]</span>
                <span className="text-slate-400 text-[10px]">
                  |1⟩: {(coord.prob1 * 100).toFixed(0)}%
                </span>
              </div>

              {/* Bloch Sphere SVG */}
              <svg width="130" height="130" className="my-1">
                <defs>
                  <radialGradient id={`sphere-grad-${qubitIdx}`} cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
                  </radialGradient>
                </defs>

                {/* Sphere Sphere Outline */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill={`url(#sphere-grad-${qubitIdx})`}
                  stroke="#334155"
                  strokeWidth="1.5"
                />

                {/* Equator Ellipse */}
                <ellipse
                  cx={centerX}
                  cy={centerY}
                  rx={radius}
                  ry={radius * 0.35}
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Z Axis (|0> top, |1> bottom) */}
                <line
                  x1={centerX}
                  y1={centerY - radius - 6}
                  x2={centerX}
                  y2={centerY + radius + 6}
                  stroke="#475569"
                  strokeWidth="1"
                />

                {/* Axis Labels */}
                <text x={centerX - 4} y={centerY - radius - 8} fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  |0⟩
                </text>
                <text x={centerX - 4} y={centerY + radius + 16} fill="#a855f7" fontSize="10" fontFamily="monospace">
                  |1⟩
                </text>

                {/* State Vector Arrow */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={projX}
                  y2={projY}
                  stroke="#22d3ee"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Vector Tip Point */}
                <circle cx={projX} cy={projY} r="4" fill="#06b6d4" className="animate-ping" />
                <circle cx={projX} cy={projY} r="3" fill="#ffffff" />
              </svg>

              {/* Polar Angle Telemetry */}
              <div className="w-full mt-1 pt-1 border-t border-slate-900 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>θ: {thetaDeg}°</span>
                <span>φ: {phiDeg}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
