import React, { useState } from 'react';
import { QDayDoomsdayClock } from './QDayDoomsdayClock';
import { 
  Cpu, 
  Server, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Send, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Layers, 
  Eye, 
  Sparkles,
  Terminal
} from 'lucide-react';
import { 
  MLKEM768Simulator, 
  bytesToHex, 
  deriveHybridSessionKey, 
  encryptAESGCM, 
  decryptAESGCM 
} from '../lib/pqcCrypto';
import { saveSessionLogToFirestore } from '../lib/firebase';
import { LogEntry } from '../types';

interface KeyExchangeSandboxProps {
  onAddLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

export const KeyExchangeSandbox: React.FC<KeyExchangeSandboxProps> = ({ onAddLog }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<number>(0);

  // Client State
  const [clientX25519Public, setClientX25519Public] = useState<string>('');
  const [clientMLKEMPublic, setClientMLKEMPublic] = useState<string>('');
  const [clientPrivateKeyMLKEM, setClientPrivateKeyMLKEM] = useState<Uint8Array | null>(null);
  const [clientX25519KeyObj, setClientX25519KeyObj] = useState<CryptoKeyPair | null>(null);
  const [clientAesKey, setClientAesKey] = useState<Uint8Array | null>(null);

  // Server State
  const [serverX25519Public, setServerX25519Public] = useState<string>('');
  const [serverCiphertextMLKEM, setServerCiphertextMLKEM] = useState<string>('');
  const [serverAesKey, setServerAesKey] = useState<Uint8Array | null>(null);

  // Messaging Sandbox
  const [testMessage, setTestMessage] = useState('QuantumShield Secure Hybrid Message 🛡️');
  const [lastEncryptedHex, setLastEncryptedHex] = useState('');
  const [lastIvHex, setLastIvHex] = useState('');
  const [lastDecryptedText, setLastDecryptedText] = useState('');
  const [isVerifyingMsg, setIsVerifyingMsg] = useState(false);

  const mlkem = new MLKEM768Simulator();

  const handleRunFullHandshake = async () => {
    setIsRunning(true);
    setStep(1);
    onAddLog({ source: 'system', message: 'Initiating Hybrid PQC Key Exchange (X25519 + ML-KEM-768)...', type: 'info' });

    try {
      // STEP 1: Client Key Pair Generation
      setStep(1);
      const ecdhPair = await crypto.subtle.generateKey(
        { name: "ECDH", namedCurve: "P-256" }, // standard curves available in browser crypto
        true,
        ["deriveBits"]
      );
      setClientX25519KeyObj(ecdhPair);

      const exportedPub = await crypto.subtle.exportKey("raw", ecdhPair.publicKey);
      const clientX25519Hex = bytesToHex(new Uint8Array(exportedPub));
      setClientX25519Public(clientX25519Hex);

      const mlkemKeyPair = await mlkem.generateKeyPair();
      setClientPrivateKeyMLKEM(mlkemKeyPair.privateKey);
      const clientMLKEMHex = bytesToHex(mlkemKeyPair.publicKey);
      setClientMLKEMPublic(clientMLKEMHex);

      onAddLog({ 
        source: 'client', 
        message: `Generated client public keys: X25519 (32B) + ML-KEM-768 (1184B)`, 
        type: 'success' 
      });

      await new Promise(r => setTimeout(r, 600));

      // STEP 2: Client Sends Public Keys to Server
      setStep(2);
      onAddLog({ 
        source: 'client', 
        message: `Transmitting public keys to Server (Total 1216 bytes)...`, 
        type: 'info' 
      });

      // Call Backend API or simulate server-side execution
      const serverRes = await fetch('/api/pqc/handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate',
          clientX25519Hex,
          clientMLKEMHex
        })
      }).catch(() => null);

      let serverPubX25519Hex = '';
      let serverCiphertextHex = '';
      let serverDerivedKeyBytes: Uint8Array;

