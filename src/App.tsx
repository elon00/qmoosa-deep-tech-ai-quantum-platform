import React, { useState } from "react";
import { Header } from "./components/Header";
import { ShorVisualizer } from "./components/ShorVisualizer";
import { CircuitCanvas } from "./components/CircuitCanvas";
import { BitcoinQuantumArena } from "./components/BitcoinQuantumArena";
import { SolanaRelayerView } from "./components/SolanaRelayerView";
import { AnnaExecutaConsole } from "./components/AnnaExecutaConsole";
import { CodeExportModal } from "./components/CodeExportModal";
import { QuantumBackend, SolanaPlayerProfile } from "./types";
import { getInitialPlayerProfile, recordOnChainDecodeProof } from "./utils/solanaSimulator";
import { Cpu, ShieldCheck, Sparkles, Terminal, Activity } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"shor_lab" | "circuit_studio" | "bitcoin_arena" | "solana_relayer" | "anna_executa">("shor_lab");
  const [selectedBackend, setSelectedBackend] = useState<QuantumBackend>("qiskit");
  const [player, setPlayer] = useState<SolanaPlayerProfile>(getInitialPlayerProfile);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const handleSyncToSolana = (result: any) => {
    // Optionally trigger automatic experience bump or transaction when running Shor's simulation
    if (result.success) {
      const taskId = `shor_${result.N}_${Date.now().toString().slice(-4)}`;
      const { updatedProfile } = recordOnChainDecodeProof(player, 25, taskId);
      setPlayer(updatedProfile);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        player={player}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedBackend={selectedBackend}
        setSelectedBackend={setSelectedBackend}
        onOpenCodeExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "shor_lab" && (
          <ShorVisualizer
            backend={selectedBackend}
            onSyncToSolana={handleSyncToSolana}
          />
        )}

        {activeTab === "circuit_studio" && (
          <CircuitCanvas
            targetN={15}
            coprimeA={7}
          />
        )}

        {activeTab === "bitcoin_arena" && (
          <BitcoinQuantumArena
            player={player}
            setPlayer={setPlayer}
          />
        )}

        {activeTab === "solana_relayer" && (
          <SolanaRelayerView
            player={player}
          />
        )}

        {activeTab === "anna_executa" && (
          <AnnaExecutaConsole
            playerAddress={player.publicKey}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">Omniver Quantum Decoder</span>
            <span className="text-slate-600">|</span>
            <span>Real-Time Quantum Simulator & Solana Hybrid Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solana Anchor Verified</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Anna Executa v2.4</span>
            </span>
            <span>•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Export Code & README
            </button>
          </div>
        </div>
      </footer>

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
