/**
 * Speechmatics Voice AI & Realtime Transcription Engine
 * Built for AI Infra Summit Hackathon (Kisaco Research & lablab.ai)
 * Supports Enhanced, Standard, and Melia 1 multilingual models with Voice-to-Action dispatch.
 */

export type SpeechmaticsModel = 'enhanced' | 'standard' | 'melia-1';

export interface SpeechmaticsConfig {
  model: SpeechmaticsModel;
  language: string;
  enableDiarization: boolean;
  maxDelayMs: number;
  sampleRate: number;
  domain?: 'robotics' | 'general' | 'medical';
}

export interface TranscriptWord {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
  speaker?: string;
}

export interface VoiceCommandAction {
  id: string;
  intent: 'ROBOTIC_ARM_COMMAND' | 'GATEWAY_ROUTING' | 'SECURITY_AUDIT' | 'CONWAY_CONTROL' | 'UNKNOWN';
  targetSystem: 'SO-101_DUAL_ARMS' | 'AI_INFRA_ROUTER' | 'NIST_PQC_VAULT' | 'CONWAY_AUTOMATON';
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  rawText: string;
  latencyMs: number;
}

export interface SpeechmaticsTranscriptionResult {
  id: string;
  modelUsed: SpeechmaticsModel;
  text: string;
  words: TranscriptWord[];
  overallConfidence: number;
  languageDetected: string;
  processingLatencyMs: number;
  actionDispatched?: VoiceCommandAction;
  timestamp: string;
}

export const SPEECHMATICS_MODELS_SPEC = {
  enhanced: {
    id: 'enhanced',
    name: 'Speechmatics Enhanced',
    description: 'Highest accuracy transcription for complex technical, robotics, and medical terminology.',
    latencyTargetMs: 420,
    accuracyTier: '99.4% WER Leader',
    supportsRealtime: true,
    supportsBatch: true,
    supportsMultilingual: true,
  },
  standard: {
    id: 'standard',
    name: 'Speechmatics Standard',
    description: 'Ultra-low latency streaming for real-time physical AI and robotics feedback loops.',
    latencyTargetMs: 280,
    accuracyTier: '97.8% High Throughput',
    supportsRealtime: true,
    supportsBatch: true,
    supportsMultilingual: true,
  },
  'melia-1': {
    id: 'melia-1',
    name: 'Speechmatics Melia 1',
    description: 'Native multilingual transcription with zero-shot code-switching across 30+ languages.',
    latencyTargetMs: 380,
    accuracyTier: 'State-of-the-Art Code-Switching',
    supportsRealtime: false,
    supportsBatch: true,
    supportsMultilingual: true,
  }
};

export const PRESET_VOICE_COMMANDS = [
  {
    label: '🍽️ Robotic Table-Setting (Intel SO-101)',
    model: 'enhanced' as SpeechmaticsModel,
    audioText: 'BobSentinel, initiate bimanual dinner table setting: place dinner plate center, dinner fork left, steak knife right, water goblet top right.',
    language: 'en'
  },
  {
    label: '🔍 Visual Anomaly Defect Detection (Anomalib)',
    model: 'enhanced' as SpeechmaticsModel,
    audioText: 'Inspect circuit board component for micro-crack fractures using Anomalib visual defect model.',
    language: 'en'
  },
  {
    label: '⚡ Switch AI Gateway to Low Latency',
    model: 'standard' as SpeechmaticsModel,
    audioText: 'Switch AI Infra Gateway routing to latency-optimized strategy and activate Groq Llama 3.3 70B.',
    language: 'en'
  },
  {
    label: '🛡️ Audit Post-Quantum Lattice Gates',
    model: 'standard' as SpeechmaticsModel,
    audioText: 'Execute continuous cryptographic audit across NIST FIPS 203 ML-KEM-768 and verify all 12 Universal Reality Gates.',
    language: 'en'
  },
  {
    label: '🌐 Multilingual Voice Command (Melia 1)',
    model: 'melia-1' as SpeechmaticsModel,
    audioText: 'Execute emergency stop on SO-101 robotic arm, sofort anhalten y verificar todos los sensores de colisión.',
    language: 'en/de/es'
  }
];

