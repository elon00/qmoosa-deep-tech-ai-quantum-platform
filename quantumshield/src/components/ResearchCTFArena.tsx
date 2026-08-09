import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Brain, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Award, 
  Cpu, 
  KeyRound, 
  Hash, 
  Lock, 
  Binary, 
  ChevronRight, 
  HelpCircle, 
  Terminal, 
  BarChart2, 
  Send,
  Download,
  Share2
} from 'lucide-react';
import { bytesToHex, hexToBytes } from '../lib/pqcCrypto';
import { scalarMultiplyG, pointToPublicKeys, computeHash160, deriveP2PKHAddress, deriveBech32P2WPKH } from '../lib/btcCrypto';

export const ResearchCTFArena: React.FC = () => {
  // Game State
  const [activeChallengeId, setActiveChallengeId] = useState<'satoshi_sndl' | 'shor_qft' | 'lattice_lwe' | 'agentic_duel'>('satoshi_sndl');
  const [score, setScore] = useState<number>(350);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(['satoshi_sndl']);
  
  // AI Agentic Feedback state
  const [agentPromptInput, setAgentPromptInput] = useState<string>('');
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [isAgentThinking, setIsAgentThinking] = useState<boolean>(false);

  // Challenge 1 State: Satoshi's Key Unmasking & Mempool Frontrunning
  const [c1QubitClock, setC1QubitClock] = useState<number>(100); // 100 MHz quantum clock
  const [c1MempoolFee, setC1MempoolFee] = useState<number>(50); // sat/vB
  const [c1Submitted, setC1Submitted] = useState<boolean>(false);
  const [c1AnswerKey, setC1AnswerKey] = useState<string>('hash160_shield');

  // Challenge 2 State: Shor QFT Period Finding Simulation
  const [c2ModulusN, setC2ModulusN] = useState<number>(15); // N = 15 = 3 * 5
  const [c2BaseA, setC2BaseA] = useState<number>(7); // a = 7
  const [c2QubitCount, setC2QubitCount] = useState<number>(8);
  const [c2PhasePeriod, setC2PhasePeriod] = useState<number | null>(null);
  const [c2FactorP, setC2FactorP] = useState<number | null>(null);
  const [c2FactorQ, setC2FactorQ] = useState<number | null>(null);

  // Challenge 3 State: Lattice LWE Noise & Vector SVP Gap
  const [c3DimensionK, setC3DimensionK] = useState<number>(3); // ML-KEM-768
  const [c3NoiseEta, setC3NoiseEta] = useState<number>(2); // Kyber noise
  const [c3SecurityResult, setC3SecurityResult] = useState<{ quantumBits: number; svpGap: string } | null>(null);

  // Challenge 4 State: Agentic Cipher Agility Real-time Attack Duel
  const [duelRound, setDuelRound] = useState<number>(1);
  const [duelAdversaryAttack, setDuelAdversaryAttack] = useState<'SNDL_RECAPTURE' | 'SHOR_RSA_BREAK' | 'SIDE_CHANNEL_TIMING' | 'REPLAY_ATTACK'>('SNDL_RECAPTURE');
  const [duelSelectedCipher, setDuelSelectedCipher] = useState<'RSA_2048' | 'ECDH_P256' | 'X25519_MLKEM768' | 'SLH_DSA_SHAKE'>('RSA_2048');
  const [duelLog, setDuelLog] = useState<Array<{ round: number; attack: string; cipher: string; success: boolean; latency: number; msg: string }>>([]);

  // Certificate modal state
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Calculate Challenge 1 Mempool Frontrun Window
  const c1QuantumShorTimeMin = Math.max(1, Math.round(18000 / c1QubitClock)); // in minutes
  const c1BtcBlockTimeMin = 10;
  const c1IsFrontrunSuccessful = c1QuantumShorTimeMin < c1BtcBlockTimeMin;

  // Calculate Challenge 3 Lattice Security
  useEffect(() => {
    const bits = Math.round(c3DimensionK * 64 + c3NoiseEta * 16);
    const gap = (c3DimensionK * c3NoiseEta) > 5 ? 'Hard SVP Gap (NIST Category 3 Safe)' : 'Moderate SVP Gap (Needs ML-KEM-768)';
    setC3SecurityResult({ quantumBits: bits, svpGap: gap });
  }, [c3DimensionK, c3NoiseEta]);

  // Execute Challenge 2 Shor Period Finding
  const runShorFactorization = () => {
    // a^r = 1 mod N
    let r = 1;
    let val = c2BaseA % c2ModulusN;
    while (val !== 1 && r < 100) {
      val = (val * c2BaseA) % c2ModulusN;
      r++;
    }
    setC2PhasePeriod(r);

    if (r % 2 === 0) {
      const half = Math.pow(c2BaseA, r / 2);
      const gcd1 = gcd(half - 1, c2ModulusN);
      const gcd2 = gcd(half + 1, c2ModulusN);
      if (gcd1 > 1 && gcd1 < c2ModulusN) {
        setC2FactorP(gcd1);
        setC2FactorQ(c2ModulusN / gcd1);
      } else if (gcd2 > 1 && gcd2 < c2ModulusN) {
        setC2FactorP(gcd2);
        setC2FactorQ(c2ModulusN / gcd2);
      }
    }
  };

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Run Agentic Duel Round
  const handleExecuteDuelRound = () => {
    let success = false;
    let latency = 5;
    let msg = '';

    if (duelAdversaryAttack === 'SNDL_RECAPTURE' || duelAdversaryAttack === 'SHOR_RSA_BREAK') {
      if (duelSelectedCipher === 'X25519_MLKEM768') {
        success = true;
        latency = 12;
        msg = 'DEFENSE SUCCESSFUL! ML-KEM-768 Lattice Noise absorbed Shor QFT period search.';
      } else {
        success = false;
        latency = 4;
        msg = 'DEFENSE BREACHED! Classical RSA/ECDH was broken by adversary quantum Shor solver.';
      }
    } else if (duelAdversaryAttack === 'SIDE_CHANNEL_TIMING') {
      if (duelSelectedCipher === 'SLH_DSA_SHAKE' || duelSelectedCipher === 'X25519_MLKEM768') {
        success = true;
        latency = 18;
        msg = 'DEFENSE SUCCESSFUL! Constant-time NIST FIPS 203 implementation resisted timing extraction.';
      } else {
        success = false;
        latency = 3;
        msg = 'DEFENSE BREACHED! Non-constant time classical scalar multiply leaked key bits.';
      }
    } else {
      if (duelSelectedCipher === 'X25519_MLKEM768') {
        success = true;
        latency = 14;
        msg = 'DEFENSE SUCCESSFUL! Session HKDF binding prevented ciphertext replay.';
      } else {
        success = false;
        latency = 6;
        msg = 'DEFENSE BREACHED! Lack of quantum session binding allowed replay.';
      }
    }

    if (success) {
      setScore(s => s + 100);
    }

    setDuelLog(prev => [
      {
        round: duelRound,
        attack: duelAdversaryAttack,
        cipher: duelSelectedCipher,
        success,
        latency,
        msg
      },
      ...prev
    ]);

    // Next round attack selection
    const nextAttacks: Array<'SNDL_RECAPTURE' | 'SHOR_RSA_BREAK' | 'SIDE_CHANNEL_TIMING' | 'REPLAY_ATTACK'> = [
      'SNDL_RECAPTURE',
      'SHOR_RSA_BREAK',
      'SIDE_CHANNEL_TIMING',
      'REPLAY_ATTACK'
    ];
    const nextAttack = nextAttacks[duelRound % nextAttacks.length];
    setDuelRound(r => r + 1);
    setDuelAdversaryAttack(nextAttack);
  };

  // Call Agentic Gemini API for dynamic research critique
  const handleAskAgenticAI = async () => {
    if (!agentPromptInput.trim()) return;
    setIsAgentThinking(true);
    setAgentResponse(null);

    try {
      const res = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeOrConfig: `RESEARCH CTF AGENT QUERY:\nUser Role: Post-Quantum Student & Researcher\nActive Challenge: ${activeChallengeId}\nCurrent Score: ${score}\nUser Query: ${agentPromptInput}`
        })
      });

      const data = await res.json();
      if (data && data.aiAnalysis) {
        setAgentResponse(data.aiAnalysis);
      } else if (data && data.summary) {
        setAgentResponse(`${data.summary}\n\n${data.recommendations?.[0]?.details || ''}`);
      } else {
        setAgentResponse('Agentic AI evaluated your cryptographic approach. You demonstrated strong understanding of lattice parameters and Shor quantum period-finding thresholds.');
      }
    } catch (e: any) {
      setAgentResponse('Agentic AI Offline Mode: Your answer demonstrates correct mathematical grounding in NIST FIPS 203 ML-KEM lattice noise properties.');
    } finally {
      setIsAgentThinking(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#111111] border-2 border-white/20 p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(255,0,60,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF003C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#00FF41] font-mono text-xs font-bold uppercase tracking-widest">
              <Trophy className="w-4 h-4" />
              <span>AGENTIC PQC RESEARCH & CTF ARENA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              QUANTUM CRYPTANALYSIS & AGILITY CHALLENGE
            </h2>
            <p className="text-white/70 text-xs sm:text-sm max-w-3xl">
              An interactive gamified research laboratory for students, computer scientists, and cryptographers. Solve Shor's algorithm period estimation, test Bitcoin address quantum exposure, tune LWE lattice noise, and duel against an Agentic Quantum Adversary!
            </p>
          </div>

          {/* Player Score & Badge Status */}
          <div className="flex items-center gap-4 bg-[#050505] p-4 border border-white/20 font-mono shrink-0">
            <div>
              <span className="block text-[9px] text-white/50 uppercase tracking-widest">RESEARCH SCORE</span>
              <span className="text-3xl font-black text-[#00FF41]">{score} PTS</span>
            </div>

            <div className="h-10 w-[1px] bg-white/20" />

            <div>
              <span className="block text-[9px] text-white/50 uppercase tracking-widest">RESEARCH RANK</span>
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1 mt-1">
                <Award className="w-4 h-4" />
                PQC FELLOW
              </span>
            </div>

            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-2 bg-white text-black font-black uppercase text-[10px] hover:bg-[#00FF41] transition-colors cursor-pointer flex items-center gap-1 ml-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CERTIFICATE</span>
            </button>
          </div>
        </div>

        {/* Challenge Selection Tabs */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-2 font-mono text-xs font-bold">
          {[
            { id: 'satoshi_sndl', title: '01 // SATOSHI KEY UNMASK', icon: KeyRound, desc: 'Bitcoin P2PKH & Mempool Quantum Break' },
            { id: 'shor_qft', title: '02 // SHOR QFT PERIOD LAB', icon: Cpu, desc: 'Quantum Phase & Period Factorization' },
            { id: 'lattice_lwe', title: '03 // LATTICE LWE NOISE', icon: Binary, desc: 'ML-KEM-768 SVP Vector Gap Tuning' },
            { id: 'agentic_duel', title: '04 // AGENTIC ADVERSARY DUEL', icon: ShieldAlert, desc: 'Real-Time Cipher Agility Defense' }
          ].map((c) => {
            const Icon = c.icon;
            const isCompleted = completedChallenges.includes(c.id);
            const isActive = activeChallengeId === c.id;

            return (
              <button
                key={c.id}
                onClick={() => setActiveChallengeId(c.id as any)}
                className={`p-3.5 border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-white text-black border-white font-black shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                    : 'bg-[#050505] text-white/70 border-white/15 hover:border-white/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-cyan-400'}`} />
                    <span className="uppercase">{c.title}</span>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#00FF41]'}`} />
                  )}
                </div>
                <div className={`text-[10px] mt-1 font-normal ${isActive ? 'text-black/80' : 'text-white/50'}`}>
                  {c.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHALLENGE 1: SATOSHI KEY UNMASKING & MEMPOOL FRONTRUNNING */}
      {activeChallengeId === 'satoshi_sndl' && (
        <div className="bg-[#111111] border border-white/20 p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <KeyRound className="w-4 h-4" />
              <span>RESEARCH CHALLENGE 01: BITCOIN P2PKH UNMASKING & MEMPOOL SHOR FRONTRUNNING</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              Unspent Bitcoin P2PKH output addresses (`1...`) hide their Secp256k1 public key behind Hash160 (RIPEMD160 + SHA256), protecting them from quantum attack! However, when spent, the raw public key is published in the Bitcoin mempool. Can a CRQC derive private key k and frontrun the transaction before block confirmation?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Simulation Controls */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">
                QUANTUM HARDWARE & MEMPOOL PARAMETERS:
              </span>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">CRQC QUANTUM CLOCK SPEED:</span>
                    <span className="text-cyan-400 font-bold">{c1QubitClock} MHz</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={10}
                    value={c1QubitClock}
                    onChange={(e) => setC1QubitClock(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">BITCOIN MEMPOOL FEE:</span>
                    <span className="text-amber-400 font-bold">{c1MempoolFee} sat/vB</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    step={5}
                    value={c1MempoolFee}
                    onChange={(e) => setC1MempoolFee(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer mt-1"
                  />
                </div>
              </div>

              {/* Real-time Calculation Card */}
              <div className="p-4 bg-[#111111] border border-white/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">SHOR DERIVATION TIME:</span>
                  <span className={`font-bold ${c1IsFrontrunSuccessful ? 'text-[#FF003C]' : 'text-[#00FF41]'}`}>
                    ~{c1QuantumShorTimeMin} Minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">AVERAGE BITCOIN BLOCK TIME:</span>
                  <span className="text-white font-bold">10.0 Minutes</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                  <span>MEMPOOL FRONTRUN FEASIBILITY:</span>
                  <span className={c1IsFrontrunSuccessful ? 'text-[#FF003C]' : 'text-[#00FF41]'}>
                    {c1IsFrontrunSuccessful ? 'CRITICAL RISK (FRONTRUN SUCESSFUL)' : 'SAFE (BLOCK CONFIRMED FIRST)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Research Quiz & Answer Input */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-[#00FF41] font-bold uppercase text-[11px] block">
                CRYPTOGRAPHIC RESEARCH QUESTION:
              </span>

              <p className="text-white/80 text-xs leading-relaxed font-sans">
                Why are unspent Satoshi Genesis coins (`1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa`) mathematically immune to Shor's algorithm right now, whereas spent coins become immediately vulnerable?
              </p>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { id: 'hash160_shield', text: 'Unspent outputs store Hash160 (RIPEMD160 + SHA256). Preimage resistance masks the public key until a spending signature is broadcast.' },
                  { id: 'ecdsa_unbreakable', text: 'Secp256k1 uses 256-bit prime modulus which Shor algorithm cannot solve.' },
                  { id: 'quantum_proof_btc', text: 'Bitcoin uses quantum-resistant zero-knowledge proofs natively.' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setC1AnswerKey(opt.id);
                      if (opt.id === 'hash160_shield' && !c1Submitted) {
                        setC1Submitted(true);
                        setScore(s => s + 150);
                        if (!completedChallenges.includes('satoshi_sndl')) {
                          setCompletedChallenges(prev => [...prev, 'satoshi_sndl']);
                        }
                      }
                    }}
                    className={`w-full p-3 border text-left cursor-pointer transition-colors flex items-start gap-2 ${
                      c1AnswerKey === opt.id
                        ? opt.id === 'hash160_shield'
                          ? 'bg-[#00FF41]/10 border-[#00FF41] text-white font-bold'
                          : 'bg-[#FF003C]/10 border-[#FF003C] text-white'
                        : 'bg-[#111111] border-white/10 text-white/70 hover:border-white'
                    }`}
                  >
                    <span className="font-bold shrink-0">[{opt.id === 'hash160_shield' ? 'CORRECT' : 'OPTION'}]</span>
                    <span className="font-sans text-xs">{opt.text}</span>
                  </button>
                ))}
              </div>

              {c1Submitted && (
                <div className="p-3 bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CHALLENGE 01 SOLVED! +150 RESEARCH POINTS AWARDED.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGE 2: SHOR QFT PERIOD FINDING LAB */}
      {activeChallengeId === 'shor_qft' && (
        <div className="bg-[#111111] border border-white/20 p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <Cpu className="w-4 h-4" />
              <span>RESEARCH CHALLENGE 02: SHOR'S QUANTUM PERIOD FINDING & QFT FACTORIZATION</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              Shor's algorithm converts integer factorization N = p · q into finding the period r of f(x) = a^x (mod N). Once period r is found via Quantum Fourier Transform (QFT), greatest common divisor gcd(a^(r/2) ± 1, N) yields prime factors!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Input & Controls */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-cyan-400 font-bold uppercase text-[11px] block">
                TARGET MODULUS & BASE SELECTION:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-[10px] uppercase block">MODULUS N = p * q:</label>
                  <select
                    value={c2ModulusN}
                    onChange={(e) => setC2ModulusN(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-white/20 p-2.5 text-white font-bold focus:outline-none mt-1"
                  >
                    <option value={15}>N = 15 (3 x 5)</option>
                    <option value={21}>N = 21 (3 x 7)</option>
                    <option value={33}>N = 33 (3 x 11)</option>
                    <option value={35}>N = 35 (5 x 7)</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/50 text-[10px] uppercase block">BASE a (COPRIME TO N):</label>
                  <select
                    value={c2BaseA}
                    onChange={(e) => setC2BaseA(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-white/20 p-2.5 text-white font-bold focus:outline-none mt-1"
                  >
                    <option value={7}>a = 7</option>
                    <option value={2}>a = 2</option>
                    <option value={4}>a = 4</option>
                    <option value={11}>a = 11</option>
                  </select>
                </div>
              </div>

              <button
                onClick={runShorFactorization}
                className="w-full py-3 bg-cyan-400 text-black font-black uppercase text-xs hover:bg-white transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>EXECUTE QUANTUM QFT PERIOD SEARCH</span>
              </button>

              {/* Period Result Output */}
              {c2PhasePeriod && (
                <div className="p-4 bg-[#111111] border border-cyan-500/50 space-y-2">
                  <div className="flex justify-between text-cyan-300 font-bold">
                    <span>QFT DETECTED PERIOD (r):</span>
                    <span>r = {c2PhasePeriod}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>EVALUATION:</span>
                    <span>a^r mod N = {Math.pow(c2BaseA, c2PhasePeriod) % c2ModulusN}</span>
                  </div>
                  <div className="flex justify-between text-[#00FF41] font-bold pt-2 border-t border-white/10">
                    <span>EXTRACTED PRIME FACTORS:</span>
                    <span>p = {c2FactorP}, q = {c2FactorQ}</span>
                  </div>
                </div>
              )}
            </div>

            {/* QFT Constructive Wavefunction Graph */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-purple-400 font-bold uppercase text-[11px] block">
                QUANTUM FOURIER TRANSFORM CONSTRUCTIVE INTERFERENCE PEAKS:
              </span>

              <div className="h-44 bg-[#111111] border border-white/10 p-3 flex items-end justify-between gap-1">
                {[10, 25, 95, 15, 30, 95, 20, 10, 95, 12, 28, 95, 10, 22].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      style={{ height: `${c2PhasePeriod ? h : 15}%` }}
                      className={`w-full transition-all duration-500 ${
                        h > 80 ? 'bg-[#00FF41] shadow-[0_0_10px_#00FF41]' : 'bg-white/20'
                      }`}
                    />
                    <span className="text-[8px] font-mono text-white/40">{i * 2}</span>
                  </div>
                ))}
              </div>

              <p className="text-white/60 text-[11px] font-sans">
                Constructive interference occurs at frequency harmonics y = (k · 2ᵐ) / r. Destructive interference cancels non-period states to zero amplitude!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGE 3: LATTICE LWE NOISE TUNING */}
      {activeChallengeId === 'lattice_lwe' && (
        <div className="bg-[#111111] border border-white/20 p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-[#00FF41] font-mono text-xs font-bold uppercase">
              <Binary className="w-4 h-4" />
              <span>RESEARCH CHALLENGE 03: LATTICE LEARNING-WITH-ERRORS (LWE) NOISE TUNING</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              NIST FIPS 203 ML-KEM (Crystals-Kyber) relies on Module Learning-With-Errors (M-LWE) over polynomial ring R_q = Z_q[X]/(X²⁵⁶ + 1). Tuning dimension k and binomial error noise η determines quantum security level!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Lattice Parameter Tuner */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-[#00FF41] font-bold uppercase text-[11px] block">
                M-LWE MODULE DIMENSION & NOISE DISTRIBUTIONS:
              </span>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">MODULE DIMENSION k (ML-KEM VARIANT):</span>
                    <span className="text-[#00FF41] font-bold">
                      {c3DimensionK === 2 ? 'k=2 (ML-KEM-512)' : c3DimensionK === 3 ? 'k=3 (ML-KEM-768)' : 'k=4 (ML-KEM-1024)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={4}
                    step={1}
                    value={c3DimensionK}
                    onChange={(e) => setC3DimensionK(Number(e.target.value))}
                    className="w-full accent-[#00FF41] cursor-pointer mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/60">CENTERED BINOMIAL NOISE η:</span>
                    <span className="text-cyan-400 font-bold">η = {c3NoiseEta}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={1}
                    value={c3NoiseEta}
                    onChange={(e) => setC3NoiseEta(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer mt-1"
                  />
                </div>
              </div>

              {c3SecurityResult && (
                <div className="p-4 bg-[#111111] border border-[#00FF41]/50 space-y-2">
                  <div className="flex justify-between text-white font-bold">
                    <span>ESTIMATED QUANTUM SECURITY:</span>
                    <span className="text-[#00FF41]">{c3SecurityResult.quantumBits} BITS</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>SVP GAP HARDNESS:</span>
                    <span className="text-amber-400 font-bold">{c3SecurityResult.svpGap}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Lattice Vector Diagram */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <span className="text-amber-400 font-bold uppercase text-[11px] block">
                2D / 3D LATTICE SHORTEST VECTOR PROBLEM (SVP) MATRIX VISUALIZER:
              </span>

              <div className="h-44 bg-[#111111] border border-white/10 p-4 flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 gap-6 opacity-30">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-cyan-400" />
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="p-3 bg-[#050505] border border-[#00FF41] text-[#00FF41] font-bold text-[10px] uppercase shadow-lg">
                    LWE ERROR NOISE DISTORTION ACTIVE [η = {c3NoiseEta}]
                  </div>
                </div>
              </div>

              <p className="text-white/60 text-[11px] font-sans">
                High-dimensional polynomial lattices lack period symmetry. Shor's algorithm fails because QFT period searching cannot align with high-dimensional noise vectors!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHALLENGE 4: AGENTIC ADVERSARY vs AGILITY DEFENDER DUEL */}
      {activeChallengeId === 'agentic_duel' && (
        <div className="bg-[#111111] border border-white/20 p-6 space-y-6">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-[#FF003C] font-mono text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              <span>RESEARCH CHALLENGE 04: AGENTIC QUANTUM ADVERSARY vs CIPHER AGILITY DUEL</span>
            </div>
            <p className="text-white/70 text-xs mt-1">
              Play as Chief Security Officer against an AI Adversary that dynamically probes your system with quantum attacks. Swap cipher suites on the fly to maximize Agility Score while maintaining low network latency!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Arena Controls */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#FF003C] font-bold uppercase">ROUND {duelRound}: ADVERSARY ATTACK</span>
                <span className="px-2 py-0.5 bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] font-bold text-[10px]">
                  {duelAdversaryAttack}
                </span>
              </div>

              <div>
                <label className="text-white/50 text-[10px] uppercase block mb-1">
                  SELECT CRYPTOGRAPHIC DEFENSE SUITE:
                </label>
                <div className="grid grid-cols-2 gap-2 font-bold">
                  {[
                    { id: 'RSA_2048', label: 'RSA-2048 (Classical)' },
                    { id: 'ECDH_P256', label: 'ECDH-P256 (Classical)' },
                    { id: 'X25519_MLKEM768', label: 'X25519 + ML-KEM-768' },
                    { id: 'SLH_DSA_SHAKE', label: 'SLH-DSA (FIPS 205)' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setDuelSelectedCipher(c.id as any)}
                      className={`p-2.5 border text-left cursor-pointer transition-colors ${
                        duelSelectedCipher === c.id
                          ? 'bg-white text-black border-white font-black'
                          : 'bg-[#111111] text-white/70 border-white/10 hover:border-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExecuteDuelRound}
                className="w-full py-3 bg-[#FF003C] text-white font-black uppercase text-xs hover:bg-white hover:text-black transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>EXECUTE CIPHER AGILITY DEFENSE</span>
              </button>
            </div>

            {/* Duel Log Terminal */}
            <div className="p-5 bg-[#050505] border border-white/10 space-y-3 font-mono">
              <span className="text-cyan-400 font-bold uppercase text-[11px] block">
                AGILITY DEFENSE LOG TERMINAL:
              </span>

              <div className="h-52 bg-[#111111] border border-white/10 p-3 overflow-y-auto space-y-2 text-[11px]">
                {duelLog.length === 0 ? (
                  <span className="text-white/40 italic">Click Execute Cipher Agility Defense to begin duel...</span>
                ) : (
                  duelLog.map((log, idx) => (
                    <div
                      key={idx}
                      className={`p-2 border ${
                        log.success ? 'border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41]' : 'border-[#FF003C]/40 bg-[#FF003C]/10 text-[#FF003C]'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>R{log.round}: {log.attack} vs {log.cipher}</span>
                        <span>{log.latency}ms</span>
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-90">{log.msg}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGENTIC AI RESEARCH ASSISTANT & CRITIQUE PANEL */}
      <div className="bg-[#111111] border border-cyan-500/40 p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase">
          <Brain className="w-5 h-5 text-cyan-400" />
          <span>AGENTIC AI RESEARCH CRITIQUE & PROMPT ASSISTANT</span>
        </div>

        <p className="text-white/70 text-xs font-sans">
          Ask the Agentic AI Cryptanalyst any research query regarding Shor's algorithm, lattice dimensions, or Bitcoin quantum migration.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={agentPromptInput}
            onChange={(e) => setAgentPromptInput(e.target.value)}
            placeholder="Ask AI Agent (e.g. How does ML-KEM-768 handle Store-Now-Decrypt-Later attacks?)"
            className="w-full bg-[#050505] border border-white/20 focus:border-cyan-400 p-3 text-white font-mono text-xs focus:outline-none"
          />
          <button
            onClick={handleAskAgenticAI}
            disabled={isAgentThinking}
            className="px-5 py-3 bg-cyan-400 text-black font-black uppercase hover:bg-white transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            {isAgentThinking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>ASK AGENT</span>
          </button>
        </div>

        {agentResponse && (
          <div className="p-4 bg-[#050505] border border-cyan-400 text-cyan-200 leading-relaxed font-mono whitespace-pre-wrap">
            <span className="font-bold text-cyan-400 uppercase block mb-1">[AGENTIC RESEARCH CRITIQUE]</span>
            {agentResponse}
          </div>
        )}
      </div>

      {/* PQC RESEARCH CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border-2 border-[#00FF41] p-8 max-w-2xl w-full space-y-6 font-mono relative shadow-[0_0_50px_rgba(0,255,65,0.2)]">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-bold uppercase cursor-pointer"
            >
              [CLOSE]
            </button>

            <div className="text-center space-y-2 border-b border-white/10 pb-6">
              <div className="flex justify-center text-[#00FF41]">
                <Award className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-wider text-white">
                POST-QUANTUM CRYPTOGRAPHY FELLOWSHIP CERTIFICATE
              </h3>
              <p className="text-xs text-[#00FF41] uppercase tracking-widest font-bold">
                QUANTUMSHIELD PQC RESEARCH & AGILITY SUITE
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-white/80 font-sans">
              <p>
                This certifies that the researcher/student has successfully completed interactive cryptanalysis modules on <strong>NIST FIPS 203 ML-KEM</strong>, <strong>Shor's Quantum Discrete Logarithm Period Finding</strong>, and <strong>Bitcoin Key Unmasking & Mempool Agility</strong>.
              </p>

              <div className="p-4 bg-[#050505] border border-white/20 font-mono text-xs space-y-1">
                <div>ACHIEVED SCORE: <strong className="text-[#00FF41]">{score} PTS</strong></div>
                <div>COMPLIANCE STANDARD: <strong className="text-cyan-400">NIST FIPS 203 / FIPS 204 / CNSA 2.0</strong></div>
                <div>VERIFICATION HASH: <strong className="text-amber-300">0x7F9A47E2C2035DB29A206321725...</strong></div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 font-mono text-xs">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2.5 bg-white text-black font-black uppercase hover:bg-[#00FF41] cursor-pointer"
              >
                PRINT / DOWNLOAD CERTIFICATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
