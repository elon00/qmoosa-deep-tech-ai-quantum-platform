import type { Policy, PolicyDecision, PolicyRequest } from "./types";

export function evaluatePolicy(policy: Policy, request: PolicyRequest): PolicyDecision {
  if (!policy.allowedActions.includes(request.action)) {
    return { allowed: false, reason: "action is not allowed by policy" };
  }

  if (policy.maxAmount !== undefined) {
    if (request.amount === undefined || request.amount < 0) {
      return { allowed: false, reason: "request amount is required and must be non-negative" };
    }
    if (request.amount > policy.maxAmount) {
      return { allowed: false, reason: `amount exceeds policy limit ${policy.maxAmount}` };
    }
  }

  if (policy.currency !== undefined && request.currency !== undefined && policy.currency !== request.currency) {
    return { allowed: false, reason: "currency does not match policy" };
  }

  if (policy.expiresAt !== undefined) {
    const now = new Date(request.now ?? new Date().toISOString());
    const expiry = new Date(policy.expiresAt);
    if (!Number.isFinite(expiry.getTime())) {
      return { allowed: false, reason: "policy expiry is invalid" };
    }
    if (now.getTime() > expiry.getTime()) {
      return { allowed: false, reason: "policy has expired" };
    }
  }

  return { allowed: true, reason: "request satisfies policy" };
}
