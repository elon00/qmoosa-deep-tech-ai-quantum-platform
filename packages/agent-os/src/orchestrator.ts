import { evaluateTrust } from "../../agent-trust/src/decision";
import type { AgentIdentity, TrustProfile } from "../../agent-trust/src/types";
import { evaluatePolicy } from "../../policy-engine/src/evaluator";
import type { Policy, PolicyRequest } from "../../policy-engine/src/types";
import { authorizeWallet } from "../../smart-wallet/src/authorization";
import { createAuditRecord, type AgentAuditRecord } from "./audit";

export interface AgentActionRequest {
  identity: AgentIdentity;
  trustProfile: TrustProfile;
  policy: Policy;
  policyRequest: PolicyRequest;
  wallet?: { amount?: number; remainingLimit?: number };
}

export interface AgentActionResult {
  decision: "ALLOW" | "DENY";
  reason: string;
  audit: AgentAuditRecord;
}

export function authorizeAgentAction(request: AgentActionRequest): AgentActionResult {
  const action = request.policyRequest.action;
  const trust = evaluateTrust(request.identity, request.trustProfile, action);

  if (trust.decision === "DENY") {
    return {
      decision: "DENY",
      reason: trust.reason,
      audit: createAuditRecord({
        agentId: request.identity.agentId,
        action,
        decision: "DENY",
        reason: trust.reason,
      }),
    };
  }

  const policy = evaluatePolicy(request.policy, request.policyRequest);
  if (!policy.allowed) {
    return {
      decision: "DENY",
      reason: policy.reason,
      audit: createAuditRecord({
        agentId: request.identity.agentId,
        action,
        decision: "DENY",
        reason: policy.reason,
      }),
    };
  }

  const wallet = authorizeWallet({
    trustAllowed: true,
    policyAllowed: true,
    amount: request.wallet?.amount ?? request.policyRequest.amount,
    remainingLimit: request.wallet?.remainingLimit,
  });

  const decision = wallet.allowed ? "ALLOW" : "DENY";
  return {
    decision,
    reason: wallet.reason,
    audit: createAuditRecord({
      agentId: request.identity.agentId,
      action,
      decision,
      reason: wallet.reason,
    }),
  };
}
