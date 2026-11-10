import React, { useState } from "react";
import confetti from "canvas-confetti";
import { ShieldAlert, Award, Play, CheckCircle2, Lock, Zap, ChevronRight, Terminal, AlertTriangle, Key, Sparkles, Coins } from "lucide-react";
import { BitcoinChallengeLevel, SolanaPlayerProfile } from "../types";
import { recordOnChainDecodeProof } from "../utils/solanaSimulator";

interface BitcoinQuantumArenaProps {
  player: SolanaPlayerProfile;
  setPlayer: (p: SolanaPlayerProfile) => void;
  onTxRecorded?: (tx: any) => void;
}

export const BitcoinQuantumArena: React.FC<BitcoinQuantumArenaProps> = ({
  player,
  setPlayer,
  onTxRecorded,
}) => {
  const initialLevels: BitcoinChallengeLevel[] = [
    {
      id: 1,
      title: "Level 1: Genesis Novice (N=15)",
      category: "RSA_PRIME",
      difficulty: "Novice",
      targetN: 15,
      suggestedCoprime: 7,
      requiredQubits: 8,
      classicalTimeEst: "0.001 ms",
      quantumTimeEst: "12 μs",
      pointsReward: 50,
      badgeReward: "Quantum Pioneer",
      scenario: "Decode the toy RSA 4-bit composite modulus guarding Satoshi's test sandbox wallet.",
      hint: "Choose coprime a=7. The period r will be 4, yielding factors gcd(7^2 - 1, 15) = 3 and 5.",
      completed: true,
      txHash: "5Xz98...init",
    },
    {
      id: 2,
      title: "Level 2: Satoshi Cipher 21 (N=21)",
      category: "RSA_PRIME",
      difficulty: "Intermediate",
      targetN: 21,
      suggestedCoprime: 2,
      requiredQubits: 10,
      classicalTimeEst: "0.004 ms",
      quantumTimeEst: "24 μs",
      pointsReward: 100,
      badgeReward: "Shor's Apprentice",
      scenario: "A 6-bit cryptographic lock N=21 is securing a prototype Bitcoin Lightning Channel channel state.",
      hint: "Use coprime a=2 or a=4. For a=2, the period r=6, giving factors 3 and 7.",
      completed: false,
    },
    {
      id: 3,
      title: "Level 3: Hal Finney Protocol 35 (N=35)",
      category: "MODULAR_EXP",
      difficulty: "Intermediate",
      targetN: 35,
      suggestedCoprime: 6,
      requiredQubits: 12,
      classicalTimeEst: "0.02 ms",
      quantumTimeEst: "45 μs",
      pointsReward: 150,
      badgeReward: "Cryptanalytic Breaker",
      scenario: "Crack an asymmetric key pair N=35 guarding a simulated peer-to-peer transaction output.",
      hint: "Use coprime a=6 (r=2) or a=4 (r=6). Factor resolution yields p=5, q=7.",
      completed: false,
    },
    {
      id: 4,
      title: "Level 4: Quantum Block 0x77 (N=77)",
      category: "RSA_PRIME",
      difficulty: "Advanced",
      targetN: 77,
      suggestedCoprime: 8,
      requiredQubits: 14,
      classicalTimeEst: "0.15 ms",
      quantumTimeEst: "80 μs",
      pointsReward: 200,
      badgeReward: "Quantum Block Hunter",
      scenario: "A 7-bit composite modulus N=77 with dual high-order primes is safeguarding an on-chain smart contract vault.",
      hint: "Shor's quantum period finding identifies r=10 for base a=8, cracking N into 7 × 11.",
      completed: false,
    },
    {
      id: 5,
      title: "Level 5: ECDSA Secp256k1 Discrete Log",
      category: "ECDSA_DISCRETE_LOG",
      difficulty: "Quantum Master",
      targetN: 256,
      suggestedCoprime: 13,
      requiredQubits: 2330,
      classicalTimeEst: "10^12 Years (Impossible)",
      quantumTimeEst: "8.4 Hours (Shor ECDSA)",
      pointsReward: 350,
      badgeReward: "ECDSA Quantum Breaker",
      scenario: "Simulate Shor's discrete logarithm attack solving k·G = P on Bitcoin's secp256k1 elliptic curve.",
      hint: "Shor's discrete log algorithm uses dual register QPE to extract private scalar k from public point P in O(n^3) gates.",
      completed: false,
    },
    {
      id: 6,
      title: "Level 6: Post-Quantum Defense (NIST ML-KEM)",
      category: "POST_QUANTUM_DEFENSE",
      difficulty: "Quantum Master",
      targetN: 512,
      suggestedCoprime: 17,
      requiredQubits: 6400,
      classicalTimeEst: "Unbreakable",
      quantumTimeEst: "Quantum Resistant",
      pointsReward: 500,
      badgeReward: "Post-Quantum Sentinel",
      scenario: "Deploy NIST-approved Post-Quantum ML-KEM/Kyber lattice cryptography to protect assets against Shor's quantum attacks.",
      hint: "Learning With Errors (LWE) and Module-Lattice hardness remain secure against both Shor and Grover quantum attacks.",
      completed: false,
    },
  ];

  const [levels, setLevels] = useState<BitcoinChallengeLevel[]>(initialLevels);
  const [activeLevel, setActiveLevel] = useState<BitcoinChallengeLevel>(initialLevels[1]);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[System Initialized] Quantum Cryptanalysis Sandbox Loaded.",
    "[Target] Bitcoin secp256k1 & RSA Modulus Testnet online.",
    "[Ready] Select a challenge mission to begin quantum attack execution.",
  ]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#a855f7", "#10b981", "#f59e0b"],
      });
    } catch (e) {}
  };

  const handleLaunchQuantumAttack = (level: BitcoinChallengeLevel) => {
    setIsAttacking(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[Attack Initiated] Target: ${level.title} (N=${level.targetN})`,
      `[Circuit Transpilation] Compiling ${level.requiredQubits}-Qubit Shor Modular Period Engine...`,
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[Phase Estimation] Applied Hadamard H^⊗${level.requiredQubits/2} on Counting Register.`,
        `[Modular Exponentiation] Executing U^(2^j) mod ${level.targetN}...`,
      ]);
    }, 800);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `[Inverse QFT] Quantum constructive interference peak detected!`,
        `[Factor Extraction] GCD Matrix resolved: Factors found!`,
      ]);
    }, 1600);

    setTimeout(() => {
      const taskId = `arena_lvl_${level.id}_${Date.now()}`;
      const { updatedProfile, newTx } = recordOnChainDecodeProof(
        player,
        level.pointsReward,
        taskId,
        level.badgeReward
      );

      setPlayer(updatedProfile);
      if (onTxRecorded) {
        onTxRecorded(newTx);
      }

      setLevels((prev) =>
        prev.map((l) => (l.id === level.id ? { ...l, completed: true, txHash: newTx.signature } : l))
      );

      setTerminalLogs((prev) => [
        ...prev,
        `🎉 [VICTORY] Mission Accomplished! +${level.pointsReward} Points, Badge '${level.badgeReward}' Awarded!`,
        `[Solana On-Chain Sync] Recorded on PDA under Signature: ${newTx.signature.substring(0, 16)}...`,
      ]);

      setIsAttacking(false);
      triggerConfetti();
    }, 2400);
  };

  return (
    <div id="bitcoin-arena-container" className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Bitcoin Cryptography & Shor Decoding Arena
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Experience how Shor's and Grover's quantum algorithms challenge legacy asymmetric cryptography (RSA, ECDSA). Complete missions and synchronize on-chain proofs on Solana.
            </p>
          </div>

          {/* Player Progress Stats */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-purple-900/50 rounded-xl p-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Total Missions Completed</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {levels.filter((l) => l.completed).length} / {levels.length} Complete
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <div className="text-[10px] text-slate-400">Q-Bits Balance</div>
              <div className="text-sm font-bold text-amber-300 font-mono flex items-center justify-end gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{player.qBitsTokens}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Mission Level Selector & Live Attack Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Level Missions Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Challenge Missions
            </span>
            <span>6 Progressive Levels</span>
          </div>

          <div className="space-y-2">
            {levels.map((level) => (
              <button
                key={level.id}
                id={`level-btn-${level.id}`}
                onClick={() => setActiveLevel(level)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  activeLevel.id === level.id
                    ? "bg-slate-800/90 border-purple-500/60 shadow-lg shadow-purple-500/10"
                    : "bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      level.completed
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    }`}
                  >
                    {level.completed ? <CheckCircle2 className="w-5 h-5" /> : `L${level.id}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {level.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          level.difficulty === "Novice"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : level.difficulty === "Intermediate"
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : "bg-purple-950 text-purple-300 border border-purple-800"
                        }`}
                      >
                        {level.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {level.scenario}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-300">+{level.pointsReward} XP</span>
                  <div className="text-[10px] text-slate-500">{level.requiredQubits} Qubits</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Mission Detail & Attack Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Mission Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                    {activeLevel.category}
                  </span>
                  {activeLevel.completed && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Solved & Synced
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeLevel.title}
                </h3>
              </div>

              {/* Action Button */}
              <button
                id="launch-quantum-attack-btn"
                onClick={() => handleLaunchQuantumAttack(activeLevel)}
                disabled={isAttacking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isAttacking ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Executing Shor Attack...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-purple-200" />
                    <span>Launch Quantum Attack</span>
                  </>
                )}
              </button>
            </div>

            {/* Mission Scenario & Specs */}
            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {activeLevel.scenario}
              </p>

              {/* Time Complexity Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Target Modulus</div>
                  <div className="text-cyan-300 font-bold">N = {activeLevel.targetN}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Classical Time</div>
                  <div className="text-amber-400 font-bold">{activeLevel.classicalTimeEst}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Quantum Time</div>
                  <div className="text-emerald-400 font-bold">{activeLevel.quantumTimeEst}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Reward Badge</div>
                  <div className="text-purple-300 font-bold truncate">{activeLevel.badgeReward}</div>
                </div>
              </div>

              {/* Hint Box */}
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/30 text-xs text-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-purple-300">Quantum Strategy Hint: </span>
                  <span>{activeLevel.hint}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Terminal Logs */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-mono font-semibold text-slate-300">Quantum Attack Stream Output</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Live Telemetry</span>
            </div>

            <div className="space-y-1 font-mono text-[11px] text-slate-300 max-h-44 overflow-y-auto pr-1">
              {terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes("VICTORY")
                      ? "text-emerald-400 font-bold"
                      : log.includes("Initiated") || log.includes("Target")
                      ? "text-cyan-300"
                      : log.includes("Error")
                      ? "text-rose-400"
                      : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
