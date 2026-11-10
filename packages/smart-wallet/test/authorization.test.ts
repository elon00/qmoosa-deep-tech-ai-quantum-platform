import { strict as assert } from "node:assert";
import test from "node:test";
import { authorizeWallet } from "../src/authorization";

test("allows when trust and policy both allow", () => {
  const result = authorizeWallet({
    trustAllowed: true,
    policyAllowed: true,
    amount: 25,
    remainingLimit: 100,
  });
  assert.equal(result.allowed, true);
});

test("denies when trust denies", () => {
  const result = authorizeWallet({ trustAllowed: false, policyAllowed: true });
  assert.equal(result.allowed, false);
});

test("denies when policy denies", () => {
  const result = authorizeWallet({ trustAllowed: true, policyAllowed: false });
  assert.equal(result.allowed, false);
});

test("denies amount over remaining limit", () => {
  const result = authorizeWallet({
    trustAllowed: true,
    policyAllowed: true,
    amount: 101,
    remainingLimit: 100,
  });
  assert.equal(result.allowed, false);
});

test("denies non-finite amount", () => {
  const result = authorizeWallet({
    trustAllowed: true,
    policyAllowed: true,
    amount: Number.NaN,
    remainingLimit: 100,
  });
  assert.equal(result.allowed, false);
});

test("denies non-finite remaining limit", () => {
  const result = authorizeWallet({
    trustAllowed: true,
    policyAllowed: true,
    amount: 25,
    remainingLimit: Number.POSITIVE_INFINITY,
  });
  assert.equal(result.allowed, false);
});
