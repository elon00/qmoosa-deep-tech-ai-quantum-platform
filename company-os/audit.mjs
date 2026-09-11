import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.env.COMPANY_OS_RUNTIME_DIR || '.company-os-runtime');
const file = path.join(dir, 'audit.jsonl');

export function audit(event, details = {}) {
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const record = {
    timestamp: new Date().toISOString(),
    event,
    details,
  };
  fs.appendFileSync(file, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
  return record;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  audit('self_test', { status: 'PASS' });
  console.log('COMPANY_OS_AUDIT=PASS');
}
