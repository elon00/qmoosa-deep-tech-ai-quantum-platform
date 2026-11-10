import assert from 'node:assert/strict';
import fs from 'node:fs';
import { plan, authorize, companySnapshot } from './orchestrator.mjs';

const snapshot = companySnapshot();
assert.equal(snapshot.mode, 'governed-autonomy');
assert.ok(snapshot.projects.length >= 5);
assert.equal(authorize('read_repo').allowed, true);
assert.equal(authorize('deploy_production').allowed, false);
assert.equal(authorize('deploy_production', true).allowed, true);
assert.equal(authorize('private_key_access').allowed, false);
assert.equal(authorize('unknown_action').allowed, false);
const p = plan('make QuantumShield-Q production ready');
assert.equal(p.phases.length, 6);
assert.ok(p.phases.some(x => x.actions.includes('deploy_production')));

const auditPath = process.env.COMPANY_OS_RUNTIME_DIR || '.company-os-runtime';
assert.ok(fs.existsSync(auditPath), 'audit runtime directory should exist after authorization/plan events');
console.log('COMPANY_OS_SELF_TEST=PASS');
console.log(`PROJECTS=${snapshot.projects.length}`);
console.log('POLICY_GATE=PASS');
console.log('PRODUCTION_APPROVAL_GATE=PASS');
console.log('FAIL_CLOSED_GATE=PASS');
console.log('AUDIT_GATE=PASS');
