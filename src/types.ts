export type NavigationTab =
  | "home"
  | "ai-workspace"
  | "quantum"
  | "blockchain"
  | "cryptography"
  | "algorithms"
  | "web4"
  | "products"
  | "solutions"
  | "developers"
  | "research"
  | "case-studies"
  | "testimonials"
  | "careers"
  | "contact"
  | "admin"
  | "legal";

export interface Agent {
  id: string;
  name: string;
  domain: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  model: string;
  tools: string[];
  permissions: string[];
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  agentId?: string;
  text: string;
  timestamp: string;
  codeBlocks?: { language: string; code: string }[];
  quantumData?: {
    qubits: number;
    states: { state: string; probability: number; amplitude: string }[];
  };
  blockchainData?: {
    chain: string;
    hash: string;
    verified: boolean;
    securityScore: number;
  };
  attachments?: { name: string; size: string; type: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  agentId: string;
  messages: ChatMessage[];
  folder?: string;
  isPinned?: boolean;
  isArchived?: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  category: "AI" | "Development" | "Blockchain" | "Quantum" | "Research";
  iconName: string;
  description: string;
  status: "Active" | "Beta" | "Experimental";
  isInstalled?: boolean;
}

export interface QuantumGate {
  id: string;
  type: "H" | "X" | "Y" | "Z" | "CNOT" | "T" | "S" | "MEASURE";
  qubit: number;
  targetQubit?: number;
  step: number;
}

export interface QuantumStateResult {
  qubits: number;
  gateCount: number;
  circuitDepth: number;
  fidelity: number;
  states: { state: string; probability: number; amplitude: string }[];
  executionTimeMs: number;
}

export interface BlockchainAuditResult {
  chain: string;
  verified: boolean;
  contractHash: string;
  bytecodeSize: string;
  vulnerabilitiesFound: number;
  securityScore: number;
  auditTrail: { step: string; result: string }[];
}

export interface AlgorithmLabItem {
  id: string;
  title: string;
  category: "Graph" | "Quantum" | "Crypto" | "Optimization" | "Machine Learning";
  complexityTime: string;
  complexitySpace: string;
  problem: string;
  proofSummary: string;
  implementationCode: string;
  benchmarkSpeedup: string;
}

export interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  iconName: string;
  features: string[];
  status: "GA" | "Beta" | "Enterprise";
}

export interface SolutionItem {
  id: string;
  targetAudience: string;
  headline: string;
  description: string;
  benefits: string[];
  iconName: string;
}

export interface CaseStudyItem {
  id: string;
  client: string;
  industry: string;
  problem: string;
  solution: string;
  architecture: string[];
  metrics: { label: string; value: string }[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  company: string;
  role: string;
  avatarUrl: string;
  quote: string;
  verificationStatus: "Verified Client" | "Audited Partner";
  publishedAt: string;
}

export interface DeveloperKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: "AI" | "Blockchain" | "Quantum" | "Research" | "Web3";
  status: "Active" | "Completed" | "In Review";
  updatedAt: string;
  description: string;
}
