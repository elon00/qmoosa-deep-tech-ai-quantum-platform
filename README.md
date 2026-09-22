# Axiom VLA & InfraGuard // QMoosa Deep Tech Platform

## Reality / verification boundary

This repository contains substantial experimental engineering, hackathon work, cryptographic tests, AI infrastructure prototypes, and physical-AI research. Internal CI, test suites, scorecards, or repository-defined “reality gates” are **not independent production certifications**. Any claims about latency, accuracy, security, deployment, partnerships, awards, or production readiness should be treated as repository claims unless backed by reproducible external evidence.

**Current positioning:** experimental / research / hackathon platform. Production use requires independent security review, deployment validation, operational monitoring, and applicable legal/compliance work.


<p align="center">
  <img src="https://img.shields.io/badge/GitHub%20CI-Passing-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI Passing" />
  <img src="https://img.shields.io/badge/URS%20v2.0-Internal%20Scorecard-38bdf8?style=for-the-badge&logo=shieldsdotio&logoColor=white" alt="URS internal scorecard" />
  <img src="https://img.shields.io/badge/Midnight-Compact%20v0.16.0-8b5cf6?style=for-the-badge&logo=shield&logoColor=white" alt="Midnight Compact" />
  <img src="https://img.shields.io/badge/PQC-ML--KEM%20%2F%20ML--DSA%20Tests-6366f1?style=for-the-badge&logo=lock&logoColor=white" alt="PQC integration tests" />
  <img src="https://img.shields.io/badge/Intel-OpenVINO™%202026.3-0071c5?style=for-the-badge&logo=intel&logoColor=white" alt="Intel OpenVINO" />
  <img src="https://img.shields.io/badge/Speechmatics-Voice%20AI-f59e0b?style=for-the-badge&logo=soundcharts&logoColor=white" alt="Speechmatics Voice AI" />
  <img src="https://img.shields.io/badge/IBM%20Bob%202.0-Hackathon%20Work-052FAD?style=for-the-badge&logo=ibm&logoColor=white" alt="IBM Bob 2.0 hackathon work" />
  <img src="https://img.shields.io/badge/TypeScript-Strict%20Mode-3178c6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-Apache%202.0%20%2F%20MIT-emerald?style=for-the-badge" alt="License" />
</p>

