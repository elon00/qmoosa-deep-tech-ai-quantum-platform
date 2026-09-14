import type { AgentIdentity, TrustDecision, TrustDecisionRecord, TrustProfile } from "./types";

export const DEFAULT_TRUST_THRESHOLD = 70;

export function evaluateTrust(
  identity: AgentIdentity,
  profile: TrustProfile,
  action: string,
  threshold = DEFAULT_TRUST_THRESHOLD,
): TrustDecisionRecord {
  let decision: TrustDecision = "ALLOW";
  let reason = "verified agent and trust threshold satisfied";

  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) {
    decision = "DENY";
    reason = "trust threshold is invalid";
  } else if (!identity.verified) {
    decision = "DENY";
    reason = "agent identity is not verified";
  } else if (!Number.isFinite(profile.score) || profile.score < threshold) {
    decision = "DENY";
    reason = `trust score ${profile.score} is below required threshold ${threshold}`;
  }

  return {
    agentId: identity.agentId,
    action,
    decision,
    reason,
    timestamp: new Date().toISOString(),
  };
}
