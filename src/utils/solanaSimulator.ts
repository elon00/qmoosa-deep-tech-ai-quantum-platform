import { SolanaPlayerProfile, SolanaTransactionRecord } from "../types";
import { ed25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha256.js";

const LOCAL_STORAGE_KEY_PLAYER = "omniver_solana_player_profile_v1";
const LOCAL_STORAGE_KEY_TXS = "omniver_solana_transactions_v1";

const B58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function toBase58(bytes: Uint8Array): string {
  const digits = [0];
  for (let i = 0; i < bytes.length; i++) {
    for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
    digits[0] += bytes[i];
    let carry = 0;
    for (let j = 0; j < digits.length; j++) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) digits.push(0);
  return digits.reverse().map(d => B58_ALPHABET[d]).join('');
}

function getCryptoRandomBytes(len: number): Uint8Array {
  const buf = new Uint8Array(len);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(buf);
  } else {
    for (let i = 0; i < len; i++) buf[i] = (Date.now() + i * 17) & 0xff;
  }
  return buf;
}

function generateCryptographicSolanaPubkey(): string {
  const priv = getCryptoRandomBytes(32);
  const pub = ed25519.getPublicKey(priv);
  return toBase58(pub);
}

function generateCryptographicSignature(data?: Uint8Array): string {
  const priv = getCryptoRandomBytes(32);
  const msg = data || getCryptoRandomBytes(32);
  const sig = ed25519.sign(msg, priv);
  return toBase58(sig);
}

export function getInitialPlayerProfile(): SolanaPlayerProfile {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PLAYER);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }

  const initial: SolanaPlayerProfile = {
    publicKey: generateCryptographicSolanaPubkey(),
    balanceSol: 4.82,
    qBitsTokens: 150,
    level: 1,
    experience: 80,
    tasksCompleted: 1,
    badges: [
      {
        id: "badge_novice",
        title: "Qubit Initiate",
        description: "Registered on-chain PDA and initialized quantum execution pipeline",
        unlockedAt: new Date(Date.now() - 3600000).toISOString(),
        icon: "zap",
      },
    ],
  };

  savePlayerProfile(initial);
  return initial;
}

export function savePlayerProfile(profile: SolanaPlayerProfile) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PLAYER, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save player profile", e);
  }
}

export function getInitialTransactions(playerPubkey: string): SolanaTransactionRecord[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TXS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }

  const initial: SolanaTransactionRecord[] = [
    {
      signature: generateCryptographicSignature(),
      slot: 284109201,
      blockTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      instruction: "initialize_player",
      player: playerPubkey,
      points: 50,
      taskId: "genesis_init_001",
      status: "finalized",
      explorerUrl: `https://explorer.solana.com/tx/genesis_init_001?cluster=devnet`,
    },
  ];

  saveTransactions(initial);
  return initial;
}

export function saveTransactions(txs: SolanaTransactionRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TXS, JSON.stringify(txs));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
}

export function recordOnChainDecodeProof(
  player: SolanaPlayerProfile,
  pointsEarned: number,
  taskId: string,
  badgeTitle?: string
): { updatedProfile: SolanaPlayerProfile; newTx: SolanaTransactionRecord } {
  const nonce = getCryptoRandomBytes(4);
  const offset = (nonce[0] << 8) | nonce[1];
  const slot = 284110000 + offset;
  const signature = generateCryptographicSignature(new TextEncoder().encode(`${taskId}_${slot}`));

  const updatedExp = player.experience + pointsEarned;
  const newLevel = Math.floor(updatedExp / 100) + 1;
  const updatedTokens = player.qBitsTokens + pointsEarned * 2;
  const updatedTasks = player.tasksCompleted + 1;

  const updatedBadges = [...player.badges];
  if (badgeTitle && !updatedBadges.some((b) => b.title === badgeTitle)) {
    const badgeDigest = Array.from(sha256(new TextEncoder().encode(`${badgeTitle}_${taskId}`))).map(b => b.toString(16).padStart(2, '0')).join('');
    updatedBadges.push({
      id: "badge_" + badgeDigest.substring(0, 8),
      title: badgeTitle,
      description: `Awarded for solving task #${taskId} with quantum precision.`,
      unlockedAt: new Date().toISOString(),
      icon: "award",
    });
  }

  const updatedProfile: SolanaPlayerProfile = {
    ...player,
    experience: updatedExp,
    level: newLevel,
    qBitsTokens: updatedTokens,
    tasksCompleted: updatedTasks,
    badges: updatedBadges,
  };

  const newTx: SolanaTransactionRecord = {
    signature,
    slot,
    blockTime: new Date().toISOString(),
    instruction: badgeTitle ? "mint_badge" : "update_score",
    player: player.publicKey,
    points: pointsEarned,
    taskId,
    status: "finalized",
    explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
  };

  savePlayerProfile(updatedProfile);

  const currentTxs = getInitialTransactions(player.publicKey);
  const updatedTxs = [newTx, ...currentTxs];
  saveTransactions(updatedTxs);

  return { updatedProfile, newTx };
}
