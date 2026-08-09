import React, { useState } from "react";
import { Lock, ShieldCheck, Key, Play, AlertCircle, RefreshCw } from "lucide-react";

export const CryptoDivisionView: React.FC = () => {
  const [algo, setAlgo] = useState("ML-KEM-768");
  const [pqcData, setPqcData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePQCKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crypto/pqc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ algorithm: algo }),
      });
      const data = await res.json();
      setPqcData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-slate-900 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>QMOOSA POST-QUANTUM CRYPTOGRAPHY DIVISION</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              NIST ML-KEM & ML-DSA Lattice Cryptography
            </h1>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl">
              Protect enterprise systems against quantum computer decryption with lattice-based key encapsulation and post-quantum digital signatures.
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-amber-400 border border-slate-800">
              PQC Level: <strong className="text-white">NIST Category 3</strong>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
              Status: <strong className="text-white">192-bit Quantum Security</strong>
            </span>
          </div>
        </div>

        {/* Interactive PQC Generator */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Post-Quantum Lattice Key Encapsulation Generator</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Simulate NIST ML-KEM-768 / ML-DSA key generation and latency benchmarking.
              </p>
            </div>

            <div className="flex items-center space-x-3 font-mono text-xs">
              <select
                value={algo}
                onChange={(e) => setAlgo(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ML-KEM-768">ML-KEM-768 (Lattice Encap)</option>
                <option value="ML-DSA-65">ML-DSA-65 (Lattice Signature)</option>
                <option value="Falcon-512">Falcon-512 (FFT Lattice)</option>
              </select>

              <button
                onClick={handleGeneratePQCKeys}
                disabled={loading}
                className="px-6 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Generating..." : "Generate PQC Keypair"}</span>
              </button>
            </div>
          </div>

          {pqcData && (
            <div className="bg-slate-950 border border-amber-800/80 rounded-xl p-6 font-mono text-xs text-slate-300 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-amber-400">PQC KEYGEN PERFORMANCE REPORT</span>
                <span className="text-emerald-400 font-bold">{pqcData.testStatus}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500">KEYGEN LATENCY</div>
                  <div className="text-sm font-bold text-white mt-1">{pqcData.keyGenTimeMs} ms</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500">PUBLIC KEY SIZE</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">{pqcData.publicKeyBytes} Bytes</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500">CIPHERTEXT SIZE</div>
                  <div className="text-sm font-bold text-amber-300 mt-1">{pqcData.ciphertextBytes} Bytes</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500">SECURITY RATING</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">NIST Cat 3</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                Lattice parameters: Module dimension d=3, modulus q=3329, polynomial degree n=256. Resistant against quantum BKZ-200 reduction attacks.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
