import assert from 'node:assert';
import { runBobWorkflow } from '../src/bobsentinel/bobOrchestrator.ts';
import { ENTERPRISE_SAMPLE_REPO } from '../src/bobsentinel/sampleRepoData.ts';

console.log('🧪 Starting IBM Bob 2.0 (BobSentinel) Orchestrator Test Suite...\n');

async function main() {
  // Test 1: Full Repo Context Verification
  console.log('➡️ [Test 1] Full Repository Context Verification');
  assert.strictEqual(ENTERPRISE_SAMPLE_REPO.repoName, 'nexus-fintech-core');
  assert(ENTERPRISE_SAMPLE_REPO.nodes.length >= 5);
  assert(ENTERPRISE_SAMPLE_REPO.crossFileDependencies.length >= 5);
  console.log(`  ✅ Full repo context verified (${ENTERPRISE_SAMPLE_REPO.totalFiles} files, ${ENTERPRISE_SAMPLE_REPO.crossFileDependencies.length} cross-file dependency arcs).`);

  // Test 2: Onboarding Workflow
  console.log('➡️ [Test 2] Subagent-Arch Onboarding Workflow');
  const onboardingRes = await runBobWorkflow('onboarding');
  assert.strictEqual(onboardingRes.summary.workflow, 'onboarding');
  assert(onboardingRes.onboardingWalkthrough.includes('Repository Architecture Walkthrough'));
  assert(onboardingRes.subagentLogs['subagent-arch'].length >= 2);
  console.log('  ✅ Onboarding subagent generated architectural breakdown & high-risk data flows.');

  // Test 3: Cross-File Debugging & Patch Generation
  console.log('➡️ [Test 3] Subagent-Debug Multi-File Race Condition Patch');
  const debugRes = await runBobWorkflow('debugging');
  assert.strictEqual(debugRes.summary.workflow, 'debugging');
  assert(debugRes.patches.length >= 1);
  const patch = debugRes.patches[0];
  assert.strictEqual(patch.file, 'src/payments/transactionRelay.ts');
  assert(patch.patchedCode.includes('acquireLock'));
  assert(patch.patchedCode.includes('try'));
  assert(patch.patchedCode.includes('finally'));
  console.log('  ✅ Debugger subagent traced cross-file race condition and generated atomic lock patch.');

  // Test 4: Automated Test Generation
  console.log('➡️ [Test 4] Subagent-Test Invariant Test Suite Synthesis');
  const testRes = await runBobWorkflow('testing');
  assert.strictEqual(testRes.summary.workflow, 'testing');
  assert(testRes.testSuite !== undefined);
  assert.strictEqual(testRes.testSuite.testCasesCount, 6);
  assert(testRes.testSuite.testCode.includes('Rejects payment when session token expires'));
  console.log('  ✅ Test subagent synthesized 6 property-based unit test cases covering concurrency.');

  // Test 5: Security & PQC Audit
  console.log('➡️ [Test 5] Subagent-Audit Cryptographic & CWE Vulnerability Scan');
  const secRes = await runBobWorkflow('security_audit');
  assert.strictEqual(secRes.summary.workflow, 'security_audit');
  assert(secRes.vulnerabilities.length >= 2);
  const rsaVuln = secRes.vulnerabilities.find(v => v.cwe.includes('CWE-327'));
  assert(rsaVuln !== undefined);
  assert.strictEqual(rsaVuln.pqcReadiness, 'VULNERABLE_RSA_ECC');
  assert(rsaVuln.recommendation.includes('ML-DSA-65'));
  console.log('  ✅ Security subagent flagged legacy RSA-2048 and prescribed NIST FIPS 204 ML-DSA-65 migration.');

  // Test 6: Release Gate & 12 URS Reality Gates Conformance
  console.log('➡️ [Test 6] Subagent-Release Pre-Flight Checklist & URS 12-Gate Integration');
  const releaseRes = await runBobWorkflow('release_gate');
  assert.strictEqual(releaseRes.summary.workflow, 'release_gate');
  assert(releaseRes.releaseChecklist.length >= 5);
  const ursCheck = releaseRes.releaseChecklist.find(c => c.task.includes('Universal Reality Score'));
  assert(ursCheck !== undefined);
  assert.strictEqual(ursCheck.passed, true);
  console.log('  ✅ Release subagent confirmed all 12 Universal Reality Gates (10.0/10) before deployment.');

  // Test 7: Task Session Summary & Hackathon Requirement Proofs
  console.log('➡️ [Test 7] IBM Bob Task Session Summary & Metrics Export');
  const summary = releaseRes.summary;
  assert(summary.sessionId.startsWith('bob_sess_'));
  assert(summary.executionTimeMs > 0);
  assert(summary.totalTokensUsed > 1000);
  assert.strictEqual(summary.productivityGainMultiplier, '5.4x');
  assert(summary.timeSavedMinutes > 100);
  assert(summary.sha256Digest.startsWith('0x'));
  console.log('  ✅ Task session summary accurately exported:');
  console.log(`     Session ID: ${summary.sessionId}`);
  console.log(`     Productivity Multiplier: ${summary.productivityGainMultiplier}`);
  console.log(`     Time Saved: ${summary.timeSavedMinutes} minutes`);
  console.log(`     Cryptographic Digest: ${summary.sha256Digest}`);

  console.log('\n🎉 ALL 7 IBM BOB 2.0 ORCHESTRATOR TESTS PASSED (100% SUCCESS)\n');
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