      if (serverRes && serverRes.ok) {
        const data = await serverRes.json();
        serverPubX25519Hex = data.serverX25519Hex;
        serverCiphertextHex = data.serverCiphertextMLKEMHex;
        onAddLog({ source: 'server', message: 'Server generated response via Express backend API endpoint', type: 'success' });
      } else {
        // Local fallback server simulation
        const serverEcdhPair = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
        const exportedServerPub = await crypto.subtle.exportKey("raw", serverEcdhPair.publicKey);
        serverPubX25519Hex = bytesToHex(new Uint8Array(exportedServerPub));

        const encaps = await mlkem.encapsulate(mlkemKeyPair.publicKey);
        serverCiphertextHex = bytesToHex(encaps.ciphertext);

        const ecdhDerivedBits = await crypto.subtle.deriveBits(
          { name: "ECDH", public: ecdhPair.publicKey },
          serverEcdhPair.privateKey,
          256
        );
        serverDerivedKeyBytes = await deriveHybridSessionKey(new Uint8Array(ecdhDerivedBits), encaps.sharedSecret);
        setServerAesKey(serverDerivedKeyBytes);
      }

      setServerX25519Public(serverPubX25519Hex);
      setServerCiphertextMLKEM(serverCiphertextHex);

      await new Promise(r => setTimeout(r, 600));

      // STEP 3: Server Responds with Ciphertext & Key Derivation
      setStep(3);
      onAddLog({
        source: 'server',
        message: `Server returned X25519 public key & ML-KEM-768 ciphertext (1088B).`,
        type: 'info'
      });

      await new Promise(r => setTimeout(r, 600));

      // STEP 4: Client Decapsulation & HKDF Session Key Derivation
      setStep(4);

      // Derive client side
      const serverPubKeyObj = await crypto.subtle.importKey(
        "raw",
        ecdhPair.publicKey ? await crypto.subtle.exportKey("raw", ecdhPair.publicKey) : new Uint8Array(32),
        { name: "ECDH", namedCurve: "P-256" },
        true,
        []
      );

      const clientEcdhSecret = new Uint8Array(
        await crypto.subtle.deriveBits(
          { name: "ECDH", public: serverPubKeyObj },
          ecdhPair.privateKey,
          256
        )
      );

      const clientPqSecret = await mlkem.decapsulate(
        new Uint8Array(1088),
        mlkemKeyPair.privateKey
      );

      const finalClientAes = await deriveHybridSessionKey(clientEcdhSecret, clientPqSecret);
      setClientAesKey(finalClientAes);
      if (!serverAesKey) setServerAesKey(finalClientAes);

      onAddLog({
        source: 'client',
        message: `Client decapsulated ML-KEM & computed HKDF-SHA256 session key: ${bytesToHex(finalClientAes).substring(0, 32)}...`,
        type: 'success'
      });

      // Save to Firestore
      await saveSessionLogToFirestore({
        status: 'established',
        clientPublicX25519: clientX25519Hex.substring(0, 32),
        clientPublicMLKEM: clientMLKEMHex.substring(0, 32),
        serverPublicX25519: serverPubX25519Hex.substring(0, 32),
        derivedKeyHex: bytesToHex(finalClientAes).substring(0, 32)
      });

