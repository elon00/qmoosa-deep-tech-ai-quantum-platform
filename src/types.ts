export type QuantumBackend =
  | "qiskit"
  | "pennylane"
  | "classiq"
  | "qniverse"
  | "cirq"
  | "simulator";

export type NoiseModelType = "none" | "depolarizing" | "thermal" | "phase_damping";

export interface QuantumRegister {
  controlQubits: number; // e.g. 4 or 8 qubits for phase estimation
  targetQubits: number;  // e.g. 4 qubits for modular arithmetic |f(x)>
}

export interface ShorStepData {
  stepIndex: number;
  title: string;
  description: string;
  mathFormula?: string;
  status: "idle" | "running" | "completed" | "failed";
  data?: any;
}

export interface FactorizationResult {
  N: number;
  a: number;
  period_r: number;
  p: number;
  q: number;
  success: boolean;
  steps: ShorStepData[];
  measuredFractions: { decimal: number; fraction: string; periodCandidate: number; probability: number }[];
  stateVectorProbabilities: { stateBin: string; stateDec: number; prob: number; phase: number }[];
  executionTimeMs: number;
  qubitTotal: number;
  gatesCount: { hadamard: number; c_unitary: number; qft: number; measurement: number };
  openQasmCode: string;
  pythonQiskitCode: string;
}

export interface BitcoinChallengeLevel {
  id: number;
  title: string;
  category: "RSA_PRIME" | "MODULAR_EXP" | "ECDSA_DISCRETE_LOG" | "POST_QUANTUM_DEFENSE";
  difficulty: "Novice" | "Intermediate" | "Advanced" | "Quantum Master";
  targetN: number;
  suggestedCoprime: number;
  requiredQubits: number;
  classicalTimeEst: string;
  quantumTimeEst: string;
  pointsReward: number;
  badgeReward: string;
  scenario: string;
  hint: string;
  completed: boolean;
  txHash?: string;
}

export interface SolanaPlayerProfile {
  publicKey: string;
  balanceSol: number;
  qBitsTokens: number;
  level: number;
  experience: number;
  tasksCompleted: number;
  badges: Array<{
    id: string;
    title: string;
    description: string;
    unlockedAt: string;
    icon: string;
  }>;
}

export interface SolanaTransactionRecord {
  signature: string;
  slot: number;
  blockTime: string;
  instruction: "initialize_player" | "update_score" | "mint_badge" | "verify_proof";
  player: string;
  points: number;
  taskId: string;
  status: "finalized" | "confirmed" | "failed";
  explorerUrl: string;
}

export interface ExecutaRpcMessage {
  id: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  type: "request" | "response" | "notification";
  method?: string;
  payload: any;
}

export type NavigationTab =
  | "home"
  | "shor_visualizer"
  | "circuit_studio"
  | "bitcoin_arena"
  | "solana_relayer"
  | "anna_executa"
  | "research"
  | "workspace"
  | "ai-workspace"
  | "products"
  | "solutions"
  | "lab"
  | "quantum"
  | "blockchain"
  | "cryptography"
  | "algorithms"
  | "developers"
  | "admin";

export interface Agent {
  id: string;
  name: string;
  domain?: string;
  role?: string;
  status?: "idle" | "busy" | "training" | "offline";
  description: string;
  systemPrompt?: string;
  model?: string;
  tools: string[];
  permissions: string[];
  avatar?: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system" | "agent";
  agentId?: string;
  text: string;
  timestamp: string;
  quantumData?: any;
  blockchainData?: any;
  metadata?: any;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  agentId?: string;
  isPinned?: boolean;
  messages: ChatMessage[];
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
  iconName?: string;
  isPopular?: boolean;
  isInstalled?: boolean;
  status?: string;
}

export interface ProjectItem {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  description: string;
  status: string;
  tags?: string[];
  updatedAt: string;
}

export interface AlgorithmLabItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  qubitsRequired?: number;
  complexityTime?: string;
  complexitySpace?: string;
  problem?: string;
  proofSummary?: string;
  implementationCode?: string;
  benchmarkSpeedup?: string;
  tags?: string[];
}

export interface ProductItem {
  id: string;
  name?: string;
  title?: string;
  tagline?: string;
  description: string;
  features?: string[];
  badge?: string;
  iconName?: string;
  status?: string;
  category?: string;
}

export interface SolutionItem {
  id: string;
  title?: string;
  headline?: string;
  targetAudience?: string;
  description: string;
  industry?: string;
  benefits?: string[];
  iconName?: string;
}

export interface CaseStudyItem {
  id: string;
  title?: string;
  client?: string;
  industry?: string;
  impact?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  architecture?: string[] | string;
  metrics?: Array<{ label: string; value: string }>;
}

export interface TestimonialItem {
  id: string;
  clientName?: string;
  author?: string;
  role: string;
  company: string;
  avatarUrl?: string;
  verificationStatus?: string;
  publishedAt?: string;
  quote: string;
}

