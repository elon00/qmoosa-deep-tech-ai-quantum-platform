export interface UserProject {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DEPLOYED';
  freeTokensUsed: number;
  creditsUsed: number;
}

export interface QuotaData {
  lastResetDate: string; // YYYY-MM-DD
  freeTokensRemaining: number;
  freeTokensMax: number; // 30,000,000
  creditTokensRemaining: number;
  creditTokensMax: number; // 100
  projectsCreatedToday: number;
  projectsMaxToday: number; // 3
  totalTokensConsumedLifetime: number;
  totalCreditsConsumedLifetime: number;
  userProjects: UserProject[];
  usageHistory: {
    id: string;
    timestamp: string;
    type: 'FREE_TOKENS' | 'CREDITS' | 'PROJECT_CREATED' | 'DAILY_RESET';
    amount: number;
    reason: string;
  }[];
}

const STORAGE_KEY = 'quantumshield_daily_quota_v1';

export const DAILY_FREE_TOKENS_MAX = 30_000_000; // 30 Million Free Tokens per day
export const DAILY_CREDIT_TOKENS_MAX = 100;       // 100 Credit Tokens per day
export const DAILY_PROJECTS_MAX = 3;              // 3 Projects Limit per day

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getDefaultQuotaData(): QuotaData {
  const today = getTodayString();
  return {
    lastResetDate: today,
    freeTokensRemaining: DAILY_FREE_TOKENS_MAX,
    freeTokensMax: DAILY_FREE_TOKENS_MAX,
    creditTokensRemaining: DAILY_CREDIT_TOKENS_MAX,
    creditTokensMax: DAILY_CREDIT_TOKENS_MAX,
    projectsCreatedToday: 0,
    projectsMaxToday: DAILY_PROJECTS_MAX,
    totalTokensConsumedLifetime: 150000, // sample initial usage
    totalCreditsConsumedLifetime: 2,
    userProjects: [
      {
        id: 'proj_default_1',
        name: 'QuantumShield PQC Core',
        description: 'Primary NIST FIPS 203 ML-KEM-768 hybrid migration project.',
        category: 'Quantum Cryptography',
        createdAt: new Date().toLocaleTimeString(),
        status: 'ACTIVE',
        freeTokensUsed: 120000,
        creditsUsed: 1
      }
    ],
    usageHistory: [
      {
        id: 'hist_init',
        timestamp: new Date().toLocaleTimeString(),
        type: 'DAILY_RESET',
        amount: DAILY_FREE_TOKENS_MAX,
        reason: 'Daily Allowance Reset: 30 Million Free Tokens + 100 Credits + 3 Projects Granted'
      }
    ]
  };
}

let quotaListeners: ((data: QuotaData) => void)[] = [];

export function loadQuotaData(): QuotaData {
  if (typeof window === 'undefined') return getDefaultQuotaData();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initData = getDefaultQuotaData();
      saveQuotaData(initData);
      return initData;
    }

    const data: QuotaData = JSON.parse(raw);
    const today = getTodayString();

    // Check if a new day has arrived -> auto reset daily counters!
    if (data.lastResetDate !== today) {
      data.lastResetDate = today;
      data.freeTokensRemaining = DAILY_FREE_TOKENS_MAX;
      data.creditTokensRemaining = DAILY_CREDIT_TOKENS_MAX;
      data.projectsCreatedToday = 0;
      data.usageHistory.unshift({
        id: `reset_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'DAILY_RESET',
        amount: DAILY_FREE_TOKENS_MAX,
        reason: `New Day Auto-Reset (${today}): 30M Free Tokens, 100 Credits, 3 Projects Allowance Refilled`
      });
      saveQuotaData(data);
    }

    return data;
  } catch (err) {
    console.error('Error reading quota data from localStorage:', err);
    return getDefaultQuotaData();
  }
}

export function saveQuotaData(data: QuotaData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    quotaListeners.forEach(listener => listener(data));
  } catch (err) {
    console.error('Error saving quota data:', err);
  }
}

export function subscribeQuota(callback: (data: QuotaData) => void): () => void {
  quotaListeners.push(callback);
  callback(loadQuotaData());
  return () => {
    quotaListeners = quotaListeners.filter(l => l !== callback);
  };
}

/**
 * Deduct free tokens for AI/Simulation usage
 */
export function consumeFreeTokens(amount: number, reason: string): { success: boolean; remaining: number; message: string } {
  const data = loadQuotaData();

  if (data.freeTokensRemaining < amount) {
    return {
      success: false,
      remaining: data.freeTokensRemaining,
      message: `Insufficient Free Tokens! Requested ${amount.toLocaleString()} tokens, but only ${data.freeTokensRemaining.toLocaleString()} remaining today.`
    };
  }

  data.freeTokensRemaining -= amount;
  data.totalTokensConsumedLifetime += amount;
  data.usageHistory.unshift({
    id: `use_tok_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    type: 'FREE_TOKENS',
    amount: amount,
    reason: reason
  });

  saveQuotaData(data);
  return {
    success: true,
    remaining: data.freeTokensRemaining,
    message: `Consumed ${amount.toLocaleString()} Free Tokens for ${reason}.`
  };
}

