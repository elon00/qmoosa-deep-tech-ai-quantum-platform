# Security Policy

## Project status

QMoosa Deep Tech AI Quantum Platform is an experimental/research and hackathon-oriented engineering repository. Passing CI, internal scorecards, cryptographic tests, or repository-defined reality gates is not an independent security audit or production certification.

## Reporting a vulnerability

Do not disclose exploitable vulnerabilities, private keys, API tokens, model/provider credentials, wallet secrets, operator data, or proof-of-concept attacks in a public issue.

Use GitHub private vulnerability reporting / a Security Advisory for this repository when available. Include:

- affected commit, component, and file
- reproduction steps or a minimal proof of concept
- expected impact and realistic attack preconditions
- whether credentials, funds, user data, or external services may be affected
- suggested mitigation, if known

## Secrets and historical exposure

Current code must not contain committed production credentials.

The repository has known historical commits containing credentials or demo secret material that were subsequently removed from the current tree. Gitleaks is configured to ignore only those exact remediated historical commits so that new/current leaks still fail CI.

**Any credential that was ever real or active must be revoked or rotated at its provider.** Removing a value from the latest source tree does not invalidate a credential already present in Git history.

## Provider-backed AI endpoint

When `NODE_ENV=production` and Gemini is configured:

- `GEMINI_MODEL` must be explicitly configured;
- the copilot endpoint requires `Authorization: Bearer <QMOOSA_API_TOKEN>`;
- `QMOOSA_API_TOKEN` must be a non-placeholder secret of at least 32 characters;
- browser/public access is not enabled by this server; add a real end-user/session authentication layer before exposing provider-backed AI to browsers;
- IP rate limiting remains defense-in-depth rather than the authorization boundary.

## Production boundary

Before production use, independently review at minimum:

- authentication/authorization boundaries
- provider and API key management
- cryptographic key lifecycle and rotation
- dependency and supply-chain risk
- prompt/model/tool execution boundaries
- network exposure and request validation
- persistent data, privacy, and retention
- monitoring, incident response, rollback, backup and recovery
- applicable legal/compliance requirements

Internal demonstrations, simulations, benchmarks, or generated certificates should be treated as engineering artifacts rather than third-party validation.
