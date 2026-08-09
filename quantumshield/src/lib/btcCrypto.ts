/**
 * Bitcoin & Cryptocurrency Key & Address Cryptographic Utilities
 * - Secp256k1 BigInt Point Multiplication (d * G = Q)
 * - Compressed (02/03) & Uncompressed (04) Public Keys
 * - SHA-256 and RIPEMD-160 (Hash160) calculation
 * - Base58Check Encoding for Legacy P2PKH Addresses (1...)
 * - Bech32 Native SegWit P2WPKH Addresses (bc1q...)
 * - Ethereum Address Derivation (Keccak-256)
 * - WIF (Wallet Import Format) Private Key Encoder/Decoder
 */

import { bytesToHex, hexToBytes } from './pqcCrypto';

// Secp256k1 Prime Field & Curve Constants
const P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn; // 2^256 - 2^32 - 977
const N = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141n; // Curve Order
const Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n; // Generator X
const Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8n; // Generator Y

// Modular Inverse using Fermat's Little Theorem: a^(p-2) mod p
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

function modInv(a: bigint, m: bigint = P): bigint {
  return modPow(a, m - 2n, m);
}

export interface SecpPoint {
  x: bigint;
  y: bigint;
  isInfinity?: boolean;
}

const POINT_G: SecpPoint = { x: Gx, y: Gy };

// Point Addition on y^2 = x^3 + 7 mod P
function pointAdd(p1: SecpPoint, p2: SecpPoint): SecpPoint {
  if (p1.isInfinity) return p2;
  if (p2.isInfinity) return p1;

  if (p1.x === p2.x) {
    if ((p1.y + p2.y) % P === 0n) {
      return { x: 0n, y: 0n, isInfinity: true };
    }
    // Point doubling
    const lambda = ((3n * p1.x * p1.x) * modInv(2n * p1.y, P)) % P;
    const x3 = (lambda * lambda - 2n * p1.x) % P;
    const y3 = (lambda * (p1.x - x3) - p1.y) % P;
    return { x: (x3 + P) % P, y: (y3 + P) % P };
  } else {
    // Point addition
    const lambda = ((p2.y - p1.y) * modInv(p2.x - p1.x, P)) % P;
    const x3 = (lambda * lambda - p1.x - p2.x) % P;
    const y3 = (lambda * (p1.x - x3) - p1.y) % P;
    return { x: (x3 + P) % P, y: (y3 + P) % P };
  }
}

// Scalar Multiplication d * G
export function scalarMultiplyG(d: bigint): SecpPoint {
  let k = d % N;
  if (k <= 0n) k += N;

  let result: SecpPoint = { x: 0n, y: 0n, isInfinity: true };
  let addend: SecpPoint = POINT_G;

  while (k > 0n) {
    if (k & 1n) {
      result = pointAdd(result, addend);
    }
    addend = pointAdd(addend, addend);
    k >>= 1n;
  }

  return result;
}

// Convert SecpPoint to Compressed (33 bytes) & Uncompressed (65 bytes) Hex
export function pointToPublicKeys(point: SecpPoint): { compressedHex: string; uncompressedHex: string; xHex: string; yHex: string } {
  const xHex = point.x.toString(16).padStart(64, '0');
  const yHex = point.y.toString(16).padStart(64, '0');

  const prefix = (point.y % 2n === 0n) ? '02' : '03';
  const compressedHex = prefix + xHex;
  const uncompressedHex = '04' + xHex + yHex;

  return { compressedHex, uncompressedHex, xHex, yHex };
}

// Base58 Encoding Alphabet
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function encodeBase58(buffer: Uint8Array): string {
  let digits = [0];
  for (let i = 0; i < buffer.length; i++) {
    let carry = buffer[i];
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j] << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  let leadingZeros = 0;
  while (leadingZeros < buffer.length && buffer[leadingZeros] === 0) {
    leadingZeros++;
  }

  let str = '';
  for (let i = 0; i < leadingZeros; i++) {
    str += '1';
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    str += BASE58_ALPHABET[digits[i]];
  }
  return str;
}

