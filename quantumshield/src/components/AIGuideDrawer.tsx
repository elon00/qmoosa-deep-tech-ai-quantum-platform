import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, Send, X, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const AIGuideDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: 'Hello! I am your QuantumShield AI Cryptographic Guide. Ask me anything about Shor\'s algorithm, RSA/ECC vulnerabilities, NIST FIPS 203 ML-KEM, or hybrid X25519 key exchanges!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const speakText = (text: string) => {
    try {
      if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI Response
    let botReply = '';
    const qLower = query.toLowerCase();

    if (qLower.includes('rsa') || qLower.includes('ecc') || qLower.includes('break') || qLower.includes('shor')) {
      botReply = "Shor's algorithm breaks RSA and ECC because quantum computers solve prime factorization and discrete logarithms in polynomial time O((log N)^3). This renders standard 2048-bit RSA and Secp256r1 vulnerable to future quantum decryption.";
    } else if (qLower.includes('ml-kem') || qLower.includes('kyber') || qLower.includes('fips 203')) {
      botReply = "ML-KEM-768 (Crystals-Kyber) is standardized in NIST FIPS 203. It uses lattice-based Module Learning With Errors (M-LWE) math, providing 192 bits of quantum security that Shor's algorithm cannot solve.";
    } else if (qLower.includes('hybrid') || qLower.includes('x25519')) {
      botReply = "Hybrid key exchange combines classical X25519 (ECDH) with ML-KEM-768 via HKDF-SHA256. This satisfies present-day FIPS certifications while guaranteeing post-quantum protection against Store-Now-Decrypt-Later attacks.";
    } else {
      botReply = `Regarding "${query}": Post-quantum cryptography upgrades standard key exchange mechanisms to lattice-based primitives like ML-KEM-768. Check our Benchmark tab to compare key overhead and speed!`;
    }

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      speakText(botReply);
    }, 600);
  };

  const toggleMic = () => {
    try {
      if (typeof window === 'undefined') return;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser environment.");
        return;
      }

      if (isRecording) {
        setIsRecording(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (e: any) => {
        if (e && e.results && e.results[0] && e.results[0][0]) {
          const transcript = e.results[0][0].transcript;
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition error:", err);
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#FF003C] hover:bg-white text-white hover:text-black font-black text-xs uppercase tracking-widest cursor-pointer shadow-2xl transition-all border-2 border-white"
        >
          <Bot className="w-5 h-5" />
          <span>AI PQC ASSISTANT</span>
          <span className="w-2.5 h-2.5 bg-[#00FF41] border border-black animate-ping" />
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#050505] border-2 border-[#FF003C] shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Header */}
          <div className="bg-[#111111] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF003C] text-white font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  QUANTUMSHIELD AI GUIDE
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF41]" />
                </h3>
                <p className="text-[9px] font-mono text-white/50 uppercase tracking-widest">VOICE & TEXT ASSISTANT</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className={`p-2 text-xs font-mono cursor-pointer transition-colors ${isSpeechEnabled ? 'text-[#00FF41] bg-white/10' : 'text-white/40'}`}
                title="Toggle Text-To-Speech audio"
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs font-mono">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#111111] border border-white/10 text-white/90'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-white/40 mt-1 font-mono uppercase">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#111111] border-t border-white/10 flex items-center gap-2">
            <button
              onClick={toggleMic}
              className={`p-2.5 text-white cursor-pointer transition-all ${
                isRecording ? 'bg-[#FF003C] animate-pulse' : 'bg-[#050505] border border-white/20 hover:border-white text-white'
              }`}
              title="Voice Input (Speech-to-text)"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={isRecording ? 'LISTENING...' : 'TYPE A QUESTION...'}
              className="flex-1 bg-[#050505] border border-white/20 px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#FF003C]"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-white hover:bg-[#FF003C] text-black hover:text-white font-bold disabled:opacity-30 cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
