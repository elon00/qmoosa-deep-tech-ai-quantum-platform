import fetch from 'node-fetch';

const baseUrl = `http://localhost:${process.env.PORT || 3000}`;

async function callEndpoint(path: string, options?: any) {
  try {
    const res = await fetch(`${baseUrl}${path}`, options);
    const json = await res.json();
    return json;
  } catch (e) {
    console.error(`Error calling ${path}:`, e);
    return { error: String(e) };
  }
}

async function main() {
  const results: Record<string, any> = {};

  // 1. Key Exchange Sandbox (handshake)
  results.keyExchange = await callEndpoint('/api/pqc/handshake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'initiate' })
  });

  // 2. Threat Matrix / Benchmarks
  results.benchmarks = await callEndpoint('/api/pqc/benchmark');

  // 3. AI Migration Audit
  results.aiAudit = await callEndpoint('/api/ai/crypto-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codeOrConfig: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384', systemName: 'QuantumShield Suite' })
  });

  // 4. Shor's QPU Lab (run a Shor circuit via Qiskit submit)
  results.shorLab = await callEndpoint('/api/quantum/qiskit-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      openqasm: `OPENQASM 3.0;
include "stdgates.inc";
qubit[4] q;
bit[4] c;
h q[0];
cx q[0], q[1];
measure q -> c;`,
      algoName: 'shor',
      shots: 1024
    })
  });

  // 5. Algorithm Synthesizer (placeholder – returns empty)
  results.algorithmSynthesizer = { note: 'Placeholder – no dedicated endpoint' };

  // 6-14 other modules – placeholders
  const otherModules = [
    'encryptedVault',
    'payments',
    'cryptoTransformer',
    'researchCTF',
    'keyhuntAutomaton',
    'theAgency',
    'exchangeHub',
    'magicBox'
  ];
  for (const mod of otherModules) {
    results[mod] = { note: `Placeholder for ${mod}` };
  }

  console.log(JSON.stringify({ magicBoxAggregated: results }, null, 2));
}

main();
