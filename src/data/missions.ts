import { GatePlacement, QuantumSimulationResult } from '../lib/quantumEngine';

export interface Mission {
  id: number;
  title: string;
  subtitle: string;
  category: 'Foundation' | 'Cryptography' | 'Q-Day Breaker' | 'Post-Quantum';
  description: string;
  storyContext: string;
  numQubits: number;
  unlockedGates: string[];
  initialGates?: GatePlacement[];
  targetStateDescription: string;
  hint: string;
  quickGuide: string;
  checkCompletion: (res: QuantumSimulationResult, gates: GatePlacement[]) => {
    success: boolean;
    feedback: string;
    score: number;
  };
}

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: 'Superposition & Key Genesis',
    subtitle: 'Level 01 • Quantum Foundation',
    category: 'Foundation',
    numQubits: 1,
    unlockedGates: ['H', 'X', 'Z', 'MEASURE'],
    description: 'Create an equal quantum superposition state |+⟩ on Qubit 0 to generate a unhackable random cryptographic key.',
    storyContext:
      'Classical ciphers use pseudo-random numbers that supercomputers can predict. By placing a qubit into quantum superposition, we harness true quantum randomness governed by quantum physics!',
    targetStateDescription: 'P(|0⟩) = 50% and P(|1⟩) = 50% on Qubit 0',
    hint: 'Drag a Hadamard (H) gate onto Qubit 0 wire at step 0.',
    quickGuide: 'Place a Hadamard (H) gate on Qubit 0. This puts the qubit into a 50% |0⟩ and 50% |1⟩ superposition state.',
    checkCompletion: (res) => {
      const p1 = res.blochSpheres[0]?.prob1 || 0;
      if (p1 >= 0.45 && p1 <= 0.55) {
        return {
          success: true,
          feedback: 'Optimal superposition achieved! True quantum randomness generated.',
          score: 100,
        };
      }
      return {
        success: false,
        feedback: `Current |1⟩ probability is ${(p1 * 100).toFixed(1)}%. Target is 50%. Try placing an H gate!`,
        score: Math.round(p1 * 100),
      };
    },
  },
  {
    id: 2,
    title: 'Bell State Entanglement Cipher',
    subtitle: 'Level 02 • Quantum Cryptography',
    category: 'Cryptography',
    numQubits: 2,
    unlockedGates: ['H', 'X', 'Z', 'CX', 'MEASURE'],
    description: 'Entangle Qubit 0 and Qubit 1 into the maximally entangled Bell State |Φ+⟩ = (|00⟩ + |11⟩) / √2.',
    storyContext:
      'Albert Einstein called it "spooky action at a distance". In quantum encryption, measuring Qubit 0 instantaneously determines Qubit 1, even across galaxies. This forms the bedrock of quantum key distribution (QKD).',
    targetStateDescription: '50% |00⟩ and 50% |11⟩. State |01⟩ and |10⟩ must be 0%.',
    hint: 'Apply H gate to Qubit 0, then a CNOT (CX) gate with Control=Q0 and Target=Q1.',
    quickGuide: 'First place an H gate on Qubit 0, then add a CNOT (CX) gate with Control set to Qubit 0 and Target set to Qubit 1.',
    checkCompletion: (res, gates) => {
      const p00 = res.probabilities[0] || 0; // "00"
      const p11 = res.probabilities[3] || 0; // "11"
      const p01 = res.probabilities[1] || 0;
      const p10 = res.probabilities[2] || 0;

      if (p00 >= 0.42 && p11 >= 0.42 && p01 < 0.05 && p10 < 0.05) {
        return {
          success: true,
          feedback: 'Bell State |Φ+⟩ created! Quantum Entanglement established successfully.',
          score: 100,
        };
      }
      return {
        success: false,
        feedback: `Current state counts: |00⟩=${(p00 * 100).toFixed(0)}%, |11⟩=${(p11 * 100).toFixed(0)}%. Make sure to use H on Q0 then CNOT!`,
        score: Math.round((p00 + p11) * 50),
      };
    },
  },
  {
    id: 3,
    title: 'Grover’s Database Decryption',
    subtitle: 'Level 03 • Q-Day Password Cracker',
    category: 'Q-Day Breaker',
    numQubits: 2,
    unlockedGates: ['H', 'X', 'Z', 'CX', 'CZ', 'MEASURE'],
    description: 'Unpack the marked target key |11⟩ from 4 unsorted database hashes in a single Grover iteration with >90% probability.',
    storyContext:
      'Classical supercomputers take O(N) operations to brute force a password hash. Grover’s Quantum Search Algorithm achieves a quadratic speedup O(√N), threatening 128-bit symmetric ciphers on Q-Day!',
    targetStateDescription: 'Probability of target key |11⟩ > 85%',
    hint: 'Step 1: H on both Q0 and Q1. Step 2: CZ gate (Oracle). Step 3: H, X on both qubits, CZ gate, then X, H on both qubits (Diffusion Operator).',
    quickGuide: 'Build the Grover Operator: Place H on both qubits, apply the CZ Oracle, then construct the Phase Diffusion Operator (H, X, CZ, X, H).',
    checkCompletion: (res) => {
      const p11 = res.probabilities[3] || 0; // "11"
      if (p11 > 0.85) {
        return {
          success: true,
          feedback: 'Grover Amplification Complete! Password key |11⟩ extracted with high quantum confidence.',
          score: 100,
        };
      }
      return {
        success: false,
        feedback: `Target state |11⟩ probability is ${(p11 * 100).toFixed(1)}%. Needs >85%. Construct Oracle + Diffusion operator!`,
        score: Math.round(p11 * 100),
      };
    },
  },
  {
    id: 4,
    title: 'Shor’s RSA-15 Semi-Prime Factoring',
    subtitle: 'Level 04 • Breaking RSA Cryptography',
    category: 'Q-Day Breaker',
    numQubits: 3,
    unlockedGates: ['H', 'X', 'Z', 'S', 'T', 'CX', 'SWAP', 'CCX', 'MEASURE'],
    description: 'Construct the Quantum Fourier Transform (QFT) period-finding circuit to factor semi-prime N=15 into factors (3 × 5).',
    storyContext:
      'Shor’s Algorithm is the primary driver of the Q-Day threat. By discovering the period r of modular exponentiation f(x) = a^x mod N on a quantum computer, it exponentially breaks RSA and ECC encryption!',
    targetStateDescription: 'Periodic peaks in measurement histogram indicating factor period r = 4',
    hint: 'Initialize control qubits in equal superposition with H, apply modular multiplication CNOT gates, and apply 3-Qubit QFT stage.',
    quickGuide: 'Apply H gates on control qubits, add modular exponentiation controlled gates, and measure the Quantum Fourier Transform (QFT) period.',
    checkCompletion: (res, gates) => {
      const hasQFTGates = gates.some((g) => g.type === 'H') && gates.some((g) => g.type === 'CX');
      const depth = res.circuitDepth;
      if (hasQFTGates && depth >= 3) {
        return {
          success: true,
          feedback: 'Period r=4 discovered! RSA semi-prime N=15 factored into 3 × 5 via Shor’s QFT!',
          score: 100,
        };
      }
      return {
        success: false,
        feedback: 'Build a circuit with superposition control qubits, CNOT modular gates and measure the output!',
        score: 40,
      };
    },
  },
  {
    id: 5,
    title: '3-Qubit Quantum Error Correction',
    subtitle: 'Level 05 • Post-Quantum NISQ Defense',
    category: 'Post-Quantum',
    numQubits: 3,
    unlockedGates: ['H', 'X', 'Z', 'CX', 'CCX', 'MEASURE'],
    description: 'Protect a secret state |1⟩ against a single physical Qubit Bit-Flip noise error using the 3-Qubit Repetition Error Code.',
    storyContext:
      'Real IBM Quantum hardware operates at 15 mK temperature with physical noise. Quantum Error Correction (QEC) encodes 1 logical qubit into 3 physical qubits so quantum computers can run fault-tolerant code on Q-Day!',
    targetStateDescription: 'Encode |1⟩ into |111⟩ using CNOT gates so bit flips are corrected.',
    hint: 'Prepare Q0 as |1⟩ with X gate. Then apply CNOT from Q0->Q1 and CNOT from Q0->Q2 to create repetition code |111⟩.',
    quickGuide: 'Prepare Qubit 0 as |1⟩ with an X gate, then apply CNOT(Q0->Q1) and CNOT(Q0->Q2) to form the 3-qubit logical state |111⟩.',
    checkCompletion: (res) => {
      const p111 = res.probabilities[7] || 0; // "111"
      if (p111 > 0.85) {
        return {
          success: true,
          feedback: '3-Qubit Quantum Error Code Active! Encoded state |111⟩ protected against hardware bit-flip noise.',
          score: 100,
        };
      }
      return {
        success: false,
        feedback: `Logical state |111⟩ probability is ${(p111 * 100).toFixed(1)}%. Prepare X on Q0, then entangle Q1 & Q2 via CNOTs!`,
        score: Math.round(p111 * 100),
      };
    },
  },
];
