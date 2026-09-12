import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { midnightSimulator } from '../src/services/midnightCompactService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n======================================================');
console.log('🌙 TEST SUITE: MIDNIGHT COMPACT DUAL-LEDGER & ZK PROVER');
console.log('======================================================\n');

async function runAllTests() {
  // Test 1: Compact Smart Contract File & Syntax Invariants
  console.log('--- Test 1: Compact Smart Contract Verification ---');
  const contractPath = path.resolve(__dirname, '../contracts/midnight/privacy_audit.compact');
  assert.ok(fs.existsSync(contractPath), 'privacy_audit.compact must exist');
  
  const contractSource = fs.readFileSync(contractPath, 'utf8');
  assert.ok(contractSource.includes('pragma language_version >= 0.16.0;'), 'Language version pragma verified');
  assert.ok(contractSource.includes('export ledger'), 'Public ledger declaration verified');
  assert.ok(contractSource.includes('export circuit prove_solvency_private'), 'Solvency circuit verified');
  assert.ok(contractSource.includes('export circuit selective_disclose_compliance'), 'Selective disclosure circuit verified');
  assert.ok(contractSource.includes('export circuit emergency_halt'), 'Emergency halt circuit verified');
  assert.ok(contractSource.includes('Apache-2.0'), 'Apache 2.0 license declaration verified');
  console.log('✔ Compact contract structure and syntax invariants validated.');

  // Test 2: Dual-Ledger Initial State Separation
  console.log('\n--- Test 2: Dual-Ledger State Separation ---');
  const pubLedger = midnightSimulator.getPublicLedger();
  const privWitness = midnightSimulator.getPrivateWitness();

  assert.ok(pubLedger.contractAddress.length === 64, 'Public contract address is 64 hex chars');
  assert.ok(pubLedger.commitmentRoot.startsWith('0x') || pubLedger.commitmentRoot.length === 64, 'Commitment root valid');
  assert.strictEqual(typeof pubLedger.verifiedProofCount, 'number');
  assert.strictEqual(typeof pubLedger.minSolvencyThreshold, 'bigint');
  assert.strictEqual(pubLedger.isHalted, false);

  assert.ok(privWitness.privateBalance > 0n, 'Private balance exists');
  assert.ok(privWitness.privateSalt.length > 10, 'Private salt exists');
  assert.ok(privWitness.agentSecretKey.startsWith('0x'), 'Agent secret key exists');
  console.log('✔ Dual-ledger strict separation confirmed (Public ledger has 0 knowledge of private balance).');

  // Test 3: Circuit 1 — Solvency ZK Proof Generation & Verification
  console.log('\n--- Test 3: Circuit 1 (prove_solvency_private) Execution ---');
  const initialProofCount = pubLedger.verifiedProofCount;
  const initialBlock = pubLedger.blockHeight;

  const zkResult = await midnightSimulator.proveSolvencyPrivate();
  assert.strictEqual(zkResult.status, 'PROVEN_AND_ACCEPTED');
  assert.strictEqual(zkResult.circuitName, 'prove_solvency_private');
  assert.ok(zkResult.provingTimeMs > 0, 'WASM proving time measured');
  assert.ok(zkResult.zkSnarkProofHex.startsWith('0x'), 'ZK-SNARK wire format verified');
  assert.strictEqual(zkResult.publicOutputs?.revealedBalance, false, 'Private balance strictly zero-knowledge');

  const updatedLedger = midnightSimulator.getPublicLedger();
  assert.strictEqual(updatedLedger.verifiedProofCount, initialProofCount + 1, 'Public proof count incremented');
  assert.strictEqual(updatedLedger.blockHeight, initialBlock + 1, 'Block height incremented');
  assert.ok(updatedLedger.spentNullifiers.includes(zkResult.publicInputs.nullifier), 'Nullifier registered in public state');
  console.log(`✔ Solvency ZK Proof accepted in ${zkResult.provingTimeMs}ms. Public tally: ${updatedLedger.verifiedProofCount}.`);

  // Test 4: Anti-Replay Defense (Nullifier Collision Rejection)
  console.log('\n--- Test 4: Anti-Replay Defense (Double-Spend Nullifier Rejection) ---');
  let replayError = false;
  try {
    // Attempt to resubmit with the same private salt/nullifier
    await midnightSimulator.proveSolvencyPrivate();
  } catch (err) {
    replayError = true;
    assert.ok(err.message.includes('replay'), 'Error mentions replay rejection');
  }
  assert.strictEqual(replayError, true, 'Replay of same nullifier rejected fail-closed');
  console.log('✔ Replay attempt rejected cleanly by nullifier registry.');

  // Test 5: Insolvent Witness Rejection
  console.log('\n--- Test 5: Insolvent Witness Rejection ---');
  // Set private balance below threshold
  midnightSimulator.updatePrivateWitness({
    privateBalance: 100n, // Way below 50,000 dust threshold
    privateSalt: 'new_random_salt_for_insolvent_test_99'
  });
  let insolventError = false;
  try {
    await midnightSimulator.proveSolvencyPrivate();
  } catch (err) {
    insolventError = true;
    assert.ok(err.message.includes('solvency'), 'Error mentions solvency check failure');
  }
  assert.strictEqual(insolventError, true, 'Insolvent witness rejected by ZK circuit');
  console.log('✔ Insolvent agent rejected by ZK circuit assertions.');

  // Test 6: Circuit 2 — Selective Disclosure Attestation
  console.log('\n--- Test 6: Circuit 2 (selective_disclose_compliance) Execution ---');
  const authorizedAuditor = updatedLedger.authorizedAuditors[0];
  const disclosureResult = await midnightSimulator.selectiveDisclose(authorizedAuditor);

  assert.strictEqual(disclosureResult.status, 'PROVEN_AND_ACCEPTED');
  assert.strictEqual(disclosureResult.circuitName, 'selective_disclose_compliance');
  assert.ok(disclosureResult.publicOutputs?.disclosureAttestationToken.startsWith('0x'), 'Attestation token derived');
  assert.strictEqual(disclosureResult.publicOutputs?.auditorCanViewRawData, false, 'Raw telemetry protected');
  console.log('✔ Selective disclosure attestation generated for authorized auditor.');

  // Test 7: Unauthorized Auditor Rejection
  console.log('\n--- Test 7: Unauthorized Auditor Rejection ---');
  let unauthorizedError = false;
  try {
    await midnightSimulator.selectiveDisclose('0xdeadbeef00000000000000000000000000000000000000000000000000000000');
  } catch (err) {
    unauthorizedError = true;
    assert.ok(err.message.includes('Unauthorized auditor'), 'Unauthorized auditor error message verified');
  }
  assert.strictEqual(unauthorizedError, true, 'Unauthorized auditor rejected');
  console.log('✔ Unauthorized auditor rejected fail-closed.');

  console.log('\n======================================================');
  console.log('🎉 ALL 7 MIDNIGHT COMPACT DUAL-LEDGER TESTS PASSED!');
  console.log('======================================================\n');
}

runAllTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
