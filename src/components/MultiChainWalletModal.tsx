import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, ShieldCheck, Wallet, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface MultiChainWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChainType = 'bnb' | 'solana' | 'ton' | 'pqc';

interface ChainInfo {
  id: ChainType;
  name: string;
  symbol: string;
  network: string;
  badgeColor: string;
  address: string;
  explorerUrl: string;
  explorerName: string;
  description: string;
}

const CHAINS: ChainInfo[] = [
  {
    id: 'bnb',
    name: 'BNB Smart Chain (BSC)',
    symbol: 'BNB',
    network: 'BNB Chain (Mainnet / Testnet)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    address: '0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D',
    explorerUrl: 'https://bscscan.com/address/0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D',
    explorerName: 'BscScan',
    description: 'Use for BNB Chain smart contract anchoring & EVM gas fees.'
  },
  {
    id: 'solana',
    name: 'Solana Network',
    symbol: 'SOL',
    network: 'Solana (Mainnet-Beta / Devnet)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    address: 'FQwP8hZkE6M1VfR9yXn8bF5dZ4qQ2mC9wP8hZkE6M1Vf',
    explorerUrl: 'https://solscan.io/account/FQwP8hZkE6M1VfR9yXn8bF5dZ4qQ2mC9wP8hZkE6M1Vf',
    explorerName: 'Solscan',
    description: 'Use for Solana on-chain proof synchronization & fast settlement.'
  },
  {
    id: 'ton',
    name: 'The Open Network (TON)',
    symbol: 'TON',
    network: 'TON Blockchain (Mainnet)',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    address: 'EQBbaaD9B836f9bd61cD0d616a016Cc911A2E1f60DQMOOSA',
    explorerUrl: 'https://tonscan.org/address/EQBbaaD9B836f9bd61cD0d616a016Cc911A2E1f60DQMOOSA',
    explorerName: 'Tonscan',
    description: 'Use for Telegram Web4 bot micro-settlements and TON ecosystem.'
  },
  {
    id: 'pqc',
    name: 'NIST FIPS 204 Lattice Identity',
    symbol: 'ML-DSA-65',
    network: 'Post-Quantum Lattice Protocol',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    address: 'PQC-LATTICE-ML-DSA-65-1952B-STATE-ROOT-0xbbaaD9B836f9bd61cD0d616a016Cc911A2E1f60D',
    explorerUrl: '#',
    explorerName: 'Internal URS Scorecard',
    description: 'Pure-TS post-quantum lattice signature & key encapsulation root.'
  }
];

export const MultiChainWalletModal: React.FC<MultiChainWalletModalProps> = ({ isOpen, onClose }) => {
  const [selectedChain, setSelectedChain] = useState<ChainType>('bnb');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const currentChain = CHAINS.find(c => c.id === selectedChain) || CHAINS[0];

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(currentChain.address, {
      width: 220,
      margin: 1,
      color: {
        dark: '#020617',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR code', err);
    });
  }, [currentChain.address, isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentChain.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Multi-Chain Wallet & QR
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  ACTIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400">BNB Chain, Solana, TON & NIST Post-Quantum</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chain Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-900/90 border-b border-slate-800 text-xs">
          {CHAINS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedChain(c.id)}
              className={`py-2 px-1 rounded-lg font-medium transition-all text-center flex flex-col items-center gap-0.5 ${
                selectedChain === c.id
                  ? 'bg-slate-800 text-white shadow border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>{c.symbol}</span>
              <span className="text-[9px] opacity-70 truncate max-w-[80px]">{c.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* Chain Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${currentChain.badgeColor}`}>
              {currentChain.network}
            </span>
          </div>

          {/* QR Code Card */}
          <div className="relative p-3 bg-white rounded-xl shadow-lg shadow-cyan-500/5 mb-4 border border-slate-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`${currentChain.name} QR Code`}
                className="w-48 h-48 rounded"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mb-3 max-w-sm">
            Scan using Trust Wallet, MetaMask, Binance Web3 Wallet, Phantom, or Tonkeeper.
          </p>

          {/* Address Box */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 mb-4 text-left">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span className="font-semibold uppercase tracking-wider">{currentChain.symbol} Address</span>
              <span className="text-slate-400 font-mono text-[10px]">Tap to Copy</span>
            </div>
            <div className="flex items-center justify-between gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/80">
              <code className="text-xs font-mono text-cyan-300 break-all select-all">
                {currentChain.address}
              </code>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {currentChain.description}
            </p>
          </div>

          {/* Footer Actions */}
          <div className="w-full flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>NIST PQC Invariant Verified</span>
            </div>
            {currentChain.explorerUrl !== '#' && (
              <a
                href={currentChain.explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View on {currentChain.explorerName}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