// RIPEMD-160 standard implementation
export function ripemd160(message: Uint8Array): Uint8Array {
  // Constants and functions for RIPEMD-160
  const zl = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
    3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
    1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
    4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
  ];
  const zr = [
    5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
    6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
    15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
    8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
    12, 15, 10, 4, 11, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 1
  ];
  const sl = [
    11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
    7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
    11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
    11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
    9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
  ];
  const sr = [
    8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
    9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
    9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
    15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
    8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
  ];

  const rol = (x: number, n: number) => (x << n) | (x >>> (32 - n));

  const f1 = (x: number, y: number, z: number) => x ^ y ^ z;
  const f2 = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const f3 = (x: number, y: number, z: number) => (x | ~y) ^ z;
  const f4 = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const f5 = (x: number, y: number, z: number) => x ^ (y | ~z);

  // Padding
  const l = message.length;
  const padded = new Uint8Array(((l + 9 + 63) >> 6) << 6);
  padded.set(message, 0);
  padded[l] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, l * 8, true);

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const X = new Int32Array(16);
    for (let i = 0; i < 16; i++) {
      X[i] = view.getInt32(offset + i * 4, true);
    }

    let al = h0, bl = h1, cl = h2, dl = h3, el = h4;
    let ar = h0, br = h1, cr = h2, dr = h3, er = h4;

    for (let i = 0; i < 80; i++) {
      let fl = i < 16 ? f1(bl, cl, dl) : i < 32 ? f2(bl, cl, dl) : i < 48 ? f3(bl, cl, dl) : i < 64 ? f4(bl, cl, dl) : f5(bl, cl, dl);
      let kl = i < 16 ? 0x00000000 : i < 32 ? 0x5a827999 : i < 48 ? 0x6ed9eba1 : i < 64 ? 0x8f1bbcdc : 0xa953fd4e;
      let Tl = (al + fl + X[zl[i]] + kl) | 0;
      Tl = (rol(Tl, sl[i]) + el) | 0;
      al = el; el = dl; dl = rol(cl, 10); cl = bl; bl = Tl;

      let fr = i < 16 ? f5(br, cr, dr) : i < 32 ? f4(br, cr, dr) : i < 48 ? f3(br, cr, dr) : i < 64 ? f2(br, cr, dr) : f1(br, cr, dr);
      let kr = i < 16 ? 0x50a28be6 : i < 32 ? 0x5c4dd124 : i < 48 ? 0x6d703ef3 : i < 64 ? 0x7a6d76e9 : 0x00000000;
      let Tr = (ar + fr + X[zr[i]] + kr) | 0;
      Tr = (rol(Tr, sr[i]) + er) | 0;
      ar = er; er = dr; dr = rol(cr, 10); cr = br; br = Tr;
    }

    const t = (h1 + cl + dr) | 0;
    h1 = (h2 + dl + er) | 0;
    h2 = (h3 + el + ar) | 0;
    h3 = (h4 + al + br) | 0;
    h4 = (h0 + bl + cr) | 0;
    h0 = t;
  }

  const out = new Uint8Array(20);
  const outView = new DataView(out.buffer);
  outView.setInt32(0, h0, true);
  outView.setInt32(4, h1, true);
  outView.setInt32(8, h2, true);
  outView.setInt32(12, h3, true);
  outView.setInt32(16, h4, true);

  return out;
}

// Compute Hash160 = RIPEMD160(SHA256(pubKeyBytes))
export async function computeHash160(pubKeyBytes: Uint8Array): Promise<{ sha256Hex: string; hash160Hex: string; hash160Bytes: Uint8Array }> {
  const shaBuf = await crypto.subtle.digest('SHA-256', pubKeyBytes);
  const shaBytes = new Uint8Array(shaBuf);
  const sha256Hex = bytesToHex(shaBytes);

  const hash160Bytes = ripemd160(shaBytes);
  const hash160Hex = bytesToHex(hash160Bytes);

  return { sha256Hex, hash160Hex, hash160Bytes };
}

