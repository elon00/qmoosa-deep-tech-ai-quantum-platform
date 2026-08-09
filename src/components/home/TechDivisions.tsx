import React, { useState } from "react";
import { NavigationTab } from "../../types";
import {
  Bot,
  Cpu,
  Link as LinkIcon,
  Lock,
  FlaskConical,
  Globe,
  Rocket,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface TechDivisionsProps {
  setCurrentTab: (tab: NavigationTab) => void;
}

export const TechDivisions: React.FC<TechDivisionsProps> = ({ setCurrentTab }) => {
  const [activeDomain, setActiveDomain] = useState<string>("ai");

  const domains = [
    {
      id: "ai",
      title: "AI Agentics",
      badge: "Agent OS",
      icon: <Bot className="w-4 h-4 text-[#00F0FF]" />,
      tab: "ai-workspace" as NavigationTab,
      description: "Autonomous multi-agent orchestration, agent memory, tool calling, and RAG pipelines.",
      highlights: [
        "13 Specialized Agent System (Coding, Quantum, Crypto, Blockchain)",
        "Custom Agent Builder with role-based tool permissions",
        "Deterministic audit logs & human-in-the-loop approvals",
        "Server-side Gemini 3.6 Flash streaming intelligence",
      ],
      codeSnippet: `// QMoosa Agent Execution Loop
const agent = await qmoosa.agents.get("quantum");
const execution = await agent.run({
  prompt: "Synthesize 4-qubit Grover circuit and verify phase fidelity",
  tools: ["QiskitSimulator", "MathMatrixEngine"]
});`,
    },
    {
      id: "quantum",
      title: "Quantum Computing",
      badge: "32 Qubits",
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      tab: "quantum" as NavigationTab,
      description: "Full-stack quantum software, Qiskit/Cirq interoperability, OpenQASM 3.0 compiler, and VQE/QAOA algorithms.",
      highlights: [
        "32-qubit state vector simulation with configurable gate noise",
        "Bloch sphere visualization & probability distribution charts",
        "PennyLane & Cirq bridge for hybrid classical-quantum models",
        "Quantum-safe API encapsulation",
      ],
      codeSnippet: `OPENQASM 3.0;
include "qelib1.inc";
qreg q[3];
creg c[3];
h q[0];
cx q[0], q[1];
cx q[1], q[2];
measure q -> c;`,
    },
    {
      id: "blockchain",
      title: "Blockchain & Web3",
      badge: "65K+ TPS",
      icon: <LinkIcon className="w-4 h-4 text-purple-400" />,
      tab: "blockchain" as NavigationTab,
      description: "High-throughput Solana Anchor programs, EVM smart contract static security audits, and agent wallets.",
      highlights: [
        "Automated Anchor Rust bytecode vulnerability detector",
        "Zero-Knowledge Succinct Proofs (zk-SNARKs / STARKs)",
        "Gasless micro-wallet mesh for autonomous machine economy",
        "On-chain verification audit trails",
      ],
      codeSnippet: `#[program]
pub mod qmoosa_chain {
    use super::*;
    pub fn verify_agent_transaction(ctx: Context<VerifyTx>, signature: [u8; 64]) -> Result<()> {
        msg!("QMoosa On-Chain Agent Signature Verified!");
        Ok(())
    }
}`,
    },
    {
      id: "crypto",
      title: "Cryptography & PQC",
      badge: "NIST Cat 3",
      icon: <Lock className="w-4 h-4 text-amber-400" />,
      tab: "cryptography" as NavigationTab,
      description: "NIST-standardized Post-Quantum Cryptography (ML-KEM, ML-DSA), lattice-based security, and key management.",
      highlights: [
        "Quantum-resistant lattice key encapsulation (Kyber-768)",
        "Dilithium digital signature authentication",
        "Hardware Security Module (HSM) key isolation",
        "Crypto-agility migration frameworks",
      ],
      codeSnippet: `// Post-Quantum ML-KEM-768 Encap
auto [pk, sk] = pqc::ml_kem_768::keygen();
auto [ct, ss] = pqc::ml_kem_768::encapsulate(pk);
assert(ss == pqc::ml_kem_768::decapsulate(ct, sk));`,
    },
    {
      id: "algorithm",
      title: "Algorithms & Research",
      badge: "Research Lab",
      icon: <FlaskConical className="w-4 h-4 text-blue-400" />,
      tab: "algorithms" as NavigationTab,
      description: "Graph algorithms, dynamic programming, NP-hard approximations, and empirical execution benchmarks.",
      highlights: [
        "Interactive mathematical proof summaries & Big-O bounds",
        "Sandboxed execution benchmarking for time/space complexity",
        "ArXiv preprint integration & BibTeX exports",
        "Reproducible experimental datasets",
      ],
      codeSnippet: `def qmoosa_min_cost_flow(graph, supply_demand):
    # Successive shortest path with Fibonacci heap priority queue
    # Returns optimal zero-slippage routing graph
    pass`,
    },
    {
      id: "web4",
      title: "Web4 Autonomous Web",
      badge: "M2M Economy",
      icon: <Globe className="w-4 h-4 text-indigo-400" />,
      tab: "web4" as NavigationTab,
      description: "Machine-to-machine economy, agentic micro-payments, decentralized AI identity (DID), and IoT orchestration.",
      highlights: [
        "Autonomous Agent Decentralized Identifiers (DIDs)",
        "Sub-cent agent-to-agent payment channels",
        "AI + IoT mesh consensus protocols",
        "Tokenized compute market settlement",
      ],
      codeSnippet: `const m2mChannel = new QMoosaM2MChannel({
  payerAgent: "did:qmoosa:agent:0x9f1a",
  payeeAgent: "did:qmoosa:agent:0x3b7c",
  microPaymentCapUsd: 0.001
});`,
    },
    {
      id: "frontier",
      title: "Frontier Technologies",
      badge: "Speculative",
      icon: <Rocket className="w-4 h-4 text-pink-400" />,
      tab: "research" as NavigationTab,
      description: "Speculative science-inspired research exploration: synthetic intelligence, space computing, and emerging physics.",
      highlights: [
        "Synthetic intelligence & neuromorphic computing paradigms",
        "Radiation-hardened space computing architectures",
        "Human-AI bi-directional cognitive interfaces",
        "Boundary-pushing experimental computing models",
      ],
      codeSnippet: `# Neuromorphic Spiking Neural Architecture
class SpikingNeuronGroup:
    def __init__(self, membrane_potential_threshold=-55.0):
        self.v_thresh = membrane_potential_threshold`,
    },
  ];

  const currentDomainObj = domains.find((d) => d.id === activeDomain) || domains[0];

  return (
    <section className="py-20 bg-[#050505] border-b border-white/10 text-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 font-mono-code">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#00F0FF]">
            // Core Engineering Divisions
          </h2>
          <p className="mt-3 text-3xl sm:text-5xl font-display font-light text-white tracking-tight">
            Software Across the Technical Frontier
          </p>
          <p className="mt-4 text-neutral-400 text-xs uppercase tracking-widest font-sans">
            Select a division below to inspect its architecture, code spec, and live capabilities.
          </p>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 font-mono-code text-xs uppercase tracking-wider">
          {domains.map((dom) => {
            const isActive = activeDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => setActiveDomain(dom.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 transition duration-150 border ${
                  isActive
                    ? "bg-white text-black border-white font-bold"
                    : "bg-white/[0.02] text-neutral-400 hover:text-white border-white/10 hover:border-white/30"
                }`}
              >
                {dom.icon}
                <span>{dom.title}</span>
                <span className={`text-[9px] px-1.5 py-0.5 border ${
                  isActive ? "border-black bg-black/10 text-black" : "border-white/10 text-[#00F0FF]"
                }`}>
                  {dom.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Active Domain Card */}
        <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Info Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 border border-white/10 bg-black">
                {currentDomainObj.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono-code text-[#00F0FF] uppercase tracking-[0.2em] font-bold">
                  QMOOSA // DIVISION SPEC
                </span>
                <h3 className="text-3xl font-display font-light text-white">{currentDomainObj.title}</h3>
              </div>
            </div>

            <p className="text-neutral-300 text-sm leading-relaxed font-sans">{currentDomainObj.description}</p>

            <div className="space-y-3 font-mono-code">
              <h4 className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                ARCHITECTURAL PILLARS
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDomainObj.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-neutral-300 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#00FF41] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentTab(currentDomainObj.tab)}
                className="inline-flex items-center space-x-2 px-6 py-3 text-xs font-mono-code uppercase tracking-widest text-black bg-white hover:bg-[#00F0FF] transition-all duration-200"
              >
                <span>Launch {currentDomainObj.title} Studio</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Code Block Box */}
          <div className="lg:col-span-5 bg-black border border-white/10 p-5 font-mono-code text-xs overflow-x-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-neutral-400 text-[10px] uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[#00FF41]" />
                <span className="font-bold text-white">{currentDomainObj.id}_module.spec</span>
              </div>
              <span className="text-[#00F0FF]">EXECUTABLE CODE</span>
            </div>
            <pre className="text-neutral-300 leading-relaxed font-mono-code text-[11px]">
              <code>{currentDomainObj.codeSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
