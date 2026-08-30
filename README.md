# QMoosa Deep Tech AI Quantum Platform

Research and prototype repository for AI, quantum-computing, cryptography, and blockchain experimentation.

## Current repository status

The current codebase contains prototype modules and an Omniver Quantum Decoder server component. These modules must not be represented as evidence of:

- execution on IBM Quantum or another real quantum provider,
- successful Shor's algorithm execution on real hardware,
- Solana on-chain proof verification,
- production-grade PQC protection,
- independently audited security or regulatory compliance.

Local factorization and demonstration responses are explicitly labelled as simulations.

## Run locally

**Prerequisites:** Node.js 20 or newer.

1. Install dependencies:

   `npm ci`

2. Create a local environment file from the example:

   `cp .env.example .env.local`

3. Add a valid `GEMINI_API_KEY` only if you want the Gemini copilot endpoint to use Gemini.

4. Start development mode:

   `npm run dev`

## Verification

Run:

`npm test`

The verification pipeline checks environment-secret policy, unsupported claims, TypeScript, and the production build.

## Evidence policy

A UI response, README statement, random identifier, or local simulation is not proof of a blockchain transaction, quantum-hardware job, cryptographic verification, security audit, or legal compliance. Such claims require independently reproducible provider, explorer, test, or audit evidence.
