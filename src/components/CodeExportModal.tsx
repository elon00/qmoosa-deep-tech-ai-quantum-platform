import React, { useState } from "react";
import { X, Copy, Check, Download, FileCode, Terminal, Layers } from "lucide-react";
import {
  RUST_ANCHOR_CODE,
  TYPESCRIPT_RELAYER_CODE,
  PYTHON_FASTAPI_QISKIT_CODE,
  ANNA_MANIFEST_JSON,
} from "../utils/codeTemplates";
import { generateOpenQASM } from "../utils/quantumMath";

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<"rust" | "relayer" | "python" | "manifest" | "qasm" | "readme">("readme");
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const README_CONTENT = `# Omniver Quantum Decoder

A real-time, interactive game and educational simulation platform integrating Solana blockchain with global quantum computing platforms (IBM Qiskit, PennyLane, Classiq, Qniverse, Cirq). Designed for researchers and students to simulate Shor's Algorithm, practice Bitcoin cryptography decoding (ECDSA secp256k1 & RSA), and synchronize on-chain proofs.

## System Architecture

1. **Quantum Execution Layer (Off-Chain):** Python 3.11 with IBM Qiskit AerSimulator runs Shor's period finding circuit.
2. **Relayer / Oracle Bridge (TypeScript):** Submits verified cryptographic proofs to Solana smart contracts.
3. **On-Chain Progression (Solana Anchor):** Tracks player XP, PDA level, Q-Bits tokens, and NFT Quantum Badges.
4. **Anna AI OS & Executa Plugin:** JSON-RPC 2.0 stdio interface powering natural language copilot interactions.

## Quickstart

### 1. Solana Anchor Smart Contract
\`\`\`bash
cd program
anchor build
anchor deploy
\`\`\`

### 2. Python Quantum Backend (FastAPI + Qiskit)
\`\`\`bash
cd backend
pip install -r requirements.txt
python main.py
\`\`\`

### 3. TypeScript Relayer Bridge
\`\`\`bash
cd relayer
npm install
npm run start
\`\`\`

### 4. Anna Executa Local Preview
\`\`\`bash
anna-app dev
\`\`\`
`;

  const filesMap: Record<string, { name: string; lang: string; content: string }> = {
    readme: { name: "README.md", lang: "markdown", content: README_CONTENT },
    rust: { name: "programs/omniver/src/lib.rs", lang: "rust", content: RUST_ANCHOR_CODE },
    relayer: { name: "relayer/src/index.ts", lang: "typescript", content: TYPESCRIPT_RELAYER_CODE },
    python: { name: "backend/main.py", lang: "python", content: PYTHON_FASTAPI_QISKIT_CODE },
    manifest: { name: "manifest.json", lang: "json", content: ANNA_MANIFEST_JSON },
    qasm: { name: "circuits/shor_period.qasm", lang: "openqasm", content: generateOpenQASM(15, 7, 4, 4) },
  };

  const active = filesMap[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([active.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = active.name.split("/").pop() || "code.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Omniver Quantum Decoder — Source Code Export
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="modal-copy-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy File"}</span>
            </button>

            <button
              id="modal-download-btn"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-950 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {Object.entries(filesMap).map(([key, item]) => (
            <button
              key={key}
              id={`export-file-tab-${key}`}
              onClick={() => setSelectedFile(key as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedFile === key
                  ? "bg-slate-800 text-cyan-300 font-semibold border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 bg-slate-950 overflow-y-auto font-mono text-xs text-slate-300">
          <pre className="leading-relaxed whitespace-pre-wrap">{active.content}</pre>
        </div>
      </div>
    </div>
  );
};
