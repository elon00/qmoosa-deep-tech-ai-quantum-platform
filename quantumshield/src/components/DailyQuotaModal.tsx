import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  Sparkles, 
  CreditCard, 
  FolderPlus, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Plus, 
  Zap, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Award,
  History,
  TrendingUp,
  FolderKanban
} from 'lucide-react';
import { 
  QuotaData, 
  subscribeQuota, 
  createNewProject, 
  forceRefillDailyQuota, 
  consumeFreeTokens, 
  consumeCreditTokens,
  DAILY_FREE_TOKENS_MAX,
  DAILY_CREDIT_TOKENS_MAX,
  DAILY_PROJECTS_MAX 
} from '../lib/quotaManager';

interface DailyQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyQuotaModal: React.FC<DailyQuotaModalProps> = ({ isOpen, onClose }) => {
  const [quota, setQuota] = useState<QuotaData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'create-project' | 'history'>('overview');
  
  // New Project Form state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('Quantum Cryptography');
  const [projectMessage, setProjectMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Time remaining until next UTC midnight reset
  const [timeToReset, setTimeToReset] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeQuota((data) => {
      setQuota(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0); // Next midnight
      const diffMs = nextReset.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeToReset(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen || !quota) return null;

  const freeTokenPercent = Math.max(0, Math.min(100, (quota.freeTokensRemaining / quota.freeTokensMax) * 100));
  const creditTokenPercent = Math.max(0, Math.min(100, (quota.creditTokensRemaining / quota.creditTokensMax) * 100));
  const projectsPercent = Math.max(0, Math.min(100, (quota.projectsCreatedToday / quota.projectsMaxToday) * 100));

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const res = createNewProject(projectName.trim(), projectDesc.trim(), projectCategory);
    setProjectMessage({
      success: res.success,
      text: res.message
    });

    if (res.success) {
      setProjectName('');
      setProjectDesc('');
      setTimeout(() => {
        setActiveTab('overview');
        setProjectMessage(null);
      }, 1800);
    }
  };

  const handleSimulateTokenUsage = () => {
    consumeFreeTokens(500_000, 'Simulated Quantum AI Simulation & PQC Audit Run');
    consumeCreditTokens(2, 'Simulated Heavy Shor Lab Circuit Execution');
  };

  const handleRefillQuota = () => {
    forceRefillDailyQuota();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono text-xs animate-fadeIn">
      <div className="bg-[#0A0A0A] border-2 border-[#00FF41] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.3)] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="bg-[#111111] border-b-2 border-[#00FF41] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00FF41] text-black font-black">
              <Coins className="w-6 h-6 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#00FF41] text-black font-black text-[9px] uppercase">
                  DAILY SYSTEM ALLOWANCE
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">
                  RESETS EVERY 24 HOURS
                </span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                DAILY TOKENS & PROJECT QUOTA MANAGEMENT
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TOP STATUS BAR & RESET TIMER */}
        <div className="bg-[#050505] px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px]">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>DAILY ALLOWANCE RESET IN: <strong className="text-amber-400 text-xs font-bold">{timeToReset}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateTokenUsage}
              className="px-3 py-1.5 bg-[#111111] border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-black font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>TEST TOKEN CONSUMPTION</span>
            </button>

            <button
              onClick={handleRefillQuota}
              className="px-3 py-1.5 bg-[#00FF41] text-black font-black uppercase hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,65,0.4)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>REFILL ALLOWANCE NOW</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-white/10 bg-[#111111]">
          {[
            { id: 'overview', label: 'ALLOWANCE OVERVIEW', icon: Coins },
            { id: 'create-project', label: `CREATE PROJECT (${quota.projectsCreatedToday}/${quota.projectsMaxToday})`, icon: FolderPlus },
            { id: 'history', label: 'USAGE AUDIT LOGS', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 font-black text-xs uppercase flex items-center justify-center gap-2 transition-all border-r border-white/10 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#00FF41] text-black'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 3 MAIN DAILY ALLOWANCE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. FREE TOKENS CARD (30 MILLION PER DAY) */}
                <div className="bg-[#111111] border-2 border-cyan-400 p-5 space-y-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-cyan-400 font-bold uppercase block">1. FREE TOKENS PER DAY</span>
                      <h3 className="text-xl font-black text-white">30,000,000 TOKENS</h3>
                    </div>
                    <div className="p-2 bg-cyan-950 text-cyan-400 border border-cyan-400">
                      <Zap className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>REMAINING TODAY:</span>
                      <span className="font-bold text-cyan-400 text-xs">
                        {(quota.freeTokensRemaining / 1_000_000).toFixed(2)}M / 30.00M
                      </span>
                    </div>
                    <div className="w-full bg-black h-3 border border-cyan-400/50 p-0.5">
                      <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${freeTokenPercent}%` }} />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Used for Quantum AI calculations, PQC audits, PennyLane simulations, and automated code synthesis.
                  </p>
                </div>

                {/* 2. CREDIT TOKENS CARD (100 CREDITS PER DAY) */}
                <div className="bg-[#111111] border-2 border-emerald-400 p-5 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase block">2. CREDIT TOKENS PER DAY</span>
                      <h3 className="text-xl font-black text-white">100 CREDITS</h3>
                    </div>
                    <div className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>REMAINING TODAY:</span>
                      <span className="font-bold text-emerald-400 text-xs">
                        {quota.creditTokensRemaining} / {quota.creditTokensMax} CREDITS
                      </span>
                    </div>
                    <div className="w-full bg-black h-3 border border-emerald-400/50 p-0.5">
                      <div className="bg-[#00FF41] h-full transition-all duration-500" style={{ width: `${creditTokenPercent}%` }} />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Used for heavy Shor quantum circuit execution, agentic squad dispatching, and key exchange deployments.
                  </p>
                </div>

                {/* 3. DAILY PROJECTS LIMIT CARD (3 PROJECTS PER DAY) */}
                <div className="bg-[#111111] border-2 border-amber-400 p-5 space-y-4 shadow-[0_0_20px_rgba(251,191,36,0.15)] relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-amber-400 font-bold uppercase block">3. DAILY PROJECTS LIMIT</span>
                      <h3 className="text-xl font-black text-white">3 PROJECTS / DAY</h3>
                    </div>
                    <div className="p-2 bg-amber-950 text-amber-400 border border-amber-400">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>CREATED TODAY:</span>
                      <span className="font-bold text-amber-400 text-xs">
                        {quota.projectsCreatedToday} / {quota.projectsMaxToday} PROJECTS
                      </span>
                    </div>
                    <div className="w-full bg-black h-3 border border-amber-400/50 p-0.5">
                      <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${projectsPercent}%` }} />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Maximum 3 active projects per day. Reset daily or archive to keep workspace clean.
                  </p>
                </div>

              </div>

              {/* USER CREATED PROJECTS LIST */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <h3 className="font-bold text-white uppercase text-xs flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-amber-400" />
                    <span>YOUR ACTIVE PROJECTS ({quota.userProjects.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('create-project')}
                    disabled={quota.projectsCreatedToday >= quota.projectsMaxToday}
                    className="px-3 py-1 bg-amber-400 hover:bg-white text-black font-bold uppercase text-[10px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>NEW PROJECT</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quota.userProjects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-[#111111] border border-white/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500 text-[9px] font-bold uppercase">
                          {proj.category}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold">{proj.status}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                      <p className="text-[10px] text-slate-300 font-sans leading-relaxed">{proj.description}</p>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 pt-2 border-t border-white/5">
                        <span>Created: {proj.createdAt}</span>
                        <span>Used: {proj.creditsUsed} Credit + {(proj.freeTokensUsed / 1000).toFixed(0)}k Tokens</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create-project' && (
            <div className="bg-[#111111] border border-white/20 p-6 space-y-6 max-w-2xl mx-auto">
              <div className="space-y-1 border-b border-white/10 pb-4">
                <h3 className="text-lg font-black text-white uppercase">CREATE A NEW QUANTUM PROJECT</h3>
                <p className="text-[10px] text-slate-400">
                  Daily Project Quota: {quota.projectsCreatedToday} / {quota.projectsMaxToday} created today.
                </p>
              </div>

              {projectMessage && (
                <div className={`p-3 border text-xs font-bold uppercase ${
                  projectMessage.success 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-rose-950 text-rose-300 border-rose-500'
                }`}>
                  {projectMessage.text}
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                    PROJECT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Project Shor Quantum Exchanger"
                    className="w-full bg-[#050505] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-emerald-400 font-bold uppercase block mb-1">
                    CATEGORY / ARCHITECTURE
                  </label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full bg-[#050505] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Quantum Cryptography">Quantum Cryptography & PQC Migration</option>
                    <option value="Shor Attack Simulation">Shor Quantum Lab & Threat Matrix</option>
                    <option value="Crypto Exchange & DEX">Crypto Exchange & DEX Swaps</option>
                    <option value="Agency AI Automaton">Agency 230+ Specialist Automaton</option>
                    <option value="QKAN & PQK Algorithm">QKAN & PQK Algorithm Generator</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-amber-400 font-bold uppercase block mb-1">
                    DESCRIPTION & SCOPE
                  </label>
                  <textarea
                    rows={3}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Briefly describe the objectives and algorithmic parameters of this project..."
                    className="w-full bg-[#050505] border border-white/20 p-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>

                <div className="p-3 bg-[#050505] border border-amber-400/40 text-[10px] text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400 uppercase">PROJECT COST DEDUCTION:</div>
                  <div>• 1 Credit Token (Remaining: {quota.creditTokensRemaining})</div>
                  <div>• 100,000 Free Tokens (Remaining: {(quota.freeTokensRemaining / 1000).toFixed(0)}k)</div>
                </div>

                <button
                  type="submit"
                  disabled={quota.projectsCreatedToday >= quota.projectsMaxToday}
                  className="w-full py-3 bg-amber-400 hover:bg-white text-black font-black uppercase tracking-wider cursor-pointer transition-all disabled:opacity-50"
                >
                  INITIALIZE PROJECT ({quota.projectsCreatedToday}/${quota.projectsMaxToday} CREATED TODAY)
                </button>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h3 className="font-bold text-white uppercase text-xs flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>TOKEN & PROJECT CONSUMPTION AUDIT STREAM</span>
                </h3>
                <span className="text-[10px] text-slate-400">{quota.usageHistory.length} AUDIT RECORDS</span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {quota.usageHistory.map((item) => (
                  <div key={item.id} className="p-3 bg-[#111111] border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                          item.type === 'DAILY_RESET' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' :
                          item.type === 'PROJECT_CREATED' ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                          item.type === 'CREDITS' ? 'bg-purple-950 text-purple-300 border border-purple-500' :
                          'bg-cyan-950 text-cyan-300 border border-cyan-500'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-white text-xs font-bold">{item.reason}</span>
                      </div>
                      <span className="text-[9px] text-slate-400 block">{item.timestamp}</span>
                    </div>

                    <span className="font-bold text-xs text-white shrink-0">
                      {item.type === 'FREE_TOKENS' ? `-${item.amount.toLocaleString()} Tokens` :
                       item.type === 'CREDITS' ? `-${item.amount} Credits` :
                       item.type === 'PROJECT_CREATED' ? `+1 Project` :
                       `+${(item.amount / 1_000_000).toFixed(0)}M Refill`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#111111] border-t border-white/10 px-6 py-3 flex justify-between items-center text-[10px] text-slate-400">
          <span>QUANTUMSHIELD DAILY SYSTEM ALLOWANCE • ENFORCED 24H RESET</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black font-bold uppercase hover:bg-[#00FF41] transition-all cursor-pointer"
          >
            CLOSE WINDOW
          </button>
        </div>

      </div>
    </div>
  );
};
