import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Repeat, 
  ShieldCheck, 
  ShieldAlert, 
  Newspaper, 
  Search, 
  Filter, 
  BarChart3, 
  Activity, 
  ExternalLink, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Wallet, 
  Coins, 
  Building2, 
  Zap, 
  Flame, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Send, 
  Layers, 
  Terminal,
  Cpu,
  Globe,
  Award
} from 'lucide-react';

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: string;
  category: 'Layer 1' | 'DeFi' | 'Layer 2' | 'RWA' | 'PQC Safe';
  quantumRisk: 'HIGH (ECDSA)' | 'MEDIUM (RSA)' | 'SAFE (ML-KEM)' | 'MIGRATING';
  cexLiquidityScore: number;
  dexLiquidityScore: number;
  messariRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB';
}

export interface CryptoNewsItem {
  id: string;
  title: string;
  source: 'Messari Intelligence' | 'CoinGecko Research' | 'CoinMarketCap News' | 'Binance Research' | 'PQC Crypto Daily';
  timestamp: string;
  summary: string;
  category: 'Market Analysis' | 'Security & PQC' | 'DeFi' | 'CEX Updates' | 'Regulation';
  url: string;
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  type: 'BUY' | 'SELL' | 'SWAP';
  assetSymbol: string;
  targetSymbol?: string;
  amount: number;
  priceUsd: number;
  totalUsd: number;
  exchange: 'Binance (CEX)' | 'Uniswap v3 (DEX)' | 'Coinbase Prime' | 'Curve PQC Pool';
  pqcSignatureStatus: 'ML-DSA-65 SIGNED' | 'SECP256K1 VULNERABLE' | 'VERIFIED';
  txHash: string;
}

const INITIAL_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 94250.00,
    change24h: 3.42,
    marketCap: 1850000000000,
    volume24h: 42100000000,
    circulatingSupply: '19.82M BTC',
    category: 'Layer 1',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 99,
    dexLiquidityScore: 88,
    messariRating: 'AAA'
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 3480.50,
    change24h: 5.12,
    marketCap: 418000000000,
    volume24h: 28400000000,
    circulatingSupply: '120.1M ETH',
    category: 'Layer 1',
    quantumRisk: 'MIGRATING',
    cexLiquidityScore: 98,
    dexLiquidityScore: 99,
    messariRating: 'AAA'
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 215.80,
    change24h: -1.25,
    marketCap: 101000000000,
    volume24h: 8900000000,
    circulatingSupply: '468M SOL',
    category: 'Layer 1',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 94,
    dexLiquidityScore: 92,
    messariRating: 'AA'
  },
  {
    id: 'qshield',
    symbol: 'PQC',
    name: 'QuantumShield Token',
    priceUsd: 14.85,
    change24h: 18.75,
    marketCap: 1485000000,
    volume24h: 320000000,
    circulatingSupply: '100M PQC',
    category: 'PQC Safe',
    quantumRisk: 'SAFE (ML-KEM)',
    cexLiquidityScore: 91,
    dexLiquidityScore: 96,
    messariRating: 'AAA'
  },
  {
    id: 'uniswap',
    symbol: 'UNI',
    name: 'Uniswap Governance',
    priceUsd: 11.40,
    change24h: 2.80,
    marketCap: 6840000000,
    volume24h: 410000000,
    circulatingSupply: '600M UNI',
    category: 'DeFi',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 89,
    dexLiquidityScore: 98,
    messariRating: 'AA'
  },
  {
    id: 'chainlink',
    symbol: 'LINK',
    name: 'Chainlink',
    priceUsd: 22.30,
    change24h: 4.15,
    marketCap: 13380000000,
    volume24h: 920000000,
    circulatingSupply: '608M LINK',
    category: 'RWA',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 92,
    dexLiquidityScore: 90,
    messariRating: 'AA'
  },
  {
    id: 'arbitrum',
    symbol: 'ARB',
    name: 'Arbitrum One',
    priceUsd: 1.15,
    change24h: -0.80,
    marketCap: 3800000000,
    volume24h: 350000000,
    circulatingSupply: '3.3B ARB',
    category: 'Layer 2',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 87,
    dexLiquidityScore: 91,
    messariRating: 'A'
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    name: 'Avalanche',
    priceUsd: 38.60,
    change24h: 6.40,
    marketCap: 15440000000,
    volume24h: 780000000,
    circulatingSupply: '400M AVAX',
    category: 'Layer 1',
    quantumRisk: 'HIGH (ECDSA)',
    cexLiquidityScore: 91,
    dexLiquidityScore: 86,
    messariRating: 'AA'
  }
];

