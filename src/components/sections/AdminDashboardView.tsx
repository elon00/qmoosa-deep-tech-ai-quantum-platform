import React from "react";
import { Building2, Users, Bot, Cpu, Link as LinkIcon, ShieldCheck, Activity, DollarSign, Layers } from "lucide-react";

export const AdminDashboardView: React.FC = () => {
  const metrics = [
    { label: "Active Organizations", value: "1,248", change: "+12% this month", icon: <Building2 className="w-5 h-5 text-cyan-400" /> },
    { label: "Active AI Agents Executed", value: "842,100", change: "+28% this week", icon: <Bot className="w-5 h-5 text-emerald-400" /> },
    { label: "Quantum QPU Jobs Run", value: "14,890", change: "Fidelity 99.8%", icon: <Cpu className="w-5 h-5 text-purple-400" /> },
    { label: "Solana Smart Contract Audits", value: "3,410", change: "Zero breaches", icon: <LinkIcon className="w-5 h-5 text-amber-400" /> },
  ];

  const auditLogs = [
    { time: "22:12:04", user: "admin@qmoosa.io", action: "PQC ML-KEM-768 Certificate Rotated", status: "SUCCESS" },
    { time: "21:48:19", user: "dev@quantum-lab.org", action: "32-Qubit State Vector Job Completed", status: "SUCCESS" },
    { time: "20:15:33", user: "sec@defense.gov", action: "Solana Anchor Bytecode Verification", status: "PASSED" },
  ];

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-mono mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>QMOOSA PLATFORM ADMIN DASHBOARD</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Platform Health & System Metrics
            </h1>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              Uptime: 99.999%
            </span>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold">{m.label}</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">{m.icon}</div>
              </div>
              <div className="text-2xl font-black text-white font-mono">{m.value}</div>
              <p className="text-[11px] font-mono text-emerald-400">{m.change}</p>
            </div>
          ))}
        </div>

        {/* Audit Logs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4 font-mono text-xs">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase block pb-3 border-b border-slate-800">
            SYSTEM SECURITY & AUDIT TRAIL
          </span>

          <div className="space-y-2">
            {auditLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-slate-500 text-[11px]">{log.time}</span>
                  <span className="font-bold text-white">{log.user}</span>
                  <span>— {log.action}</span>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">{log.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
