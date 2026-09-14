export interface Policy {
  allowedActions: string[];
  maxAmount?: number;
  currency?: string;
  expiresAt?: string;
}

export interface PolicyRequest {
  action: string;
  amount?: number;
  currency?: string;
  now?: string;
}

export interface PolicyDecision {
  allowed: boolean;
  reason: string;
}
