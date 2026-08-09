import React, { useState } from "react";
import { Terminal, Key, Copy, Check, ShieldCheck, Plus, Trash2, Code2 } from "lucide-react";

export const DeveloperPortalView: React.FC = () => {
  const [keys, setKeys] = useState([
    {
      id: "key-1",
      name: "Production Agentic Key",
      prefix: "qmoosa_live_8f3a...",
      scopes: ["agents:run", "quantum:simulate", "chain:verify"],
      createdAt: "2026-07-01",
    },
    {
      id: "key-2",
      name: "Staging Quantum Key",
      prefix: "qmoosa_test_2b9c...",
      scopes: ["quantum:simulate"],
      createdAt: "2026-08-01",
    },
  ]);

  const [activeLang, setActiveLang] = useState<"python" | "typescript" | "rust" | "go">("typescript");
  const [copied, setCopied] = useState(false);

  const sdkSnippets = {
    typescript: `import { QMoosaClient } from "@qmoosa/sdk";

const qmoosa = new QMoosaClient({ apiKey: process.env.QMOOSA_API_KEY });

// Execute 32-qubit state simulator
const quantumResult = await qmoosa.quantum.simulate({ qubits: 4 });
console.log("Superposition state vector:", quantumResult.states);`,

    python: `from qmoosa import QMoosaClient

client = QMoosaClient(api_key="qmoosa_live_...")

# Run Solana Anchor Smart Contract Security Audit
audit = client.blockchain.verify_contract(chain="solana", address="0x9f1a...4e2b")
print(f"Contract Security Score: {audit.security_score}/100")`,

    rust: `use qmoosa_sdk::QMoosaClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = QMoosaClient::new(std::env::var("QMOOSA_API_KEY")?);
    let keypair = client.crypto().ml_kem_768_keygen().await?;
    println!("NIST Category 3 Public Key Bytes: {}", keypair.public_key.len());
    Ok(())
}`,

    go: `package main

import (
    "fmt"
    "github.com/qmoosa/qmoosa-go"
)

func main() {
    client := qmoosa.NewClient("qmoosa_live_...")
    res, _ := client.Agents.Chat("general", "Explain Grover search amplitude amplification")
    fmt.Println(res.Response)
}`,
  };

  const handleCreateKey = () => {
    const newK = {
      id: `key-${Date.now()}`,
      name: "New API Key",
      prefix: `qmoosa_live_${Math.random().toString(36).substring(2, 8)}...`,
      scopes: ["agents:run", "quantum:simulate"],
      createdAt: new Date().toISOString().split("T")[0],
    };
    setKeys([...keys, newK]);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sdkSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono mb-3">
              <Terminal className="w-3.5 h-3.5" />
              <span>QMOOSA DEVELOPER PORTAL & API PLATFORM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              API Keys, SDKs & Webhooks
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl">
              Integrate QMoosa AI agents, quantum state simulation, and post-quantum encryption into your applications with official Python, TypeScript, Rust, and Go SDKs.
            </p>
          </div>
        </div>

        {/* API Key Management */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <span>API Keys Management</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Generate and rotate secret keys with granular RBAC permission scopes.
              </p>
            </div>
            <button
              onClick={handleCreateKey}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center space-x-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Key</span>
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {keys.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <span>{k.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                      Active
                    </span>
                  </div>
                  <div className="text-slate-400 mt-1 text-[11px]">{k.prefix}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {k.scopes.map((s, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-slate-500">Created {k.createdAt}</span>
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 transition"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SDK Quickstart Snippets */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <span>Official SDK Code Snippets</span>
              </h3>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 font-mono text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(["typescript", "python", "rust", "go"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition ${
                    activeLang === lang ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300">
            <button
              onClick={handleCopyCode}
              className="absolute top-3 right-3 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center space-x-1 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Snippet"}</span>
            </button>

            <code>{sdkSnippets[activeLang]}</code>
          </div>
        </div>
      </div>
    </div>
  );
};
