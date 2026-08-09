/**
 * Cryptographic Utility for Hybrid Post-Quantum Key Exchange
 * Combines X25519 (ECDH) + ML-KEM-768 (Crystals-Kyber) + HKDF-SHA256 + AES-256-GCM
 */

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

export class MLKEM768Simulator {
  PUBLIC_KEY_BYTES = 1184;
  CIPHERTEXT_BYTES = 1088;
  SHARED_SECRET_BYTES = 32;

  async generateKeyPair(): Promise<{ publicKey: Uint8Array; privateKey: Uint8Array }> {
    const rawEntropy = new Uint8Array(64);
    crypto.getRandomValues(rawEntropy);
    
    const publicKey = new Uint8Array(this.PUBLIC_KEY_BYTES);
    crypto.getRandomValues(publicKey);
    publicKey.set(rawEntropy.slice(0, 32), 0);
    
    const privateKey = new Uint8Array(2400); // ML-KEM-768 private key length
    crypto.getRandomValues(privateKey);
    privateKey.set(rawEntropy, 0);

    return { publicKey, privateKey };
  }

  async encapsulate(publicKey: Uint8Array): Promise<{ ciphertext: Uint8Array; sharedSecret: Uint8Array }> {
    const sharedSecret = new Uint8Array(this.SHARED_SECRET_BYTES);
    crypto.getRandomValues(sharedSecret);
    
    const ciphertext = new Uint8Array(this.CIPHERTEXT_BYTES);
    crypto.getRandomValues(ciphertext);
    // Embed deterministically bound entropy for simulation verification
    ciphertext.set(sharedSecret.slice(0, 16), 0);
    ciphertext.set(publicKey.slice(0, 16), 16);
    
    return { ciphertext, sharedSecret };
  }

  async decapsulate(ciphertext: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
    const sharedSecret = new Uint8Array(this.SHARED_SECRET_BYTES);
    if (ciphertext.length === this.CIPHERTEXT_BYTES) {
      sharedSecret.set(ciphertext.slice(0, 16), 0);
      sharedSecret.set(privateKey.slice(0, 16), 16);
    } else {
      crypto.getRandomValues(sharedSecret);
    }
    return sharedSecret;
  }
}

export async function deriveHybridSessionKey(
  ecdhSecret: Uint8Array,
  pqSecret: Uint8Array,
  salt: Uint8Array = new Uint8Array(32)
): Promise<Uint8Array> {
  const combinedSecret = new Uint8Array(ecdhSecret.length + pqSecret.length);
  combinedSecret.set(ecdhSecret, 0);
  combinedSecret.set(pqSecret, ecdhSecret.length);

  const encoder = new TextEncoder();
  const info = encoder.encode("QuantumShield-Hybrid-X25519-MLKEM768-HKDF-SHA256");

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    combinedSecret,
    { name: "HKDF" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: salt, info: info },
    keyMaterial,
    256
  );

  return new Uint8Array(derivedBits);
}

export async function encryptAESGCM(
  plaintext: string,
  keyBytes: Uint8Array
): Promise<{ ciphertextHex: string; ivHex: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    cryptoKey,
    encoder.encode(plaintext)
  );

  return {
    ciphertextHex: bytesToHex(new Uint8Array(encrypted)),
    ivHex: bytesToHex(iv)
  };
}

export async function decryptAESGCM(
  ciphertextHex: string,
  ivHex: string,
  keyBytes: Uint8Array
): Promise<string> {
  const iv = hexToBytes(ivHex);
  const encryptedBytes = hexToBytes(ciphertextHex);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    cryptoKey,
    encryptedBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export function getBenchmarkComparisonData() {
  return [
    {
      algorithm: 'RSA-2048',
      category: 'Classical RSA' as const,
      publicKeySize: 256,
      privateKeySize: 1184,
      ciphertextOverhead: 256,
      handshakeTimeMs: 14.2,
      quantumSecurityBits: 0,
      classicalSecurityBits: 112,
      nistStatus: 'Deprecating' as const,
      shorVulnerable: true
    },
    {
      algorithm: 'RSA-4096',
      category: 'Classical RSA' as const,
      publicKeySize: 512,
      privateKeySize: 2352,
      ciphertextOverhead: 512,
      handshakeTimeMs: 92.5,
      quantumSecurityBits: 0,
      classicalSecurityBits: 128,
      nistStatus: 'Deprecating' as const,
      shorVulnerable: true
    },
    {
      algorithm: 'ECDH Secp256r1',
      category: 'Classical ECC' as const,
      publicKeySize: 64,
      privateKeySize: 32,
      ciphertextOverhead: 64,
      handshakeTimeMs: 0.8,
      quantumSecurityBits: 0,
      classicalSecurityBits: 128,
      nistStatus: 'Disallowed Post-2030' as const,
      shorVulnerable: true
    },
    {
      algorithm: 'X25519 (Curve25519)',
      category: 'Classical ECC' as const,
      publicKeySize: 32,
      privateKeySize: 32,
      ciphertextOverhead: 32,
      handshakeTimeMs: 0.4,
      quantumSecurityBits: 0,
      classicalSecurityBits: 128,
      nistStatus: 'Disallowed Post-2030' as const,
      shorVulnerable: true
    },
    {
      algorithm: 'ML-KEM-768 (Kyber)',
      category: 'NIST PQC' as const,
      publicKeySize: 1184,
      privateKeySize: 2400,
      ciphertextOverhead: 1088,
      handshakeTimeMs: 1.1,
      quantumSecurityBits: 192,
      classicalSecurityBits: 192,
      nistStatus: 'NIST Standard (FIPS 203)' as const,
      shorVulnerable: false
    },
    {
      algorithm: 'X25519 + ML-KEM-768 Hybrid',
      category: 'Hybrid PQC' as const,
      publicKeySize: 1216,
      privateKeySize: 2432,
      ciphertextOverhead: 1120,
      handshakeTimeMs: 1.5,
      quantumSecurityBits: 192,
      classicalSecurityBits: 256,
      nistStatus: 'Recommended Hybrid' as const,
      shorVulnerable: false
    }
  ];
}
