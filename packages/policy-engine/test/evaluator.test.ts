import { strict as assert } from "node:assert";
import test from "node:test";
import { evaluatePolicy } from "../src/evaluator";

test("allows an action within policy", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], maxAmount: 100, currency: "USDC" },
    { action: "wallet.transfer", amount: 50, currency: "USDC" },
  );
  assert.deepEqual(result, { allowed: true, reason: "request satisfies policy" });
});

test("denies an action outside policy", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], maxAmount: 100 },
    { action: "admin.delete", amount: 1 },
  );
  assert.equal(result.allowed, false);
});

test("denies amount above policy limit", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], maxAmount: 100 },
    { action: "wallet.transfer", amount: 101 },
  );
  assert.equal(result.allowed, false);
});