const INITIAL_NEWS: CryptoNewsItem[] = [
  {
    id: 'news-1',
    title: 'NIST Standardizes FIPS 203 & 204: Major CEX Exchanges Prepare Post-Quantum Cold Storage Upgrades',
    source: 'Messari Intelligence',
    timestamp: '12 MINS AGO',
    summary: 'Binance, Coinbase Prime, and Kraken announce roadmap to mandate ML-KEM-768 lattice encryption for enterprise multi-sig cold storage before Q-Day deadline.',
    category: 'Security & PQC',
    url: 'https://messari.io/research/pqc-exchange-security'
  },
  {
    id: 'news-2',
    title: 'Uniswap v4 Hooks Integrate Post-Quantum Signature Verification for High-Value Swaps',
    source: 'CoinGecko Research',
    timestamp: '45 MINS AGO',
    summary: 'Decentralized exchange liquidity pools test zero-overhead ML-DSA signature hooks, offering MEV-resistant and quantum-safe atomic routing.',
    category: 'DeFi',
    url: 'https://coingecko.com/research/uniswap-pqc-hooks'
  },
  {
    id: 'news-3',
    title: 'Bitcoin Developer Proposal (BIP-Q): Lattice Signatures Proposed to Protect Secp256k1 Satoshi Coins',
    source: 'CoinMarketCap News',
    timestamp: '2 HOURS AGO',
    summary: 'Bitcoin Core contributors propose a soft-fork covenant migration allowing legacy unspent transaction outputs (UTXOs) to transition to Dilithium lattice keys.',
    category: 'Market Analysis',
    url: 'https://coinmarketcap.com/headlines/bitcoin-pqc-proposal'
  },
  {
    id: 'news-4',
    title: 'Global Crypto Market Cap Exceeds $3.4T as Institutional Capital Flees Legacy Vulnerable RSA Vaults',
    source: 'Binance Research',
    timestamp: '4 HOURS AGO',
    summary: 'Institutional asset managers allocate $12.4B into quantum-audited crypto funds, driving record liquidity across top CEX spot and derivatives order books.',
    category: 'CEX Updates',
    url: 'https://research.binance.com/market-outlook-2026'
  }
];

