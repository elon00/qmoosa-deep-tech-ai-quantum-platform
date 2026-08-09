import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import pLimit from 'p-limit';

// ==== CONFIGURATION ==== //
const TOTAL_RUNS = 6000; // total Magic Box executions
const INTERVAL_MS = 60 * 60 * 1000; // 1 hour between job submissions
const CONCURRENCY = 1; // number of parallel Magic Box processes
const HISTORY_DIR = path.resolve(__dirname, 'history');
const MAGIC_CMD = 'npm run magic'; // runs the Magic Box script
// ======================== //

async function ensureDir() {
  await fs.mkdir(HISTORY_DIR, { recursive: true });
}

function runMagic(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(MAGIC_CMD, { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) reject(stderr || err.message);
      else resolve(stdout);
    });
  });
}

async function recordRun(index: number) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(HISTORY_DIR, `magic_${index}_${timestamp}.json`);
  try {
    const output = await runMagic();
    await fs.writeFile(filePath, output, 'utf8');
    console.log(`✅ Run #${index} completed → ${filePath}`);
  } catch (e) {
    await fs.writeFile(filePath, JSON.stringify({ error: String(e) }, null, 2), 'utf8');
    console.warn(`⚠️ Run #${index} failed – error saved`);
  }
}

async function main() {
  await ensureDir();
  const limit = pLimit(CONCURRENCY);
  let current = 0;
  while (current < TOTAL_RUNS) {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < CONCURRENCY && current < TOTAL_RUNS; i++) {
      current++;
      promises.push(limit(() => recordRun(current)));
    }
    await Promise.all(promises);
    if (current < TOTAL_RUNS) {
      await new Promise(res => setTimeout(res, INTERVAL_MS));
    }
  }
  console.log('🚀 All 6,000 Magic Box runs have been scheduled and completed.');
}

main().catch(err => console.error('❌ History runner crashed', err));
