import React from "react";
import { NavigationTab } from "../../types";

interface FooterProps {
  setCurrentTab: (tab: NavigationTab) => void;
  openLegalModal: (policyId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openLegalModal }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 text-[#F5F5F5] text-xs font-mono-code">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentTab("home")}>
              <div className="w-7 h-7 border border-white bg-white text-black flex items-center justify-center font-display font-light text-base">
                Q
              </div>
              <span className="font-display font-light text-xl tracking-widest text-white">QMOOSA</span>
            </div>
            <p className="text-neutral-400 text-xs font-sans leading-relaxed max-w-sm">
              Engineering intelligent software, post-quantum cryptography, high-throughput Solana/EVM blockchains, and 32-qubit quantum simulation frameworks for the next generation of computing.
            </p>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-black text-[#00FF41] border border-white/10 text-[10px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></span>
                <span>Operational</span>
              </span>
              <span className="text-[10px] text-neutral-400">v2.4.0-Production</span>
            </div>
          </div>

          {/* Deep Tech Divisions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white tracking-widest uppercase text-[10px] text-[#00F0FF]">
              Divisions
            </h4>
            <ul className="space-y-2 font-sans text-xs text-neutral-300">
              <li>
                <button onClick={() => setCurrentTab("ai-workspace")} className="hover:text-white transition">
                  AI Agentics
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("blockchain")} className="hover:text-white transition">
                  Blockchain & Web3
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("quantum")} className="hover:text-white transition">
                  Quantum Computing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("cryptography")} className="hover:text-white transition">
                  Cryptography & PQC
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("algorithms")} className="hover:text-white transition">
                  Algorithm Lab
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("web4")} className="hover:text-white transition">
                  Web4 Autonomous Web
                </button>
              </li>
            </ul>
          </div>

          {/* Products & Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white tracking-widest uppercase text-[10px] text-[#00F0FF]">
              Platform
            </h4>
            <ul className="space-y-2 font-sans text-xs text-neutral-300">
              <li>
                <button onClick={() => setCurrentTab("products")} className="hover:text-white transition">
                  Products Suite
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("solutions")} className="hover:text-white transition">
                  Enterprise Solutions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("research")} className="hover:text-white transition">
                  Academic Research
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("developers")} className="hover:text-white transition">
                  Developer Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("case-studies")} className="hover:text-white transition">
                  Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("testimonials")} className="hover:text-white transition">
                  Verified Reviews
                </button>
              </li>
            </ul>
          </div>

          {/* Developers & Docs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white tracking-widest uppercase text-[10px] text-[#00F0FF]">
              Developers
            </h4>
            <ul className="space-y-2 font-sans text-xs text-neutral-300">
              <li>
                <button onClick={() => setCurrentTab("developers")} className="hover:text-white transition">
                  API Reference
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("developers")} className="hover:text-white transition">
                  SDKs (Python, Rust, TS)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("admin")} className="hover:text-white transition">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("contact")} className="hover:text-white transition">
                  Request Custom Build
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white tracking-widest uppercase text-[10px] text-[#00F0FF]">
              Compliance
            </h4>
            <ul className="space-y-2 font-sans text-xs text-neutral-300">
              <li>
                <button onClick={() => openLegalModal("privacy")} className="hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal("terms")} className="hover:text-white transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal("security")} className="hover:text-white transition">
                  Security Center
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal("ai")} className="hover:text-white transition">
                  Responsible AI Policy
                </button>
              </li>
              <li>
                <button onClick={() => openLegalModal("crypto")} className="hover:text-white transition">
                  Crypto & Risk Disclosures
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400">
          <p>
            © {new Date().getFullYear()} QMoosa Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <button onClick={() => openLegalModal("accessibility")} className="hover:text-white transition">
              Accessibility
            </button>
            <span>•</span>
            <button onClick={() => openLegalModal("cookies")} className="hover:text-white transition">
              Cookie Preferences
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab("contact")} className="hover:text-white transition">
              Support
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