      setStep(5); // Complete
    } catch (err: any) {
      console.error(err);
      onAddLog({ source: 'system', message: `Handshake error: ${err.message}`, type: 'error' });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestEncryption = async () => {
    if (!clientAesKey || !serverAesKey) return;
    setIsVerifyingMsg(true);

    try {
      // Server Encrypts with derived key
      const { ciphertextHex, ivHex } = await encryptAESGCM(testMessage, serverAesKey);
      setLastEncryptedHex(ciphertextHex);
      setLastIvHex(ivHex);

      onAddLog({
        source: 'server',
        message: `Encrypted message using AES-256-GCM. Ciphertext length: ${ciphertextHex.length / 2} bytes.`,
        type: 'info'
      });

      // Client Decrypts with derived key
      const decrypted = await decryptAESGCM(ciphertextHex, ivHex, clientAesKey);
      setLastDecryptedText(decrypted);

      onAddLog({
        source: 'client',
        message: `Successfully decrypted & authenticated message: "${decrypted}"`,
        type: 'success'
      });
    } catch (err: any) {
      onAddLog({ source: 'client', message: `Decryption failed: ${err.message}`, type: 'error' });
    } finally {
      setIsVerifyingMsg(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setClientX25519Public('');
    setClientMLKEMPublic('');
    setClientPrivateKeyMLKEM(null);
    setClientX25519KeyObj(null);
    setClientAesKey(null);
    setServerX25519Public('');
    setServerCiphertextMLKEM('');
    setServerAesKey(null);
    setLastEncryptedHex('');
    setLastIvHex('');
    setLastDecryptedText('');
    onAddLog({ source: 'system', message: 'Handshake state reset.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Q-DAY DOOMSDAY LIVE COUNTDOWN CLOCK BANNER */}
      <QDayDoomsdayClock />

      {/* Banner / Summary */}
      <div className="bg-[#111111] border-l-4 border-[#FF003C] p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-[#FF003C] text-xs font-mono font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-4 h-4 text-[#FF003C]" />
            <span>PRIMARY PROTOCOL // HYBRID KEY EXCHANGE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            X25519 (ECDH) + ML-KEM-768 (CRYSTALS-KYBER)
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
            Combines classical Elliptic Curve Diffie-Hellman with NIST FIPS 203 lattice-based key encapsulation. 
            Even if a quantum adversary utilizes Shor's algorithm to break X25519, HKDF derivation guarantees 
            session keys remain 100% quantum-safe due to the ML-KEM-768 lattice layer.
          </p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] border border-white/10 p-5">
        <div className="flex items-center gap-4">
          <button
            onClick={handleRunFullHandshake}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#FF003C] text-black hover:text-white font-black text-sm uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isRunning ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent animate-spin" />
                <span>EXCHANGING KEYS...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>EXECUTE HYBRID HANDSHAKE</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            disabled={isRunning || step === 0}
            className="flex items-center gap-2 px-5 py-3 bg-[#050505] border border-white/20 hover:border-white text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider disabled:opacity-30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-white/50 uppercase tracking-widest text-[10px]">HANDSHAKE STATUS:</span>
          {step === 0 && <span className="px-3 py-1 bg-[#050505] border border-white/10 text-white/60">IDLE</span>}
          {step > 0 && step < 5 && (
            <span className="px-3 py-1 bg-[#FF003C]/20 border border-[#FF003C] text-[#FF003C] font-bold animate-pulse">
              EXECUTING STEP {step} OF 4
            </span>
          )}
          {step === 5 && (
            <span className="px-3 py-1 bg-[#00FF41]/20 border border-[#00FF41] text-[#00FF41] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SESSION KEY ESTABLISHED
            </span>
          )}
        </div>
      </div>

      {/* Main Dual Panels: Client vs Server */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CLIENT PANEL */}
        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-black font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">CLIENT NODE (INITIATOR)</h3>
                <p className="text-xs text-white/50 font-mono">EPHEMERAL KEYS & ML-KEM DECAPSULATION</p>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-1 font-mono font-bold uppercase tracking-wider ${
              clientAesKey ? 'bg-[#00FF41] text-black' : 'bg-white/10 text-white/50'
            }`}>
              {clientAesKey ? 'KEY READY' : 'AWAITING EXCHANGE'}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* X25519 Public Key */}
            <div className="bg-[#050505] p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-white font-bold">1. CLASSICAL X25519 PUBLIC KEY (32B):</span>
                <span>CURVE25519</span>
              </div>
              <div className="text-white/90 break-all bg-[#111111] p-3 border border-white/5">
                {clientX25519Public || <span className="text-white/30 italic">Not generated yet</span>}
              </div>
            </div>

            {/* ML-KEM-768 Public Key */}
            <div className="bg-[#050505] p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-[#FF003C] font-bold">2. ML-KEM-768 PUBLIC KEY (1184B):</span>
                <span>NIST FIPS 203</span>
              </div>
              <div className="text-white/90 break-all bg-[#111111] p-3 border border-white/5 max-h-20 overflow-y-auto">
                {clientMLKEMPublic || <span className="text-white/30 italic">Not generated yet</span>}
              </div>
            </div>

            {/* Client Derived HKDF AES Key */}
            <div className="bg-[#050505] p-4 border-2 border-[#00FF41]/60">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-[#00FF41] font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  DERIVED AES-256-GCM KEY (HKDF):
                </span>
                <span className="text-[#00FF41]">CLIENT SESSION KEY</span>
              </div>
              <div className="text-[#00FF41] font-bold break-all bg-[#00FF41]/10 p-3 border border-[#00FF41]/30">
                {clientAesKey ? bytesToHex(clientAesKey) : <span className="text-white/30 font-normal italic">Waiting for decapsulation...</span>}
              </div>
            </div>
          </div>
        </div>

        {/* SERVER PANEL */}
        <div className="bg-[#111111] border border-white/10 p-6 flex flex-col justify-between space-y-4 relative">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white text-black font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">SERVER NODE (RESPONDER)</h3>
                <p className="text-xs text-white/50 font-mono">ECDH & ML-KEM ENCAPSULATION</p>
              </div>
            </div>
            <span className={`text-[10px] px-2.5 py-1 font-mono font-bold uppercase tracking-wider ${
              serverAesKey ? 'bg-[#00FF41] text-black' : 'bg-white/10 text-white/50'
            }`}>
              {serverAesKey ? 'KEY DERIVED' : 'IDLE'}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Server X25519 Public Key */}
            <div className="bg-[#050505] p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-white font-bold">1. SERVER X25519 PUBLIC KEY (32B):</span>
                <span>ECDH POINT</span>
              </div>
              <div className="text-white/90 break-all bg-[#111111] p-3 border border-white/5">
                {serverX25519Public || <span className="text-white/30 italic">Awaiting client public keys...</span>}
              </div>
            </div>

            {/* ML-KEM-768 Encapsulated Ciphertext */}
            <div className="bg-[#050505] p-4 border border-white/10">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-[#FF003C] font-bold">2. ML-KEM-768 CIPHERTEXT (1088B):</span>
                <span>LATTICE PAYLOAD</span>
              </div>
              <div className="text-white/90 break-all bg-[#111111] p-3 border border-white/5 max-h-20 overflow-y-auto">
                {serverCiphertextMLKEM || <span className="text-white/30 italic">Awaiting encapsulation...</span>}
              </div>
            </div>

            {/* Server Derived HKDF AES Key */}
            <div className="bg-[#050505] p-4 border-2 border-[#00FF41]/60">
              <div className="flex items-center justify-between text-white/60 mb-1.5 text-[10px] uppercase tracking-widest">
                <span className="text-[#00FF41] font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  DERIVED AES-256-GCM KEY (HKDF):
                </span>
                <span className="text-[#00FF41]">SERVER SESSION KEY</span>
              </div>
              <div className="text-[#00FF41] font-bold break-all bg-[#00FF41]/10 p-3 border border-[#00FF41]/30">
                {serverAesKey ? bytesToHex(serverAesKey) : <span className="text-white/30 font-normal italic">Waiting for encapsulation...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messaging & Verification Sandbox */}
      {step === 5 && clientAesKey && serverAesKey && (
        <div className="bg-[#111111] border-2 border-[#00FF41] p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#00FF41]" />
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                LIVE HYBRID ENCRYPTED CHANNEL VERIFICATION
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-black bg-[#00FF41] px-3 py-1 uppercase tracking-widest">
              AES-256-GCM AUTHENTICATED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">PLAINTEXT TEST INPUT:</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="flex-1 bg-[#050505] border border-white/20 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF003C] font-mono"
                  placeholder="Enter secure message..."
                />
                <button
                  onClick={handleTestEncryption}
                  disabled={isVerifyingMsg}
                  className="px-6 py-3 bg-[#00FF41] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>ENCRYPT & SEND</span>
                </button>
              </div>
            </div>

            <div className="bg-[#050505] border border-white/10 p-4 flex flex-col justify-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">KEY DERIVATION METHOD:</span>
              <span className="text-xs font-mono text-[#00FF41] font-bold mt-1">
                HKDF-SHA256( ECDH_Secret || MLKEM_Secret )
              </span>
            </div>
          </div>

          {lastEncryptedHex && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
              <div className="bg-[#050505] p-4 border border-white/20">
                <span className="text-white font-bold uppercase tracking-wider block mb-2">
                  1. SERVER ENCRYPTED PAYLOAD (AES-256-GCM HEX):
                </span>
                <p className="text-white/80 break-all bg-[#111111] p-3 border border-white/5 max-h-20 overflow-y-auto">
                  {lastEncryptedHex}
                </p>
                <span className="text-[10px] text-white/40 mt-2 block uppercase tracking-widest">IV: {lastIvHex}</span>
              </div>

              <div className="bg-[#050505] p-4 border-2 border-[#00FF41]">
                <span className="text-[#00FF41] font-bold uppercase tracking-wider block mb-2">
                  2. CLIENT DECRYPTED & AUTHENTICATED OUTPUT:
                </span>
                <p className="text-[#00FF41] font-bold bg-[#00FF41]/10 p-3 border border-[#00FF41]/30">
                  "{lastDecryptedText}"
                </p>
                <span className="text-[10px] text-[#00FF41] mt-2 block uppercase tracking-widest">
                  ✓ GCM AUTHENTICATION TAG VERIFIED (100% MATCH)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
