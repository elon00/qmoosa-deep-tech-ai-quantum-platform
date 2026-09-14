export interface Policy {
  allowedActions: string[];
  allowedContracts?: string[];
  maxAmount?: number;
  currency?: string;
  expiresAt?: string;
}

export interface PolicyRequest {
  action: string;
  contractAddress?: string;
  amount?: number;
  currency?: string;
  now?: string;
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
}
