import React, { useState } from "react";
import { Link as LinkIcon, ShieldCheck, Play, Terminal, CheckCircle2, AlertTriangle, Layers } from "lucide-react";

export const BlockchainDivisionView: React.FC = () => {
  const [contractCode, setContractCode] = useState(
    `#[program]\npub mod solana_agent_vault {\n    use super::*;\n    pub fn deposit_agent_collateral(ctx: Context<Deposit>, amount: u64) -> Result<()> {\n        msg!("Collateral deposited!");\n        Ok(())\n    }\n}`
  );
  const [auditResult, setAuditResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAuditContract = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blockchain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain: "solana", addressOrCode: contractCode }),
      });
      const data = await res.json();
      setAuditResult(data);
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
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950 text-purple-400 border border-purple-800 text-xs font-mono mb-3">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>QMOOSA BLOCKCHAIN & WEB3/WEB4 DIVISION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Solana Anchor Auditor & Web4 Agent Wallets
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl">
              Static Rust bytecode auditing, zero-knowledge rollup proofs, and autonomous machine-to-machine wallet infrastructures.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-purple-400 border border-slate-800">
              Solana TPS: <strong className="text-white">65,000</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
              Audit Score: <strong className="text-white">99.2/100</strong>
            </span>
          </div>
        </div>

        {/* Auditor Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Code Area */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                SOLANA ANCHOR / EVM SMART CONTRACT INPUT
              </span>
              <button
                onClick={handleAuditContract}
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition flex items-center space-x-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loading ? "Auditing..." : "Run Security Audit"}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={contractCode}
              onChange={(e) => setContractCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-purple-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Right Audit Results */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase block pb-3 border-b border-slate-800">
              VERIFICATION REPORT
            </span>

            {auditResult ? (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>SECURITY SCORE:</span>
                    <strong className="text-emerald-400">{auditResult.securityScore} / 100</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>VULNERABILITIES:</span>
                    <strong className="text-emerald-400">{auditResult.vulnerabilitiesFound} Found</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>BYTECODE SIZE:</span>
                    <strong className="text-slate-300">{auditResult.bytecodeSize}</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 uppercase font-bold text-[10px]">
                    FORMAL AUDIT CHECKS
                  </span>
                  {auditResult.auditTrail.map((tr: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between text-slate-300"
                    >
                      <span>{tr.step}</span>
                      <span className="text-emerald-400 font-bold">{tr.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono py-12 text-center">
                Click "Run Security Audit" to analyze contract bytecode and generate audit proofs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
