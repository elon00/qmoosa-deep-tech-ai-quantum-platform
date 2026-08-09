export interface KeyPairInfo {
  algorithm: 'RSA-2048' | 'RSA-4096' | 'ECDH-P256' | 'X25519' | 'ML-KEM-768' | 'Hybrid-X25519-MLKEM';
  publicKeyHex: string;
  privateKeyHex?: string;
  bytesCount: number;
}

export interface HandshakeStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp?: string;
  details?: Record<string, string | number>;
}

export interface HandshakeSession {
  sessionId: string;
  createdAt: string;
  clientPublicX25519: string;
  clientPublicMLKEM: string;
  serverPublicX25519?: string;
  serverCiphertextMLKEM?: string;
  derivedAesKeyHex?: string;
  status: 'initiated' | 'key_exchanged' | 'established' | 'failed';
  latencyMs?: number;
}

export interface BenchmarkMetrics {
  algorithm: string;
  category: 'Classical RSA' | 'Classical ECC' | 'NIST PQC' | 'Hybrid PQC';
  publicKeySize: number; // in bytes
  privateKeySize: number; // in bytes
  ciphertextOverhead: number; // in bytes
  handshakeTimeMs: number;
  quantumSecurityBits: number; // 0 for RSA/ECC, 128/192/256 for PQC
  classicalSecurityBits: number;
  nistStatus: 'Deprecating' | 'Disallowed Post-2030' | 'NIST Standard (FIPS 203)' | 'Recommended Hybrid';
  shorVulnerable: boolean;
}

export interface SecurityAuditResult {
  overallRiskScore: number; // 0 to 100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'QUANTUM_SAFE';
  vulnerabilities: {
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    affectedStandard: string;
  }[];
  recommendations: {
    action: string;
    details: string;
    targetStandard: string;
    codeSnippet?: string;
  }[];
  summary: string;
  aiAnalysis?: string;
}

export interface VaultMessage {
  id: string;
  sender: 'client' | 'server' | 'system';
  plaintext: string;
  ciphertextHex: string;
  ivHex: string;
  tagHex?: string;
  timestamp: string;
  verified: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'client' | 'server' | 'system' | 'ai';
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  data?: any;
}

export interface PaymentTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'grant';
  amount: number;
  currency: 'USD' | 'ETH' | 'PQC_TOKEN';
  status: 'completed' | 'pending' | 'failed';
  sender: string;
  recipient: string;
  timestamp: string;
  memo?: string;
  pqcSignatureHex?: string;
}

export interface PaymentGatewayState {
  balanceUSD: number;
  balanceETH: number;
  balancePQCToken: number;
  transactions: PaymentTransaction[];
}

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (event: string, handler: (...args: any[]) => void) => void;
      removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