> **Project materials reference work prepared for:**  
> 1. 🌙 **The Midnight Buildathon 2026 (Wave 1)** (AKINDO & Midnight Foundation) — MidnightPrivacySentinel  
> 2. 🤖 **AI Infra Summit Hackathon 2026** (Kisaco Research & lablab.ai) — Team Axiom Technologies  
> 3. ⚡ **IBM Bob 2.0 Hackathon 2026** (IBM, lablab.ai, NativelyAI) — BobSentinel 2.0  
> 🌐 **Live Web Application:** [https://elon00.github.io/qmoosa-deep-tech-ai-quantum-platform/](https://elon00.github.io/qmoosa-deep-tech-ai-quantum-platform/)  
> 📊 **Midnight Pitch Deck (10 Slides):** [midnight_slides.html](https://elon00.github.io/qmoosa-deep-tech-ai-quantum-platform/midnight_slides.html)  
> 📊 **AI Infra Pitch Deck (10 Slides):** [presentation_slides.html](https://elon00.github.io/qmoosa-deep-tech-ai-quantum-platform/presentation_slides.html)  
> 📽️ **IBM Bob 2.0 Pitch Deck (8 Slides):** [bobsentinel_slides.html](https://elon00.github.io/qmoosa-deep-tech-ai-quantum-platform/bobsentinel_slides.html)

---

## ⚡ InfraGuard AI — Modern AI Infrastructure Gateway & Multi-Model Router

InfraGuard AI is an experimental AI infrastructure gateway and multi-model routing engine designed to explore resilience, cost optimization, and safety controls:

- **Dynamic Multi-Model Router**: Experimental task-based routing adapters for multiple model providers. Provider availability, model names, pricing, and latency are external variables and must be validated at deployment time.
- **Semantic Caching**: In-memory prompt-normalized caching intended to reduce repeat-request latency and provider usage. Performance is environment-specific and should be benchmarked under the target workload.
- **Edge Guardrail Experiments**: Detection/redaction logic for selected prompt-injection patterns, credential-like strings, and PII patterns. These controls are defense-in-depth, not a guarantee against all attacks or data leakage.
- **Provider Failover Logic**: Fallback routing for selected provider errors and rate limits. Availability depends on upstream providers, network conditions, quotas, and deployment configuration.
- **Universal Reality System (URS v2.0)**: Repository-defined internal verification gates and scorecards used to track implementation evidence; they are not an external certification.

---

## Internal Universal Reality System (URS v2.0) scorecard

The repository's internal **Universal Reality System (URS v2.0)** reports a **10.0 / 10** score across its 12 project-defined gates. This is an internal engineering scorecard, not an independent certification:

```
Total Reality Gates:       12 / 12 PASSED
Internal Gate Score:       10.0 / 10 (repository-defined)
External Certification:    NOT CLAIMED
URS Result:                12 / 12 internal gates reported passing
```

---

## 🏛️ The 7 Technical Layers

1. **Layer 1: Deterministic Wire Invariants & Zero-Simulation Telemetry**
   - Pure algorithmic execution with strict input validation and zero pseudo-random simulation in cryptographic paths.
2. **Layer 2: NIST FIPS 203 ML-KEM-768 Lattice Key Encapsulation (Kyber)**
   - 1184-byte public key, 2400-byte secret key, 1088-byte ciphertext, 32-byte shared secret over pure NTT polynomial rings.
3. **Layer 3: NIST FIPS 204 ML-DSA-65 Lattice Digital Signatures (Dilithium)**
   - 1952-byte public key, 4032-byte secret key, 3309-byte digital signature for quantum-resistant state root attestation.
4. **Layer 4: Post-Quantum Wire Invariants & Adversarial Wycheproof Tamper Rejection**
   - Strict NIST FIPS 203 §7.3 implicit rejection (0 oracle bits leaked), bit-flip tamper rejection, truncated signature defense.
5. **Layer 5: BNB Chain (BSC) & Multi-Chain Dual Hybrid Cryptographic Conjunction**
   - Solidity contract and deployment tooling targeting BNB Smart Chain architecture with a classical + PQC application-layer conjunction. Repository code alone is not evidence of a current mainnet deployment.
6. **Layer 6: Company OS Autonomous Intelligence & Policy State Governance**
   - 5 autonomous project modules, role-based execution boundaries, fail-closed policy enforcement, auditable append-only ledger.
7. **Layer 7: Continuous Cryptographic Audit, Ledger Attestation & Universal Reality Scorecard**
   - Standalone cryptographic auditor with 23/23 assertions, automated URS scorecard generation (`reality/URS_SCORECARD.json`).

---

## ⚡ The 12 URS Reality Gates

| Gate | Name | Status | Specification |
|:---|:---|:---:|:---|
| **Gate 1** | Claim Freeze & Manifest Registration | ✅ PASS | `REALITY_MANIFEST.json` audited truth taxonomy |
| **Gate 2** | Static Simulation Scanner | ✅ PASS | Zero `Math.random()` in crypto paths |
| **Gate 3** | NIST FIPS 204 Keygen & Wire Length Invariants | ✅ PASS | 1952B pk, 4032B sk verified |
| **Gate 4** | Quantum Platform State Commitment Integrity | ✅ PASS | Canonical SHA-256 state tree commitments |
| **Gate 5** | Pure-TS ML-DSA-65 Signing & Tamper Rejection | ✅ PASS | 3309B signature verified; bit-flip rejected |
| **Gate 6** | Dual Hybrid Conjunction & Fail-Closed Defense | ✅ PASS | Conjunction enforced; unauthorized fail-closed |
| **Gate 7** | NIST FIPS 203 ML-KEM-768 & §7.3 Implicit Rejection | ✅ PASS | Constant-time implicit rejection |
| **Gate 8** | Quantum Shor Number Theory Math Engine | ✅ PASS | GCD, modPow, coprimes, period r=4, continued fractions |
| **Gate 9** | Reproducibility & Known Answer Tests (KAT) | ✅ PASS | RFC 5869 HKDF-SHA256 Test Case 1 & NIST KAT |
| **Gate 10** | Company OS Policy Gate & Autonomy | ✅ PASS | 5 modules, policy enforcement, fail-closed audit |
| **Gate 11** | BNB Chain & EVM Smart Contract Architecture | ✅ PASS | `QMoosaQuantumSentinel` compiled (4053B bytecode, 22 ABI endpoints) |
| **Gate 12** | Multiplicative Reality Law ($URS_{12}$) | ✅ PASS | $\min(G_1..G_{12}) \times 10 = 10.0 / 10$ |

---

## BNB Chain deployment tooling

The repository contains tooling that can target BNB Smart Chain (BSC, Chain ID 56). This section documents a deployment path; it is **not evidence that the contract is currently deployed, audited, or production-ready on mainnet**. Validate on a test environment first and use a dedicated deployment key managed outside Git.

### 1. Compile Contracts
```bash
npm run compile:contracts
```

### 2. Configure a deployment target
For any live deployment, use a dedicated funded deployer key supplied through the deployment environment or a secret manager. Never commit it:
```bash
# In your environment or .env:
BNB_PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
npm run deploy:bnb
```
The deployment script is intended to check the configured RPC/network and deployer balance before submitting a transaction. Any claimed live deployment should be supported by an independently inspectable explorer transaction/address and the exact source/bytecode provenance.

---

## 🧪 Verification & Audit

Run the full end-to-end verification pipeline:
```bash
npm test
```
Or run individual verification suites:
- `npm run test:nist` — NIST FIPS 203 & 204 pure-TS test suite (8 tiers)
- `npm run audit:crypto` — Standalone cryptographic auditor (23 assertions)
- `npm run compile:contracts` — Solidity contract compiler for BNB Chain
- `npm run reality:universal` — URS v2.0 12-Gate reality verification
- `npm run test:company-os` — Company OS governance & self-test suite

---

## 📜 Evidence & Truth Policy

A UI response, README statement, random identifier, or local simulation is not proof of a blockchain transaction, quantum-hardware job, cryptographic verification, security audit, or legal compliance. Such claims require independently reproducible provider, explorer, test, or audit evidence.
