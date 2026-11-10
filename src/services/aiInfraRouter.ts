/**
 * InfraGuard AI — Modern AI Infrastructure Gateway & Multi-Model Routing Engine
 * Implements intelligent dynamic routing, fallback cascades, prompt guardrails,
 * and semantic caching.
 */

export type ModelProvider = 'Google' | 'Anthropic' | 'OpenAI' | 'Groq';
export type RoutingStrategy = 'cost_optimized' | 'latency_optimized' | 'quality_optimized';
export type TaskCategory = 'code' | 'reasoning' | 'fast_chat' | 'general';

export interface ModelSpec {
  id: string;
  name: string;
  provider: ModelProvider;
  costPer1MTokensUsd: number;
  typicalLatencyMs: number;
  maxContextTokens: number;
  specialty: TaskCategory[];
  tier: 'economy' | 'standard' | 'flagship';
}

export const SUPPORTED_MODELS: Record<string, ModelSpec> = {
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    costPer1MTokensUsd: 0.075,
    typicalLatencyMs: 110,
    maxContextTokens: 1000000,
    specialty: ['fast_chat', 'general'],
    tier: 'economy'
  },
  'llama-3.3-70b': {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B (Groq)',
    provider: 'Groq',
    costPer1MTokensUsd: 0.59,
    typicalLatencyMs: 85,
    maxContextTokens: 128000,
    specialty: ['fast_chat', 'general', 'code'],
    tier: 'economy'
  },
  'claude-3-7-sonnet': {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    costPer1MTokensUsd: 3.00,
    typicalLatencyMs: 480,
    maxContextTokens: 200000,
    specialty: ['code', 'reasoning'],
    tier: 'flagship'
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    costPer1MTokensUsd: 1.25,
    typicalLatencyMs: 420,
    maxContextTokens: 1000000,
    specialty: ['reasoning', 'code', 'general'],
    tier: 'standard'
  },
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    costPer1MTokensUsd: 2.50,
    typicalLatencyMs: 450,
    maxContextTokens: 128000,
    specialty: ['reasoning', 'code', 'general'],
    tier: 'flagship'
  }
};

export interface GuardrailCheckResult {
  passed: boolean;
  violationType?: 'PROMPT_INJECTION' | 'PII_LEAK' | 'API_KEY_LEAK' | 'MALICIOUS_OVERRIDE';
  details?: string;
  sanitizedPrompt?: string;
}

export interface RoutingDecision {
  selectedModel: ModelSpec;
  fallbackModels: ModelSpec[];
  strategy: RoutingStrategy;
  detectedTask: TaskCategory;
  estimatedCostUsd: number;
  reason: string;
}

export interface GatewayExecutionResult {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  modelUsed: string;
  provider: ModelProvider;
  latencyMs: number;
  tokensPrompt: number;
  tokensCompletion: number;
  costUsd: number;
  cacheHit: boolean;
  guardrailStatus: 'CLEAN' | 'SANITIZED' | 'BLOCKED';
  fallbackTriggered: boolean;
  failoverReason?: string;
}

export interface GatewayTelemetry {
  totalRequests: number;
  cacheHits: number;
  guardrailBlocks: number;
  totalTokensProcessed: number;
  totalCostUsd: number;
  estimatedCostSavedUsd: number;
  averageLatencyMs: number;
  providerDistribution: Record<ModelProvider, number>;
}

// In-memory semantic cache
interface CacheEntry {
  response: string;
  modelUsed: string;
  provider: ModelProvider;
  timestamp: number;
  hitCount: number;
}

const semanticCache = new Map<string, CacheEntry>();

// In-memory global telemetry
const telemetry: GatewayTelemetry = {
  totalRequests: 0,
  cacheHits: 0,
  guardrailBlocks: 0,
  totalTokensProcessed: 0,
  totalCostUsd: 0,
  estimatedCostSavedUsd: 0,
  averageLatencyMs: 0,
  providerDistribution: {
    Google: 0,
    Anthropic: 0,
    OpenAI: 0,
    Groq: 0
  }
};

/**
 * Normalizes prompt for semantic cache matching
 */
function normalizePrompt(prompt: string): string {
  return prompt
    .toLowerCase()
    .trim()
    .replace(/[\s\p{P}]+/gu, ' ');
}

/**
 * Real-time guardrail scanner for prompt injection, secrets, and PII
 */
