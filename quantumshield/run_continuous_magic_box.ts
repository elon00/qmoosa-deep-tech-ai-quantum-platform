import fetch from 'node-fetch';

const baseUrl = `http://localhost:${process.env.PORT || 3000}`;
const INTERVAL_MS = Number(process.env.LOOP_INTERVAL_MS) || 5 * 60 * 1000; // default 5 minutes

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

async function runMagicBox() {
  const results: Record<string, any> = {};

  // 1. Handshake
  results.keyExchange = await callEndpoint('/api/pqc/handshake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'initiate' })
  });

  // 2. Benchmarks
  results.benchmarks = await callEndpoint('/api/pqc/benchmark');

  // 3. AI Audit
  results.aiAudit = await callEndpoint('/api/ai/crypto-audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codeOrConfig: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384', systemName: 'QuantumShield Suite' })
  });

  // 4. Shor Lab
  results.shorLab = await callEndpoint('/api/quantum/qiskit-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      openqasm: `OPENQASM 3.0;\ninclude \"stdgates.inc\";\nqubit[4] q;\nbit[4] c;\nh q[0];\ncx q[0], q[1];\nmeasure q -> c;`,
      algoName: 'shor',
      shots: 1024
    })
  });

  console.log('--- Magic Box Run Completed ---');
  console.log(JSON.stringify({ magicBoxAggregated: results }, null, 2));
}

async function main() {
  console.log(`Starting continuous Magic Box loop (interval ${INTERVAL_MS / 1000}s)...`);
  while (true) {
    await runMagicBox();
    await new Promise(res => setTimeout(res, INTERVAL_MS));
  }
}

main().catch(err => console.error('Fatal error in Magic Box loop', err));
