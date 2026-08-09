import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, BarChart3, Sparkles, Lock, ShieldAlert, RefreshCw, Wallet, User as UserIcon, UserCheck, LogIn, LogOut, CreditCard, Binary, Trophy, Grid, Users, Coins, Wand2, Brain, FolderKanban, Zap } from 'lucide-react';
import { User } from 'firebase/auth';
import { subscribeToAuth, logoutUser } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { DailyQuotaModal } from './DailyQuotaModal';
import { QuotaData, subscribeQuota } from '../lib/quotaManager';

export type TabType = 'sandbox' | 'shor-lab' | 'matrix' | 'benchmark' | 'ai-audit' | 'vault' | 'payments' | 'crypto-tool' | 'ctf-arena' | 'keyhunt-automaton' | 'agency-hub' | 'crypto-exchange' | 'omniversal-magic-box' | 'quantum-algo-generator';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  serverStatus: 'connected' | 'checking' | 'error';
  onCheckHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  serverStatus,
  onCheckHealth,
}) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'simulated'>('disconnected');
  const [walletError, setWalletError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [quotaData, setQuotaData] = useState<QuotaData | null>(null);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    const unsubscribeQuota = subscribeQuota((data) => {
      setQuotaData(data);
    });
    return () => {
      unsubscribeAuth();
      unsubscribeQuota();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
      const handleAccounts = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setWalletStatus('connected');
          setWalletError(null);
        } else {
          setWalletAddress(null);
          setWalletStatus('disconnected');
        }
      };

      try {
        window.ethereum.on('accountsChanged', handleAccounts);
      } catch (e) {
        console.warn('Ethereum event listener setup failed:', e);
      }

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          try {
            window.ethereum.removeListener('accountsChanged', handleAccounts);
          } catch (e) {
            // ignore cleanup error
          }
        }
      };
    }
  }, []);

  const handleConnectMetaMask = async () => {
    setWalletStatus('connecting');
    setWalletError(null);

    const fallbackAddress = '0x71C7053e198b1a5e1e48C5f54129b69201a089B1';

    try {
      if (typeof window !== 'undefined' && window.ethereum && typeof window.ethereum.request === 'function') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setWalletStatus('connected');
            setWalletError(null);
            return;
          }
        } catch (ethErr: any) {
          console.info('MetaMask eth_requestAccounts info:', ethErr);
          const errMsg = ethErr?.message || 'Connection refused or unavailable';
          setWalletAddress(fallbackAddress);
          setWalletStatus('simulated');
          setWalletError(`MetaMask info: ${errMsg} — switched to Quantum-Safe Test Wallet`);
          return;
        }
      }

      // Fallback if window.ethereum is not found
      setWalletAddress(fallbackAddress);
      setWalletStatus('simulated');
      setWalletError('MetaMask not detected in current frame — using Quantum-Safe Test Wallet');
    } catch (err: any) {
      console.warn('Wallet connection notice:', err);
      setWalletAddress(fallbackAddress);
      setWalletStatus('simulated');
      setWalletError('MetaMask connection notice — switched to Quantum-Safe Test Wallet');
    }
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    setWalletStatus('disconnected');
    setWalletError(null);
  };

  const handleQuickLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="bg-[#131314]/95 border-b border-[#2E3135] sticky top-0 z-40 backdrop-blur-2xl font-sans text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Gemini Chat Top Header Branding Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Gemini Aurora Spark Icon */}
            <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-[#4285F4] via-[#9B51E0] to-[#E91E63] rounded-full p-0.5 shadow-[0_0_20px_rgba(66,133,244,0.4)]">
              <div className="w-full h-full bg-[#131314] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-sans">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63]">
                    QUANTUM SHIELD
                  </span>
                </h1>
                <span className="px-3 py-1 bg-[#1E1F20] hover:bg-[#282A2C] border border-[#2E3135] text-slate-200 font-sans text-[11px] font-semibold rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                  <span>1.5 Pro</span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            {/* Account Login / Logout Button */}
            {currentUser && !currentUser.isAnonymous ? (
              <div className="flex items-center gap-1 bg-[#1E1F20] border border-[#2E3135] rounded-full px-2 py-1">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-2 py-0.5 text-white hover:text-emerald-400 cursor-pointer text-left transition-colors"
                  title="View Account Details"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-slate-200 text-xs max-w-[120px] truncate block">
                    {currentUser.email || currentUser.uid.substring(0, 8)}
                  </span>
                </button>
                <button
                  onClick={handleQuickLogout}
                  className="px-2 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-full font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#9B51E0] hover:opacity-90 text-white font-semibold rounded-full transition-all cursor-pointer shadow-md text-xs"
                title="Log In or Sign Up"
              >
                <LogIn className="w-4 h-4" />
                <span>SIGN IN</span>
              </button>
            )}

            {/* MetaMask / Web3 Wallet Button */}
            {walletStatus === 'disconnected' ? (
              <button
                onClick={handleConnectMetaMask}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1E1F20] hover:bg-[#282A2C] text-slate-200 border border-[#2E3135] font-medium rounded-full transition-all cursor-pointer text-xs"
                title="Connect Web3 Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-[#4285F4]" />
                <span>CONNECT WALLET</span>
              </button>
            ) : (
              <button
                onClick={handleDisconnectWallet}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1E1F20] border border-emerald-500/40 text-white rounded-full transition-all cursor-pointer text-left"
                title="Disconnect Wallet"
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" />
                <span className="font-medium text-slate-200 text-xs">
                  {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'WALLET'}
                </span>
              </button>
            )}

            {/* System Health Status */}
            <button
              onClick={onCheckHealth}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1E1F20] border border-[#2E3135] hover:border-slate-500 text-slate-200 rounded-full transition-all text-left"
              title="Verify Backend System"
            >
              <span className={`w-2 h-2 rounded-full ${
                serverStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                serverStatus === 'checking' ? 'bg-amber-400 animate-ping' : 'bg-rose-500'
              }`} />
              <span className="font-medium text-xs">
                {serverStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
              </span>
              <RefreshCw className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {/* Daily System Quota Allowance */}
            <button
              onClick={() => setIsQuotaModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1F20] border border-[#2E3135] hover:border-slate-500 text-slate-200 rounded-full transition-all text-xs cursor-pointer"
              title="View Daily Allowance"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-slate-200">
                {quotaData ? (quotaData.freeTokensRemaining / 1_000_000).toFixed(1) : '30'}M TOKENS
              </span>
            </button>
          </div>
        </div>

        {/* Wallet Error Notice Bar */}
        {walletError && (
          <div className="mb-3 p-2 bg-rose-950/60 border border-rose-500/40 rounded-xl text-white flex items-center justify-between text-xs">
            <span className="text-rose-300 font-medium">{walletError}</span>
            <button
              onClick={() => setWalletError(null)}
              className="text-slate-400 hover:text-white px-2 uppercase text-[10px] cursor-pointer"
            >
              [DISMISS]
            </button>
          </div>
        )}

        {/* GEMINI CHATBOT STYLE NAVIGATION PILLS */}
        <div className="pt-2 border-t border-[#2E3135]">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs font-medium font-sans">
            {/* 14 Navigation Tabs with Gemini Rounded Pill Styling */}
            <button
              onClick={() => setActiveTab('quantum-algo-generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'quantum-algo-generator'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>Algorithm Synthesizer</span>
            </button>

            <button
              onClick={() => setActiveTab('shor-lab')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'shor-lab'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Shor's QPU Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'sandbox'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>Key Exchange Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'matrix'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Threat Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'benchmark'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Benchmarks</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-audit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'ai-audit'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>AI Migration Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'vault'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Encrypted Vault</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('crypto-tool')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'crypto-tool'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Binary className="w-4 h-4 text-indigo-400" />
              <span>Crypto Transformer</span>
            </button>

            <button
              onClick={() => setActiveTab('ctf-arena')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'ctf-arena'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Research CTF</span>
            </button>

            <button
              onClick={() => setActiveTab('keyhunt-automaton')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'keyhunt-automaton'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Grid className="w-4 h-4 text-emerald-400" />
              <span>Keyhunt Automaton</span>
            </button>

            <button
              onClick={() => setActiveTab('agency-hub')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'agency-hub'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>The Agency</span>
            </button>

            <button
              onClick={() => setActiveTab('crypto-exchange')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'crypto-exchange'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Exchange Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('omniversal-magic-box')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
                activeTab === 'omniversal-magic-box'
                  ? 'bg-gradient-to-r from-[#4285F4] via-[#9B51E0] to-[#E91E63] text-white shadow-lg shadow-purple-500/20'
                  : 'bg-[#1E1F20] text-slate-300 hover:bg-[#282A2C] border border-[#2E3135]'
              }`}
            >
              <Wand2 className="w-4 h-4 text-pink-400" />
              <span>Magic Box</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />

      {/* Daily Quota Modal */}
      <DailyQuotaModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
      />
    </header>
  );
};

