export interface AgentPolicy {
  allowedActions: string[];
  allowedContracts?: string[];
  maxSpend?: number;
  expiresAt?: string;
}
