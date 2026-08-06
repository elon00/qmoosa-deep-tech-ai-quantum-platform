import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

interface QasmViewerProps {
  qasm: string;
}

export const QasmViewer: React.FC<QasmViewerProps> = ({ qasm }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qasm);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-semibold tracking-wider text-slate-300">
            OPENQASM 2.0 CODE SPECIFICATION
          </h2>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied QASM' : 'Copy QASM'}
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs text-cyan-300 max-h-36 overflow-y-auto">
        <pre>{qasm}</pre>
      </div>
    </div>
  );
};