export const CryptoExchangeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'cex-dex' | 'swap' | 'research' | 'news' | 'ledger'>('market');
  const [assets, setAssets] = useState<CryptoAsset[]>(INITIAL_CRYPTO_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(INITIAL_CRYPTO_ASSETS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Swap / Trading State
  const [swapFromSymbol, setSwapFromSymbol] = useState<string>('ETH');
  const [swapToSymbol, setSwapToSymbol] = useState<string>('PQC');
  const [swapAmount, setSwapAmount] = useState<number>(1.5);
  const [selectedVenue, setSelectedVenue] = useState<'Uniswap v3 (DEX)' | 'Binance (CEX)' | 'Coinbase Prime' | 'Curve PQC Pool'>('Uniswap v3 (DEX)');
  const [pqcProtectionEnabled, setPqcProtectionEnabled] = useState<boolean>(true);
  
  // Portfolio Balance
  const [portfolio, setPortfolio] = useState({
    usd: 48500.00,
    btc: 0.85,
    eth: 12.40,
    pqc: 2500.00,
    sol: 45.00
  });

  // Transaction History
  const [tradeHistory, setTradeHistory] = useState<TradeOrder[]>([
    {
      id: 'tx_98214_pqc',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(),
      type: 'SWAP',
      assetSymbol: 'ETH',
      targetSymbol: 'PQC',
      amount: 2.0,
      priceUsd: 3480.50,
      totalUsd: 6961.00,
      exchange: 'Uniswap v3 (DEX)',
      pqcSignatureStatus: 'ML-DSA-65 SIGNED',
      txHash: '0x8f2a93c714e82b991d09e51c2f90a18e38d771bc4'
    },
    {
      id: 'tx_98213_btc',
      timestamp: new Date(Date.now() - 7200000).toLocaleTimeString(),
      type: 'BUY',
      assetSymbol: 'BTC',
      amount: 0.1,
      priceUsd: 94250.00,
      totalUsd: 9425.00,
      exchange: 'Binance (CEX)',
      pqcSignatureStatus: 'VERIFIED',
      txHash: '0x13c72e90f142ba390d12fe88ab511a0937b8d141'
    }
  ]);

  // Live price fluctuation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => {
        const deltaPct = (Math.random() - 0.49) * 0.4;
        const newPrice = Math.max(0.01, asset.priceUsd * (1 + deltaPct / 100));
        return {
          ...asset,
          priceUsd: parseFloat(newPrice.toFixed(2)),
          change24h: parseFloat((asset.change24h + (deltaPct * 0.1)).toFixed(2))
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || asset.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate swap rates
  const getAssetPrice = (sym: string) => {
    if (sym === 'USD') return 1;
    const a = assets.find(x => x.symbol === sym);
    return a ? a.priceUsd : 1;
  };

  const fromPrice = getAssetPrice(swapFromSymbol);
  const toPrice = getAssetPrice(swapToSymbol);
  const estimatedReceiveAmount = (swapAmount * fromPrice) / toPrice;

  const handleExecuteSwap = () => {
    const totalUsd = swapAmount * fromPrice;
    
    // Check balances
    if (swapFromSymbol === 'USD' && portfolio.usd < swapAmount) {
      alert('Insufficient USD balance');
      return;
    }

    const newTx: TradeOrder = {
      id: `tx_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'SWAP',
      assetSymbol: swapFromSymbol,
      targetSymbol: swapToSymbol,
      amount: swapAmount,
      priceUsd: fromPrice,
      totalUsd: totalUsd,
      exchange: selectedVenue,
      pqcSignatureStatus: pqcProtectionEnabled ? 'ML-DSA-65 SIGNED' : 'SECP256K1 VULNERABLE',
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`
    };

    setTradeHistory(prev => [newTx, ...prev]);

    // Update balances simulation
    setPortfolio(prev => {
      const updated = { ...prev };
      if (swapFromSymbol === 'USD') updated.usd -= swapAmount;
      if (swapFromSymbol === 'ETH') updated.eth = Math.max(0, updated.eth - swapAmount);
      if (swapFromSymbol === 'BTC') updated.btc = Math.max(0, updated.btc - swapAmount);

      if (swapToSymbol === 'PQC') updated.pqc += estimatedReceiveAmount;
      if (swapToSymbol === 'ETH') updated.eth += estimatedReceiveAmount;
      if (swapToSymbol === 'BTC') updated.btc += estimatedReceiveAmount;

      return updated;
    });

    alert(`Successfully swapped ${swapAmount} ${swapFromSymbol} for ${estimatedReceiveAmount.toFixed(4)} ${swapToSymbol} on ${selectedVenue}! (${pqcProtectionEnabled ? 'PQC Protected with ML-DSA-65' : 'Standard ECDSA'})`);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* TOP HERO BRANDING HEADER */}
      <div className="bg-[#111111] border-2 border-amber-400 p-6 sm:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(251,191,36,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-amber-400 text-black font-black shrink-0">
              <Coins className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest">
                  GLOBAL CRYPTO EXCHANGE & INTELLIGENCE CENTER
                </span>
                <span className="text-[10px] text-amber-300/80 uppercase font-bold">
                  BINANCE • UNISWAP • MESSARI • COINGECKO • COINMARKETCAP
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                CRYPTO CURRENCIES, EXCHANGES & RESEARCH ENGINE
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
                Full-spectrum cryptocurrency aggregator, CEX/DEX spot & order book analytics, Messari institutional research, real-time industry news feed, instant PQC-secured token swapping, and audit transactional ledger.
              </p>
            </div>
          </div>

          {/* User Portfolio Snapshot */}
          <div className="bg-[#050505] p-4 border border-amber-400/50 space-y-2 text-right shrink-0 min-w-[220px]">
            <span className="text-[10px] text-amber-400 uppercase font-bold block">TOTAL PORTFOLIO BALANCE</span>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              ${(portfolio.usd + portfolio.btc * 94250 + portfolio.eth * 3480 + portfolio.pqc * 14.85 + portfolio.sol * 215.8).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex justify-end gap-2 text-[10px] text-slate-400">
              <span>{portfolio.btc.toFixed(2)} BTC</span>
              <span>•</span>
              <span>{portfolio.eth.toFixed(1)} ETH</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">{portfolio.pqc.toFixed(0)} PQC</span>
            </div>
          </div>
        </div>

        {/* Global Market Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-amber-400/30 text-[11px]">
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">TOTAL CRYPTO MARKET CAP</span>
            <span className="text-white font-bold text-sm">$3.42 TRILLION</span>
            <span className="text-emerald-400 text-[10px] block font-bold">+3.2% 24h</span>
          </div>
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">24H VOLUME (GLOBAL)</span>
            <span className="text-white font-bold text-sm">$148.5 BILLION</span>
            <span className="text-cyan-400 text-[10px] block font-bold">CEX 68% / DEX 32%</span>
          </div>
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">BITCOIN DOMINANCE</span>
            <span className="text-amber-400 font-bold text-sm">54.1%</span>
            <span className="text-white/60 text-[10px] block">ETH 12.3%</span>
          </div>
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">FEAR & GREED INDEX</span>
            <span className="text-emerald-400 font-bold text-sm">82 (EXTREME GREED)</span>
            <span className="text-white/60 text-[10px] block">Institutional Inflow</span>
          </div>
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">MESSARI PQC SCORE</span>
            <span className="text-cyan-400 font-bold text-sm">94.8 / 100</span>
            <span className="text-emerald-400 text-[10px] block font-bold">NIST Compliant</span>
          </div>
          <div className="bg-[#050505] p-2.5 border border-white/10">
            <span className="text-white/50 block text-[9px] uppercase font-bold">PQC PROTECTED VAULTS</span>
            <span className="text-emerald-400 font-bold text-sm">1,420 VAULTS</span>
            <span className="text-white/60 text-[10px] block">ML-KEM-768 Enforced</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'market', label: '1 // MARKET AGGREGATOR (GECKO/CMC)', icon: BarChart3 },
          { id: 'cex-dex', label: '2 // EXCHANGES & ORDER BOOK (BINANCE/UNISWAP)', icon: Building2 },
          { id: 'swap', label: '3 // INSTANT PQC SWAP & TRADING', icon: Repeat },
          { id: 'research', label: '4 // MESSARI RESEARCH & INTEL', icon: BookOpen },
          { id: 'news', label: '5 // LIVE CRYPTO NEWS FEED', icon: Newspaper },
          { id: 'ledger', label: '6 // TRANSACTIONAL LEDGER & AUDIT', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border transition-all cursor-pointer font-bold ${
                isActive
                  ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-[#111111] text-white/70 border-white/10 hover:border-white/40 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MARKET AGGREGATOR */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#111111] border border-white/10 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bitcoin, Ethereum, Solana, PQC..."
                className="w-full bg-[#050505] border border-white/20 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {['ALL', 'Layer 1', 'DeFi', 'Layer 2', 'RWA', 'PQC Safe'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 border uppercase text-[10px] font-bold cursor-pointer transition-colors ${
                    categoryFilter === cat
                      ? 'bg-amber-400 text-black border-amber-400'
                      : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Crypto Asset Table */}
          <div className="bg-[#111111] border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#050505] border-b border-white/10 text-[10px] text-white/50 uppercase font-bold">
                  <th className="p-4"># ASSET</th>
                  <th className="p-4 text-right">PRICE (USD)</th>
                  <th className="p-4 text-right">24H CHANGE</th>
                  <th className="p-4 text-right">MARKET CAP</th>
                  <th className="p-4 text-right">24H VOLUME</th>
                  <th className="p-4 text-center">QUANTUM THREAT TIER</th>
                  <th className="p-4 text-center">MESSARI AUDIT</th>
                  <th className="p-4 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAssets.map((asset, idx) => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-white/40 font-bold w-5">{idx + 1}</span>
                      <div className="w-8 h-8 bg-amber-400/10 border border-amber-400/40 rounded-full flex items-center justify-center font-black text-amber-400">
                        {asset.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <span className="font-bold text-white block text-sm">{asset.name}</span>
                        <span className="text-[10px] text-white/50 uppercase">{asset.symbol} • {asset.category}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right font-bold text-white text-sm">
                      ${asset.priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-4 text-right font-bold text-xs">
                      <span className={`inline-flex items-center gap-1 ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {asset.change24h >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {asset.change24h > 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
                      </span>
                    </td>

                    <td className="p-4 text-right text-slate-300 font-mono">
                      ${(asset.marketCap / 1e9).toFixed(2)}B
                    </td>

                    <td className="p-4 text-right text-slate-300 font-mono">
                      ${(asset.volume24h / 1e6).toFixed(1)}M
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[9px] font-bold uppercase border inline-flex items-center gap-1 ${
                        asset.quantumRisk.includes('SAFE') 
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500' 
                          : asset.quantumRisk.includes('MIGRATING') 
                          ? 'bg-amber-950/80 text-amber-400 border-amber-500' 
                          : 'bg-red-950/80 text-red-400 border-red-500'
                      }`}>
                        {asset.quantumRisk.includes('SAFE') ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {asset.quantumRisk}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 bg-black border border-amber-400/50 text-amber-300 font-black text-[10px]">
                        RATING: {asset.messariRating}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSwapToSymbol(asset.symbol);
                          setActiveTab('swap');
                        }}
                        className="px-3 py-1.5 bg-amber-400 hover:bg-white text-black font-black uppercase text-[10px] cursor-pointer transition-colors"
                      >
                        SWAP / TRADE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CEX & DEX ORDER BOOK ENGINE */}
      {activeTab === 'cex-dex' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* BINANCE CEX SPOT ORDER BOOK (7 cols) */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">BINANCE CEX SPOT ORDER BOOK</h3>
                  <span className="text-[10px] text-white/50">PAIR: {selectedAsset.symbol}/USDT • LIVE STREAMING DEPTH</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold text-[10px]">
                MATCHING ENGINE ACTIVE
              </span>
            </div>

            {/* Asks (Sell Orders - Red) */}
            <div className="space-y-1 font-mono text-[11px]">
              <div className="grid grid-cols-3 text-white/40 font-bold border-b border-white/10 pb-1 text-[10px]">
                <span>PRICE (USDT)</span>
                <span className="text-right">SIZE ({selectedAsset.symbol})</span>
                <span className="text-right">TOTAL (USDT)</span>
              </div>

              {[
                { price: selectedAsset.priceUsd * 1.002, size: 1.84, total: selectedAsset.priceUsd * 1.84 * 1.002 },
                { price: selectedAsset.priceUsd * 1.0015, size: 4.12, total: selectedAsset.priceUsd * 4.12 * 1.0015 },
                { price: selectedAsset.priceUsd * 1.001, size: 2.35, total: selectedAsset.priceUsd * 2.35 * 1.001 },
                { price: selectedAsset.priceUsd * 1.0005, size: 0.95, total: selectedAsset.priceUsd * 0.95 * 1.0005 }
              ].map((ask, i) => (
                <div key={i} className="grid grid-cols-3 text-red-400 hover:bg-red-950/20 p-1">
                  <span className="font-bold">${ask.price.toFixed(2)}</span>
                  <span className="text-right text-slate-300">{ask.size.toFixed(2)}</span>
                  <span className="text-right text-white/60">${ask.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Current Price Banner */}
            <div className="p-3 bg-[#050505] border-y border-amber-400/40 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white/50 block font-bold">LAST MATCHED PRICE</span>
                <span className="text-xl font-black text-amber-400">${selectedAsset.priceUsd.toFixed(2)} USDT</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 block font-bold">24H HIGH / LOW</span>
                <span className="text-xs font-bold text-white">
                  ${(selectedAsset.priceUsd * 1.04).toFixed(2)} / ${(selectedAsset.priceUsd * 0.96).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bids (Buy Orders - Green) */}
            <div className="space-y-1 font-mono text-[11px]">
              {[
                { price: selectedAsset.priceUsd * 0.9995, size: 3.40, total: selectedAsset.priceUsd * 3.40 * 0.9995 },
                { price: selectedAsset.priceUsd * 0.999, size: 6.80, total: selectedAsset.priceUsd * 6.80 * 0.999 },
                { price: selectedAsset.priceUsd * 0.9985, size: 12.15, total: selectedAsset.priceUsd * 12.15 * 0.9985 },
                { price: selectedAsset.priceUsd * 0.998, size: 8.50, total: selectedAsset.priceUsd * 8.50 * 0.998 }
              ].map((bid, i) => (
                <div key={i} className="grid grid-cols-3 text-emerald-400 hover:bg-emerald-950/20 p-1">
                  <span className="font-bold">${bid.price.toFixed(2)}</span>
                  <span className="text-right text-slate-300">{bid.size.toFixed(2)}</span>
                  <span className="text-right text-white/60">${bid.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* UNISWAP V3 DEX AMM LIQUIDITY ROUTER (5 cols) */}
          <div className="lg:col-span-5 bg-[#111111] border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">UNISWAP V3 DEX AMM ROUTER</h3>
                  <span className="text-[10px] text-white/50">DECENTRALIZED ATOMIC SWAP HOOKS</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-[#050505] border border-white/10 space-y-2">
                <span className="text-[10px] text-white/50 block font-bold">TOTAL VALUE LOCKED (TVL)</span>
                <span className="text-lg font-black text-cyan-400">$6.42 BILLION</span>
                <span className="text-[10px] text-slate-400 block">0.05% Fee Tier • Concentrated Liquidity</span>
              </div>

              <div className="p-3 bg-[#050505] border border-white/10 space-y-2">
                <span className="text-[10px] text-white/50 block font-bold">MEV & QUANTUM PROTECTION</span>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs">PQC ML-DSA Signature Hooks</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-300 font-sans">
                  Protects transactions against sandwich attacks and future quantum decryption vectors using lattice signature batching.
                </p>
              </div>

              <div className="p-3 bg-[#050505] border border-white/10 space-y-2">
                <span className="text-[10px] text-white/50 block font-bold">OPTIMAL ROUTING PATH</span>
                <div className="text-xs text-amber-300 font-mono font-bold flex items-center gap-2">
                  <span>{swapFromSymbol}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                  <span>Uniswap v3 (0.05%)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/40" />
                  <span>{swapToSymbol}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('swap')}
                className="w-full py-3 bg-amber-400 hover:bg-white text-black font-black uppercase text-xs tracking-wider cursor-pointer transition-colors"
              >
                OPEN DEX SWAP TERMINAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INSTANT PQC TOKEN SWAP & TRADING */}
      {activeTab === 'swap' && (
        <div className="max-w-2xl mx-auto bg-[#111111] border-2 border-amber-400 p-6 sm:p-8 space-y-6 shadow-[0_0_25px_rgba(251,191,36,0.2)] font-mono">
          <div className="flex items-center justify-between border-b border-amber-400/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-400 text-black font-black">
                <Repeat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase">INSTANT PQC TOKEN SWAP</h3>
                <span className="text-[10px] text-amber-300">CROSS-CHAIN & DEX ATOMIC ROUTING</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/50 block font-bold">EXECUTION VENUE</span>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value as any)}
                className="bg-[#050505] border border-amber-400/50 text-amber-300 text-xs font-bold p-1 focus:outline-none"
              >
                <option>Uniswap v3 (DEX)</option>
                <option>Binance (CEX)</option>
                <option>Coinbase Prime</option>
                <option>Curve PQC Pool</option>
              </select>
            </div>
          </div>

          {/* SWAP FROM INPUT */}
          <div className="bg-[#050505] p-4 border border-white/20 space-y-2">
            <div className="flex justify-between text-[10px] text-white/60 font-bold">
              <span>YOU PAY / SELL</span>
              <span>AVAILABLE BALANCE: {swapFromSymbol === 'ETH' ? portfolio.eth.toFixed(2) : swapFromSymbol === 'BTC' ? portfolio.btc.toFixed(2) : portfolio.usd.toFixed(2)} {swapFromSymbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(Math.max(0.001, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent text-2xl font-black text-white focus:outline-none"
              />
              <select
                value={swapFromSymbol}
                onChange={(e) => setSwapFromSymbol(e.target.value)}
                className="bg-[#111111] border border-amber-400 text-amber-400 font-black text-sm p-2 focus:outline-none"
              >
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="SOL">SOL</option>
                <option value="USD">USD</option>
                <option value="PQC">PQC</option>
              </select>
            </div>
            <span className="text-[10px] text-white/40 block">≈ ${(swapAmount * fromPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
          </div>

          {/* SWAP DIRECTION TOGGLE */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={() => {
                const temp = swapFromSymbol;
                setSwapFromSymbol(swapToSymbol);
                setSwapToSymbol(temp);
              }}
              className="p-3 bg-amber-400 hover:bg-white text-black font-black border-2 border-black rounded-full cursor-pointer transition-transform hover:scale-110"
            >
              <Repeat className="w-5 h-5" />
            </button>
          </div>

          {/* SWAP TO INPUT */}
          <div className="bg-[#050505] p-4 border border-white/20 space-y-2">
            <div className="flex justify-between text-[10px] text-white/60 font-bold">
              <span>YOU RECEIVE (ESTIMATED)</span>
              <span>ESTIMATED RATE: 1 {swapFromSymbol} = {(fromPrice / toPrice).toFixed(4)} {swapToSymbol}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={estimatedReceiveAmount.toFixed(4)}
                className="w-full bg-transparent text-2xl font-black text-emerald-400 focus:outline-none"
              />
              <select
                value={swapToSymbol}
                onChange={(e) => setSwapToSymbol(e.target.value)}
                className="bg-[#111111] border border-amber-400 text-amber-400 font-black text-sm p-2 focus:outline-none"
              >
                <option value="PQC">PQC</option>
                <option value="ETH">ETH</option>
                <option value="BTC">BTC</option>
                <option value="SOL">SOL</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <span className="text-[10px] text-white/40 block">≈ ${(estimatedReceiveAmount * toPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
          </div>

          {/* PQC PROTECTION ENFORCEMENT TOGGLE */}
          <div className="p-4 bg-[#050505] border border-emerald-500/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-bold text-xs block">ML-DSA-65 LATTICE SIGNATURE PROTECTION</span>
                <span className="text-[10px] text-white/60">Guarantees quantum resistance for swap transaction signature</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={pqcProtectionEnabled}
              onChange={(e) => setPqcProtectionEnabled(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleExecuteSwap}
            className="w-full py-4 bg-amber-400 hover:bg-white text-black font-black text-sm uppercase tracking-widest cursor-pointer transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)]"
          >
            CONFIRM & EXECUTE PQC TOKEN SWAP
          </button>
        </div>
      )}

      {/* TAB 4: MESSARI INSTITUTIONAL RESEARCH & INTELLIGENCE */}
      {activeTab === 'research' && (
        <div className="space-y-6 font-mono">
          <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-xl font-black text-white uppercase">MESSARI INSTITUTIONAL CRYPTO RESEARCH</h3>
                <span className="text-[10px] text-white/50">DEEP-DIVE TOKENOMICS • PROTOCOL AUDITS • PQC ROADMAPS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Post-Quantum Ethereum: EIP-7503 & Account Abstraction Migration',
                  author: 'Messari Senior Analyst Team',
                  date: 'JULY 2026 REPORT',
                  rating: 'AAA RATING',
                  summary: 'Comprehensive analysis on how ERC-4337 and account abstraction allow smart contract wallets to upgrade to ML-KEM and Dilithium signatures without breaking layer-1 consensus.'
                },
                {
                  title: 'Store-Now-Decrypt-Later (SNDL) Exposure Across Top 20 CEX Cold Vaults',
                  author: 'Binance Research & PQC Security Lab',
                  date: 'JUNE 2026 REPORT',
                  rating: 'AA RATING',
                  summary: 'Audit of $420B in centralized crypto exchange cold storage vaults. Recommends immediate transition to FIPS 203 ML-KEM-768 hybrid key encapsulates.'
                },
                {
                  title: 'Decentralized Exchanges & AMMs: MEV Prevention via Lattice Encryption Hooks',
                  author: 'CoinGecko Institutional Research',
                  date: 'JULY 2026 REPORT',
                  rating: 'AAA RATING',
                  summary: 'Explores how lattice-based homomorphic commitment schemes eliminate front-running and sandwich attacks on Uniswap v4 pools.'
                }
              ].map((report, i) => (
                <div key={i} className="p-5 bg-[#050505] border border-white/20 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="px-2 py-0.5 bg-amber-400 text-black font-black uppercase">{report.rating}</span>
                      <span className="text-white/40 font-bold">{report.date}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm leading-snug">{report.title}</h4>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{report.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px]">
                    <span className="text-white/50">{report.author}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                      READ REPORT <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LIVE CRYPTO NEWS FEED */}
      {activeTab === 'news' && (
        <div className="space-y-4 font-mono">
          <div className="bg-[#111111] border border-white/10 p-4 flex justify-between items-center">
            <span className="font-bold text-white uppercase text-sm flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-400" />
              <span>REAL-TIME CRYPTO INDUSTRY NEWS TICKER</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              LIVE STREAMING
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_NEWS.map(news => (
              <div key={news.id} className="p-5 bg-[#111111] border border-white/10 hover:border-amber-400/50 transition-all space-y-2">
                <div className="flex flex-wrap justify-between items-center text-[10px] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400 text-amber-300 font-bold uppercase">
                      {news.source}
                    </span>
                    <span className="px-2 py-0.5 bg-white/10 text-white/70 uppercase">
                      {news.category}
                    </span>
                  </div>
                  <span className="text-white/40 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.timestamp}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white hover:text-amber-300 cursor-pointer">{news.title}</h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{news.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TRANSACTIONAL LEDGER & AUDIT */}
      {activeTab === 'ledger' && (
        <div className="space-y-6 font-mono">
          <div className="bg-[#111111] border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm uppercase">TRANSACTIONAL LEDGER & PQC AUDIT LOGS</h3>
                  <span className="text-[10px] text-white/50">IMMUTABLE CRYPTOGRAPHIC ORDER RECORDS</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-bold">TOTAL TRANSACTIONS: {tradeHistory.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#050505] border-b border-white/10 text-[10px] text-white/50 uppercase font-bold">
                    <th className="p-3">TX ID & TIME</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">PAIR / ASSET</th>
                    <th className="p-3 text-right">AMOUNT</th>
                    <th className="p-3 text-right">TOTAL (USD)</th>
                    <th className="p-3">VENUE / EXCHANGE</th>
                    <th className="p-3 text-center">PQC SIGNATURE AUDIT</th>
                    <th className="p-3">TRANSACTION HASH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {tradeHistory.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5">
                      <td className="p-3">
                        <span className="font-bold text-white block">{tx.id}</span>
                        <span className="text-[10px] text-white/40">{tx.timestamp}</span>
                      </td>

                      <td className="p-3 font-bold">
                        <span className={`px-2 py-0.5 text-[9px] uppercase ${
                          tx.type === 'SWAP' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500' : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        }`}>
                          {tx.type}
                        </span>
                      </td>

                      <td className="p-3 font-bold text-white">
                        {tx.assetSymbol} {tx.targetSymbol ? `➔ ${tx.targetSymbol}` : ''}
                      </td>

                      <td className="p-3 text-right font-bold text-slate-200">
                        {tx.amount} {tx.assetSymbol}
                      </td>

                      <td className="p-3 text-right font-bold text-amber-400">
                        ${tx.totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="p-3 text-slate-300">
                        {tx.exchange}
                      </td>

                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase border inline-flex items-center gap-1 ${
                          tx.pqcSignatureStatus.includes('ML-DSA') || tx.pqcSignatureStatus.includes('VERIFIED')
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500'
                            : 'bg-red-950 text-red-400 border-red-500'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {tx.pqcSignatureStatus}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-[10px] text-white/50">
                        {tx.txHash.substring(0, 10)}...{tx.txHash.substring(34)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
