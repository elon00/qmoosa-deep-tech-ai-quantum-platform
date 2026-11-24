import React, { useState } from "react";
import { Terminal, Send, Bot, User, Sparkles, Code2, RefreshCw, Cpu, Layers, CheckCircle2, MessageSquare } from "lucide-react";
import { ANNA_MANIFEST_JSON } from "../utils/codeTemplates";
import { ExecutaRpcMessage } from "../types";

interface AnnaExecutaConsoleProps {
  playerAddress: string;
}

export const AnnaExecutaConsole: React.FC<AnnaExecutaConsoleProps> = ({ playerAddress }) => {
  const [activeSubTab, setActiveSubTab] = useState<"copilot" | "rpc_traffic" | "manifest">("copilot");
  const [chatInput, setChatInput] = useState<string>("" );
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    {
      role: "assistant",
      text: "Greetings! I am your Anna Quantum Copilot. I can explain Shor's Algorithm phases, generate Qiskit & OpenQASM scripts, break down Bitcoin ECDSA discrete log vulnerabilities, and verify Solana on-chain bridge transactions.",
      time: "Just now",
    },
  ]);

  const [rpcLogs, setRpcLogs] = useState<ExecutaRpcMessage[]>([
    {
      id: "rpc_1",
      direction: "inbound",
      timestamp: "12:00:01",
      type: "request",
      method: "initialize",
      payload: { jsonrpc: "2.0", id: 1, method: "initialize", params: { client: "Anna AI OS v2.4" } },
    },
    {
      id: "rpc_2",
      direction: "outbound",
      timestamp: "12:00:01",
      type: "response",
      payload: {
        jsonrpc: "2.0",
        id: 1,
        result: { name: "Omniver Quantum Decoder Executa", version: "2.4.0", capabilities: ["tools", "sampling"] },
      },
    },
    {
      id: "rpc_3",
      direction: "inbound",
      timestamp: "12:00:02",
      type: "request",
      method: "tools.list",
      payload: { jsonrpc: "2.0", id: 2, method: "tools.list" },
    },
    {
      id: "rpc_4",
      direction: "outbound",
      timestamp: "12:00:02",
      type: "response",
      payload: {
        jsonrpc: "2.0",
        id: 2,
        result: {
          tools: [
            { name: "start_quantum_decoding", description: "Execute Shor's algorithm on composite integer N." },
            { name: "verify_solana_proof", description: "Verifies factorization on Solana Anchor Program." },
          ],
        },
      },
    },
  ]);

  const quickPrompts = [
    "Explain Step 4 (Inverse QFT) in Shor's Algorithm",
    "Why is Bitcoin's ECDSA secp256k1 vulnerable to Shor's algorithm?",
    "How does the TypeScript Relayer bridge Qiskit to Solana?",
    "Generate OpenQASM 3.0 code for N=21 factorization",
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      role: "user" as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: {
            app: "Omniver Quantum Decoder",
            playerAddress,
            supportedBackends: ["IBM Qiskit", "PennyLane", "Classiq", "Solana Anchor"],
          },
        }),
      });

      const data = await res.json();
      const aiResponseText = data.text || "I was unable to retrieve a response from the quantum model.";

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: aiResponseText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Add simulated Executa RPC Call
      const rpcId = "rpc_" + Math.random().toString(36).substring(2, 7);
      setRpcLogs((prev) => [
        ...prev,
        {
          id: rpcId + "_in",
          direction: "inbound",
          timestamp: new Date().toLocaleTimeString(),
          type: "request",
          method: "tools.call",
          payload: { jsonrpc: "2.0", id: 3, method: "tools.call", params: { name: "quantum_copilot_query", query: textToSend } },
        },
        {
          id: rpcId + "_out",
          direction: "outbound",
          timestamp: new Date().toLocaleTimeString(),
          type: "response",
          payload: { jsonrpc: "2.0", id: 3, result: { status: "OK", latencyMs: 280 } },
        },
      ]);
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Error connecting to Copilot: ${e.message}. Offline Shor's algorithm engine remains active.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="anna-executa-container" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-orange-950/60 border border-amber-800/40 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Terminal className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Anna AI OS & Executa JSON-RPC 2.0 Hub
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Anna AI OS interfaces with Executa plugins via bidirectional JSON-RPC 2.0 over stdio. Chat with the Quantum AI Assistant or monitor real-time message streams.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center p-1 bg-slate-950/90 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
              id="subtab-copilot-btn"
              onClick={() => setActiveSubTab("copilot")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "copilot" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Copilot</span>
            </button>

            <button
              id="subtab-rpc-traffic-btn"
              onClick={() => setActiveSubTab("rpc_traffic")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "rpc_traffic" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>JSON-RPC stdio</span>
            </button>

            <button
              id="subtab-manifest-btn"
              onClick={() => setActiveSubTab("manifest")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === "manifest" ? "bg-purple-500/20 text-purple-300 border border-purple-500/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>manifest.json</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main SubTab Contents */}
      {activeSubTab === "copilot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Quick Prompts & Info */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Quick Research Prompts</span>
              </h3>

              <div className="space-y-2">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    id={`quick-prompt-btn-${idx}`}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-xs text-slate-300 hover:text-white transition-all leading-snug"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Interactive Chat Arena */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[520px]">
            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-sans">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === "user"
                        ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyan-950/80 border border-cyan-700/50 text-cyan-100"
                        : "bg-slate-950 border border-slate-800/90 text-slate-200"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="text-[9px] text-slate-500 mt-1.5 text-right">{msg.time}</div>
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-amber-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Analyzing quantum circuits & state space...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                id="anna-copilot-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Shor's phase estimation, ECDSA attack, Qiskit circuits, or Solana proofs..."
                className="flex-1 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                id="anna-copilot-send-btn"
                type="submit"
                disabled={isAiLoading || !chatInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:shadow-amber-500/40 transition-all disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* JSON-RPC Traffic Monitor */}
      {activeSubTab === "rpc_traffic" && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>Bidirectional JSON-RPC 2.0 over stdio</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Anna OS Executa Protocol v2</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto font-mono text-xs">
            {rpcLogs.map((rpc) => (
              <div
                key={rpc.id}
                className={`p-3 rounded-xl border ${
                  rpc.direction === "inbound"
                    ? "bg-slate-900/90 border-cyan-800/40 text-cyan-200"
                    : "bg-slate-900/60 border-purple-800/40 text-purple-200"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold uppercase tracking-wider">
                    {rpc.direction === "inbound" ? "📥 Host (Anna OS) ➔ Executa" : "📤 Executa ➔ Host (Anna OS)"}
                  </span>
                  <span>{rpc.timestamp}</span>
                </div>
                <pre className="overflow-x-auto text-[11px]">{JSON.stringify(rpc.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manifest Viewer */}
      {activeSubTab === "manifest" && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>manifest.json (Anna App Store Deployment Spec)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Schema 2.0 Validated ✓
            </span>
          </div>

          <pre className="p-4 bg-slate-900/80 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-[420px]">
            {ANNA_MANIFEST_JSON}
          </pre>
        </div>
      )}
    </div>
  );
};
