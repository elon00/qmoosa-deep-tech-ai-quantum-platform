import type { Policy } from "./types";

export type AgentPolicy = Policy;

export function normalizePolicy(policy: Policy): Policy {
  return {
    ...policy,
    allowedActions: [...new Set(policy.allowedActions)],
  };
}
