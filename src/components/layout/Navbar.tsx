import React, { useState } from "react";
import { NavigationTab } from "../../types";
import {
  Bot,
  Cpu,
  Link as LinkIcon,
  Lock,
  Sparkles,
  Terminal,
  Layers,
  FlaskConical,
  Building2,
  Menu,
  X,
} from "lucide-react";

interface NavbarProps {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  openLegalModal: (tabName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openLegalModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; tab: NavigationTab; icon: React.ReactNode }[] = [
    { label: "Home", tab: "home", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: "AI Agentics", tab: "ai-workspace", icon: <Bot className="w-3.5 h-3.5 text-[#00F0FF]" /> },
    { label: "Quantum", tab: "quantum", icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: "Blockchain", tab: "blockchain", icon: <LinkIcon className="w-3.5 h-3.5 text-purple-400" /> },
    { label: "Cryptography", tab: "cryptography", icon: <Lock className="w-3.5 h-3.5 text-amber-400" /> },
    { label: "Algorithms", tab: "algorithms", icon: <FlaskConical className="w-3.5 h-3.5 text-blue-400" /> },
    { label: "Products", tab: "products", icon: <Layers className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: "Developers", tab: "developers", icon: <Terminal className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "Admin", tab: "admin", icon: <Building2 className="w-3.5 h-3.5 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setCurrentTab("home")}>
            <div className="w-5 h-5 bg-white rotate-45 group-hover:bg-[#00F0FF] transition-colors shrink-0"></div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-[0.2em] uppercase text-white group-hover:text-[#00F0FF] transition-colors font-mono-code">
                  QMOOSA
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono-code uppercase bg-white/5 text-[#00F0FF] border border-white/10 rounded-none">
                  v4.02
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 font-mono-code text-[11px] uppercase tracking-[0.15em]">
            {navItems.map((item) => {
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab)}
                  className={`flex items-center space-x-1.5 px-3 py-2 transition-all duration-150 ${
                    isActive
                      ? "text-[#00F0FF] border-b-2 border-[#00F0FF] bg-white/[0.03] font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => setCurrentTab("contact")}
              className="text-[11px] font-mono-code uppercase tracking-widest text-neutral-400 hover:text-white px-3 py-2 transition"
            >
              Contact
            </button>
            <button
              onClick={() => setCurrentTab("ai-workspace")}
              className="px-5 py-2 border border-white text-white text-[11px] font-mono-code uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-200"
            >
              Launch AI Workspace
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => setCurrentTab("ai-workspace")}
              className="px-3 py-1.5 border border-white/30 text-white text-[10px] font-mono-code uppercase tracking-wider"
            >
              AI Workspace
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-white/10 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#050505] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 font-mono-code">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  setCurrentTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-2 p-2.5 text-[11px] uppercase tracking-wider text-left border ${
                  currentTab === item.tab
                    ? "bg-white/10 text-[#00F0FF] border-[#00F0FF]"
                    : "border-white/5 text-neutral-300 hover:bg-white/5"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => {
                setCurrentTab("contact");
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 text-[11px] uppercase tracking-widest font-bold text-black bg-white"
            >
              Start Consultation
            </button>
            <button
              onClick={() => {
                openLegalModal("privacy");
                setMobileMenuOpen(false);
              }}
              className="w-full text-center text-[10px] uppercase tracking-widest text-neutral-400 py-1"
            >
              Legal & Compliance
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
