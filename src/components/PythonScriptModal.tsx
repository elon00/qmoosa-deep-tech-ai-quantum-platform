import React, { useState } from 'react';
import { X, Copy, Download, Check, Terminal, FileCode2 } from 'lucide-react';

interface PythonScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  qiskitCode: string;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  isOpen,
  onClose,
  qiskitCode,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullPythonScript = `"""
===================================================================
OMNIVERSE QUANTUM DECODER - REAL IBM QUANTUM HARDWARE RUNNER
Vision & Mission: Solving Post-Quantum Cryptography & Q-Day Puzzles
===================================================================
Requirements:
    pip install qiskit qiskit-ibm-runtime qiskit-aer

Run:
    python omniverse_decoder.py
"""

import sys
${qiskitCode}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPythonScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.location.href = '/api/download/omniverse_decoder.py';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <FileCode2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              LOCAL TERMINAL PYTHON RUNNER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              omniverse_decoder.py • Run on your Desktop or IBM Quantum Cloud
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-3 text-xs font-mono text-slate-300 space-y-1">
          <p className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Terminal className="w-4 h-4" /> Terminal Execution Commands:
          </p>
          <p className="text-slate-400">1. Install Qiskit dependencies:</p>
          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-cyan-300 font-bold">
            pip install qiskit qiskit-ibm-runtime qiskit-aer
          </div>
          <p className="text-slate-400">2. Run the script in terminal:</p>
          <div className="bg-slate-900 p-2 rounded border border-slate-800 text-emerald-300 font-bold">
            python omniverse_decoder.py
          </div>
        </div>

        {/* Code Editor Preview */}
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-xs text-cyan-300 mb-4 max-h-60">
          <pre>{fullPythonScript}</pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Code!' : 'Copy Python Code'}
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Download omniverse_decoder.py
          </button>
        </div>
      </div>
    </div>
  );
};
