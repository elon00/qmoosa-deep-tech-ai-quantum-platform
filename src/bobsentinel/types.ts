/**
 * IBM Bob 2.0 — BobSentinel Developer Copilot & Multi-Agent Studio Types
 * Full-repository context, parallel subagents, task session summaries.
 */

export type BobWorkflowType =
  | 'onboarding'
  | 'debugging'
  | 'testing'
  | 'security_audit'
  | 'release_gate';

export type SubagentRole =
  | 'subagent-arch'
  | 'subagent-debug'
  | 'subagent-test'
  | 'subagent-audit'
  | 'subagent-release';

export interface SubagentStatus {
  id: SubagentRole;
  name: string;
  specialty: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress: number; // 0 - 100
  currentAction: string;
  tokensProcessed: number;
  filesScanned: number;
  runtimeMs: number;
}

export interface RepoFileNode {
  path: string;
  module: string;
  lines: number;
  imports: string[];
  exports: string[];
  complexityScore: number;
  snippet: string;
}

export interface RepoContextGraph {
  repoName: string;
  totalFiles: number;
  totalLines: number;
  primaryLanguage: string;
  nodes: RepoFileNode[];
  crossFileDependencies: { source: string; target: string; relationship: string }[];
}

export interface CodePatchDiff {
  file: string;
  originalCode: string;
  patchedCode: string;
  explanation: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface GeneratedTestSuite {
  targetFile: string;
  testFramework: 'Node-Test' | 'Vitest' | 'Jest';
  testCode: string;
  testCasesCount: number;
  coverageEstimate: string;
}

export interface SecurityVulnerability {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cwe: string;
  file: string;
  line: number;
  title: string;
  recommendation: string;
  pqcReadiness: 'VULNERABLE_RSA_ECC' | 'NIST_PQC_COMPLIANT' | 'TRANSITIONAL';
}

export interface BobTaskSessionSummary {
  sessionId: string;
  timestamp: string;
  repoContext: string;
  workflow: BobWorkflowType;
  prompt: string;
  subagentsEngaged: SubagentRole[];
  executionTimeMs: number;
  totalTokensUsed: number;
  filesAnalyzedCount: number;
  productivityGainMultiplier: string; // e.g. "5.4x"
  timeSavedMinutes: number;
  patchesProposed: number;
  testsGenerated: number;
  vulnerabilitiesNeutralized: number;
  verdict: 'SUCCESS' | 'ACTION_REQUIRED' | 'BLOCKED';
  sha256Digest: string;
}

export interface BobWorkflowResult {
  summary: BobTaskSessionSummary;
  subagentLogs: Record<SubagentRole, string[]>;
  onboardingWalkthrough?: string;
  patches?: CodePatchDiff[];
  testSuite?: GeneratedTestSuite;
  vulnerabilities?: SecurityVulnerability[];
  releaseChecklist?: { task: string; passed: boolean; details: string }[];
}
