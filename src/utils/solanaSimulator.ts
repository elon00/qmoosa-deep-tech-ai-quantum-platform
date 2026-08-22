import { SolanaPlayerProfile, SolanaTransactionRecord } from "../types";

const LOCAL_STORAGE_KEY_PLAYER = "omniver_solana_player_profile_v1";
const LOCAL_STORAGE_KEY_TXS = "omniver_solana_transactions_v1";

function generateRandomSolanaPubkey(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "Omni";
  for (let i = 0; i < 40; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomSignature(): string {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let result = "5";
  for (let i = 0; i < 86; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
    publicKey: generateRandomSolanaPubkey(),
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
      signature: generateRandomSignature(),
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
  const signature = generateRandomSignature();
  const slot = 284110000 + Math.floor(Math.random() * 50000);

  const updatedExp = player.experience + pointsEarned;
  const newLevel = Math.floor(updatedExp / 100) + 1;
  const updatedTokens = player.qBitsTokens + pointsEarned * 2;
  const updatedTasks = player.tasksCompleted + 1;

  const updatedBadges = [...player.badges];
  if (badgeTitle && !updatedBadges.some((b) => b.title === badgeTitle)) {
    updatedBadges.push({
      id: "badge_" + Math.random().toString(36).substring(2, 8),
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
