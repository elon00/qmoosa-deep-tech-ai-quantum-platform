import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  ShieldCheck, 
  History, 
  RefreshCw, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  LockKeyhole,
  Building2,
  Receipt
} from 'lucide-react';
import { PaymentTransaction, LogEntry } from '../types';
import { bytesToHex } from '../lib/pqcCrypto';
import { savePaymentTransactionToFirestore, fetchPaymentTransactionsFromFirestore } from '../lib/firebase';

interface PaymentGatewayProps {
  onAddLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onAddLog }) => {
  const [balanceUSD, setBalanceUSD] = useState<number>(10000);
  const [balanceETH, setBalanceETH] = useState<number>(2.5);
  const [balancePQC, setBalancePQC] = useState<number>(5000);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'grant' | 'history'>('send');

  // Form states
  const [recipient, setRecipient] = useState<string>('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [amount, setAmount] = useState<string>('250');
  const [currency, setCurrency] = useState<'USD' | 'ETH' | 'PQC_TOKEN'>('USD');
  const [memo, setMemo] = useState<string>('QuantumShield Security Operations');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load transactions from Firestore or set defaults
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const fetched = await fetchPaymentTransactionsFromFirestore(25);
      if (fetched && fetched.length > 0) {
        setTransactions(fetched.map((t: any) => ({
          id: t.id || `tx_${Math.random().toString(36).substring(2, 9)}`,
          type: t.type || 'transfer',
          amount: t.amount || 0,
          currency: t.currency || 'USD',
          status: t.status || 'completed',
          sender: t.sender || 'System',
          recipient: t.recipient || 'Auditor',
          timestamp: t.timestamp || t.createdAt || new Date().toLocaleString(),
          memo: t.memo,
          pqcSignatureHex: t.pqcSignatureHex
        })));
      } else {
        // Default initial demo transactions
        const initialTxs: PaymentTransaction[] = [
          {
            id: 'tx_pqc_init_001',
            type: 'grant',
            amount: 10000,
            currency: 'USD',
            status: 'completed',
            sender: 'NIST PQC Migration Fund',
            recipient: 'QuantumShield Vault',
            timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString(),
            memo: 'Initial Post-Quantum Reserve Deposit',
            pqcSignatureHex: 'MLKEM768_SIG_8a92b3c4f5e67d89a1b2c3d4e5f6a7b8c9d0e1f2'
          },
          {
            id: 'tx_pqc_init_002',
            type: 'deposit',
            amount: 5000,
            currency: 'PQC_TOKEN',
            status: 'completed',
            sender: 'PQC Liquidity Protocol',
            recipient: 'QuantumShield Vault',
            timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString(),
            memo: 'Staked ML-KEM Security Tokens',
            pqcSignatureHex: 'MLKEM768_SIG_1f2e3d4c5b6a79887766554433221100'
          }
        ];
        setTransactions(initialTxs);
      }
    } catch (err) {
      console.warn("Failed loading transactions, using local state:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const generatePqcSignature = (): string => {
    const raw = new Uint8Array(32);
    crypto.getRandomValues(raw);
    return `ML-KEM-768_SIG_${bytesToHex(raw)}`;
  };

  const handleSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid transfer amount.' });
      return;
    }

    if (currency === 'USD' && numAmount > balanceUSD) {
      setStatusMsg({ type: 'error', text: 'Insufficient USD balance in Quantum Vault.' });
      return;
    }
    if (currency === 'ETH' && numAmount > balanceETH) {
      setStatusMsg({ type: 'error', text: 'Insufficient ETH balance in Quantum Vault.' });
      return;
    }
    if (currency === 'PQC_TOKEN' && numAmount > balancePQC) {
      setStatusMsg({ type: 'error', text: 'Insufficient PQC Token balance in Quantum Vault.' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: 'Signing payment mandate with ML-KEM-768 post-quantum key...' });

    setTimeout(async () => {
      try {
        const sigHex = generatePqcSignature();
        const newTx: PaymentTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          type: 'transfer',
          amount: numAmount,
          currency,
          status: 'completed',
          sender: 'QuantumShield Vault (0x3A07)',
          recipient: recipient || '0xRecipientAddress',
          timestamp: new Date().toLocaleTimeString(),
          memo: memo || 'Quantum-Secured Transfer',
          pqcSignatureHex: sigHex
        };

        // Deduct balance
        if (currency === 'USD') setBalanceUSD(prev => prev - numAmount);
        if (currency === 'ETH') setBalanceETH(prev => prev - numAmount);
        if (currency === 'PQC_TOKEN') setBalancePQC(prev => prev - numAmount);

        setTransactions(prev => [newTx, ...prev]);

        // Save to Firestore
        await savePaymentTransactionToFirestore(newTx);

        onAddLog({
          source: 'system',
          message: `PQC Signed Payment Sent: ${numAmount} ${currency} to ${recipient.substring(0, 8)}...`,
          type: 'success',
          data: { txId: newTx.id, sigHex }
        });

        setStatusMsg({ 
          type: 'success', 
          text: `Payment of ${numAmount} ${currency} successfully authorized and broadcast with NIST ML-KEM-768 signature!` 
        });

        setAmount('100');
        setMemo('PQC Verified Transaction');
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: 'Transaction signing failed: ' + (err?.message || err) });
      } finally {
        setIsProcessing(false);
      }
    }, 1200);
  };

  const handleClaimGrant = async () => {
    setIsProcessing(true);
    setStatusMsg({ type: 'info', text: 'Claiming NIST PQC Post-Quantum Infrastructure Grant ($2,500)...' });

    setTimeout(async () => {
      try {
        const grantAmount = 2500;
        const sigHex = generatePqcSignature();
        const grantTx: PaymentTransaction = {
          id: `grant_${Date.now()}`,
          type: 'grant',
          amount: grantAmount,
          currency: 'USD',
          status: 'completed',
          sender: 'NIST PQC Migration Reserve',
          recipient: 'QuantumShield Vault (0x3A07)',
          timestamp: new Date().toLocaleTimeString(),
          memo: 'Post-Quantum Migration Ecosystem Incentive',
          pqcSignatureHex: sigHex
        };

        setBalanceUSD(prev => prev + grantAmount);
        setTransactions(prev => [grantTx, ...prev]);

        await savePaymentTransactionToFirestore(grantTx);

        onAddLog({
          source: 'system',
          message: `Claimed $2,500 PQC Migration Grant from NIST Reserve`,
          type: 'success'
        });

        setStatusMsg({ type: 'success', text: 'Received $2,500 USD PQC Infrastructure Grant into your Vault!' });
      } catch (err: any) {
        setStatusMsg({ type: 'error', text: 'Grant claim failed.' });
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#111111] border-2 border-white/20 p-6 sm:p-8 space-y-4 shadow-[0_0_25px_rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF41]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#00FF41] font-mono text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>POST-QUANTUM PAYMENT GATEWAY (ML-KEM-768 SIGNED)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              FINANCIAL TRANSACTIONS & VAULT RESERVES
            </h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-2xl mt-1">
              Send, receive, and audit cross-chain cryptocurrency and fiat transfers protected against Shor's algorithm via hybrid ML-KEM-768 key encapsulates and AES-256-GCM encryption.
            </p>
          </div>

          <button
            onClick={loadTransactions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#050505] border border-white/20 hover:border-white text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC VAULT LEDGER</span>
          </button>
        </div>

        {/* Balance Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 bg-[#050505] border border-white/15 space-y-1">
            <div className="flex items-center justify-between text-white/50 font-mono text-[10px] uppercase tracking-widest">
              <span>FIAT RESERVES</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[#00FF41] font-mono flex items-center gap-1">
              <LockKeyhole className="w-3 h-3" />
              <span>FDIC + PQC Vault Insured</span>
            </div>
          </div>

          <div className="p-4 bg-[#050505] border border-white/15 space-y-1">
            <div className="flex items-center justify-between text-white/50 font-mono text-[10px] uppercase tracking-widest">
              <span>ETHEREUM (ETH)</span>
              <Coins className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {balanceETH.toFixed(4)} ETH
            </div>
            <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>~${(balanceETH * 3200).toLocaleString()} USD</span>
            </div>
          </div>

          <div className="p-4 bg-[#050505] border border-white/15 space-y-1">
            <div className="flex items-center justify-between text-white/50 font-mono text-[10px] uppercase tracking-widest">
              <span>PQC TOKEN RESERVES</span>
              <ShieldCheck className="w-4 h-4 text-[#FF003C]" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {balancePQC.toLocaleString()} PQC
            </div>
            <div className="text-[10px] text-[#FF003C] font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>NIST Standard Utility Token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Operations Tabs & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Actions Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#111111] border border-white/20 p-6 space-y-6">
            {/* Tab Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#050505] border border-white/10 font-mono text-xs font-bold">
              <button
                onClick={() => { setActiveTab('send'); setStatusMsg(null); }}
                className={`py-2.5 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'send' ? 'bg-[#FF003C] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>SEND</span>
              </button>
              <button
                onClick={() => { setActiveTab('receive'); setStatusMsg(null); }}
                className={`py-2.5 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'receive' ? 'bg-[#FF003C] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>RECEIVE</span>
              </button>
              <button
                onClick={() => { setActiveTab('grant'); setStatusMsg(null); }}
                className={`py-2.5 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === 'grant' ? 'bg-[#FF003C] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>GRANT</span>
              </button>
            </div>

            {/* Notification Bar */}
            {statusMsg && (
              <div className={`p-3 border font-mono text-xs flex items-center gap-2 ${
                statusMsg.type === 'success' ? 'bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41]' :
                statusMsg.type === 'error' ? 'bg-[#FF003C]/10 border-[#FF003C] text-[#FF003C]' :
                'bg-cyan-500/10 border-cyan-500 text-cyan-400'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {/* TAB 1: SEND PAYMENTS */}
            {activeTab === 'send' && (
              <form onSubmit={handleSendPayment} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="block text-white/60 uppercase tracking-widest text-[10px]">
                    SELECT CURRENCY / ASSET
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['USD', 'ETH', 'PQC_TOKEN'] as const).map((curr) => (
                      <button
                        type="button"
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`py-2 border font-bold uppercase transition-colors cursor-pointer ${
                          currency === curr ? 'bg-white text-black border-white' : 'bg-[#050505] text-white/60 border-white/20 hover:border-white/50'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-white/60 uppercase tracking-widest text-[10px]">
                    RECIPIENT ADDRESS / VAULT ID
                  </label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x... or Vault ID"
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#00FF41] focus:outline-none p-2.5 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-white/60 uppercase tracking-widest text-[10px]">
                    TRANSFER AMOUNT ({currency})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#00FF41] focus:outline-none p-2.5 text-white font-mono text-base font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-white/60 uppercase tracking-widest text-[10px]">
                    TRANSACTION MEMO / NOTE
                  </label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="E.g. Security Audit Payment"
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#00FF41] focus:outline-none p-2.5 text-white font-mono"
                  />
                </div>

                <div className="p-3 bg-[#050505] border border-white/10 space-y-1 text-[10px] text-white/50">
                  <div className="flex justify-between">
                    <span>SIGNATURE ALGORITHM:</span>
                    <span className="text-[#00FF41] font-bold">NIST FIPS 203 ML-KEM-768</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SECURITY STATUS:</span>
                    <span className="text-cyan-400 font-bold">SHOR-RESISTANT (QUANTUM SAFE)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#00FF41] hover:bg-white text-black font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>{isProcessing ? 'AUTHORIZING & SIGNING...' : 'SEND QUANTUM-SIGNED PAYMENT'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: RECEIVE PAYMENTS */}
            {activeTab === 'receive' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-[#050505] border border-[#00FF41]/40 space-y-3 text-center">
                  <div className="mx-auto w-12 h-12 bg-[#00FF41]/10 border border-[#00FF41] flex items-center justify-center text-[#00FF41]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">YOUR PQC VAULT DEPOSIT ADDRESS</h4>
                  <p className="text-white/60 text-[11px]">
                    Share this post-quantum signed vault public key to receive USD, ETH, or PQC tokens directly into your encrypted account.
                  </p>

                  <div className="p-3 bg-black border border-white/20 font-mono text-white/90 break-all text-[11px] select-all">
                    0x3A072C536F4841139EE8552B3DE14B0B_PQC_VAULT
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('0x3A072C536F4841139EE8552B3DE14B0B_PQC_VAULT');
                      setStatusMsg({ type: 'success', text: 'PQC Vault Deposit address copied to clipboard!' });
                    }}
                    className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider hover:bg-[#00FF41] transition-colors cursor-pointer text-xs"
                  >
                    COPY RECEIVE ADDRESS
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CLAIM GRANT */}
            {activeTab === 'grant' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 bg-[#050505] border border-cyan-500/40 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider">
                    <PlusCircle className="w-5 h-5" />
                    <span>NIST PQC ECOSYSTEM FUND GRANT</span>
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    Test your post-quantum migration setup by claiming a instant $2,500 USD test grant from the NIST PQC Migration Incentive Pool. Funds are deposited straight to your encrypted vault balance.
                  </p>

                  <button
                    onClick={handleClaimGrant}
                    disabled={isProcessing}
                    className="w-full py-3 bg-cyan-400 hover:bg-white text-black font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isProcessing ? 'DISPATCHING GRANT...' : 'CLAIM $2,500 USD PQC GRANT'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Transaction History Ledger */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#111111] border border-white/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-mono text-sm font-bold uppercase tracking-wider">
                <History className="w-4 h-4 text-[#00FF41]" />
                <span>POST-QUANTUM TRANSACTION LEDGER</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                {transactions.length} RECORDS
              </span>
            </div>

            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-white/40 font-mono text-xs border border-white/10">
                  NO TRANSACTIONS RECORDED YET.
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-3.5 bg-[#050505] border border-white/10 hover:border-white/30 transition-colors space-y-2 font-mono text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {tx.type === 'grant' || tx.type === 'deposit' ? (
                          <div className="p-1.5 bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1.5 bg-[#FF003C]/20 text-[#FF003C] border border-[#FF003C]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-white uppercase text-[11px] flex items-center gap-2">
                            <span>{tx.type}</span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-white/10 text-white/70">
                              {tx.currency}
                            </span>
                          </div>
                          <div className="text-[10px] text-white/50">{tx.timestamp}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`font-black text-sm ${
                          tx.type === 'grant' || tx.type === 'deposit' ? 'text-[#00FF41]' : 'text-[#FF003C]'
                        }`}>
                          {tx.type === 'grant' || tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                        </div>
                        <span className="text-[9px] text-[#00FF41] font-bold uppercase">
                          ● {tx.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex flex-col gap-1 text-[10px] text-white/60">
                      <div className="flex justify-between">
                        <span className="text-white/40">SENDER:</span>
                        <span className="truncate max-w-[180px] text-white/80">{tx.sender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">RECIPIENT:</span>
                        <span className="truncate max-w-[180px] text-white/80">{tx.recipient}</span>
                      </div>
                      {tx.memo && (
                        <div className="flex justify-between text-[#00FF41]">
                          <span className="text-white/40">NOTE:</span>
                          <span>{tx.memo}</span>
                        </div>
                      )}
                      {tx.pqcSignatureHex && (
                        <div className="mt-1 p-1 bg-black text-[9px] text-cyan-400 font-mono truncate border border-white/10">
                          SIG: {tx.pqcSignatureHex}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
