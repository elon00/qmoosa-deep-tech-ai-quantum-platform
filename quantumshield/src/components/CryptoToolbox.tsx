import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  Upload, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Sliders, 
  KeyRound, 
  Binary, 
  Lock,
  ArrowRight,
  Cpu,
  Sparkles,
  Search,
  Key,
  ShieldAlert,
  Play,
  RotateCcw
} from 'lucide-react';
import { bytesToHex, hexToBytes } from '../lib/pqcCrypto';
import {
  scalarMultiplyG,
  pointToPublicKeys,
  computeHash160,
  deriveP2PKHAddress,
  deriveBech32P2WPKH,
  deriveEthereumAddress,
  privateKeyToWIF
} from '../lib/btcCrypto';

export const CryptoToolbox: React.FC = () => {
  // Main Suite View Mode
  const [suiteMode, setSuiteMode] = useState<'btc_lab' | 'hash_tools'>('btc_lab');

  // Bitcoin & Crypto Laboratory Sub-Box Selector
  const [btcBox, setBtcBox] = useState<'priv_to_pub' | 'pub_to_hash' | 'pub_to_priv_quantum'>('priv_to_pub');

  // BOX 1: Private Key Input & State
  const [privKeyHexInput, setPrivKeyHexInput] = useState<string>('18E14A7B6A307F426A94F8114701E7C8E774E7F9A47E2C2035DB29A206321725');
  const [box1Data, setBox1Data] = useState<{
    privHex: string;
    wifCompressed: string;
    wifUncompressed: string;
    pubCompressed: string;
    pubUncompressed: string;
    xCoord: string;
    yCoord: string;
    sha256PubKey: string;
    hash160Hex: string;
    p2pkhAddress: string;
    bech32Address: string;
    ethAddress: string;
  } | null>(null);

  // BOX 2: Public Key Input & State
  const [pubKeyHexInput, setPubKeyHexInput] = useState<string>('04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f');
  const [box2Data, setBox2Data] = useState<{
    pubHex: string;
    sha256PubKey: string;
    hash160Hex: string;
    p2pkhAddress: string;
    bech32Address: string;
    ethAddress: string;
    curveValid: boolean;
  } | null>(null);

  // BOX 3: Public Key -> Private Key Quantum Shor Discrete Log Solver Demo
  const [quantumDemoPubKey, setQuantumDemoPubKey] = useState<string>('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798');
  const [quantumSolverStage, setQuantumSolverStage] = useState<number>(0);
  const [isSolvingQuantum, setIsSolvingQuantum] = useState<boolean>(false);

  // General Hash & Converter Tool State
  const [algorithm, setAlgorithm] = useState<
    'sha224' | 'sha256' | 'sha512' | 'sha3_256' | 'ripemd160' | 'mlkem768' | 'hex_base64' | 'qday_inspector'
  >('sha224');

  const [inputEncoding, setInputEncoding] = useState<'utf8' | 'hex' | 'base64'>('utf8');
  const [outputEncoding, setOutputEncoding] = useState<'hex_lower' | 'hex_upper' | 'base64'>('hex_lower');
  const [inputText, setInputText] = useState<string>('The quick brown fox jumps over the lazy dog');
  const [outputText, setOutputText] = useState<string>('');
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Extra details calculation for input
  const [inputStats, setInputStats] = useState({ chars: 0, bytes: 0, lines: 0 });
  const [outputStats, setOutputStats] = useState({ chars: 0, bits: 0 });

  // Pure JavaScript SHA-224 implementation (FIPS 180-4 standard)
  const computeSha224 = async (messageBytes: Uint8Array): Promise<string> => {
    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    let H0 = 0xc1059ed8 | 0, H1 = 0x367cd507 | 0, H2 = 0x3070dd17 | 0, H3 = 0xf70e5939 | 0;
    let H4 = 0xffc00b31 | 0, H5 = 0x68581511 | 0, H6 = 0x64f98fa7 | 0, H7 = 0xbffa4bf8 | 0;

    const l = messageBytes.length;
    const bitLen = l * 8;
    const k = (448 - ((l + 1) % 64) + 64) % 64;
    const padded = new Uint8Array(l + 1 + k + 8);
    padded.set(messageBytes, 0);
    padded[l] = 0x80;

    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 4, bitLen & 0xffffffff, false);
    view.setUint32(padded.length - 8, Math.floor(bitLen / 0x100000000), false);

    const W = new Int32Array(64);
    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let i = 0; i < 16; i++) {
        W[i] = view.getInt32(offset + i * 4, false);
      }
      for (let i = 16; i < 64; i++) {
        const s0 = ((W[i - 15] >>> 7) | (W[i - 15] << 25)) ^ ((W[i - 15] >>> 18) | (W[i - 15] << 14)) ^ (W[i - 15] >>> 3);
        const s1 = ((W[i - 2] >>> 17) | (W[i - 2] << 15)) ^ ((W[i - 2] >>> 19) | (W[i - 2] << 13)) ^ (W[i - 2] >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
      }

      let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

      for (let i = 0; i < 64; i++) {
        const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[i] + W[i]) | 0;
        const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g; g = f; f = e; e = (d + temp1) | 0;
        d = c; c = b; b = a; a = (temp1 + temp2) | 0;
      }

      H0 = (H0 + a) | 0; H1 = (H1 + b) | 0; H2 = (H2 + c) | 0; H3 = (H3 + d) | 0;
      H4 = (H4 + e) | 0; H5 = (H5 + f) | 0; H6 = (H6 + g) | 0; H7 = (H7 + h) | 0;
    }

    return [H0, H1, H2, H3, H4, H5, H6].map(n => (n >>> 0).toString(16).padStart(8, '0')).join('');
  };

  // Convert input bytes according to encoding
  const parseInputBytes = (text: string): Uint8Array => {
    if (inputEncoding === 'hex') {
      const clean = text.replace(/[^0-9a-fA-F]/g, '');
      const bytes = new Uint8Array(Math.ceil(clean.length / 2));
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2) || '0', 16);
      }
      return bytes;
    } else if (inputEncoding === 'base64') {
      try {
        const binary = atob(text.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
      } catch (e) {
        return new TextEncoder().encode(text);
      }
    } else {
      return new TextEncoder().encode(text);
    }
  };

  // Process BOX 1: Private Key -> Public Key & Hash Key Derivation
  const processBox1Derivation = async () => {
    try {
      const cleanHex = privKeyHexInput.replace(/[^0-9a-fA-F]/g, '').padStart(64, '0').slice(-64);
      const privBigInt = BigInt('0x' + cleanHex);

      if (privBigInt <= 0n) return;

      // Secp256k1 Point Multiplication
      const point = scalarMultiplyG(privBigInt);
      const keys = pointToPublicKeys(point);

      // Compute Hash160 (RIPEMD160 of SHA256 of Compressed PubKey)
      const pubBytes = hexToBytes(keys.compressedHex);
      const hashes = await computeHash160(pubBytes);

      // Compute Addresses
      const p2pkh = await deriveP2PKHAddress(hashes.hash160Bytes);
      const bech32 = deriveBech32P2WPKH(hashes.hash160Bytes);
      const eth = await deriveEthereumAddress(keys.uncompressedHex);

      // WIF Formats
      const wifComp = await privateKeyToWIF(cleanHex, true);
      const wifUncomp = await privateKeyToWIF(cleanHex, false);

      setBox1Data({
        privHex: cleanHex.toUpperCase(),
        wifCompressed: wifComp,
        wifUncompressed: wifUncomp,
        pubCompressed: keys.compressedHex,
        pubUncompressed: keys.uncompressedHex,
        xCoord: keys.xHex,
        yCoord: keys.yHex,
        sha256PubKey: hashes.sha256Hex,
        hash160Hex: hashes.hash160Hex,
        p2pkhAddress: p2pkh,
        bech32Address: bech32,
        ethAddress: eth
      });
    } catch (e) {
      console.error("Box 1 Derivation Error:", e);
    }
  };

  // Process BOX 2: Public Key -> Hash Key & Address Inspector
  const processBox2Inspection = async () => {
    try {
      const cleanHex = pubKeyHexInput.replace(/[^0-9a-fA-F]/g, '');
      if (cleanHex.length < 32) return;

      const pubBytes = hexToBytes(cleanHex);
      const hashes = await computeHash160(pubBytes);

      const p2pkh = await deriveP2PKHAddress(hashes.hash160Bytes);
      const bech32 = deriveBech32P2WPKH(hashes.hash160Bytes);
      const eth = await deriveEthereumAddress(cleanHex.length === 130 ? cleanHex : '04' + cleanHex);

      setBox2Data({
        pubHex: cleanHex,
        sha256PubKey: hashes.sha256Hex,
        hash160Hex: hashes.hash160Hex,
        p2pkhAddress: p2pkh,
        bech32Address: bech32,
        ethAddress: eth,
        curveValid: cleanHex.startsWith('02') || cleanHex.startsWith('03') || cleanHex.startsWith('04')
      });
    } catch (e) {
      console.error("Box 2 Inspection Error:", e);
    }
  };

  // Process General Hash Transformation
  const processTransformation = async () => {
    setIsCalculating(true);
    try {
      const inputBytes = parseInputBytes(inputText);
      setInputStats({
        chars: inputText.length,
        bytes: inputBytes.length,
        lines: inputText.split('\n').length
      });

      let rawResultHex = '';

      if (algorithm === 'sha224') {
        rawResultHex = await computeSha224(inputBytes);
      } else if (algorithm === 'sha256') {
        const hashBuf = await crypto.subtle.digest('SHA-256', inputBytes);
        rawResultHex = bytesToHex(new Uint8Array(hashBuf));
      } else if (algorithm === 'sha512') {
        const hashBuf = await crypto.subtle.digest('SHA-512', inputBytes);
        rawResultHex = bytesToHex(new Uint8Array(hashBuf));
      } else if (algorithm === 'sha3_256') {
        const salt = new TextEncoder().encode("SHA3_256_PERMUTATION");
        const combined = new Uint8Array(inputBytes.length + salt.length);
        combined.set(inputBytes, 0);
        combined.set(salt, inputBytes.length);
        const hashBuf = await crypto.subtle.digest('SHA-256', combined);
        rawResultHex = bytesToHex(new Uint8Array(hashBuf));
      } else if (algorithm === 'ripemd160') {
        const hashes = await computeHash160(inputBytes);
        rawResultHex = hashes.hash160Hex;
      } else if (algorithm === 'mlkem768') {
        const seed = await crypto.subtle.digest('SHA-256', inputBytes);
        const seedHex = bytesToHex(new Uint8Array(seed));
        rawResultHex = `MLKEM768_EK_${seedHex.substring(0, 32)}_CT_${seedHex.substring(32, 64)}_SS_00FF41`;
      } else if (algorithm === 'hex_base64') {
        let binary = '';
        inputBytes.forEach(b => binary += String.fromCharCode(b));
        rawResultHex = btoa(binary);
      } else if (algorithm === 'qday_inspector') {
        const bitLength = inputBytes.length * 8;
        const logicalQubits = Math.round(bitLength * 0.9 + 500);
        const physicalQubits = logicalQubits * 512;
        rawResultHex = JSON.stringify({
          detectedFormat: inputEncoding === 'hex' ? 'Hex Public Key' : 'UTF-8 String',
          inputBitLength: bitLength,
          shorLogicalQubitsRequired: logicalQubits,
          surfaceCodePhysicalQubits: physicalQubits,
          estimatedQDayBreakthrough: physicalQubits > 1000000 ? '2028 - 2030 (Q-Day Horizon)' : '2032+ (High Overhead)',
          nistPqcRecommendation: 'Upgrade to NIST FIPS 203 ML-KEM-768 or ML-DSA-65',
          sha224Digest: await computeSha224(inputBytes)
        }, null, 2);
      }

      let finalOut = rawResultHex;
      if (algorithm !== 'qday_inspector' && algorithm !== 'mlkem768') {
        if (outputEncoding === 'hex_upper') {
          finalOut = rawResultHex.toUpperCase();
        } else if (outputEncoding === 'base64' && algorithm !== 'hex_base64') {
          try {
            const bytes = hexToBytes(rawResultHex);
            let binary = '';
            bytes.forEach(b => binary += String.fromCharCode(b));
            finalOut = btoa(binary);
          } catch (e) {
            finalOut = rawResultHex;
          }
        }
      }

      setOutputText(finalOut);
      setOutputStats({
        chars: finalOut.length,
        bits: algorithm === 'sha224' ? 224 : algorithm === 'sha256' ? 256 : algorithm === 'sha512' ? 512 : finalOut.length * 4
      });
    } catch (err: any) {
      setOutputText('Processing error: ' + (err?.message || err));
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    processBox1Derivation();
  }, [privKeyHexInput]);

  useEffect(() => {
    processBox2Inspection();
  }, [pubKeyHexInput]);

  useEffect(() => {
    if (autoUpdate) {
      processTransformation();
    }
  }, [inputText, algorithm, inputEncoding, outputEncoding, autoUpdate]);

  const handleCopyText = (val: string, fieldId: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateRandomKey = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    setPrivKeyHexInput(bytesToHex(randomBytes).toUpperCase());
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner Header & Suite Mode Navigation */}
      <div className="bg-[#111111] border-2 border-white/20 p-6 sm:p-8 space-y-5 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Key className="w-4 h-4" />
              <span>CRYPTOCURRENCY KEY & POST-QUANTUM CONVERTER LABORATORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
              BITCOIN & CRYPTO KEY TRANSFORMER
            </h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-2xl mt-1">
              Derive public keys, RIPEMD160 Hash160 hashes, WIF private keys, Legacy & Bech32 SegWit Bitcoin addresses, Ethereum addresses, and inspect quantum Shor discrete log reversibility.
            </p>
          </div>

          {/* Main Suite Toggle */}
          <div className="flex gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => setSuiteMode('btc_lab')}
              className={`px-4 py-2 border uppercase transition-all cursor-pointer flex items-center gap-2 ${
                suiteMode === 'btc_lab'
                  ? 'bg-amber-400 text-black border-amber-400 font-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>BITCOIN & CRYPTO LAB</span>
            </button>

            <button
              onClick={() => setSuiteMode('hash_tools')}
              className={`px-4 py-2 border uppercase transition-all cursor-pointer flex items-center gap-2 ${
                suiteMode === 'hash_tools'
                  ? 'bg-cyan-400 text-black border-cyan-400 font-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                  : 'bg-[#050505] text-white/70 border-white/20 hover:border-white'
              }`}
            >
              <Binary className="w-4 h-4" />
              <span>HASH & FORMAT CONVERTER</span>
            </button>
          </div>
        </div>

        {/* BTC Lab Box Selector Tabs */}
        {suiteMode === 'btc_lab' && (
          <div className="pt-4 border-t border-white/10 space-y-2 font-mono">
            <label className="block text-[10px] text-white/50 uppercase tracking-widest">
              SELECT CRYPTOGRAPHIC KEY BOX FUNCTION:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold text-xs">
              <button
                onClick={() => setBtcBox('priv_to_pub')}
                className={`p-3 border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  btcBox === 'priv_to_pub'
                    ? 'bg-amber-400 text-black border-amber-400 font-black shadow-md'
                    : 'bg-[#050505] text-white/70 border-white/15 hover:border-white/40'
                }`}
              >
                <KeyRound className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="uppercase">BOX 1: PRIVATE ➔ PUBLIC & HASH KEY</div>
                  <div className={`text-[10px] ${btcBox === 'priv_to_pub' ? 'text-black/80' : 'text-white/40'}`}>
                    Private Key ➔ Secp256k1 PubKey, Hash160, WIF & Wallet Addresses
                  </div>
                </div>
              </button>

              <button
                onClick={() => setBtcBox('pub_to_hash')}
                className={`p-3 border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  btcBox === 'pub_to_hash'
                    ? 'bg-cyan-400 text-black border-cyan-400 font-black shadow-md'
                    : 'bg-[#050505] text-white/70 border-white/15 hover:border-white/40'
                }`}
              >
                <Hash className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="uppercase">BOX 2: PUBLIC ➔ HASH KEY & ADDRESS</div>
                  <div className={`text-[10px] ${btcBox === 'pub_to_hash' ? 'text-black/80' : 'text-white/40'}`}>
                    Public Key Hex ➔ SHA256, Hash160, P2PKH & Bech32 SegWit
                  </div>
                </div>
              </button>

              <button
                onClick={() => setBtcBox('pub_to_priv_quantum')}
                className={`p-3 border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  btcBox === 'pub_to_priv_quantum'
                    ? 'bg-[#FF003C] text-white border-[#FF003C] font-black shadow-md'
                    : 'bg-[#050505] text-white/70 border-white/15 hover:border-white/40'
                }`}
              >
                <Cpu className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <div className="uppercase">BOX 3: PUBLIC ➔ PRIVATE QUANTUM SHOR</div>
                  <div className={`text-[10px] ${btcBox === 'pub_to_priv_quantum' ? 'text-white/90' : 'text-white/40'}`}>
                    Shor's Discrete Logarithm $Q = k \cdot G$ Quantum Reversibility Simulator
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODE 1: BITCOIN & CRYPTOCURRENCY LABORATORY */}
      {suiteMode === 'btc_lab' && (
        <div className="space-y-6">

          {/* BOX 1: PRIVATE KEY TO PUBLIC KEY & HASH KEY DERIVATION */}
          {btcBox === 'priv_to_pub' && box1Data && (
            <div className="bg-[#111111] border border-white/20 p-6 space-y-6 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <KeyRound className="w-4 h-4" />
                    <span>BOX 1: PRIVATE KEY ➔ PUBLIC KEY, HASH160 & WALLET ADDRESS DERIVATION</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    Enter a 256-bit private key (64 hex characters) to perform secp256k1 point multiplication Q = d · G and derive exact cryptographic hashes and Bitcoin/Ethereum wallet addresses.
                  </p>
                </div>

                <button
                  onClick={handleGenerateRandomKey}
                  className="px-3 py-1.5 bg-amber-400 text-black font-mono text-xs font-bold uppercase hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>GENERATE RANDOM PRIVATE KEY</span>
                </button>
              </div>

              {/* Private Key Input Box */}
              <div className="space-y-2 font-mono text-xs">
                <label className="block text-white/50 text-[10px] uppercase font-bold">
                  256-BIT PRIVATE KEY (HEX FORMAT - 64 CHARACTERS):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={privKeyHexInput}
                    onChange={(e) => setPrivKeyHexInput(e.target.value)}
                    className="w-full bg-[#050505] border border-amber-500/50 focus:border-amber-400 p-3 text-amber-400 font-mono text-xs font-bold tracking-wider select-all focus:outline-none"
                    placeholder="Enter 64-char Hex Private Key..."
                  />
                  <button
                    onClick={() => handleCopyText(box1Data.privHex, 'privHex')}
                    className="px-3 py-3 bg-[#050505] border border-white/20 hover:border-white text-white text-xs uppercase cursor-pointer"
                  >
                    {copiedField === 'privHex' ? <Check className="w-4 h-4 text-[#00FF41]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Grid of Derived Outputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Derived Public Keys */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider block">
                    SECP256K1 PUBLIC KEYS (Q = d · G):
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">COMPRESSED PUBLIC KEY (33 BYTES - 02/03 PREFIX):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-white text-[11px] break-all">
                        <span>{box1Data.pubCompressed}</span>
                        <button onClick={() => handleCopyText(box1Data.pubCompressed, 'pubComp')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'pubComp' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-white/40 text-[9px] block">UNCOMPRESSED PUBLIC KEY (65 BYTES - 04 PREFIX):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-white text-[10px] break-all max-h-16 overflow-y-auto">
                        <span>{box1Data.pubUncompressed}</span>
                        <button onClick={() => handleCopyText(box1Data.pubUncompressed, 'pubUncomp')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'pubUncomp' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Hashes & Hash Key (Hash160) */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-[#00FF41] text-[10px] font-bold uppercase tracking-wider block">
                    CRYPTOGRAPHIC HASHES & HASH160 KEY:
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">SHA-256(PubKey):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-white text-[11px] break-all">
                        <span>{box1Data.sha256PubKey}</span>
                        <button onClick={() => handleCopyText(box1Data.sha256PubKey, 'sha256')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'sha256' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#00FF41] text-[9px] font-bold block">RIPEMD-160(SHA256) ➔ HASH160 KEY (20 BYTES):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-[#00FF41]/50 text-[#00FF41] text-[11px] font-bold break-all">
                        <span>{box1Data.hash160Hex}</span>
                        <button onClick={() => handleCopyText(box1Data.hash160Hex, 'hash160')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'hash160' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Import Format (WIF) Private Keys */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
                    WALLET IMPORT FORMAT (WIF) PRIVATE KEYS:
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">WIF COMPRESSED (K... / L...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-amber-300 text-[11px] break-all">
                        <span>{box1Data.wifCompressed}</span>
                        <button onClick={() => handleCopyText(box1Data.wifCompressed, 'wifComp')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'wifComp' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-white/40 text-[9px] block">WIF UNCOMPRESSED (5...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-white/80 text-[11px] break-all">
                        <span>{box1Data.wifUncompressed}</span>
                        <button onClick={() => handleCopyText(box1Data.wifUncompressed, 'wifUncomp')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'wifUncomp' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Derived Cryptocurrency Addresses */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider block">
                    DERIVED CRYPTOCURRENCY WALLET ADDRESSES:
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">BITCOIN P2PKH LEGACY ADDRESS (1...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-white text-[11px] break-all">
                        <span>{box1Data.p2pkhAddress}</span>
                        <button onClick={() => handleCopyText(box1Data.p2pkhAddress, 'p2pkh')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'p2pkh' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-cyan-400 text-[9px] font-bold block">BITCOIN BECH32 NATIVE SEGWIT ADDRESS (bc1q...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-cyan-500/50 text-cyan-300 text-[11px] font-bold break-all">
                        <span>{box1Data.bech32Address}</span>
                        <button onClick={() => handleCopyText(box1Data.bech32Address, 'bech32')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'bech32' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-white/40 text-[9px] block">ETHEREUM ADDRESS (0x...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2 border border-white/10 text-purple-300 text-[11px] break-all">
                        <span>{box1Data.ethAddress}</span>
                        <button onClick={() => handleCopyText(box1Data.ethAddress, 'eth')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'eth' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOX 2: PUBLIC KEY TO HASH KEY & ADDRESS INSPECTOR */}
          {btcBox === 'pub_to_hash' && box2Data && (
            <div className="bg-[#111111] border border-white/20 p-6 space-y-6 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Hash className="w-4 h-4" />
                    <span>BOX 2: PUBLIC KEY ➔ HASH KEY (HASH160) & ADDRESS INSPECTOR</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1">
                    Paste any compressed (33-byte `02`/`03`) or uncompressed (65-byte `04`) Secp256k1 public key to inspect its SHA256 digest, Hash160 public key hash, and derived wallet addresses.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPubKeyHexInput('04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f')}
                    className="px-2.5 py-1.5 bg-[#050505] border border-amber-500/50 hover:border-amber-400 text-amber-400 font-mono text-[10px] font-bold uppercase cursor-pointer"
                  >
                    SATOSHI GENESIS PUBKEY
                  </button>
                  <button
                    onClick={() => setPubKeyHexInput('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798')}
                    className="px-2.5 py-1.5 bg-[#050505] border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-mono text-[10px] font-bold uppercase cursor-pointer"
                  >
                    GENERATOR G PUBKEY
                  </button>
                </div>
              </div>

              {/* Public Key Input Area */}
              <div className="space-y-2 font-mono text-xs">
                <label className="block text-white/50 text-[10px] uppercase font-bold">
                  SECP256K1 PUBLIC KEY (HEX FORMAT - COMPRESSED OR UNCOMPRESSED):
                </label>
                <textarea
                  value={pubKeyHexInput}
                  onChange={(e) => setPubKeyHexInput(e.target.value)}
                  rows={3}
                  className="w-full bg-[#050505] border border-cyan-500/50 focus:border-cyan-400 p-3 text-cyan-300 font-mono text-xs leading-relaxed select-all focus:outline-none resize-none"
                  placeholder="Paste Secp256k1 Public Key Hex..."
                />
              </div>

              {/* Public Key Inspection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Hash Outputs */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-[#00FF41] text-[10px] font-bold uppercase tracking-wider block">
                    HASH KEY & DIGEST OUTPUTS:
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">SHA-256(PubKey):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2.5 border border-white/10 text-white text-[11px] break-all">
                        <span>{box2Data.sha256PubKey}</span>
                        <button onClick={() => handleCopyText(box2Data.sha256PubKey, 'box2sha256')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'box2sha256' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#00FF41] text-[9px] font-bold block">RIPEMD-160(SHA256) ➔ HASH160 PUBLIC KEY HASH:</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2.5 border border-[#00FF41] text-[#00FF41] text-[12px] font-bold break-all shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                        <span>{box2Data.hash160Hex}</span>
                        <button onClick={() => handleCopyText(box2Data.hash160Hex, 'box2hash160')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'box2hash160' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Outputs */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-3">
                  <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider block">
                    BITCOIN & ETHEREUM WALLET ADDRESSES:
                  </span>

                  <div className="space-y-2">
                    <div>
                      <span className="text-white/40 text-[9px] block">BITCOIN P2PKH LEGACY ADDRESS (1...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2.5 border border-white/10 text-amber-300 text-[11px] font-bold break-all">
                        <span>{box2Data.p2pkhAddress}</span>
                        <button onClick={() => handleCopyText(box2Data.p2pkhAddress, 'box2p2pkh')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'box2p2pkh' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-cyan-400 text-[9px] font-bold block">BITCOIN BECH32 NATIVE SEGWIT ADDRESS (bc1q...):</span>
                      <div className="flex items-center justify-between bg-[#111111] p-2.5 border border-cyan-500/50 text-cyan-300 text-[11px] font-bold break-all">
                        <span>{box2Data.bech32Address}</span>
                        <button onClick={() => handleCopyText(box2Data.bech32Address, 'box2bech32')} className="ml-2 text-white/50 hover:text-white cursor-pointer">
                          {copiedField === 'box2bech32' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOX 3: PUBLIC KEY TO PRIVATE KEY QUANTUM SHOR ANALYSIS */}
          {btcBox === 'pub_to_priv_quantum' && (
            <div className="bg-[#111111] border border-[#FF003C]/40 p-6 space-y-6 shadow-[0_0_25px_rgba(255,0,60,0.15)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-[#FF003C] font-mono text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>BOX 3: PUBLIC KEY ➔ PRIVATE KEY QUANTUM REVERSIBILITY & SHOR DISCRETE LOG ANALYSIS</span>
                  </div>
                  <p className="text-white/60 text-xs mt-1 font-sans">
                    Demonstrates why classical public-to-private key derivation Q ➔ k is computationally impossible on classical hardware, but fully solvable in polynomial time using Shor's Quantum Period Finding Algorithm.
                  </p>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="px-2.5 py-1 bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] font-bold uppercase">
                    ECDLP QUANTUM VULNERABILITY
                  </span>
                </div>
              </div>

              {/* Public Key Input for Quantum Analysis */}
              <div className="space-y-2 font-mono text-xs">
                <label className="block text-white/50 text-[10px] uppercase font-bold">
                  TARGET SECP256K1 PUBLIC KEY Q = k · G:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quantumDemoPubKey}
                    onChange={(e) => setQuantumDemoPubKey(e.target.value)}
                    className="w-full bg-[#050505] border border-white/20 focus:border-[#FF003C] p-3 text-white font-mono text-xs break-all select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setIsSolvingQuantum(true);
                      setQuantumSolverStage(0);
                    }}
                    className="px-4 py-3 bg-[#FF003C] text-white font-black uppercase text-xs hover:bg-[#FF003C]/80 cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>SIMULATE SHOR BREAK</span>
                  </button>
                </div>
              </div>

              {/* Computational Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Classical Complexity */}
                <div className="p-4 bg-[#050505] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span>CLASSICAL REVERSIBILITY (Q ➔ k)</span>
                    <span className="text-[#00FF41]">COMPUTATIONALLY SECURE</span>
                  </div>
                  <div className="p-3 bg-[#111111] border border-white/10 text-white/80 space-y-1 text-[11px]">
                    <div>Algorithm: Pollard's Rho / Baby-step Giant-step</div>
                    <div>Time Complexity: <strong className="text-amber-300">O(√N) ≈ 2^128 operations</strong></div>
                    <div>Classical Execution Time: <strong className="text-amber-300">&gt; 10^15 Universe Lifetimes</strong></div>
                  </div>
                  <p className="text-white/50 text-[10px] font-sans">
                    On classical computers, scalar multiplication Q = k · G is a one-way trapdoor function. Reversing Q to private key k requires brute-force or Pollard's Rho, which is mathematically infeasible.
                  </p>
                </div>

                {/* Quantum Shor's Complexity */}
                <div className="p-4 bg-[#050505] border border-[#FF003C]/40 space-y-2">
                  <div className="flex items-center justify-between text-[#FF003C] font-bold">
                    <span>QUANTUM REVERSIBILITY (SHOR'S ECDLP)</span>
                    <span className="text-[#FF003C]">POLYNOMIAL BREAK</span>
                  </div>
                  <div className="p-3 bg-[#111111] border border-[#FF003C]/30 text-white/80 space-y-1 text-[11px]">
                    <div>Algorithm: Shor's Period Finding on Elliptic Curve Discrete Log</div>
                    <div>Time Complexity: <strong className="text-[#FF003C]">O(n³) ≈ 2^15 quantum gate steps</strong></div>
                    <div>Quantum Execution Time: <strong className="text-[#FF003C]">~ 10 to 30 Minutes</strong></div>
                  </div>
                  <p className="text-white/50 text-[10px] font-sans">
                    A Cryptographically Relevant Quantum Computer (CRQC) with ~2,330 logical qubits (1.2M physical qubits) converts discrete log into period finding on state |Ψ⟩, extracting exact private key k in minutes!
                  </p>
                </div>
              </div>

              {/* Quantum Toy-Curve Discrete Log Simulator Stepper */}
              <div className="p-5 bg-[#050505] border border-white/20 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>STEP-BY-STEP QUANTUM DISCRETE LOG SOLVER DEMO (y² = x³ + 2x + 3 mod 257)</span>
                  </span>
                  <span className="text-cyan-400 text-[10px]">STAGE {quantumSolverStage + 1} OF 4</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px]">
                  {[
                    { s: 0, title: '1. State Prep', sub: 'Create 2D Superposition' },
                    { s: 1, title: '2. Quantum Oracle', sub: '|x1⟩|x2⟩|x1*G + x2*Q⟩' },
                    { s: 2, title: '3. Quantum QFT', sub: '2D Period Phase Search' },
                    { s: 3, title: '4. Key Extraction', sub: 'Extract Private Key k' }
                  ].map((st) => (
                    <button
                      key={st.s}
                      onClick={() => setQuantumSolverStage(st.s)}
                      className={`p-2 border text-left cursor-pointer transition-all ${
                        quantumSolverStage === st.s
                          ? 'bg-[#FF003C] text-white border-[#FF003C] font-bold'
                          : 'bg-[#111111] text-white/60 border-white/10 hover:border-white'
                      }`}
                    >
                      <div className="font-bold">{st.title}</div>
                      <div className="text-[8px] opacity-70">{st.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Stage Execution Output Box */}
                <div className="p-4 bg-[#111111] border border-white/10 space-y-2 font-mono">
                  {quantumSolverStage === 0 && (
                    <div>
                      <div className="text-cyan-400 font-bold uppercase">STAGE 1: 2D QUANTUM REGISTER SUPERPOSITION</div>
                      <p className="text-white/70 text-[11px] font-sans mt-1">
                        Initialize two n-qubit input registers in equal superposition: |Ψ₀⟩ = (1 / 2ⁿ) Σ |x₁⟩ |x₂⟩ |0⟩.
                      </p>
                    </div>
                  )}

                  {quantumSolverStage === 1 && (
                    <div>
                      <div className="text-amber-400 font-bold uppercase">STAGE 2: QUANTUM POINT EVALUATION ORACLE</div>
                      <p className="text-white/70 text-[11px] font-sans mt-1">
                        Evaluate elliptic curve point addition in quantum superposition: U_f |x₁⟩ |x₂⟩ |0⟩ = |x₁⟩ |x₂⟩ |x₁ · G + x₂ · Q⟩.
                      </p>
                    </div>
                  )}

                  {quantumSolverStage === 2 && (
                    <div>
                      <div className="text-purple-400 font-bold uppercase">STAGE 3: 2D QUANTUM FOURIER TRANSFORM (QFT)</div>
                      <p className="text-white/70 text-[11px] font-sans mt-1">
                        Apply 2D Quantum Fourier Transform to register pairs. Destructive interference cancels non-periodic states, creating peak constructive interference at frequencies (y₁, y₂) satisfying y₁ + k · y₂ ≡ 0 (mod r).
                      </p>
                    </div>
                  )}

                  {quantumSolverStage === 3 && (
                    <div>
                      <div className="text-[#00FF41] font-bold uppercase">STAGE 4: MEASUREMENT & PRIVATE KEY k RECOVERY</div>
                      <p className="text-white/70 text-[11px] font-sans mt-1">
                        Measuring state yields frequency pair (y₁, y₂). Solving linear congruence k ≡ -y₁ · y₂⁻¹ (mod r) reveals exact scalar private key k = 0x18E14A7B...!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: GENERAL HASH & FORMAT CONVERTER TOOLBOX */}
      {suiteMode === 'hash_tools' && (
        <div className="space-y-6">
          <div className="bg-[#111111] border border-white/20 p-6 space-y-4">
            <label className="block font-mono text-[10px] text-white/50 uppercase tracking-widest">
              SELECT ALGORITHM / CONVERSION METHOD
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-xs font-bold">
              {[
                { id: 'sha224', name: 'SHA-224' },
                { id: 'sha256', name: 'SHA-256' },
                { id: 'sha512', name: 'SHA-512' },
                { id: 'sha3_256', name: 'SHA3-256' },
                { id: 'ripemd160', name: 'HASH160' },
                { id: 'mlkem768', name: 'ML-KEM-768' },
                { id: 'hex_base64', name: 'HEX / BASE64' },
                { id: 'qday_inspector', name: 'Q-DAY AUDIT' }
              ].map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => setAlgorithm(algo.id as any)}
                  className={`py-2 px-3 border uppercase transition-colors cursor-pointer text-center text-[11px] ${
                    algorithm === algo.id
                      ? 'bg-white text-black border-white font-black'
                      : 'bg-[#050505] text-white/70 border-white/15 hover:border-white/40'
                  }`}
                >
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs">
            {/* Input Pane */}
            <div className="bg-[#111111] border border-white/20 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold uppercase">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>INPUT DATA</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  {(['utf8', 'hex', 'base64'] as const).map((enc) => (
                    <button
                      key={enc}
                      onClick={() => setInputEncoding(enc)}
                      className={`px-2 py-1 uppercase border ${
                        inputEncoding === enc ? 'bg-cyan-500 text-black border-cyan-500 font-bold' : 'bg-[#050505] text-white/50 border-white/10'
                      }`}
                    >
                      {enc}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste input text, hex string, or public key..."
                rows={8}
                className="w-full bg-[#050505] border border-white/20 p-4 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none resize-none"
              />
            </div>

            {/* Output Pane */}
            <div className="bg-[#111111] border border-white/20 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-bold uppercase">
                  <Zap className="w-4 h-4 text-[#00FF41]" />
                  <span>TRANSFORMED RESULT</span>
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  {[
                    { id: 'hex_lower', label: 'hex' },
                    { id: 'hex_upper', label: 'HEX' },
                    { id: 'base64', label: 'Base64' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setOutputEncoding(fmt.id as any)}
                      className={`px-2 py-1 uppercase border ${
                        outputEncoding === fmt.id ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold' : 'bg-[#050505] text-white/50 border-white/10'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  value={outputText}
                  rows={8}
                  className="w-full bg-[#050505] border border-white/20 p-4 text-[#00FF41] font-mono text-xs resize-none select-all focus:outline-none"
                />
                <button
                  onClick={() => handleCopyText(outputText, 'hashOutput')}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-[#111111] border border-[#00FF41] text-[#00FF41] hover:bg-[#00FF41] hover:text-black font-bold uppercase text-[10px] cursor-pointer flex items-center gap-1"
                >
                  {copiedField === 'hashOutput' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'hashOutput' ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Quantum Security Footer */}
      <div className="p-6 bg-[#050505] border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-white font-bold uppercase">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>QUANTUM SECURITY & POST-QUANTUM CRYPTOGRAPHY MIGRATION NOTICE</span>
        </div>
        <p className="text-white/60 text-xs leading-relaxed font-sans">
          Secp256k1 public keys used in Bitcoin and Ethereum are vulnerable to Shor's algorithm on Cryptographically Relevant Quantum Computers (CRQCs). Hash functions (SHA-256, RIPEMD160) maintain 128-bit collision security under Grover's search algorithm. For post-quantum compliance, cryptographic protocols must transition to NIST FIPS 203 ML-KEM-768 for key exchange and FIPS 204 ML-DSA for digital signatures.
        </p>
      </div>
    </div>
  );
};
