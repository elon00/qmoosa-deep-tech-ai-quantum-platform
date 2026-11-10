import { strict as assert } from "node:assert";
import test from "node:test";
import { evaluateTrust } from "../src/decision";

test("allows verified agent at threshold", () => {
  const result = evaluateTrust(
    { agentId: "agent-1", verified: true },
    { score: 70, lastUpdated: "2026-09-14T00:00:00.000Z" },
    "marketplace.execute",
  );
  assert.equal(result.decision, "ALLOW");
});

test("denies unverified agent", () => {
  const result = evaluateTrust(
    { agentId: "agent-2", verified: false },
    { score: 99, lastUpdated: "2026-09-14T00:00:00.000Z" },
    "wallet.transfer",
  );
  assert.equal(result.decision, "DENY");
});

test("denies score below threshold", () => {
  const result = evaluateTrust(
    { agentId: "agent-3", verified: true },
    { score: 69, lastUpdated: "2026-09-14T00:00:00.000Z" },
    "wallet.transfer",
  );
  assert.equal(result.decision, "DENY");
});

test("denies non-finite threshold", () => {
  const result = evaluateTrust(
    { agentId: "agent-4", verified: true },
    { score: 99, lastUpdated: "2026-09-14T00:00:00.000Z" },
    "wallet.transfer",
    Number.NaN,
  );
  assert.equal(result.decision, "DENY");
});
