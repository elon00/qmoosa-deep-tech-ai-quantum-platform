import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const HISTORY_DIR = path.resolve(__dirname, 'history');
const MAGIC_CMD = 'npm run magic'; // runs the magic box script
const INTERVAL_MS = 60 * 60 * 1000; // 1 hour – adjust as needed

async function ensureHistoryDir() {
  try {
    await fs.mkdir(HISTORY_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create history dir', e);
  }
}

function runMagic(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(MAGIC_CMD, { cwd: path.resolve(__dirname) }, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function recordRun() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(HISTORY_DIR, `magic_${timestamp}.json`);
  try {
    const output = await runMagic();
    await fs.writeFile(filename, output, 'utf8');
    console.log(`Recorded magic run → ${filename}`);
  } catch (e) {
    console.error('Magic run failed', e);
    await fs.writeFile(filename, JSON.stringify({ error: String(e) }, null, 2), 'utf8');
  }
}

async function loop() {
  await ensureHistoryDir();
  while (true) {
    await recordRun();
    await new Promise(r => setTimeout(r, INTERVAL_MS));
  }
}

loop().catch(err => console.error('History runner crashed', err));
