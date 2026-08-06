import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, HelpCircle, Lightbulb } from 'lucide-react';
import { Mission } from '../data/missions';
import { GatePlacement } from '../lib/quantumEngine';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMission: Mission;
  gates: GatePlacement[];
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentMission,
  gates,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hello Quantum Developer! I am Q-Core, your Quantum AI Assistant powered by Gemini. 🚀\nI can help you build quantum circuits, understand Shor's & Grover's algorithms, solve Q-Day ciphers, and answer quantum computing questions!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim()) return;

    const newMsgs: Message[] = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/quantum-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          currentLevel: currentMission,
          circuitState: {
            gateCount: gates.length,
            gates: gates.map((g) => `${g.type}(q[${g.qubit}])`),
          },
          languagePreference: 'English',
        }),
      });

      const data = await res.json();
      setMessages([...newMsgs, { sender: 'ai', text: data.reply || data.error }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        { sender: 'ai', text: 'Quantum telemetry error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-xl">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl text-white shadow-md shadow-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">Q-AI COPILOT</h3>
            <p className="text-[10px] text-purple-400 font-mono">
              Gemini 3.6 Flash • Quantum Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono">
        <button
          onClick={() => handleSend('Suggest a tip for solving this quantum mission level!')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg whitespace-nowrap flex items-center gap-1 border border-slate-700"
        >
          <Lightbulb className="w-3 h-3 text-amber-400" /> Mission Hint
        </button>
        <button
          onClick={() => handleSend('Explain Grover search algorithm clearly.')}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg whitespace-nowrap flex items-center gap-1 border border-slate-700"
        >
          <HelpCircle className="w-3 h-3 text-cyan-400" /> Explain Grover's
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-mono text-[11px] leading-relaxed'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs p-2">
            <Sparkles className="w-4 h-4 animate-spin" /> Q-Core is formulating quantum response...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Q-Core any quantum question..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
