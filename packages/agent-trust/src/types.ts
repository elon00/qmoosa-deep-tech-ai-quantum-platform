export type TrustDecision = "ALLOW" | "DENY";

export interface AgentIdentity {
  agentId: string;
  verified: boolean;
  issuer?: string;
}

export interface TrustProfile {
  score: number;
  lastUpdated: string;
}

export interface TrustDecisionRecord {
  agentId: string;
  action: string;
  decision: TrustDecision;
  reason: string;
  timestamp: string;
}