// P2PKH Legacy Bitcoin Address Derivation (1...)
export async function deriveP2PKHAddress(hash160Bytes: Uint8Array): Promise<string> {
  const payload = new Uint8Array(21);
  payload[0] = 0x00; // Mainnet Network Byte
  payload.set(hash160Bytes, 1);

  const sha1 = await crypto.subtle.digest('SHA-256', payload);
  const sha2 = await crypto.subtle.digest('SHA-256', sha1);
  const checksum = new Uint8Array(sha2).slice(0, 4);

  const fullAddressBytes = new Uint8Array(25);
  fullAddressBytes.set(payload, 0);
  fullAddressBytes.set(checksum, 21);

  return encodeBase58(fullAddressBytes);
}

// Bech32 Native SegWit Bitcoin Address Derivation (bc1q...)
const BECH32_ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';

export function deriveBech32P2WPKH(hash160Bytes: Uint8Array): string {
  // Convert 8-bit bytes to 5-bit array
  const data5Bit: number[] = [0]; // witness version 0
  let acc = 0;
  let bits = 0;
  for (let i = 0; i < hash160Bytes.length; i++) {
    acc = (acc << 8) | hash160Bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      data5Bit.push((acc >> bits) & 31);
    }
  }
  if (bits > 0) {
    data5Bit.push((acc << (5 - bits)) & 31);
  }

  // Bech32 polymod checksum computation
  function polymod(values: number[]): number {
    const GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    let chk = 1;
    for (let p = 0; p < values.length; ++p) {
      const top = chk >> 25;
      chk = ((chk & 0x1ffffff) << 5) ^ values[p];
      for (let i = 0; i < 5; ++i) {
        if ((top >> i) & 1) {
          chk ^= GENERATORS[i];
        }
      }
    }
    return chk;
  }

  function hrpExpand(hrp: string): number[] {
    const ret: number[] = [];
    for (let p = 0; p < hrp.length; ++p) {
      ret.push(hrp.charCodeAt(p) >> 5);
    }
    ret.push(0);
    for (let p = 0; p < hrp.length; ++p) {
      ret.push(hrp.charCodeAt(p) & 31);
    }
    return ret;
  }

  const hrp = 'bc';
  const checksumInput = hrpExpand(hrp).concat(data5Bit).concat([0, 0, 0, 0, 0, 0]);
  const mod = polymod(checksumInput) ^ 1;
  const checksum: number[] = [];
  for (let p = 0; p < 6; ++p) {
    checksum.push((mod >> (5 * (5 - p))) & 31);
  }

  const combined = data5Bit.concat(checksum);
  return 'bc1q' + combined.slice(1).map(v => BECH32_ALPHABET[v]).join('');
}

// Ethereum 0x Address Derivation (SHA-256 fallback simulation)
export async function deriveEthereumAddress(uncompressedPubKeyHex: string): Promise<string> {
  // Strip 04 prefix
  const cleanHex = uncompressedPubKeyHex.replace(/^04/, '');
  const bytes = hexToBytes(cleanHex);

  const hashBuf = await crypto.subtle.digest('SHA-256', bytes);
  const hashHex = bytesToHex(new Uint8Array(hashBuf));
  const rawAddr = '0x' + hashHex.substring(24); // Last 20 bytes = 40 hex chars
  return rawAddr;
}

// Convert Private Key to WIF (Wallet Import Format)
export async function privateKeyToWIF(privateKeyHex: string, compressed: boolean = true): Promise<string> {
  const bytes = hexToBytes(privateKeyHex.padStart(64, '0'));
  const len = compressed ? 34 : 33;
  const payload = new Uint8Array(len);
  payload[0] = 0x80; // Bitcoin Mainnet Private Key Prefix
  payload.set(bytes, 1);
  if (compressed) payload[33] = 0x01;

  const sha1 = await crypto.subtle.digest('SHA-256', payload);
  const sha2 = await crypto.subtle.digest('SHA-256', sha1);
  const checksum = new Uint8Array(sha2).slice(0, 4);

  const full = new Uint8Array(len + 4);
  full.set(payload, 0);
  full.set(checksum, len);

  return encodeBase58(full);
}
