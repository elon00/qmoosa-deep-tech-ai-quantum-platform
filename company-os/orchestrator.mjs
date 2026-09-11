import fs from 'node:fs';

const registry = JSON.parse(fs.readFileSync(new URL('./project-registry.json', import.meta.url)));
const policy = JSON.parse(fs.readFileSync(new URL('./policy.json', import.meta.url)));

const ACTIONS = new Map();
for (const [risk, actions] of Object.entries(policy.risk_levels)) {
  for (const action of actions) ACTIONS.set(action, risk);
}

export function plan(goal) {
  if (!goal || typeof goal !== 'string') throw new Error('goal must be a non-empty string');
  return {
    goal,
    phases: [
      {name:'discover', actions:['read_public_web','read_repo']},
      {name:'design', actions:['draft_document']},
      {name:'build', actions:['run_local_test','create_issue','create_draft_pr']},
      {name:'verify', actions:['run_local_test']},
      {name:'release', actions:['deploy_staging','merge_pr_after_ci']},
      {name:'production', actions:['deploy_production']}
    ]
  };
}

export function authorize(action, approved = false) {
  const risk = ACTIONS.get(action);
  if (!risk) return {allowed:false, risk:'unknown', reason:'action_not_in_policy'};
  if (risk === 'low') return {allowed:true, risk, reason:'policy_allows'};
  if (!approved) return {allowed:false, risk, reason:'founder_approval_required'};
  return {allowed:true, risk, reason:'founder_approval_recorded'};
}

export function companySnapshot() {
  return {
    company:'QMoosa Autonomous Company OS',
    mode:'governed-autonomy',
    projects: registry.projects.map(p => ({id:p.id,name:p.name,domain:p.domain,status:p.status,risk:p.risk})),
    policy:'company-os/policy/v1',
    irreversible_actions:'approval-gated'
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const goal = process.argv.slice(2).join(' ') || 'audit and improve the company portfolio';
  console.log(JSON.stringify({snapshot:companySnapshot(), plan:plan(goal)}, null, 2));
}
