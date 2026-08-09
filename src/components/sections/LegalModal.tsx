import React, { useState } from "react";
import { X, Scale } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, defaultTab = "privacy" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-white/20 max-w-4xl w-full max-h-[85vh] flex flex-col text-[#F5F5F5] font-mono-code">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scale className="w-5 h-5 text-[#00F0FF]" />
            <div>
              <h2 className="text-lg font-display font-light text-white">QMoosa Legal & Compliance Center</h2>
              <p className="text-xs text-neutral-400">
                Mandatory terms, privacy, security, responsible AI, and disclosures.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal Tabs Bar */}
        <div className="flex overflow-x-auto bg-black border-b border-white/10 text-xs px-4">
          {[
            { id: "privacy", label: "Privacy Policy" },
            { id: "terms", label: "Terms of Service" },
            { id: "security", label: "Security Policy" },
            { id: "ai", label: "Responsible AI" },
            { id: "crypto", label: "Crypto Risk Disclosures" },
            { id: "cookies", label: "Cookie Policy" },
            { id: "accessibility", label: "Accessibility Statement" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 whitespace-nowrap uppercase tracking-widest text-[10px] font-bold transition border-b-2 ${
                activeTab === t.id
                  ? "border-[#00F0FF] text-[#00F0FF] bg-white/5"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-neutral-300 space-y-4 leading-relaxed font-sans">
          {activeTab === "privacy" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">1. Privacy Policy & Data Handling</h3>
              <p className="font-sans text-xs text-neutral-300">
                QMoosa Technologies Inc. ("QMoosa") prioritizes the confidentiality and integrity of user data across our AI agent, quantum simulation, and blockchain audit platforms.
              </p>
              <h4 className="font-bold text-[#00F0FF] text-xs uppercase tracking-wider mt-2">1.1 AI Model Training</h4>
              <p className="font-sans text-xs text-neutral-300">
                Customer data, API prompt inputs, and uploaded documents are strictly isolated. We do NOT use proprietary customer data or API payloads to train foundational AI models.
              </p>
              <h4 className="font-bold text-[#00F0FF] text-xs uppercase tracking-wider mt-2">1.2 Encryption</h4>
              <p className="font-sans text-xs text-neutral-300">
                Data stored at rest is encrypted using AES-256 and post-quantum ML-KEM-768 lattice keys.
              </p>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">2. Terms of Service & Acceptable Use</h3>
              <p className="font-sans text-xs text-neutral-300">
                By accessing the QMoosa platform, API endpoints, or Quantum Simulators, you agree to comply with all applicable export controls, cybersecurity regulations, and intellectual property laws.
              </p>
              <p className="font-sans text-xs text-neutral-300">
                You may not use QMoosa agents or cryptographic tools to attempt unauthorized penetration testing against third-party non-consenting systems.
              </p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">3. Security Architecture & Auditability</h3>
              <p className="font-sans text-xs text-neutral-300">
                QMoosa maintains SOC2 Type II and ISO 27001 compliance standards. All AI agent tool executions pass through explicit human-in-the-loop authorization boundaries and deterministic audit logs.
              </p>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">4. Responsible AI & Transparency Policy</h3>
              <p className="font-sans text-xs text-neutral-300">
                Every QMoosa agent response clearly denotes model provenance, system instruction parameters, and confidence metrics. High-impact autonomous agent actions require explicit user verification before execution.
              </p>
            </div>
          )}

          {activeTab === "crypto" && (
            <div className="space-y-3 p-4 bg-white/5 border border-white/20 text-neutral-200 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">5. Crypto & Blockchain Risk Disclosures</h3>
              <p className="font-sans text-xs text-neutral-300">
                Blockchain smart contract audits, Solana Anchor verification, and Web4 agentic wallet interactions provided by QMoosa are for simulation, verification, and analytical purposes.
              </p>
              <p className="font-sans text-xs text-neutral-300">
                Products involving tokens or financial infrastructure require jurisdiction-specific legal review prior to mainnet deployment.
              </p>
            </div>
          )}

          {activeTab === "cookies" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">6. Cookie Policy</h3>
              <p className="font-sans text-xs text-neutral-300">
                QMoosa uses essential session tokens and local browser storage strictly for authentication, persistent chat session state, and security routing. We do not sell tracking cookies to third parties.
              </p>
            </div>
          )}

          {activeTab === "accessibility" && (
            <div className="space-y-3 font-mono-code">
              <h3 className="text-lg font-display font-light text-white">7. Accessibility Statement (WCAG 2.2 AA)</h3>
              <p className="font-sans text-xs text-neutral-300">
                QMoosa is committed to digital accessibility. Our interface supports full keyboard navigation, screen reader ARIA landmarks, high contrast color ratios, and reduced motion settings.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-[#00F0FF] transition"
          >
            Close Policy Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
