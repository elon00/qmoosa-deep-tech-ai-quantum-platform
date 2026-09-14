# Security Dependency Exception — curve25519-dalek

## Status

`curve25519-dalek` is currently constrained by the Solana/Anchor dependency stack used by the on-chain program.

## Root cause

The current dependency chain resolves through `solana-program` 1.18.x to `curve25519-dalek` 3.2.1. Dependabot cannot automatically move this transitive dependency to the non-vulnerable 4.1.3+ line without changing the upstream Solana/Anchor stack.

## Repository handling

Dependabot is configured to ignore `curve25519-dalek` for the `/program` Cargo ecosystem so routine automated updates do not repeatedly generate an unresolvable security-update failure.

## Remediation plan

This is an exception, not a permanent claim that the dependency is risk-free. Re-evaluate it when upgrading the Solana/Anchor dependency stack, and run the full test/security pipeline after that migration.

## Important

Do not represent this exception as proof that the advisory is universally inapplicable. The risk assessment is specific to the dependency's actual use and runtime context and should be reviewed again when dependencies or execution paths change.
