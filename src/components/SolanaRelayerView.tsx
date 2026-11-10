import React, { useState } from "react";
import { Wallet, CheckCircle2, Copy, ExternalLink, ShieldCheck, ArrowRightLeft, Terminal, Cpu, FileCode2, RefreshCw } from "lucide-react";
import { SolanaPlayerProfile, SolanaTransactionRecord } from "../types";
import { RUST_ANCHOR_CODE, TYPESCRIPT_RELAYER_CODE } from "../utils/codeTemplates";
import { getInitialTransactions } from "../utils/solanaSimulator";

interface SolanaRelayerViewProps {
  player: SolanaPlayerProfile;
}

export const SolanaRelayerView: React.FC<SolanaRelayerViewProps> = ({ player }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<"rust" | "relayer">("rust");
  const [transactions, setTransactions] = useState<SolanaTransactionRecord[]>(() =>
    getInitialTransactions(player.publicKey)
  );
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  const handleCopyPubkey = () => {
    navigator.clipboard.writeText(player.publicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="solana-relayer-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-800/40 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Wallet className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Solana On-Chain State & Relayer Bridge
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Quantum factorization proofs from Qiskit/Python are packaged and signed by the TypeScript Oracle Relayer directly into the Solana Anchor Smart Contract.
            </p>
          </div>

          {/* Account Key Card */}
          <div className="bg-slate-950/90 border border-emerald-700/40 rounded-xl p-3 flex items-center gap-3">
            <div>
              <div className="text-[10px] text-slate-400">Player Profile PDA Address</div>
              <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 mt-0.5">
                <span>{player.publicKey}</span>
                <button
                  id="copy-pubkey-btn"
                  onClick={handleCopyPubkey}
                  className="p-1 hover:text-white transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
              {copiedKey && <span className="text-[10px] text-emerald-400">Copied to clipboard!</span>}
            </div>
          </div>
        </div>

        {/* On-Chain Player Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Player Level</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">Level {player.level}</div>
            <div className="text-[10px] text-purple-400">{player.experience} Total XP</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Q-Bits Tokens</div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">{player.qBitsTokens} Q-Bits</div>
            <div className="text-[10px] text-slate-400">Minted via Decode Proofs</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Tasks Completed</div>
            <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">{player.tasksCompleted} Tasks</div>
            <div className="text-[10px] text-emerald-400">100% Cryptographic Accuracy</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">NFT Quantum Badges</div>
            <div className="text-lg font-bold text-purple-300 font-mono mt-0.5">{player.badges.length} Badges</div>
            <div className="text-[10px] text-slate-400">On-Chain Verified</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Transactions & Relayer Code Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Solana Transactions Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-semibold flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solana Devnet Transactions</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Finalized (Commitment: Confirmed)
            </span>
          </div>

          <div className="space-y-2">
            {transactions.map((tx, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-300">
                    {tx.instruction === "update_score" ? "⚡ update_score" : "✨ mint_badge"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Slot #{tx.slot}</span>
                </div>

                <div className="text-[11px] text-slate-400 font-mono truncate">
                  Sig: <span className="text-slate-300">{tx.signature}</span>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1 text-slate-500 border-t border-slate-800">
                  <span>Task: {tx.taskId} (+{tx.points} pts)</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Finalized
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Rust Anchor & Relayer Code Viewers */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
            {/* Tab switch */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  id="tab-rust-code-btn"
                  onClick={() => setActiveCodeTab("rust")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeCodeTab === "rust"
                      ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Rust Smart Contract (Anchor)
                </button>
                <button
                  id="tab-relayer-code-btn"
                  onClick={() => setActiveCodeTab("relayer")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeCodeTab === "relayer"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  TypeScript Relayer Oracle
                </button>
              </div>

              <span className="text-[10px] text-slate-500 font-mono">
                {activeCodeTab === "rust" ? "programs/lib.rs" : "relayer/index.ts"}
              </span>
            </div>

            {/* Code Body */}
            <div className="mt-3">
              <pre className="p-3.5 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[380px] border border-slate-800/80 leading-relaxed">
                {activeCodeTab === "rust" ? RUST_ANCHOR_CODE : TYPESCRIPT_RELAYER_CODE}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