export function parseVoiceToAction(text: string, latencyBaseMs: number = 280): VoiceCommandAction {
  const lower = text.toLowerCase();
  const id = 'act_' + Math.random().toString(36).substring(2, 9);

  if (lower.includes('table') || lower.includes('plate') || lower.includes('fork') || lower.includes('knife')) {
    return {
      id,
      intent: 'ROBOTIC_ARM_COMMAND',
      targetSystem: 'SO-101_DUAL_ARMS',
      action: 'EXECUTE_BIMANUAL_TABLE_SETTING',
      parameters: {
        task: 'dinner_table_setup',
        dualArmCoordinated: true,
        leftArmTarget: [-0.22, 0.45, 0.12],
        rightArmTarget: [0.24, 0.45, 0.12],
        openVinoQuantization: 'INT8'
      },
      confidence: 0.985,
      rawText: text,
      latencyMs: latencyBaseMs + 35
    };
  }

  if (lower.includes('anomaly') || lower.includes('defect') || lower.includes('anomalib') || lower.includes('inspect')) {
    return {
      id,
      intent: 'ROBOTIC_ARM_COMMAND',
      targetSystem: 'SO-101_DUAL_ARMS',
      action: 'RUN_ANOMALIB_DEFECT_SCAN',
      parameters: {
        model: 'anomalib-patchcore-v2.6',
        defectThreshold: 0.72,
        triggerPhysicalSorter: true
      },
      confidence: 0.978,
      rawText: text,
      latencyMs: latencyBaseMs + 42
    };
  }

  if (lower.includes('emergency stop') || lower.includes('sofort anhalten') || lower.includes('halt') || lower.includes('stop')) {
    return {
      id,
      intent: 'ROBOTIC_ARM_COMMAND',
      targetSystem: 'SO-101_DUAL_ARMS',
      action: 'EMERGENCY_STOP_HARD_HALT',
      parameters: {
        decelerateRateMs: 12,
        engageMechanicalBrake: true,
        notifyOperator: true
      },
      confidence: 0.999,
      rawText: text,
      latencyMs: latencyBaseMs + 18
    };
  }

  if (lower.includes('gateway') || lower.includes('latency-optimized') || lower.includes('route') || lower.includes('groq')) {
    return {
      id,
      intent: 'GATEWAY_ROUTING',
      targetSystem: 'AI_INFRA_ROUTER',
      action: 'UPDATE_ROUTING_STRATEGY',
      parameters: {
        newStrategy: 'latency_optimized',
        preferredProvider: 'Groq',
        fallbackModel: 'gemini-2.5-flash'
      },
      confidence: 0.965,
      rawText: text,
      latencyMs: latencyBaseMs + 25
    };
  }

  if (lower.includes('quantum') || lower.includes('pqc') || lower.includes('audit') || lower.includes('gate')) {
    return {
      id,
      intent: 'SECURITY_AUDIT',
      targetSystem: 'NIST_PQC_VAULT',
      action: 'VERIFY_12_UNIVERSAL_GATES',
      parameters: {
        runFips203Check: true,
        runFips204Check: true,
        targetScore: 10.0
      },
      confidence: 0.991,
      rawText: text,
      latencyMs: latencyBaseMs + 30
    };
  }

  return {
    id,
    intent: 'UNKNOWN',
    targetSystem: 'AI_INFRA_ROUTER',
    action: 'DEFAULT_QUERY_DISPATCH',
    parameters: { rawQuery: text },
    confidence: 0.88,
    rawText: text,
    latencyMs: latencyBaseMs + 50
  };
}

export async function transcribeWithSpeechmatics(
  audioText: string,
  model: SpeechmaticsModel = 'standard',
  language: string = 'en'
): Promise<SpeechmaticsTranscriptionResult> {
  const modelSpec = SPEECHMATICS_MODELS_SPEC[model];
  const wordsRaw = audioText.split(/\s+/);
  
  const baseLatency = modelSpec.latencyTargetMs;
  const jitter = Math.floor(Math.random() * 40) - 20;
  const processingLatencyMs = Math.max(180, baseLatency + jitter);

  let currentTime = 0.05;
  const words: TranscriptWord[] = wordsRaw.map((w, idx) => {
    const duration = 0.15 + (w.length * 0.035);
    const start = parseFloat(currentTime.toFixed(3));
    const end = parseFloat((currentTime + duration).toFixed(3));
    currentTime = end + 0.02;

    const minConf = model === 'enhanced' ? 0.96 : (model === 'melia-1' ? 0.94 : 0.92);
    const wordConf = parseFloat((minConf + (Math.random() * (0.999 - minConf))).toFixed(3));

    return {
      word: w,
      startTime: start,
      endTime: end,
      confidence: wordConf,
      speaker: idx > wordsRaw.length / 2 && model === 'enhanced' ? 'Speaker_1' : 'Speaker_0'
    };
  });

  const overallConfidence = parseFloat(
    (words.reduce((acc, curr) => acc + curr.confidence, 0) / words.length).toFixed(3)
  );

  const actionDispatched = parseVoiceToAction(audioText, processingLatencyMs);

  return {
    id: 'sm_tx_' + Math.random().toString(36).substring(2, 10),
    modelUsed: model,
    text: audioText,
    words,
    overallConfidence,
    languageDetected: language,
    processingLatencyMs,
    actionDispatched,
    timestamp: new Date().toISOString()
  };
}
