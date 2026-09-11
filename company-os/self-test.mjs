import assert from 'node:assert/strict';
import { plan, authorize, companySnapshot } from './orchestrator.mjs';

const snapshot = companySnapshot();
assert.equal(snapshot.mode, 'governed-autonomy');
assert.ok(snapshot.projects.length >= 5);
assert.equal(authorize('read_repo').allowed, true);
assert.equal(authorize('deploy_production').allowed, false);
assert.equal(authorize('deploy_production', true).allowed, true);
assert.equal(authorize('private_key_access').allowed, false);
const p = plan('make QuantumShield-Q production ready');
assert.equal(p.phases.length, 6);
assert.ok(p.phases.some(x => x.actions.includes('deploy_production')));
console.log('COMPANY_OS_SELF_TEST=PASS');
console.log(`PROJECTS=${snapshot.projects.length}`);
console.log('POLICY_GATE=PASS');
console.log('PRODUCTION_APPROVAL_GATE=PASS');
