/**
 * QuantumShield PQC - Main Application Entry
 * Full-stack Post-Quantum Cryptography & Hybrid Key Exchange Migration Platform
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Brain, ShieldAlert } from 'lucide-react';
import { Header, TabType } from './components/Header';
import { QDayDoomsdayClock } from './components/QDayDoomsdayClock';
import { KeyExchangeSandbox } from './components/KeyExchangeSandbox';
import { ShorSimulator } from './components/ShorSimulator';
import { QuantumRiskMatrix } from './components/QuantumRiskMatrix';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { AiMigrationAudit } from './components/AiMigrationAudit';
import { EncryptedVault } from './components/EncryptedVault';
import { PaymentGateway } from './components/PaymentGateway';
import { CryptoToolbox } from './components/CryptoToolbox';
import { ResearchCTFArena } from './components/ResearchCTFArena';
import { KeyHuntAutomaton } from './components/KeyHuntAutomaton';
import { AgencyAgentsHub } from './components/AgencyAgentsHub';
import { CryptoExchangeHub } from './components/CryptoExchangeHub';
import { OmniversalMagicBox } from './components/OmniversalMagicBox';
import { QuantumAlgorithmGenerator } from './components/QuantumAlgorithmGenerator';
import { GeminiChatbot } from './components/GeminiChatbot';
import { LogEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('quantum-algo-generator');
  const [serverStatus, setServerStatus] = useState<'connected' | 'checking' | 'error'>('checking');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-0',
      timestamp: new Date().toLocaleTimeString(),
      source: 'system',
      message: 'QuantumShield PQC Engine active. Express server, OpenQASM 3.0 & Qiskit QPU webhook ready.',
      type: 'info'
    }
  ]);

  const addLog = (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString()
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  const checkServerHealth = async () => {
    setServerStatus('checking');
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setServerStatus('connected');
      } else {
        setServerStatus('error');
      }
    } catch (e) {
      setServerStatus('error');
    }
  };

  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#131314] text-slate-100 font-sans selection:bg-[#4285F4] selection:text-white relative overflow-x-hidden">
      {/* Background Subtle Gemini Aurora Glows */}
      <div className="fixed top-[-10%] left-1/4 w-[700px] h-[700px] bg-[#4285F4]/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="fixed top-[30%] right-[-5%] w-[600px] h-[600px] bg-[#9B51E0]/10 rounded-full blur-[180px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/3 w-[650px] h-[650px] bg-[#E91E63]/10 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Top Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        onCheckHealth={checkServerHealth}
      />

      {/* Gemini Chat Hero Greeting & Prompt Bar Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-6 pt-2 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63]">
                Hello, Quantum Auditor
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-medium max-w-2xl">
              Where would you like to start securing your post-quantum infrastructure today?
            </p>
          </div>

          {/* Interactive AI Chatbot Stream */}
          <div className="bg-[#1E1F20] border border-[#2E3135] rounded-3xl p-4 sm:p-6 shadow-xl">
            <GeminiChatbot />
          </div>

          {/* Gemini Style Feature Quick Launch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('quantum-algo-generator')}
              className="p-4 bg-[#1E1F20] hover:bg-[#282A2C] border border-[#2E3135] hover:border-[#4285F4]/40 rounded-2xl text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-32"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" /> Synthesis
                </span>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                  Generate Qiskit & Cirq Quantum Circuits
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">Click to launch &rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('shor-lab')}
              className="p-4 bg-[#1E1F20] hover:bg-[#282A2C] border border-[#2E3135] hover:border-[#9B51E0]/40 rounded-2xl text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-32"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Factorization
                </span>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                  Simulate Shor's QPU 127Q Execution
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">Click to launch &rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className="p-4 bg-[#1E1F20] hover:bg-[#282A2C] border border-[#2E3135] hover:border-[#E91E63]/40 rounded-2xl text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-32"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> PQC Protocol
                </span>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                  Audit ML-KEM & Dilithium Key Exchange
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">Click to launch &rarr;</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className="p-4 bg-[#1E1F20] hover:bg-[#282A2C] border border-[#2E3135] hover:border-rose-500/40 rounded-2xl text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between h-32"
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Threat Matrix
                </span>
                <p className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                  Calculate Q-Day Risk Assessment
                </p>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">Click to launch &rarr;</span>
            </button>
          </div>
        </div>

        {/* Q-Day Doomsday Clock Prominently Displayed in Gemini Card */}
        <div className="bg-[#1E1F20] border border-[#2E3135] rounded-3xl p-4 sm:p-6 shadow-xl">
          <QDayDoomsdayClock />
        </div>

        {/* Active Tool View Container inside Gemini Response Card */}
        <div className="bg-[#1E1F20] border border-[#2E3135] rounded-3xl p-4 sm:p-6 shadow-xl">
          {activeTab === 'quantum-algo-generator' && (
            <QuantumAlgorithmGenerator />
          )}

          {activeTab === 'shor-lab' && (
            <ShorSimulator />
          )}

          {activeTab === 'sandbox' && (
            <KeyExchangeSandbox onAddLog={addLog} />
          )}

          {activeTab === 'matrix' && (
            <QuantumRiskMatrix />
          )}

          {activeTab === 'benchmark' && (
            <BenchmarkSuite />
          )}

          {activeTab === 'ai-audit' && (
            <AiMigrationAudit />
          )}

          {activeTab === 'vault' && (
            <EncryptedVault logs={logs} onClearLogs={() => setLogs([])} />
          )}

          {activeTab === 'payments' && (
            <PaymentGateway onAddLog={addLog} />
          )}

          {activeTab === 'crypto-tool' && (
            <CryptoToolbox />
          )}

          {activeTab === 'ctf-arena' && (
            <ResearchCTFArena />
          )}

          {activeTab === 'keyhunt-automaton' && (
            <KeyHuntAutomaton />
          )}

          {activeTab === 'agency-hub' && (
            <AgencyAgentsHub />
          )}

          {activeTab === 'crypto-exchange' && (
            <CryptoExchangeHub />
          )}

          {activeTab === 'omniversal-magic-box' && (
            <OmniversalMagicBox onNavigateTab={(tab) => setActiveTab(tab as TabType)} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2E3135] bg-[#131314] py-8 text-center text-xs text-slate-400 font-sans space-y-2">
        <p className="text-slate-300 font-semibold">
          QUANTUM SHIELD AI • High-Level Quantum Algorithm Synthesis & Post-Quantum Cryptography Platform
        </p>
        <p className="text-[11px] text-slate-500">
          Compliant with NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) & CNSA 2.0 Specifications • OpenQASM 3.0 Transpilation
        </p>
      </footer>
    </div>
  );
}
