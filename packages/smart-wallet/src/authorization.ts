export interface WalletAuthorizationRequest {
  trustAllowed: boolean;
  policyAllowed: boolean;
  amount?: number;
  remainingLimit?: number;
}

export interface WalletAuthorizationDecision {
  allowed: boolean;
  reason: string;
}

export function authorizeWallet(request: WalletAuthorizationRequest): WalletAuthorizationDecision {
  if (!request.trustAllowed) {
    return { allowed: false, reason: "trust layer denied the action" };
  }
  if (!request.policyAllowed) {
    return { allowed: false, reason: "policy engine denied the action" };
  }
  if (request.amount !== undefined && request.amount < 0) {
    return { allowed: false, reason: "amount must be non-negative" };
  }
  if (
    request.amount !== undefined &&
    request.remainingLimit !== undefined &&
    request.amount > request.remainingLimit
  ) {
    return { allowed: false, reason: "amount exceeds remaining wallet limit" };
  }

  return { allowed: true, reason: "trust and policy checks passed" };
}
