# Contributing to QMoosa Deep Tech Platform

QMoosa is an experimental/research and hackathon-oriented platform spanning AI infrastructure, physical-AI work, cryptographic experiments, and blockchain tooling.

## Before opening a pull request

```bash
npm ci
npm test
npm run build
npm audit --audit-level=high
```

Run additional component-specific tests for any affected program, contract, AI-provider integration, or cryptographic path.

## Contribution rules

- Never commit API keys, provider tokens, wallet keys, credentials, or private user data.
- Add regression/adversarial coverage for security-sensitive changes.
- Keep provider names, prices, latency, and availability claims deployment-specific and current.
- Do not describe internal URS/reality scores as third-party certification.
- Do not claim partnerships, awards, mainnet deployment, production readiness, or benchmark results without verifiable supporting evidence.
- Keep generated evidence artifacts clearly labeled as internal unless independently verified.
- Explain major dependency upgrades and migration risk.

Report vulnerabilities privately according to `SECURITY.md`.
