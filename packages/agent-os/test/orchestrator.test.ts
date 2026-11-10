import { strict as assert } from "node:assert";
import test from "node:test";
import { authorizeAgentAction } from "../src/orchestrator";

const baseRequest = {
  identity: { agentId: "agent-demo", verified: true },
  trustProfile: { score: 82, lastUpdated: "2026-09-14T00:00:00.000Z" },
  policy: { allowedActions: ["wallet.transfer"], maxAmount: 100, currency: "USDC" },
  policyRequest: { action: "wallet.transfer", amount: 25, currency: "USDC" },
  wallet: { remainingLimit: 100 },
};

test("allows a verified trusted policy-compliant action", () => {
  const result = authorizeAgentAction(baseRequest);
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.audit.decision, "ALLOW");
});

test("denies an unverified agent before wallet authorization", () => {
  const result = authorizeAgentAction({ ...baseRequest, identity: { agentId: "agent-demo", verified: false } });
  assert.equal(result.decision, "DENY");
  assert.match(result.reason, /not verified/);
});

test("denies a policy violation", () => {
  const result = authorizeAgentAction({
    ...baseRequest,
    policyRequest: { action: "admin.delete", amount: 1, currency: "USDC" },
  });
  assert.equal(result.decision, "DENY");
  assert.match(result.reason, /not allowed/);
});

test("denies a wallet limit violation", () => {
  const result = authorizeAgentAction({
    ...baseRequest,
    policyRequest: { action: "wallet.transfer", amount: 101, currency: "USDC" },
    wallet: { remainingLimit: 100 },
  });
  assert.equal(result.decision, "DENY");
});