/**
 * Deduct credit tokens for heavy operations
 */
export function consumeCreditTokens(amount: number, reason: string): { success: boolean; remaining: number; message: string } {
  const data = loadQuotaData();

  if (data.creditTokensRemaining < amount) {
    return {
      success: false,
      remaining: data.creditTokensRemaining,
      message: `Insufficient Credit Tokens! Requested ${amount} credits, but only ${data.creditTokensRemaining} remaining today.`
    };
  }

  data.creditTokensRemaining -= amount;
  data.totalCreditsConsumedLifetime += amount;
  data.usageHistory.unshift({
    id: `use_cred_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    type: 'CREDITS',
    amount: amount,
    reason: reason
  });

  saveQuotaData(data);
  return {
    success: true,
    remaining: data.creditTokensRemaining,
    message: `Consumed ${amount} Credit Tokens for ${reason}.`
  };
}

/**
 * Create a new project within the 3/day project limit
 */
export function createNewProject(
  name: string,
  description: string,
  category: string
): { success: boolean; project?: UserProject; message: string } {
  const data = loadQuotaData();

  if (data.projectsCreatedToday >= DAILY_PROJECTS_MAX) {
    return {
      success: false,
      message: `Daily Project Limit Reached! You have created ${data.projectsCreatedToday} / ${DAILY_PROJECTS_MAX} projects today. Please wait for tomorrow's reset or archive existing ones.`
    };
  }

  // Cost: 1 credit + 100,000 tokens
  const tokenCost = 100_000;
  const creditCost = 1;

  if (data.creditTokensRemaining < creditCost || data.freeTokensRemaining < tokenCost) {
    return {
      success: false,
      message: `Creating a project requires ${creditCost} Credit Token and ${tokenCost.toLocaleString()} Free Tokens.`
    };
  }

  data.projectsCreatedToday += 1;
  data.creditTokensRemaining -= creditCost;
  data.freeTokensRemaining -= tokenCost;

  const newProject: UserProject = {
    id: `proj_${Date.now()}`,
    name,
    description,
    category,
    createdAt: new Date().toLocaleTimeString(),
    status: 'ACTIVE',
    freeTokensUsed: tokenCost,
    creditsUsed: creditCost
  };

  data.userProjects.unshift(newProject);
  data.usageHistory.unshift({
    id: `proj_create_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    type: 'PROJECT_CREATED',
    amount: 1,
    reason: `Created Project: "${name}" (${data.projectsCreatedToday}/${DAILY_PROJECTS_MAX} created today)`
  });

  saveQuotaData(data);
  return {
    success: true,
    project: newProject,
    message: `Project "${name}" successfully created! Daily limit remaining: ${DAILY_PROJECTS_MAX - data.projectsCreatedToday} projects.`
  };
}

/**
 * Reset daily quota manually (for admin / developer testing or instant refill)
 */
export function forceRefillDailyQuota(): QuotaData {
  const data = loadQuotaData();
  data.freeTokensRemaining = DAILY_FREE_TOKENS_MAX;
  data.creditTokensRemaining = DAILY_CREDIT_TOKENS_MAX;
  data.projectsCreatedToday = 0;
  data.usageHistory.unshift({
    id: `refill_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    type: 'DAILY_RESET',
    amount: DAILY_FREE_TOKENS_MAX,
    reason: 'Manual Instant Refill: 30 Million Free Tokens + 100 Credits + 3 Projects Granted'
  });
  saveQuotaData(data);
  return data;
}
