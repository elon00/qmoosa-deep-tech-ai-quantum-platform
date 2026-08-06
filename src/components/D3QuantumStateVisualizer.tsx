import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { QuantumSimulationResult, Complex, BlochCoords } from '../lib/quantumEngine';
import {
  BarChart3,
  Globe,
  Compass,
  Zap,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface D3QuantumStateVisualizerProps {
  simulationResult: QuantumSimulationResult;
  totalShots: number;
  onShotsChange?: (shots: number) => void;
  noiseLevel?: number;
  onNoiseLevelChange?: (noise: number) => void;
  executionMode?: 'simulator' | 'ibm_hardware';
}

type ViewMode = 'histogram' | 'bloch' | 'amplitudes';

export const D3QuantumStateVisualizer: React.FC<D3QuantumStateVisualizerProps> = ({
  simulationResult,
  totalShots,
  onShotsChange,
  noiseLevel = 0,
  onNoiseLevelChange,
  executionMode = 'simulator',
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('histogram');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{
    state: string;
    prob: number;
    count: number;
    re: number;
    im: number;
    phaseDeg: number;
  } | null>(null);

  // SVG Refs
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotation angles for Bloch Spheres (interactive drag)
  const [blochRotations, setBlochRotations] = useState<{ [qubit: number]: number }>({});

  const {
    numQubits,
    stateVector,
    probabilities,
    basisStates,
    shotCounts,
    blochSpheres,
    hasEntanglement,
    entanglementFidelity,
  } = simulationResult;

  // Render D3 Bar Chart Spectrum
  useEffect(() => {
    if (viewMode !== 'histogram' || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean container for responsive redrawing

    const width = containerRef.current.clientWidth || 600;
    const height = 260;
    const margin = { top: 25, right: 20, bottom: 50, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleBand()
      .domain(basisStates)
      .range([0, innerWidth])
      .padding(0.25);

    const maxProb = Math.max(...probabilities, 0.05);
    const yScale = d3.scaleLinear().domain([0, maxProb * 1.1]).range([innerHeight, 0]);

    // Grid lines
    const yGrid = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSize(-innerWidth)
      .tickFormat(() => '');

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#1e293b')
      .attr('stroke-dasharray', '3,3');

    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d) => `|${d}⟩`);
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${(Number(d) * 100).toFixed(0)}%`);

    // X Axis group
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-family', 'monospace')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#38bdf8');

    // Y Axis group
    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-family', 'monospace')
      .attr('font-size', '10px')
      .attr('fill', '#94a3b8');

    // Helper to calculate phase color
    const getPhaseColor = (comp: Complex) => {
      const phase = Math.atan2(comp.im, comp.re); // -PI to PI
      const hue = ((phase + Math.PI) / (2 * Math.PI)) * 360;
      return `hsl(${hue}, 85%, 60%)`;
    };

    // Bars rendering with D3 Transitions
    const barGroups = g
      .selectAll('.bar-group')
      .data(basisStates)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d: string) => `translate(${xScale(d) || 0}, 0)`);

    // Background track
    barGroups
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', innerHeight)
      .attr('fill', '#0f172a')
      .attr('rx', 6)
      .attr('opacity', 0.5);

    // Probability Bars
    barGroups
      .append('rect')
      .attr('class', 'prob-bar')
      .attr('x', 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('rx', 6)
      .attr('fill', (d: string, i: number) => {
        const comp = stateVector[i] || { re: 0, im: 0 };
        return probabilities[i] > 0.001 ? getPhaseColor(comp) : '#334155';
      })
      .attr('stroke', (d: string) => (selectedState === d ? '#38bdf8' : 'none'))
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d: string) => {
        const i = basisStates.indexOf(d);
        const prob = probabilities[i] || 0;
        const count = shotCounts[d] || 0;
        const comp = stateVector[i] || { re: 0, im: 0 };
        const phaseDeg = (Math.atan2(comp.im, comp.re) * 180) / Math.PI;

        setHoveredInfo({
          state: d,
          prob,
          count,
          re: comp.re,
          im: comp.im,
          phaseDeg,
        });

        if (event.currentTarget) {
          d3.select(event.currentTarget as SVGRectElement).attr('opacity', 0.8);
        }
      })
      .on('mouseout', (event: MouseEvent) => {
        setHoveredInfo(null);
        if (event.currentTarget) {
          d3.select(event.currentTarget as SVGRectElement).attr('opacity', 1.0);
        }
      })
      .on('click', (event: MouseEvent, d: string) => {
        setSelectedState((prev) => (prev === d ? null : d));
      })
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr('y', (d: string, i: number) => yScale(probabilities[i] || 0))
      .attr('height', (d: string, i: number) => innerHeight - yScale(probabilities[i] || 0));

    // Top Percentage Labels
    barGroups
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', (d: string, i: number) => yScale(probabilities[i] || 0) - 6)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', (d: string, i: number) => (probabilities[i] > 0.01 ? '#e2e8f0' : '#64748b'))
      .text((d: string, i: number) => {
        const p = probabilities[i] || 0;
        return p >= 0.005 ? `${(p * 100).toFixed(1)}%` : '';
      });

    // Shot count labels at bottom
    barGroups
      .append('text')
      .attr('x', xScale.bandwidth() / 2)
      .attr('y', innerHeight + 32)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '9px')
      .attr('fill', '#64748b')
      .text((d: string) => `${shotCounts[d] || 0}s`);

  }, [viewMode, simulationResult, selectedState]);

  // Render D3 Amplitude Phase Circles
  useEffect(() => {
    if (viewMode !== 'amplitudes' || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 600;
    const height = 260;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const padding = 20;
    const availableWidth = width - padding * 2;
    const cols = Math.min(basisStates.length, 8);
    const itemWidth = availableWidth / cols;
    const centerY = height / 2;

    const g = svg.append('g').attr('transform', `translate(${padding}, 0)`);

    basisStates.forEach((state, i) => {
      const comp = stateVector[i] || { re: 0, im: 0 };
      const mag = Math.sqrt(comp.re * comp.re + comp.im * comp.im);
      const phase = Math.atan2(comp.im, comp.re);
      const phaseDeg = (phase * 180) / Math.PI;

      const cx = i * itemWidth + itemWidth / 2;
      const maxRadius = Math.min(itemWidth / 2 - 10, 40);
      const r = Math.max(mag * maxRadius, 2);

      const stateGroup = g.append('g').attr('transform', `translate(${cx}, ${centerY})`);

      // Outer boundary ring
      stateGroup
        .append('circle')
        .attr('r', maxRadius)
        .attr('fill', '#020617')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1.5);

      // Phase Wheel Angle Markings
      stateGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', -maxRadius)
        .attr('x2', 0)
        .attr('y2', maxRadius)
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 1);

      stateGroup
        .append('line')
        .attr('x1', -maxRadius)
        .attr('y1', 0)
        .attr('x2', maxRadius)
        .attr('y2', 0)
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 1);

      // Magnitude Circle (Animated radius)
      const hue = ((phase + Math.PI) / (2 * Math.PI)) * 360;
      const color = mag > 0.01 ? `hsl(${hue}, 85%, 60%)` : '#334155';

      stateGroup
        .append('circle')
        .attr('r', 0)
        .attr('fill', color)
        .attr('fill-opacity', 0.35)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .transition()
        .duration(400)
        .attr('r', r);

      // Phase Pointer Line
      const px = Math.cos(phase) * Math.max(r, 12);
      const py = -Math.sin(phase) * Math.max(r, 12); // SVG inverted Y

      stateGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 0)
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .transition()
        .duration(400)
        .attr('x2', px)
        .attr('y2', py);

      stateGroup
        .append('circle')
        .attr('cx', px)
        .attr('cy', py)
        .attr('r', 3)
        .attr('fill', '#ffffff');

      // Labels below
      stateGroup
        .append('text')
        .attr('y', maxRadius + 18)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#38bdf8')
        .text(`|${state}⟩`);

      stateGroup
        .append('text')
        .attr('y', maxRadius + 32)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '9px')
        .attr('fill', '#94a3b8')
        .text(`φ=${phaseDeg.toFixed(0)}°`);
    });
  }, [viewMode, simulationResult]);

  // Render D3 Bloch Sphere Projections
  useEffect(() => {
    if (viewMode !== 'bloch' || !svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current.clientWidth || 600;
    const height = 260;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const itemWidth = width / numQubits;
    const radius = Math.min(itemWidth / 2 - 25, 75);
    const centerY = height / 2;

    blochSpheres.forEach((coord, qIdx) => {
      const cx = qIdx * itemWidth + itemWidth / 2;
      const rotAngle = blochRotations[qIdx] || 0;

      // Rotate (x, y) coordinates around Z axis for visual inspection
      const rad = (rotAngle * Math.PI) / 180;
      const rx = coord.x * Math.cos(rad) - coord.y * Math.sin(rad);
      const ry = coord.x * Math.sin(rad) + coord.y * Math.cos(rad);

      // Orthographic projection to 2D
      const projX = cx + rx * radius * 0.8 + ry * radius * 0.3;
      const projY = centerY - coord.z * radius * 0.8 + ry * radius * 0.3;

      const group = svg.append('g').attr('class', `bloch-qubit-${qIdx}`);

      // Background Sphere Gradient Definition
      const gradId = `d3-bloch-grad-${qIdx}`;
      const grad = svg
        .append('defs')
        .append('radialGradient')
        .attr('id', gradId)
        .attr('cx', '35%')
        .attr('cy', '35%')
        .attr('r', '65%');

      grad.append('stop').attr('offset', '0%').attr('stop-color', '#1e293b').attr('stop-opacity', '0.9');
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#020617').attr('stop-opacity', '0.98');

      // Sphere Outer Circle
      group
        .append('circle')
        .attr('cx', cx)
        .attr('cy', centerY)
        .attr('r', radius)
        .attr('fill', `url(#${gradId})`)
        .attr('stroke', '#334155')
        .attr('stroke-width', 1.5);

      // Equator Ellipse
      group
        .append('ellipse')
        .attr('cx', cx)
        .attr('cy', centerY)
        .attr('rx', radius)
        .attr('ry', radius * 0.35)
        .attr('fill', 'none')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3 3');

      // Z Axis Line (|0> top, |1> bottom)
      group
        .append('line')
        .attr('x1', cx)
        .attr('y1', centerY - radius - 8)
        .attr('x2', cx)
        .attr('y2', centerY + radius + 8)
        .attr('stroke', '#475569')
        .attr('stroke-width', 1.2);

      // Axis Labels
      group
        .append('text')
        .attr('x', cx)
        .attr('y', centerY - radius - 12)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .attr('fill', '#38bdf8')
        .text('|0⟩');

      group
        .append('text')
        .attr('x', cx)
        .attr('y', centerY + radius + 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .attr('fill', '#a855f7')
        .text('|1⟩');

      // Statevector Arrow
      group
        .append('line')
        .attr('x1', cx)
        .attr('y1', centerY)
        .attr('x2', cx)
        .attr('y2', centerY)
        .attr('stroke', '#06b6d4')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .transition()
        .duration(400)
        .attr('x2', projX)
        .attr('y2', projY);

      // Pulsing vector tip
      group
        .append('circle')
        .attr('cx', projX)
        .attr('cy', projY)
        .attr('r', 4)
        .attr('fill', '#22d3ee');

      group
        .append('circle')
        .attr('cx', projX)
        .attr('cy', projY)
        .attr('r', 2)
        .attr('fill', '#ffffff');

      // Qubit Label Header
      group
        .append('text')
        .attr('x', cx)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', '#38bdf8')
        .text(`Qubit q[${qIdx}]`);

      // Probability of |1⟩
      group
        .append('text')
        .attr('x', cx)
        .attr('y', 35)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '10px')
        .attr('fill', '#94a3b8')
        .text(`P(|1⟩) = ${(coord.prob1 * 100).toFixed(1)}%`);
    });
  }, [viewMode, simulationResult, blochRotations]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded-lg text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 flex items-center gap-2">
              REAL-TIME D3.JS QUANTUM STATE VISUALIZER
            </h2>
            <p className="text-[10px] font-mono text-slate-400">
              Interactive probability spectrum, Bloch vectors & complex phases
            </p>
          </div>
        </div>

        {/* View Mode Switches */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('histogram')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'histogram'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Probability
          </button>

          <button
            onClick={() => setViewMode('bloch')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'bloch'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Bloch Spheres
          </button>

          <button
            onClick={() => setViewMode('amplitudes')}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'amplitudes'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Phase Wheels
          </button>
        </div>

        {/* Shots & Noise options */}
        {onShotsChange && (
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Shots:</span>
              <select
                value={totalShots}
                onChange={(e) => onShotsChange(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-cyan-400 rounded-lg px-2 py-1 outline-none"
              >
                <option value={256}>256</option>
                <option value={1024}>1024</option>
                <option value={4096}>4096</option>
                <option value={8192}>8192</option>
              </select>
            </div>

            {onNoiseLevelChange && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Noise:
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={noiseLevel}
                  onChange={(e) => onNoiseLevelChange(parseFloat(e.target.value))}
                  className="w-16 accent-amber-500 cursor-pointer"
                />
                <span className="text-amber-400 font-bold w-8 text-right">
                  {(noiseLevel * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main D3 Render Canvas Container */}
      <div
        ref={containerRef}
        className="w-full relative min-h-[260px] bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden p-2 flex items-center justify-center"
      >
        <svg ref={svgRef} className="w-full h-[260px] transition-all" />

        {/* Tooltip Popup on Hover */}
        {hoveredInfo && (
          <div className="absolute top-3 right-3 bg-slate-900/95 border border-cyan-500/80 rounded-xl p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1 z-20 pointer-events-none animate-fadeIn">
            <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
              <span>Basis State |{hoveredInfo.state}⟩</span>
              <span className="text-emerald-400">
                {(hoveredInfo.prob * 100).toFixed(2)}%
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Shots Sampled: <strong className="text-white">{hoveredInfo.count}</strong>
            </div>
            <div className="text-[11px] text-slate-300">
              Amplitude: <strong className="text-purple-300">{hoveredInfo.re >= 0 ? '+' : ''}{hoveredInfo.re.toFixed(3)} {hoveredInfo.im >= 0 ? '+' : ''}{hoveredInfo.im.toFixed(3)}i</strong>
            </div>
            <div className="text-[11px] text-slate-300">
              Quantum Phase: <strong className="text-amber-300">{hoveredInfo.phaseDeg.toFixed(1)}°</strong>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Legend & Quantum State Telemetry Footer */}
      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3.5 h-3.5" /> Engine: {executionMode === 'ibm_hardware' ? 'IBM Hardware' : 'D3 Web Statevector'}
          </span>
          {hasEntanglement && (
            <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-bold text-[10px] animate-pulse">
              ENTANGLED (|Φ+⟩)
            </span>
          )}
          <span>
            Fidelity: <strong className="text-emerald-400">{(entanglementFidelity * 100).toFixed(2)}%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Phase spectrum mapping: HSL Hue [-π, +π]</span>
        </div>
      </div>
    </div>
  );
};
