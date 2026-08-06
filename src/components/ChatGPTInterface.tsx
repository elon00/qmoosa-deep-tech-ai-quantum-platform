import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Cpu,
  Terminal,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Key,
  Shield,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Play,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Zap,
  Sliders,
  Layers,
  BarChart3,
  Code2,
  FolderOpen
} from 'lucide-react';

import { Mission, MISSIONS } from '../data/missions';
import { GatePlacement, GateType, QuantumSimulationResult } from '../lib/quantumEngine';
import { GatePalette } from './GatePalette';
import { QuantumCircuitGrid } from './QuantumCircuitGrid';
import { BlochSphereVisualizer } from './BlochSphereVisualizer';
import { MeasurementHistogram } from './MeasurementHistogram';
import { D3QuantumStateVisualizer } from './D3QuantumStateVisualizer';
import { QuantumGameHub } from './QuantumGameHub';
import { QasmViewer } from './QasmViewer';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isWidget?: boolean;
  widgetType?: 'circuit_studio' | 'verification' | 'ibm_hardware_status';
}

interface ChatGPTInterfaceProps {
  currentMission: Mission;
  onSelectMission: (id: number) => void;
  numQubits: number;
  onNumQubitsChange: (num: number) => void;
  gates: GatePlacement[];
  selectedGate: GateType | null;
  onSelectGate: (gate: GateType | null) => void;
  onAddGate: (gate: GatePlacement) => void;
  onRemoveGate: (gateId: string) => void;
  onClearCircuit: () => void;
  simulationResult: QuantumSimulationResult;
  totalShots: number;
  onShotsChange: (shots: number) => void;
  noiseLevel: number;
  onNoiseLevelChange: (noise: number) => void;
  executionMode: 'simulator' | 'ibm_hardware';
  onSetExecutionMode: (mode: 'simulator' | 'ibm_hardware') => void;
  onOpenHardwareModal: () => void;
  onOpenPythonModal: () => void;
  onOpenSavedModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  verificationResult: { success: boolean; feedback: string; score: number } | null;
  onVerifyMission: () => void;
  onNextMission: () => void;
  onApplySolutionGates?: (gates: GatePlacement[], numQubits: number) => void;
}

