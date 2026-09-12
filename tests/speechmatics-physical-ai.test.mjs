import assert from 'node:assert/strict';
import {
  transcribeWithSpeechmatics,
  parseVoiceToAction,
  SPEECHMATICS_MODELS_SPEC
} from '../src/services/speechmaticsVoiceService.ts';

import {
  createTableSettingPlan,
  runAnomalibDefectScan,
  INITIAL_TABLE_ITEMS,
  INITIAL_ARMS,
  OPENVINO_TELEMETRY
} from '../src/services/intelPhysicalAiService.ts';

console.log('\n======================================================');
console.log('🤖 TEST SUITE: SPEECHMATICS VOICE AI & INTEL PHYSICAL AI');
console.log('======================================================\n');

async function runAllTests() {
  // Test 1: Speechmatics Models Specification Verification
  console.log('--- Test 1: Speechmatics Models Specification ---');
  assert.ok(SPEECHMATICS_MODELS_SPEC.enhanced, 'Enhanced model exists');
  assert.ok(SPEECHMATICS_MODELS_SPEC.standard, 'Standard model exists');
  assert.ok(SPEECHMATICS_MODELS_SPEC['melia-1'], 'Melia-1 model exists');
  assert.strictEqual(SPEECHMATICS_MODELS_SPEC.standard.supportsRealtime, true);
  assert.strictEqual(SPEECHMATICS_MODELS_SPEC.enhanced.supportsRealtime, true);
  console.log('✔ Speechmatics Enhanced, Standard, and Melia 1 models verified.');

  // Test 2: Speechmatics Standard Model Streaming Transcription
  console.log('\n--- Test 2: Speechmatics Standard Low-Latency Transcription ---');
  const sampleAudio = 'Switch AI Infra Gateway routing to latency-optimized strategy and activate Groq Llama 3.3 70B.';
  const resStandard = await transcribeWithSpeechmatics(sampleAudio, 'standard', 'en');
  assert.ok(resStandard.id.startsWith('sm_tx_'));
  assert.strictEqual(resStandard.modelUsed, 'standard');
  assert.strictEqual(resStandard.text, sampleAudio);
  assert.ok(resStandard.processingLatencyMs <= 400, `Expected low latency, got ${resStandard.processingLatencyMs}ms`);
  assert.ok(resStandard.overallConfidence >= 0.90, `Expected confidence >= 0.90, got ${resStandard.overallConfidence}`);
  assert.ok(resStandard.words.length > 5, 'Words timestamps parsed');
  assert.strictEqual(resStandard.actionDispatched?.intent, 'GATEWAY_ROUTING');
  assert.strictEqual(resStandard.actionDispatched?.action, 'UPDATE_ROUTING_STRATEGY');
  console.log(`✔ Standard transcription success (${resStandard.processingLatencyMs}ms, conf: ${resStandard.overallConfidence}).`);

  // Test 3: Speechmatics Voice-to-Action for Intel SO-101 Robotic Table-Setting
  console.log('\n--- Test 3: Voice Command to Intel SO-101 Bimanual Table Setting ---');
  const tableCommand = 'BobSentinel, initiate bimanual dinner table setting: place dinner plate center, dinner fork left, steak knife right, water goblet top right.';
  const resTable = await transcribeWithSpeechmatics(tableCommand, 'enhanced', 'en');
  assert.strictEqual(resTable.actionDispatched?.intent, 'ROBOTIC_ARM_COMMAND');
  assert.strictEqual(resTable.actionDispatched?.targetSystem, 'SO-101_DUAL_ARMS');
  assert.strictEqual(resTable.actionDispatched?.action, 'EXECUTE_BIMANUAL_TABLE_SETTING');
  assert.strictEqual(resTable.actionDispatched?.parameters.dualArmCoordinated, true);
  console.log('✔ Voice command mapped to EXECUTE_BIMANUAL_TABLE_SETTING.');

  // Test 4: Emergency Stop Safety Command
  console.log('\n--- Test 4: Voice-Driven Emergency Stop Trigger ---');
  const haltAction = parseVoiceToAction('Emergency stop SO-101 arm immediately!');
  assert.strictEqual(haltAction.intent, 'ROBOTIC_ARM_COMMAND');
  assert.strictEqual(haltAction.action, 'EMERGENCY_STOP_HARD_HALT');
  assert.strictEqual(haltAction.parameters.engageMechanicalBrake, true);
  console.log('✔ Voice emergency stop engages immediate mechanical braking.');

  // Test 5: Intel Physical AI Bimanual Table Setting Plan
  console.log('\n--- Test 5: Intel Bimanual SO-101 Task Planner ---');
  const plan = createTableSettingPlan();
  assert.strictEqual(plan.totalSteps, 5);
  assert.strictEqual(plan.steps[0].activeArm, 'left_arm');
  assert.strictEqual(plan.steps[2].activeArm, 'right_arm');
  assert.strictEqual(plan.steps[4].activeArm, 'dual_coordinated');
  assert.strictEqual(INITIAL_TABLE_ITEMS.length, 4);
  assert.strictEqual(INITIAL_ARMS.left_arm.id, 'left_arm');
  assert.strictEqual(INITIAL_ARMS.right_arm.id, 'right_arm');
  console.log('✔ 5-step coordinated bimanual trajectory planned.');

  // Test 6: Intel OpenVINO Telemetry & Anomalib Defect Inspection
  console.log('\n--- Test 6: Intel OpenVINO 2026.3 & Anomalib Inspection ---');
  assert.strictEqual(OPENVINO_TELEMETRY.quantizationPrecision, 'INT8');
  assert.ok(OPENVINO_TELEMETRY.inferenceLatencyMs < 1.0, 'Sub-millisecond inference verified');
  const normalScan = runAnomalibDefectScan(false);
  assert.ok(normalScan.scanId.startsWith('anom_'));
  assert.strictEqual(typeof normalScan.anomalyScore, 'number');
  const defectScan = runAnomalibDefectScan(true);
  assert.strictEqual(defectScan.hasDefect, true);
  assert.strictEqual(defectScan.sortingAction, 'EJECT_TO_REJECT_BIN');
  console.log(`✔ OpenVINO telemetry: ${OPENVINO_TELEMETRY.inferenceLatencyMs}ms / ${OPENVINO_TELEMETRY.throughputFps} FPS.`);
  console.log(`✔ Anomalib Defect Scan: Score ${defectScan.anomalyScore} -> ${defectScan.sortingAction}.`);

  console.log('\n======================================================');
  console.log('🎉 ALL 6 SPEECHMATICS & INTEL PHYSICAL AI TESTS PASSED!');
  console.log('======================================================\n');
}

runAllTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