export function evaluateGuardrails(prompt: string): GuardrailCheckResult {
  const lower = prompt.toLowerCase();

  // 1. Prompt Injections & Jailbreaks
  const injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /system prompt override/i,
    /you are now in dan mode/i,
    /disregard safety guidelines/i,
    /jailbreak/i,
    /pretend to be unrestricted/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(lower)) {
      return {
        passed: false,
        violationType: 'PROMPT_INJECTION',
        details: 'Adversarial prompt injection pattern detected and blocked.'
      };
    }
  }

  // 2. Secret / API Key Leaks
  const secretPatterns = [
    /AIzaSy[A-Za-z0-9_-]{33}/, // Google API Key
    /sk-[a-zA-Z0-9]{32,}/,     // OpenAI API Key
    /ghp_[a-zA-Z0-9]{36}/      // GitHub PAT
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(prompt)) {
      return {
        passed: false,
        violationType: 'API_KEY_LEAK',
        details: 'Plaintext API key / credential detected in prompt payload.'
      };
    }
  }

  // 3. PII Detection (Credit Card, Email redaction)
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (emailPattern.test(prompt)) {
    const sanitized = prompt.replace(emailPattern, '[REDACTED_EMAIL]');
    return {
      passed: true,
      violationType: 'PII_LEAK',
      details: 'Sensitive email identified and automatically redacted.',
      sanitizedPrompt: sanitized
    };
  }

  return { passed: true };
}

/**
 * Detects task category based on prompt heuristics
 */
export function classifyTask(prompt: string): TaskCategory {
  const lower = prompt.toLowerCase();
  
  if (
    lower.includes('function') ||
    lower.includes('code') ||
    lower.includes('typescript') ||
    lower.includes('python') ||
    lower.includes('bug') ||
    lower.includes('refactor') ||
    lower.includes('solidity') ||
    lower.includes('class ')
  ) {
    return 'code';
  }

  if (
    lower.includes('calculate') ||
    lower.includes('why') ||
    lower.includes('prove') ||
    lower.includes('derive') ||
    lower.includes('analyze') ||
    lower.includes('architecture') ||
    lower.includes('quantum')
  ) {
    return 'reasoning';
  }

  if (prompt.length < 80) {
    return 'fast_chat';
  }

  return 'general';
}

/**
 * Intelligent Dynamic Model Router
 */
export function routePrompt(prompt: string, strategy: RoutingStrategy = 'cost_optimized'): RoutingDecision {
  const task = classifyTask(prompt);
  let selectedModel: ModelSpec;
  let fallbackModels: ModelSpec[] = [];
  let reason = '';

  if (strategy === 'latency_optimized') {
    selectedModel = SUPPORTED_MODELS['llama-3.3-70b'];
    fallbackModels = [SUPPORTED_MODELS['gemini-2.5-flash'], SUPPORTED_MODELS['gpt-4o']];
    reason = 'Prioritizing lowest p95 latency (Groq ultra-fast Llama 3.3).';
  } else if (strategy === 'quality_optimized') {
    selectedModel = task === 'code' ? SUPPORTED_MODELS['claude-3-7-sonnet'] : SUPPORTED_MODELS['gemini-2.5-pro'];
    fallbackModels = [SUPPORTED_MODELS['gpt-4o'], SUPPORTED_MODELS['gemini-2.5-flash']];
    reason = `Selected flagship ${selectedModel.name} for high-fidelity ${task} execution.`;
  } else {
    // cost_optimized (default)
    if (task === 'fast_chat' || task === 'general') {
      selectedModel = SUPPORTED_MODELS['gemini-2.5-flash'];
      fallbackModels = [SUPPORTED_MODELS['llama-3.3-70b'], SUPPORTED_MODELS['gemini-2.5-pro']];
      reason = 'Lightweight task routed to Gemini 2.5 Flash ($0.075/1M tokens).';
    } else {
      selectedModel = SUPPORTED_MODELS['gemini-2.5-pro'];
      fallbackModels = [SUPPORTED_MODELS['claude-3-7-sonnet'], SUPPORTED_MODELS['llama-3.3-70b']];
      reason = `Balanced cost-to-performance for ${task} routed to Gemini 2.5 Pro.`;
    }
  }

  const tokenEstimate = Math.ceil(prompt.length / 4);
  const estimatedCostUsd = (tokenEstimate / 1000000) * selectedModel.costPer1MTokensUsd;

  return {
    selectedModel,
    fallbackModels,
    strategy,
    detectedTask: task,
    estimatedCostUsd,
    reason
  };
}

/**
 * Executes a request through the InfraGuard AI Gateway
 */
