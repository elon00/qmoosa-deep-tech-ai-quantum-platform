import React, { useState, useEffect } from 'react';
import { X, Key, Cpu, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Server } from 'lucide-react';

interface IbmHardwareModalProps {
  isOpen: boolean;
  onClose: () => void;
  ibmToken: string;
  onSaveToken: (token: string) => void;
  selectedBackend: string;
  onSelectBackend: (backend: string) => void;
  executionMode: 'simulator' | 'ibm_hardware';
  onSetExecutionMode: (mode: 'simulator' | 'ibm_hardware') => void;
  qasmCode: string;
}

export const IbmHardwareModal: React.FC<IbmHardwareModalProps> = ({
  isOpen,
  onClose,
  ibmToken,
  onSaveToken,
  selectedBackend,
  onSelectBackend,
  executionMode,
  onSetExecutionMode,
  qasmCode, }) => {
  const [inputToken, setInputToken] = useState(ibmToken);
  const [backends, setBackends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobStatus, setJobStatus] = useState<any | null>(null);
  const [isExecutingJob, setIsExecutingJob] = useState(false);

  useEffect(() => {
    setInputToken(ibmToken);
    fetchBackends(ibmToken);
  }, [ibmToken]);

  const fetchBackends = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ibm-quantum/backends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.backends) {
        setBackends(data.backends);
      }
    } catch (err) {
      console.error('Failed to load IBM backends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToken = () => {
    onSaveToken(inputToken);
    if (inputToken.trim().length > 10) {
      onSetExecutionMode('ibm_hardware');
    }
    fetchBackends(inputToken);
  };

  const handleRunTestJob = async () => {
    setIsExecutingJob(true);
    setJobStatus(null);
    try {
      const res = await fetch('/api/ibm-quantum/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: inputToken,
          qasm: qasmCode,
          backend: selectedBackend,
          shots: 1024,
        }),
      });
      const data = await res.json();
      setJobStatus(data);
    } catch (err) {
      console.error('Job submission failed', err);
    } finally {
      setIsExecutingJob(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              REAL IBM QUANTUM HARDWARE INTEGRATION
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Connect directly to cryogenic superconducting quantum computers in NY & Japan
            </p>
          </div>
        </div>

        {/* Mode Selector Switch */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-xl border border-slate-800 mb-6 text-xs font-mono">
          <button
            onClick={() => onSetExecutionMode('simulator')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              executionMode === 'simulator'
                ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Web Quantum Vector Engine (Local)</span>
          </button>

          <button
            onClick={() => onSetExecutionMode('ibm_hardware')}
            className={`py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
              executionMode === 'ibm_hardware'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>IBM Quantum Hardware (Cloud)</span>
          </button>
        </div>

        {/* API Token Section */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6">
          <label className="block text-xs font-mono font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            IBM QUANTUM API TOKEN (From quantum.ibm.com)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="Paste token from https://quantum.ibm.com..."
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
            />
            <button
              onClick={handleSaveToken}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Connect
            </button>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-2">
            Sign up for free at <a href="https://quantum.ibm.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">quantum.ibm.com</a> to copy your API Token.
          </p>
        </div>

        {/* Active Backends List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-semibold text-slate-300">
              AVAILABLE IBM QUANTUM BACKENDS
            </span>
            <button
              onClick={() => fetchBackends(inputToken)}
              className="text-xs text-cyan-400 flex items-center gap-1 hover:underline font-mono"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {backends.map((backend) => {
              const isSelected = selectedBackend === backend.id;
              return (
                <div
                  key={backend.id}
                  onClick={() => onSelectBackend(backend.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-400'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-purple-400 font-mono font-bold text-xs">
                      {backend.qubits} Q
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-slate-200">
                        {backend.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">
                        {backend.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold block">
                      ● {backend.status.toUpperCase()}
                    </span>
                    {backend.temperatureK && (
                      <span className="text-slate-400 block">Temp: {backend.temperatureK * 1000} mK</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Job Execution Trigger */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleRunTestJob}
            disabled={isExecutingJob}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isExecutingJob ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Submitting Circuit to Cryogenic System...
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" /> Run Current Circuit on {selectedBackend}
              </>
            )}
          </button>
        </div>

        {/* Execution Result Log */}
        {jobStatus && (
          <div className="mt-4 p-3 bg-slate-950 border border-purple-800/80 rounded-xl font-mono text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
              <CheckCircle2 className="w-4 h-4" /> Job Executed on {jobStatus.backendUsed}
            </div>
            <p>Job ID: <span className="text-cyan-400">{jobStatus.jobId}</span></p>
            <p>Target System: {jobStatus.executedOn}</p>
            <p>Quantum Hardware Fidelity: {jobStatus.fidelity}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              Timestamp: {jobStatus.timestamp}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
