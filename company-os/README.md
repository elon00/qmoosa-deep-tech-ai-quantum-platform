# QMoosa Autonomous Company OS

A governed control plane for operating a one-person deep-tech company across AI, blockchain, crypto, quantum computing, PQC, and algorithms.

## 10/10 architecture

`Founder -> Company OS -> Planner -> Specialist agents/tools -> Policy gate -> Execution -> Verification -> Audit evidence -> Release`

### Operating principles

- **Autonomy with boundaries:** low-risk work can execute; irreversible or externally consequential work requires explicit approval.
- **Simulation before action:** blockchain, quantum, payments, deployments and other high-impact operations need a dry-run path before live execution.
- **Truthful capabilities:** simulations are labelled as simulations; live provider evidence is required before a live claim is published.
- **Least privilege:** secrets, private keys, unbounded spend and irreversible writes are not exposed to generic agents.
- **Auditability:** important control-plane events can be written to a local JSONL audit trail.
- **Fail closed:** unknown actions are denied by default.

## Components

- `orchestrator.mjs` — planning and policy authorization.
- `policy.json` — risk and approval policy.
- `project-registry.json` — portfolio inventory and declared capability status.
- `audit.mjs` — local append-only audit evidence for control-plane events.
- `self-test.mjs` — deterministic policy and registry verification.

The runtime audit directory is outside source control. For production, ship these events to a managed, access-controlled logging/observability system with retention and alerting policies.

## Run

```bash
node company-os/orchestrator.mjs "turn QuantumShield-Q into a production candidate"
node company-os/self-test.mjs
node company-os/audit.mjs
```

Expected self-test output includes `COMPANY_OS_SELF_TEST=PASS`, `POLICY_GATE=PASS`, and `PRODUCTION_APPROVAL_GATE=PASS`.

## Production boundary

This is a control-plane foundation, not proof that external accounts, cloud infrastructure, blockchain wallets, quantum providers, payment systems, or social channels are connected. External credentials and irreversible operations remain explicit integrations and approval-gated actions.
