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

test("denies NaN amount", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], maxAmount: 100 },
    { action: "wallet.transfer", amount: Number.NaN },
  );
  assert.equal(result.allowed, false);
});

test("enforces allowed contract", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], allowedContracts: ["0xallowed"] },
    { action: "wallet.transfer", contractAddress: "0xblocked" },
  );
  assert.equal(result.allowed, false);
});

test("denies invalid request timestamp", () => {
  const result = evaluatePolicy(
    { allowedActions: ["wallet.transfer"], expiresAt: "2026-09-13T00:00:00.000Z" },
    { action: "wallet.transfer", now: "not-a-date" },
  );
  assert.equal(result.allowed, false);
});
