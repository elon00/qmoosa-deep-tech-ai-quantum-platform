# QMoosa Autonomous Company OS

A governed automation control plane for operating a one-person deep-tech company across AI, blockchain, crypto, quantum computing, PQC, and algorithms.

## What is implemented

- Canonical portfolio registry for the QMoosa ecosystem.
- Goal-to-work plan generation with discovery, design, build, verification, staging, and production phases.
- Explicit risk policy with least privilege and founder approval gates.
- Deterministic authorization function for tool actions.
- Self-test proving low-risk autonomy, production approval gating, and forbidden secret/key actions.

## Run

From the repository root:

```bash
node company-os/orchestrator.mjs "turn QuantumShield-Q into a production candidate"
node company-os/self-test.mjs
```

Expected self-test output includes:

```text
COMPANY_OS_SELF_TEST=PASS
POLICY_GATE=PASS
PRODUCTION_APPROVAL_GATE=PASS
```

## Production boundary

This module is the control-plane foundation, not a claim that external accounts, cloud infrastructure, blockchain wallets, quantum providers, or social channels are already connected. External credentials and irreversible operations remain explicit integrations and approval-gated actions.

## Operating model

Founder -> Orchestrator -> specialized agents/tools -> policy gate -> execution -> audit/evidence.

The system must never treat a UI response, local simulation, generated identifier, or draft as proof of an external transaction, real quantum-hardware job, security audit, or regulatory compliance.