export async function processGatewayRequest(
  prompt: string,
  strategy: RoutingStrategy = 'cost_optimized',
  simulateFailure: boolean = false
): Promise<GatewayExecutionResult> {
  const reqId = `req_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const startTime = Date.now();

  // Step 1: Guardrail Inspection
  const guardrail = evaluateGuardrails(prompt);
  if (!guardrail.passed) {
    telemetry.totalRequests += 1;
    telemetry.guardrailBlocks += 1;
    return {
      id: reqId,
      timestamp: new Date().toISOString(),
      prompt,
      response: `[INFRA_GUARD_BLOCKED] Security violation: ${guardrail.details}`,
      modelUsed: 'InfraGuard Security Gateway',
      provider: 'Google',
      latencyMs: Date.now() - startTime,
      tokensPrompt: Math.ceil(prompt.length / 4),
      tokensCompletion: 0,
      costUsd: 0,
      cacheHit: false,
      guardrailStatus: 'BLOCKED',
      fallbackTriggered: false
    };
  }

  const effectivePrompt = guardrail.sanitizedPrompt || prompt;
  const normalizedKey = normalizePrompt(effectivePrompt);

  // Step 2: Semantic Caching Layer Check
  if (semanticCache.has(normalizedKey)) {
    const cached = semanticCache.get(normalizedKey)!;
    cached.hitCount += 1;

    const tokens = Math.ceil(effectivePrompt.length / 4);
    const costSaved = (tokens / 1000000) * 1.50; // Baseline savings estimate

    telemetry.totalRequests += 1;
    telemetry.cacheHits += 1;
    telemetry.totalTokensProcessed += tokens;
    telemetry.estimatedCostSavedUsd += costSaved;

    return {
      id: reqId,
      timestamp: new Date().toISOString(),
      prompt: effectivePrompt,
      response: cached.response,
      modelUsed: `${cached.modelUsed} (Semantic Cache)`,
      provider: cached.provider,
      latencyMs: Math.max(3, Date.now() - startTime),
      tokensPrompt: tokens,
      tokensCompletion: Math.ceil(cached.response.length / 4),
      costUsd: 0,
      cacheHit: true,
      guardrailStatus: guardrail.sanitizedPrompt ? 'SANITIZED' : 'CLEAN',
      fallbackTriggered: false
    };
  }

  // Step 3: Dynamic Model Routing
  const routing = routePrompt(effectivePrompt, strategy);
  let activeModel = routing.selectedModel;
  let fallbackTriggered = false;
  let failoverReason: string | undefined;

  // Step 4: Outage / Rate Limit Fallback Simulation
  if (simulateFailure) {
    fallbackTriggered = true;
    failoverReason = `Primary model ${activeModel.name} returned HTTP 429 (Rate Limit Exceeded). Automatic failover engaged.`;
    activeModel = routing.fallbackModels[0] || SUPPORTED_MODELS['gemini-2.5-flash'];
  }

  // Step 5: Generate Synthesized Model Output
  const promptTokens = Math.ceil(effectivePrompt.length / 4);
  const latency = Math.round(activeModel.typicalLatencyMs * (0.8 + Math.random() * 0.4));
  
  // High quality deterministic simulated AI completion based on task
  let responseText = '';
  if (routing.detectedTask === 'code') {
    responseText = `// [InfraGuard AI Router -> ${activeModel.name}]
// Task: Code Engineering & Architecture
export function solve(${effectivePrompt.slice(0, 30)}...) {
  // Optimized algorithmic path via ${activeModel.provider} cloud infra
  return { status: "SUCCESS", latencyMs: ${latency}, provider: "${activeModel.provider}" };
}`;
  } else if (routing.detectedTask === 'reasoning') {
    responseText = `[Reasoning Core // ${activeModel.name}]
Analyzing query: "${effectivePrompt}"
1. Invariant decomposition confirmed.
2. Optimal throughput achieved across ${activeModel.provider} infrastructure.
3. Verified conclusion derived with high confidence.`;
  } else {
    responseText = `[InfraGuard Gateway // ${activeModel.name}]
Response to "${effectivePrompt}": Processed successfully with ${latency}ms response time under ${strategy} strategy.`;
  }

  const completionTokens = Math.ceil(responseText.length / 4);
  const cost = ((promptTokens + completionTokens) / 1000000) * activeModel.costPer1MTokensUsd;

  // Populate cache for future queries
  semanticCache.set(normalizedKey, {
    response: responseText,
    modelUsed: activeModel.name,
    provider: activeModel.provider,
    timestamp: Date.now(),
    hitCount: 0
  });

  // Update telemetry
  telemetry.totalRequests += 1;
  telemetry.totalTokensProcessed += promptTokens + completionTokens;
  telemetry.totalCostUsd += cost;
  telemetry.providerDistribution[activeModel.provider] = (telemetry.providerDistribution[activeModel.provider] || 0) + 1;
  telemetry.averageLatencyMs = Math.round((telemetry.averageLatencyMs * (telemetry.totalRequests - 1) + latency) / telemetry.totalRequests);

  return {
    id: reqId,
    timestamp: new Date().toISOString(),
    prompt: effectivePrompt,
    response: responseText,
    modelUsed: activeModel.name,
    provider: activeModel.provider,
    latencyMs: latency,
    tokensPrompt: promptTokens,
    tokensCompletion: completionTokens,
    costUsd: cost,
    cacheHit: false,
    guardrailStatus: guardrail.sanitizedPrompt ? 'SANITIZED' : 'CLEAN',
    fallbackTriggered,
    failoverReason
  };
}

export function getGatewayTelemetry(): GatewayTelemetry {
  return { ...telemetry };
}

export function clearGatewayCache(): void {
  semanticCache.clear();
}
