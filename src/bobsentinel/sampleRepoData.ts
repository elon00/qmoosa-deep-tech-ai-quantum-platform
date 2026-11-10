import { RepoContextGraph } from './types';

export const ENTERPRISE_SAMPLE_REPO: RepoContextGraph = {
  repoName: 'nexus-fintech-core',
  totalFiles: 14,
  totalLines: 3420,
  primaryLanguage: 'TypeScript',
  nodes: [
    {
      path: 'src/auth/sessionManager.ts',
      module: 'auth',
      lines: 240,
      imports: ['src/crypto/jwtSigner.ts', 'src/database/userStore.ts'],
      exports: ['createSession', 'verifySessionToken', 'revokeSession'],
      complexityScore: 6,
      snippet: `export async function verifySessionToken(token: string) {
  const payload = await jwtSigner.verify(token);
  if (!payload || payload.exp < Date.now() / 1000) {
    throw new Error("TOKEN_EXPIRED");
  }
  return userStore.findUserById(payload.sub);
}`
    },
    {
      path: 'src/crypto/jwtSigner.ts',
      module: 'crypto',
      lines: 180,
      imports: ['src/crypto/pqcLattice.ts'],
      exports: ['signJwt', 'verifyJwt', 'rotateKeypair'],
      complexityScore: 8,
      snippet: `// Notice: Legacy RSA 2048 key used in fallback branch (VULNERABLE TO QUANTUM SHOR)
import { generateKeyPairSync } from 'crypto';
export function getFallbackKey() {
  return generateKeyPairSync('rsa', { modulusLength: 2048 });
}`
    },
    {
      path: 'src/payments/transactionRelay.ts',
      module: 'payments',
      lines: 390,
      imports: ['src/auth/sessionManager.ts', 'src/database/ledger.ts', 'src/api/gateway.ts'],
      exports: ['dispatchPayment', 'reconcileBatches', 'handleRefund'],
      complexityScore: 9,
      snippet: `export async function dispatchPayment(req: PaymentRequest) {
  // BUG: Missing session re-validation before commit causes race-condition under high concurrency
  const user = await sessionManager.verifySessionToken(req.token);
  const lock = await ledger.acquireLock(user.id);
  const tx = await ledger.commitTransfer(user.id, req.amountUsd);
  return { txId: tx.id, status: "COMMITTED" };
}`
    },
    {
      path: 'src/database/ledger.ts',
      module: 'database',
      lines: 310,
      imports: ['src/database/connectionPool.ts'],
      exports: ['acquireLock', 'commitTransfer', 'auditHistory'],
      complexityScore: 7,
      snippet: `export async function commitTransfer(userId: string, amount: number) {
  return db.query("INSERT INTO ledger_entries (user_id, amount, created_at) VALUES ($1, $2, NOW())", [userId, amount]);
}`
    },
    {
      path: 'src/api/gateway.ts',
      module: 'api',
      lines: 260,
      imports: ['src/payments/transactionRelay.ts', 'src/auth/sessionManager.ts'],
      exports: ['router', 'middlewareAuth', 'rateLimiter'],
      complexityScore: 5,
      snippet: `export const router = express.Router();
router.post('/checkout', middlewareAuth, async (req, res) => {
  const result = await transactionRelay.dispatchPayment(req.body);
  res.json(result);
});`
    }
  ],
  crossFileDependencies: [
    { source: 'src/api/gateway.ts', target: 'src/payments/transactionRelay.ts', relationship: 'invokes dispatchPayment' },
    { source: 'src/api/gateway.ts', target: 'src/auth/sessionManager.ts', relationship: 'authenticates request header' },
    { source: 'src/payments/transactionRelay.ts', target: 'src/auth/sessionManager.ts', relationship: 'session token validation' },
    { source: 'src/payments/transactionRelay.ts', target: 'src/database/ledger.ts', relationship: 'commits balance ledger' },
    { source: 'src/auth/sessionManager.ts', target: 'src/crypto/jwtSigner.ts', relationship: 'verifies cryptographic signature' },
    { source: 'src/crypto/jwtSigner.ts', target: 'src/crypto/pqcLattice.ts', relationship: 'post-quantum upgrade migration' }
  ]
};
