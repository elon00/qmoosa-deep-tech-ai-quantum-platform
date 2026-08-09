import React, { useState, useRef, useEffect } from "react";
import {
  Agent,
  ChatMessage,
  ChatSession,
  ToolItem,
  ProjectItem,
} from "../../types";
import {
  INITIAL_AGENTS,
  TOOL_MARKETPLACE,
  DEFAULT_CHAT_SESSIONS,
  INITIAL_PROJECTS,
} from "../../data/mockData";
import {
  Bot,
  Plus,
  Search,
  MessageSquare,
  Cpu,
  Link as LinkIcon,
  Lock,
  Paperclip,
  Send,
  Terminal,
  Settings,
  Folder,
  Trash2,
  Pin,
  Edit2,
  Play,
  Copy,
  Check,
  Mic,
  PlusCircle,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";

export const AIWorkspace: React.FC = () => {
  // Chat state
  const [sessions, setSessions] = useState<ChatSession[]>(DEFAULT_CHAT_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string>(DEFAULT_CHAT_SESSIONS[0].id);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Agents & Custom Agent state
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("general");
  const [agentBuilderOpen, setAgentBuilderOpen] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({
    name: "Custom Quantum Agent",
    domain: "Quantum Physics",
    description: "Custom agent tailored for molecular VQE simulation.",
    systemPrompt: "You are a custom QMoosa agent. Analyze quantum eigensolvers and Hamiltonian matrices.",
    model: "gemini-3.6-flash",
  });

  // Tools & Projects state
  const [tools, setTools] = useState<ToolItem[]>(TOOL_MARKETPLACE);
  const [projects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [activeTabLeft, setActiveTabLeft] = useState<"chats" | "agents" | "tools" | "projects">("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Active Tool Simulation Drawer state
  const [activeToolDrawer, setActiveToolDrawer] = useState<"none" | "quantum" | "blockchain" | "crypto">("none");
  const [simulatingTool, setSimulatingTool] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, loading]);

  // Create new chat
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "New Deep-Tech Conversation",
      createdAt: "Just now",
      agentId: selectedAgentId,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: "agent",
          agentId: selectedAgentId,
          text: `QMOOSA ${currentAgent.name} initialized.\n\nSystem instructions active: "${currentAgent.systemPrompt.slice(0, 80)}..."\n\nHow can I assist your engineering pipeline today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  // Delete chat session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered.length > 0 ? filtered : DEFAULT_CHAT_SESSIONS);
    if (activeSessionId === id && filtered.length > 0) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Send message to server Gemini endpoint
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update session state locally
    const updatedMessages = [...currentSession.messages, userMsg];
    const updatedTitle =
      currentSession.messages.length === 1 && currentSession.title === "New Deep-Tech Conversation"
        ? userText.slice(0, 32) + "..."
        : currentSession.title;

    setSessions(
      sessions.map((s) =>
        s.id === activeSessionId ? { ...s, title: updatedTitle, messages: updatedMessages } : s
      )
    );

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          agentId: selectedAgentId,
          history: updatedMessages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await res.json();

      let agentResponseText = data.response || "No response received.";
      let quantumDataPayload: any = undefined;
      let blockchainDataPayload: any = undefined;

      // Detect quantum / blockchain triggers in message to attach interactive widget cards
      const textLower = userText.toLowerCase();
      if (textLower.includes("quantum") || textLower.includes("circuit") || textLower.includes("qubit")) {
        quantumDataPayload = {
          qubits: 3,
          states: [
            { state: "|000⟩", probability: 0.50, amplitude: "0.707 + 0.00i" },
            { state: "|111⟩", probability: 0.50, amplitude: "0.707 + 0.00i" },
          ],
        };
      } else if (textLower.includes("solana") || textLower.includes("contract") || textLower.includes("anchor")) {
        blockchainDataPayload = {
          chain: "Solana Anchor Program",
          hash: "0x9f1a...4e2b",
          verified: true,
          securityScore: 99,
        };
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        agentId: selectedAgentId,
        text: agentResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        quantumData: quantumDataPayload,
        blockchainData: blockchainDataPayload,
      };

      setSessions(
        sessions.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...updatedMessages, agentMsg] }
            : s
        )
      );
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "agent",
        agentId: selectedAgentId,
        text: "Error communicating with QMoosa Server Agent. Please verify your connection or try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setSessions(
        sessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...updatedMessages, errorMsg] } : s
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Create Custom Agent
  const handleCreateCustomAgent = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Agent = {
      id: `agent-custom-${Date.now()}`,
      name: newAgentForm.name,
      domain: newAgentForm.domain,
      avatar: "⚙️",
      description: newAgentForm.description,
      systemPrompt: newAgentForm.systemPrompt,
      model: newAgentForm.model,
      tools: ["Code Interpreter", "Web Search"],
      permissions: ["read", "execute"],
      isCustom: true,
    };
    setAgents([...agents, created]);
    setSelectedAgentId(created.id);
    setAgentBuilderOpen(false);
  };

  // Run Tool Drawer Simulation
  const handleRunToolSim = async (toolType: "quantum" | "blockchain" | "crypto") => {
    setActiveToolDrawer(toolType);
    setSimulatingTool(true);
    setSimResult(null);

    try {
      if (toolType === "quantum") {
        const res = await fetch("/api/quantum/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qubits: 3 }),
        });
        const data = await res.json();
        setSimResult(data);
      } else if (toolType === "blockchain") {
        const res = await fetch("/api/blockchain/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chain: "solana" }),
        });
        const data = await res.json();
        setSimResult(data);
      } else if (toolType === "crypto") {
        const res = await fetch("/api/crypto/pqc", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ algorithm: "ML-KEM-768" }),
        });
        const data = await res.json();
        setSimResult(data);
      }
    } catch (err) {
      setSimResult({ error: "Failed to execute tool simulation" });
    } finally {
      setSimulatingTool(false);
    }
  };

  // Copy code helper
  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-950 flex overflow-hidden text-slate-100">
      {/* LEFT SIDEBAR NAVIGATION */}
      <div className="w-80 bg-slate-950 border-r border-slate-900 flex flex-col shrink-0">
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center font-black text-white text-xs">
              Q
            </div>
            <span className="font-bold text-sm text-white tracking-wider font-mono">QMOOSA AI</span>
          </div>
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 hover:bg-cyan-900/60 border border-cyan-800 transition flex items-center space-x-1 text-xs font-mono font-semibold"
            title="Start New Chat"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        {/* Tab Switchers: Chats, Agents, Tools, Projects */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/50 border-b border-slate-900 font-mono text-[10px]">
          <button
            onClick={() => setActiveTabLeft("chats")}
            className={`py-1.5 rounded text-center transition ${
              activeTabLeft === "chats" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Chats
          </button>
          <button
            onClick={() => setActiveTabLeft("agents")}
            className={`py-1.5 rounded text-center transition ${
              activeTabLeft === "agents" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => setActiveTabLeft("tools")}
            className={`py-1.5 rounded text-center transition ${
              activeTabLeft === "tools" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tools
          </button>
          <button
            onClick={() => setActiveTabLeft("projects")}
            className={`py-1.5 rounded text-center transition ${
              activeTabLeft === "projects" ? "bg-slate-800 text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Projects
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-900">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search ${activeTabLeft}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* TAB 1: CHATS */}
          {activeTabLeft === "chats" && (
            <div className="space-y-1">
              {sessions
                .filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((session) => {
                  const isActive = session.id === activeSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition text-xs ${
                        isActive
                          ? "bg-slate-900 text-white border border-cyan-500/40 font-semibold"
                          : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                        <span className="truncate">{session.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          )}

          {/* TAB 2: AGENTS SELECTOR & BUILDER */}
          {activeTabLeft === "agents" && (
            <div className="space-y-2">
              <button
                onClick={() => setAgentBuilderOpen(true)}
                className="w-full p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/80 transition flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Custom Agent</span>
              </button>

              <div className="space-y-1 pt-1">
                {agents
                  .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((agent) => {
                    const isSelected = agent.id === selectedAgentId;
                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`p-2.5 rounded-lg cursor-pointer transition border text-xs ${
                          isSelected
                            ? "bg-slate-900 border-cyan-500/60 text-white"
                            : "bg-slate-900/40 border-slate-900 text-slate-400 hover:bg-slate-900/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 font-bold">
                            <span>{agent.avatar}</span>
                            <span>{agent.name}</span>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                            {agent.domain}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{agent.description}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 3: TOOLS MARKETPLACE */}
          {activeTabLeft === "tools" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] font-mono text-slate-400 font-bold">
                <span>AVAILABLE TOOLS</span>
                <span className="text-cyan-400">{tools.length} Installed</span>
              </div>
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-900 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{tool.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400">
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{tool.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {activeTabLeft === "projects" && (
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-900 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span className="truncate">{proj.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400">
                      {proj.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Quick Tools Launcher Strip */}
        <div className="p-3 border-t border-slate-900 bg-slate-950 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider uppercase block">
            Interactive Simulators
          </span>
          <div className="grid grid-cols-3 gap-1 font-mono text-[10px]">
            <button
              onClick={() => handleRunToolSim("quantum")}
              className="py-1.5 px-2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900/80 flex items-center justify-center space-x-1"
            >
              <Cpu className="w-3 h-3" />
              <span>Quantum</span>
            </button>
            <button
              onClick={() => handleRunToolSim("blockchain")}
              className="py-1.5 px-2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/80 hover:bg-purple-900/80 flex items-center justify-center space-x-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Solana</span>
            </button>
            <button
              onClick={() => handleRunToolSim("crypto")}
              className="py-1.5 px-2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 hover:bg-amber-900/80 flex items-center justify-center space-x-1"
            >
              <Lock className="w-3 h-3" />
              <span>PQC</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
        {/* Chat Active Agent Header Banner */}
        <div className="p-3 px-6 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentAgent.avatar}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white">{currentAgent.name}</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {currentAgent.domain}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Model: <strong className="text-slate-300">{currentAgent.model}</strong> • System-verified
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gemini 3.6 Flash Active</span>
            </span>
          </div>
        </div>

        {/* Message History Window */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentSession.messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"} max-w-4xl mx-auto`}
              >
                <div
                  className={`max-w-3xl rounded-2xl p-4 sm:p-5 shadow-xl space-y-3 ${
                    isUser
                      ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
                  }`}
                >
                  {/* Sender header */}
                  <div className="flex items-center justify-between font-mono text-[11px] opacity-80 border-b pb-1.5 border-white/10">
                    <span className="font-bold">
                      {isUser ? "You" : `${currentAgent.name}`}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Text content with simple markdown/line split */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                    {msg.text}
                  </div>

                  {/* Interactive Quantum Data Widget if present */}
                  {msg.quantumData && (
                    <div className="bg-slate-950 border border-cyan-800/80 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1">
                        <span className="flex items-center space-x-1.5">
                          <Cpu className="w-4 h-4" />
                          <span>Qiskit Quantum Circuit Result ({msg.quantumData.qubits} Qubits)</span>
                        </span>
                        <span className="text-[10px] text-emerald-400">FIDELITY: 99.8%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {msg.quantumData.states.map((st, i) => (
                          <div key={i} className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between">
                            <span className="font-bold text-cyan-300">{st.state}</span>
                            <span className="text-slate-400">Prob: {st.probability * 100}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Blockchain Audit Widget if present */}
                  {msg.blockchainData && (
                    <div className="bg-slate-950 border border-purple-800/80 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-1">
                        <span className="flex items-center space-x-1.5">
                          <LinkIcon className="w-4 h-4" />
                          <span>{msg.blockchainData.chain} On-Chain Verification</span>
                        </span>
                        <span className="text-[10px] text-emerald-400">SCORE: {msg.blockchainData.securityScore}/100</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Bytecode Hash: <strong className="text-slate-200">{msg.blockchainData.hash}</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start max-w-4xl mx-auto">
              <div className="bg-slate-900 border border-slate-800 text-cyan-400 rounded-2xl p-4 font-mono text-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>QMoosa {currentAgent.name} is computing intelligence...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Simulation Drawer Popover */}
        {activeToolDrawer !== "none" && (
          <div className="bg-slate-900 border-t border-cyan-800/80 p-4 font-mono text-xs space-y-3 animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between text-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold uppercase text-cyan-400">
                  {activeToolDrawer.toUpperCase()} LIVE TOOL SIMULATOR
                </span>
              </div>
              <button
                onClick={() => setActiveToolDrawer("none")}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {simulatingTool ? (
              <div className="text-slate-400">Executing deep-tech calculation...</div>
            ) : simResult ? (
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto text-[11px] text-slate-300">
                {JSON.stringify(simResult, null, 2)}
              </pre>
            ) : null}
          </div>
        )}

        {/* INPUT COMPOSER BAR */}
        <div className="p-4 bg-slate-950 border-t border-slate-900">
          <form
            onSubmit={handleSendMessage}
            className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-2xl focus-within:border-cyan-500/80 transition"
          >
            <textarea
              rows={2}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask ${currentAgent.name} anything about Quantum, Blockchain, Algorithms, or Code... (Press Enter to send)`}
              className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 py-1 font-sans"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleRunToolSim("quantum")}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition"
                  title="Attach Quantum Circuit"
                >
                  <Cpu className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRunToolSim("blockchain")}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-purple-400 transition"
                  title="Attach Solana Smart Contract"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRunToolSim("crypto")}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
                  title="Attach Cryptographic Key"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="hidden sm:inline text-[10px] font-mono text-slate-500">
                  Shift+Enter for newline
                </span>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition disabled:opacity-40 flex items-center space-x-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* AGENT BUILDER MODAL */}
      {agentBuilderOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>Create Custom AI Agent</span>
              </h3>
              <button onClick={() => setAgentBuilderOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomAgent} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-slate-300 font-bold mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.name}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-300 font-bold mb-1">Domain Focus</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.domain}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, domain: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-300 font-bold mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newAgentForm.description}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-300 font-bold mb-1">System Instructions</label>
                <textarea
                  rows={3}
                  required
                  value={newAgentForm.systemPrompt}
                  onChange={(e) => setNewAgentForm({ ...newAgentForm, systemPrompt: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAgentBuilderOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save & Launch Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