export const ChatGPTInterface: React.FC<ChatGPTInterfaceProps> = ({
  currentMission,
  onSelectMission,
  numQubits,
  onNumQubitsChange,
  gates,
  selectedGate,
  onSelectGate,
  onAddGate,
  onRemoveGate,
  onClearCircuit,
  simulationResult,
  totalShots,
  onShotsChange,
  noiseLevel,
  onNoiseLevelChange,
  executionMode,
  onSetExecutionMode,
  onOpenHardwareModal,
  onOpenPythonModal,
  onOpenSavedModal,
  soundEnabled,
  onToggleSound,
  verificationResult,
  onVerifyMission,
  onNextMission,
  onApplySolutionGates,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'workbench'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `👋 **Welcome to Omniverse Quantum Decoder**!\n\nI am **Q-Core**, your Quantum AI Assistant powered by Gemini 3.6 Flash & IBM Quantum Cloud.\n\nWe are currently on **${currentMission.subtitle}: ${currentMission.title}**.\n\n🎯 **Mission Goal**: ${currentMission.description}\n\n💡 **Quick Guide**: ${currentMission.quickGuide}\n\nYou can ask me questions, build quantum circuits, or test your code on real IBM Quantum Hardware!`,
      isWidget: true,
      widgetType: 'circuit_studio',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loadingAi]);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptText = customPrompt || inputMessage;
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoadingAi(true);

    try {
      const response = await fetch('/api/quantum-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          currentLevel: currentMission,
          circuitState: {
            gateCount: gates.length,
            gates: gates.map((g) => `${g.type}(q[${g.qubit}])`),
            qasm: simulationResult.qasm,
          },
          languagePreference: 'English',
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Quantum telemetry received.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: '[-] Error connecting to Q-Core Quantum Assistant.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setChatHistory([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `🚀 **New Quantum Session Initialized**!\n\nActive Mission: **${currentMission.title}**.\nAsk me anything or build your quantum circuit below!`,
        isWidget: true,
        widgetType: 'circuit_studio',
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-[#171717] text-gray-100 font-sans overflow-hidden">
      {/* LEFT SIDEBAR (ChatGPT Style) */}
      <aside
        className={`bg-[#202123] border-r border-white/10 flex flex-col transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64 sm:w-72' : 'w-0 -ml-64 sm:-ml-72'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={handleNewChat}
            className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-white transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Quantum Chat</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Missions / Chat Threads List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <div className="px-3 text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Q-Day Problem Missions
          </div>

          {MISSIONS.map((m) => {
            const isActive = currentMission.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMission(m.id);
                  setChatHistory((prev) => [
                    ...prev,
                    {
                      id: `sw-${Date.now()}`,
                      sender: 'assistant',
                      text: `Switched to **${m.subtitle}: ${m.title}**!\n\n🎯 **Goal**: ${m.description}\n\n💡 **Guide**: ${m.quickGuide}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isWidget: true,
                      widgetType: 'circuit_studio',
                    },
                  ]);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                  isActive
                    ? 'bg-[#343541] text-cyan-300 font-medium border border-cyan-500/30'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                <div className="truncate">
                  <div className="font-medium truncate">{m.title}</div>
                  <div className="text-[10px] text-gray-500 font-mono truncate">{m.subtitle}</div>
                </div>
              </button>
            );
          })}

          <div className="pt-4 px-3 text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Hardware & Tools
          </div>

          <button
            onClick={onOpenHardwareModal}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
              executionMode === 'ibm_hardware'
                ? 'bg-purple-950/60 border border-purple-500/50 text-purple-300'
                : 'text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>IBM Hardware</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-cyan-400">
              {executionMode === 'ibm_hardware' ? 'ONLINE ⚡' : 'SIM'}
            </span>
          </button>

          <button
            onClick={onOpenPythonModal}
            className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-gray-300 hover:bg-white/5 transition-all"
          >
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>omniverse_decoder.py</span>
          </button>

          <button
            onClick={onOpenSavedModal}
            className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-gray-300 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>Saved Circuits</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              LOAD/SAVE
            </span>
          </button>

          <button
            onClick={onToggleSound}
            className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-gray-300 hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
              <span>Quantum Sound FX</span>
            </div>
            <span className="text-[10px] text-gray-400">{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* User Account / Footer */}
        <div className="p-3 border-t border-white/10 bg-[#171717]/80 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
            QD
          </div>
          <div className="flex-1 truncate">
            <div className="text-xs font-semibold text-white truncate">Quantum Developer</div>
            <div className="text-[10px] text-cyan-400 font-mono truncate">q-core-3.6-flash</div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full bg-[#343541] relative">
        {/* ChatGPT Header Navigation Bar */}
        <header className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-[#202123]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
                title="Open sidebar"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}

            {/* Model Selector Dropdown Header */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#343541] border border-white/10 rounded-xl text-xs font-mono text-white cursor-pointer hover:border-cyan-500 transition-all">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Q-Core Gemini 3.6 Flash</span>
              <span className="text-[10px] text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                {executionMode === 'ibm_hardware' ? 'IBM Hardware ⚡' : 'Local Engine'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Tab Switcher: Chat Mode vs Split Workbench Mode */}
          <div className="flex items-center gap-1 bg-[#202123] p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-cyan-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat View
            </button>
            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'workbench'
                  ? 'bg-purple-600 text-white font-bold shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Full Studio
            </button>
          </div>
        </header>

        {/* BODY AREA */}
        {activeTab === 'workbench' ? (
          /* Full Workbench Mode */
          <div className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto w-full space-y-4">
            <div className="flex items-center justify-between bg-[#202123] p-4 rounded-2xl border border-white/10">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">{currentMission.subtitle}</span>
                <h2 className="text-lg font-bold text-white">{currentMission.title}</h2>
              </div>
              <button
                onClick={onVerifyMission}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" /> Execute & Verify
              </button>
            </div>

            <QuantumGameHub
              currentMission={currentMission}
              simulationResult={simulationResult}
              gates={gates}
              onSendMessage={handleSendMessage}
              onApplySolutionGates={onApplySolutionGates}
              onVerifyMission={onVerifyMission}
              verificationResult={verificationResult}
              numQubits={numQubits}
            />

            <GatePalette
              unlockedGates={currentMission.unlockedGates}
              selectedGate={selectedGate}
              onSelectGate={onSelectGate}
              onClearCircuit={onClearCircuit}
              onOpenSavedModal={onOpenSavedModal}
            />

            <QuantumCircuitGrid
              numQubits={numQubits}
              onNumQubitsChange={onNumQubitsChange}
              gates={gates}
              selectedGate={selectedGate}
              onAddGate={onAddGate}
              onRemoveGate={onRemoveGate}
              onOpenSavedModal={onOpenSavedModal}
            />

            <D3QuantumStateVisualizer
              simulationResult={simulationResult}
              totalShots={totalShots}
              onShotsChange={onShotsChange}
              noiseLevel={noiseLevel}
              onNoiseLevelChange={onNoiseLevelChange}
              executionMode={executionMode}
            />

            <QasmViewer qasm={simulationResult.qasm} />
          </div>
        ) : (
          /* ChatGPT Chat Stream View */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-4 p-4 rounded-2xl transition-all ${
                    msg.sender === 'assistant'
                      ? 'bg-[#444654] border border-white/5 shadow-md'
                      : 'bg-[#343541] border border-cyan-500/20'
                  }`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 mt-0.5">
                    {msg.sender === 'assistant' ? (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
                        <Bot className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-cyan-900 border border-cyan-500 flex items-center justify-center text-cyan-300 font-bold text-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 space-y-3 overflow-hidden text-sm leading-relaxed text-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-1">
                      <span className="font-bold text-gray-300">
                        {msg.sender === 'assistant' ? 'Q-Core AI' : 'You'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="p-1 hover:text-white"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap font-sans leading-relaxed text-gray-100">
                      {msg.text}
                    </div>

                    {/* Inline Interactive Quantum Studio Widget inside Chat Stream */}
                    {msg.isWidget && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                        <div className="bg-[#202123] rounded-2xl p-4 border border-cyan-500/30 space-y-4">
                          <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-2">
                              <Zap className="w-4 h-4" /> INTERACTIVE QUANTUM CIRCUIT STUDIO
                            </span>
                            <button
                              onClick={onVerifyMission}
                              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Execute & Verify
                            </button>
                          </div>

                          <QuantumGameHub
                            currentMission={currentMission}
                            simulationResult={simulationResult}
                            gates={gates}
                            onSendMessage={handleSendMessage}
                            onApplySolutionGates={onApplySolutionGates}
                            onVerifyMission={onVerifyMission}
                            verificationResult={verificationResult}
                            numQubits={numQubits}
                          />

                          <GatePalette
                            unlockedGates={currentMission.unlockedGates}
                            selectedGate={selectedGate}
                            onSelectGate={onSelectGate}
                            onClearCircuit={onClearCircuit}
                            onOpenSavedModal={onOpenSavedModal}
                          />

                          <QuantumCircuitGrid
                            numQubits={numQubits}
                            onNumQubitsChange={onNumQubitsChange}
                            gates={gates}
                            selectedGate={selectedGate}
                            onAddGate={onAddGate}
                            onRemoveGate={onRemoveGate}
                            onOpenSavedModal={onOpenSavedModal}
                          />

                          <D3QuantumStateVisualizer
                            simulationResult={simulationResult}
                            totalShots={totalShots}
                            onShotsChange={onShotsChange}
                            noiseLevel={noiseLevel}
                            onNoiseLevelChange={onNoiseLevelChange}
                            executionMode={executionMode}
                          />

                          {verificationResult && (
                            <div
                              className={`p-3 rounded-xl border flex items-center justify-between font-mono text-xs ${
                                verificationResult.success
                                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                                  : 'bg-red-950/80 border-red-500 text-red-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {verificationResult.success ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                )}
                                <span>{verificationResult.feedback}</span>
                              </div>
                              {verificationResult.success && (
                                <button
                                  onClick={onNextMission}
                                  className="px-2.5 py-1 bg-cyan-600 text-white font-bold rounded-lg text-[10px]"
                                >
                                  Next Level →
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Inline Bloch Spheres & Spectrum */}
                        <BlochSphereVisualizer blochCoords={simulationResult.blochSpheres} />
                        <MeasurementHistogram
                          simulationResult={simulationResult}
                          totalShots={totalShots}
                          onShotsChange={onShotsChange}
                          noiseLevel={noiseLevel}
                          onNoiseLevelChange={onNoiseLevelChange}
                          executionMode={executionMode}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loadingAi && (
                <div className="flex items-center gap-3 p-4 bg-[#444654] rounded-2xl border border-white/5">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-xs font-mono text-purple-300">
                    Q-Core AI is calculating quantum statevector response...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ChatGPT Bottom Input Box */}
            <div className="p-4 bg-[#343541] border-t border-white/10 max-w-4xl mx-auto w-full">
              {/* Prompt Suggestions */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-mono">
                <button
                  onClick={() => handleSendMessage('Suggest a hint for this mission level!')}
                  className="px-3 py-1.5 bg-[#202123] hover:bg-white/10 text-cyan-300 border border-white/10 rounded-xl whitespace-nowrap flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Mission Hint
                </button>
                <button
                  onClick={() => handleSendMessage('Explain how Grover search algorithm works in simple terms.')}
                  className="px-3 py-1.5 bg-[#202123] hover:bg-white/10 text-purple-300 border border-white/10 rounded-xl whitespace-nowrap flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-400" /> Explain Grover's Search
                </button>
                <button
                  onClick={() => handleSendMessage('How can I run my circuit on real IBM Quantum Hardware?')}
                  className="px-3 py-1.5 bg-[#202123] hover:bg-white/10 text-emerald-300 border border-white/10 rounded-xl whitespace-nowrap flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-emerald-400" /> IBM Hardware Guide
                </button>
              </div>

              {/* Chat Input Pill */}
              <div className="relative flex items-center bg-[#40414f] border border-white/20 rounded-2xl shadow-xl focus-within:border-cyan-500 transition-all">
                <textarea
                  rows={1}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask Q-Core AI, or ask how to solve this level..."
                  className="w-full bg-transparent px-4 py-3.5 text-sm font-sans text-white placeholder-gray-400 outline-none resize-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="mr-2 p-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl disabled:opacity-30 transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center text-[10px] text-gray-500 font-mono mt-2">
                Q-Core Quantum Engine • IBM Quantum Superconducting Hardware & Local Statevector Simulator
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
