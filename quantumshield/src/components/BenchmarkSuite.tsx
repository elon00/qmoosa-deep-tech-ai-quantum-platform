import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Key, Shield, HardDrive, RefreshCw } from 'lucide-react';
import { getBenchmarkComparisonData } from '../lib/pqcCrypto';
import { BenchmarkMetrics } from '../types';

export const BenchmarkSuite: React.FC = () => {
  const [data, setData] = useState<BenchmarkMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMetric, setActiveMetric] = useState<'publicKey' | 'ciphertext' | 'handshakeTime' | 'quantumSecurity'>('publicKey');

  const fetchBenchmarks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pqc/benchmark');
      if (res.ok) {
        const json = await res.json();
        if (json.metrics) {
          setData(json.metrics);
          return;
        }
      }
      setData(getBenchmarkComparisonData());
    } catch (e) {
      setData(getBenchmarkComparisonData());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, []);

  const getMaxValue = () => {
    if (activeMetric === 'publicKey') return Math.max(...data.map(d => d.publicKeySize));
    if (activeMetric === 'ciphertext') return Math.max(...data.map(d => d.ciphertextOverhead));
    if (activeMetric === 'handshakeTime') return Math.max(...data.map(d => d.handshakeTimeMs));
    if (activeMetric === 'quantumSecurity') return 256;
    return 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border-l-4 border-[#FF003C] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#FF003C] text-xs font-mono font-bold uppercase tracking-[0.2em]">
            <BarChart3 className="w-4 h-4 text-[#FF003C]" />
            <span>METRIC COMPARISON // PERFORMANCE ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            KEY SIZE, OVERHEAD & QUANTUM SECURITY BENCHMARKS
          </h2>
          <p className="text-xs text-white/60 font-sans max-w-3xl">
            Evaluates classical asymmetric algorithms against post-quantum lattice alternatives (ML-KEM-768) and hybrid protocol implementations.
          </p>
        </div>

        <button
          onClick={fetchBenchmarks}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-3 bg-[#050505] border border-white/20 hover:border-[#FF003C] text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF003C]' : ''}`} />
          <span>REFRESH API BENCHMARKS</span>
        </button>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <button
          onClick={() => setActiveMetric('publicKey')}
          className={`p-4 border transition-all text-left cursor-pointer uppercase tracking-wider ${
            activeMetric === 'publicKey'
              ? 'bg-white text-black border-white font-black'
              : 'bg-[#111111] border-white/10 text-white/70 hover:border-white/40 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4 mb-2" />
          <span className="font-bold text-sm block">PUBLIC KEY SIZE</span>
          <span className="text-[9px] opacity-60">Bytes on the wire</span>
        </button>

        <button
          onClick={() => setActiveMetric('ciphertext')}
          className={`p-4 border transition-all text-left cursor-pointer uppercase tracking-wider ${
            activeMetric === 'ciphertext'
              ? 'bg-white text-black border-white font-black'
              : 'bg-[#111111] border-white/10 text-white/70 hover:border-white/40 hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4 mb-2" />
          <span className="font-bold text-sm block">CIPHERTEXT OVERHEAD</span>
          <span className="text-[9px] opacity-60">Encapsulation payload</span>
        </button>

        <button
          onClick={() => setActiveMetric('handshakeTime')}
          className={`p-4 border transition-all text-left cursor-pointer uppercase tracking-wider ${
            activeMetric === 'handshakeTime'
              ? 'bg-white text-black border-white font-black'
              : 'bg-[#111111] border-white/10 text-white/70 hover:border-white/40 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 mb-2" />
          <span className="font-bold text-sm block">EXECUTION LATENCY</span>
          <span className="text-[9px] opacity-60">Handshake speed in ms</span>
        </button>

        <button
          onClick={() => setActiveMetric('quantumSecurity')}
          className={`p-4 border transition-all text-left cursor-pointer uppercase tracking-wider ${
            activeMetric === 'quantumSecurity'
              ? 'bg-[#00FF41] text-black border-[#00FF41] font-black'
              : 'bg-[#111111] border-white/10 text-white/70 hover:border-white/40 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4 mb-2" />
          <span className="font-bold text-sm block">QUANTUM SECURITY</span>
          <span className="text-[9px] opacity-60">Bits of quantum resistance</span>
        </button>
      </div>

      {/* Visual Chart / Bar Visualization */}
      <div className="bg-[#111111] border border-white/10 p-6 space-y-6">
        <h3 className="text-lg font-black text-white uppercase tracking-tight">
          VISUAL METRIC DISTRIBUTION ({activeMetric.toUpperCase()})
        </h3>

        <div className="space-y-4">
          {data.map((item, idx) => {
            let value = 0;
            let unit = 'Bytes';
            if (activeMetric === 'publicKey') { value = item.publicKeySize; unit = 'Bytes'; }
            if (activeMetric === 'ciphertext') { value = item.ciphertextOverhead; unit = 'Bytes'; }
            if (activeMetric === 'handshakeTime') { value = item.handshakeTimeMs; unit = 'ms'; }
            if (activeMetric === 'quantumSecurity') { value = item.quantumSecurityBits; unit = 'Bits'; }

            const max = getMaxValue();
            const percentage = Math.max(5, Math.min(100, (value / max) * 100));

            return (
              <div key={idx} className="space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold">{item.algorithm}</span>
                    <span className={`text-[9px] px-2 py-0.5 uppercase tracking-wider font-bold ${
                      item.shorVulnerable ? 'bg-[#FF003C] text-white' : 'bg-[#00FF41] text-black'
                    }`}>
                      {item.shorVulnerable ? 'SHOR VULNERABLE' : 'QUANTUM SAFE'}
                    </span>
                  </div>
                  <span className="text-white font-bold">{value} {unit}</span>
                </div>

                <div className="w-full h-4 bg-[#050505] overflow-hidden border border-white/20 p-0.5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.shorVulnerable ? 'bg-[#FF003C]' : 'bg-[#00FF41]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Benchmark Specs Table */}
      <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">FULL ALGORITHM SPECIFICATIONS</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-white/20 text-white/60 bg-[#050505] uppercase text-[10px] tracking-wider">
                <th className="p-3">Algorithm</th>
                <th className="p-3">Public Key</th>
                <th className="p-3">Private Key</th>
                <th className="p-3">Ciphertext</th>
                <th className="p-3">Handshake (ms)</th>
                <th className="p-3">Classical Bits</th>
                <th className="p-3">Quantum Bits</th>
                <th className="p-3">NIST Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/90">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-white">{item.algorithm}</td>
                  <td className="p-3">{item.publicKeySize} B</td>
                  <td className="p-3">{item.privateKeySize} B</td>
                  <td className="p-3">{item.ciphertextOverhead} B</td>
                  <td className="p-3 text-white font-bold">{item.handshakeTimeMs} ms</td>
                  <td className="p-3">{item.classicalSecurityBits} bits</td>
                  <td className={`p-3 font-bold ${item.quantumSecurityBits > 0 ? 'text-[#00FF41]' : 'text-[#FF003C]'}`}>
                    {item.quantumSecurityBits} bits
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                      item.shorVulnerable ? 'bg-[#FF003C] text-white' : 'bg-[#00FF41] text-black'
                    }`}>
                      {item.nistStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
