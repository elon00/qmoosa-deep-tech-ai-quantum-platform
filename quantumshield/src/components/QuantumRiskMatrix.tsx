import React from 'react';
import { ShieldAlert, Cpu, Unlock, CheckCircle2, Zap, AlertTriangle, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';

export const QuantumRiskMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#111111] border-l-4 border-[#FF003C] p-6 sm:p-8 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF003C] text-white shrink-0 font-bold">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono font-bold bg-[#FF003C] text-white px-2.5 py-1 uppercase tracking-widest">
                CRITICAL THREAT VECTOR
              </span>
              <span className="text-xs font-mono text-white/50 uppercase tracking-widest">SHOR'S ALGORITHM & CRQC THREAT HORIZON</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              WHY RSA AND ECC KEY EXCHANGES WILL BREAK
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl font-sans">
              Classical public-key algorithms (RSA, ECC Secp256r1, Curve25519, DSA, ECDSA) rely on mathematical problems—namely 
              <strong className="text-white"> Prime Factorization</strong> and <strong className="text-white">Discrete Logarithms</strong>. On classical supercomputers, these require exponential time. 
              However, Shor's Algorithm running on a Cryptographically Relevant Quantum Computer (CRQC) solves them in <strong className="text-[#FF003C]">polynomial time</strong>, completely breaking classical asymmetric key exchange.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSA / ECC Vulnerability Box */}
        <div className="bg-[#111111] border-2 border-[#FF003C] p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Unlock className="w-6 h-6 text-[#FF003C]" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight">CLASSICAL CRYPTOGRAPHY (RSA & ECC)</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#FF003C] text-white px-2.5 py-1 uppercase tracking-widest">
              VULNERABLE
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#050505] p-4 border border-white/10">
              <span className="text-white font-bold block mb-1 uppercase tracking-wider">RSA KEY EXCHANGE (2048 / 4096 BIT)</span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Relies on difficulty of factoring product of two prime numbers. Shor's algorithm uses quantum period-finding via Quantum Fourier Transform (QFT) to compute secret factors in minutes.
              </p>
            </div>

            <div className="bg-[#050505] p-4 border border-white/10">
              <span className="text-white font-bold block mb-1 uppercase tracking-wider">ECC KEY EXCHANGE (ECDH / SECP256R1 / X25519)</span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Relies on the Elliptic Curve Discrete Logarithm Problem (ECDLP). Shor's algorithm solves elliptic curve scalar multipliers using polynomial quantum circuits.
              </p>
            </div>

            <div className="bg-[#FF003C]/10 border-l-4 border-[#FF003C] p-4">
              <span className="text-[#FF003C] font-black block mb-1 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                STORE-NOW-DECRYPT-LATER (SNDL) ATTACK:
              </span>
              <p className="text-white/90 leading-relaxed font-sans text-xs">
                Hostile state actors are actively recording and harvesting encrypted TLS key exchange traffic today. Once a CRQC becomes operational, recorded handshakes will be retroactively decrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Post-Quantum ML-KEM Solution Box */}
        <div className="bg-[#111111] border-2 border-[#00FF41] p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#00FF41]" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight">POST-QUANTUM ML-KEM-768 (KYBER)</h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-[#00FF41] text-black px-2.5 py-1 uppercase tracking-widest">
              FIPS 203 READY
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#050505] p-4 border border-white/10">
              <span className="text-[#00FF41] font-bold block mb-1 uppercase tracking-wider">MODULE LEARNING WITH ERRORS (M-LWE)</span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                Based on hard high-dimensional lattice math. Finding hidden vectors in high-dimensional polynomial modules is NP-hard and completely immune to Shor's algorithm.
              </p>
            </div>

            <div className="bg-[#050505] p-4 border border-white/10">
              <span className="text-white font-bold block mb-1 uppercase tracking-wider">HYBRID KEY EXCHANGE STRATEGY</span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                NIST & NSA CNSA 2.0 recommend combining classical X25519 with ML-KEM-768 into HKDF. Ensures compliance with existing security standards while guarding against quantum threats.
              </p>
            </div>

            <div className="bg-[#00FF41]/10 border-l-4 border-[#00FF41] p-4">
              <span className="text-[#00FF41] font-black block mb-1 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                NIST FIPS STANDARDIZED (AUGUST 2024):
              </span>
              <p className="text-white/90 leading-relaxed font-sans text-xs">
                FIPS 203 specifies ML-KEM for general key encapsulation. Security Level 3 (ML-KEM-768) offers 192 bits of quantum security—equivalent to AES-192 brute force complexity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NIST PQC Standards Summary Table */}
      <div className="bg-[#111111] border border-white/10 p-6 space-y-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">NIST POST-QUANTUM CRYPTOGRAPHY (PQC) STANDARDS MATRIX</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-white/20 text-white/60 bg-[#050505] uppercase tracking-wider text-[10px]">
                <th className="p-3">Standard</th>
                <th className="p-3">Algorithm Name</th>
                <th className="p-3">Functionality</th>
                <th className="p-3">Mathematical Basis</th>
                <th className="p-3">Quantum Security</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/90">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">NIST FIPS 203</td>
                <td className="p-3 font-bold text-[#00FF41]">ML-KEM (Kyber)</td>
                <td className="p-3">Key Encapsulation (KEM)</td>
                <td className="p-3">Module-LWE Lattice</td>
                <td className="p-3 text-[#00FF41]">Category 1, 3, 5 (128 - 256 bits)</td>
                <td className="p-3 font-bold"><span className="bg-[#00FF41] text-black px-2 py-0.5 text-[9px] uppercase">Standardized (FIPS)</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">NIST FIPS 204</td>
                <td className="p-3 font-bold text-white">ML-DSA (Dilithium)</td>
                <td className="p-3">Digital Signature</td>
                <td className="p-3">Module-LWE Lattice</td>
                <td className="p-3 text-[#00FF41]">Category 2, 3, 5</td>
                <td className="p-3 font-bold"><span className="bg-[#00FF41] text-black px-2 py-0.5 text-[9px] uppercase">Standardized (FIPS)</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">NIST FIPS 205</td>
                <td className="p-3 font-bold text-white">SLH-DSA (SPHINCS+)</td>
                <td className="p-3">Digital Signature</td>
                <td className="p-3">Stateless Hash-Based</td>
                <td className="p-3 text-[#00FF41]">Category 1, 3, 5</td>
                <td className="p-3 font-bold"><span className="bg-[#00FF41] text-black px-2 py-0.5 text-[9px] uppercase">Standardized (FIPS)</span></td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">NIST FIPS 206</td>
                <td className="p-3 font-bold text-white">FN-DSA (Falcon)</td>
                <td className="p-3">Compact Digital Signature</td>
                <td className="p-3">NTRU Lattice</td>
                <td className="p-3 text-[#00FF41]">Category 1, 5</td>
                <td className="p-3 font-bold"><span className="bg-amber-400 text-black px-2 py-0.5 text-[9px] uppercase">Draft Release</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
