import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      name: "Omniver Quantum Decoder Server",
      timestamp: new Date().toISOString(),
      quantumBackends: ["DECLARED_CAPABILITIES_ONLY"],
      backendStatus: "No live provider connection is established by this health endpoint.",
      hasGemini: !!process.env.GEMINI_API_KEY,
    });
  });

  // Gemini AI Assistant & Quantum Copilot endpoint
  app.post("/api/gemini/copilot", async (req, res) => {
    try {
      const { message, context, mode } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback response if API key is not yet set
        return res.json({
          text: `[Quantum Simulation Copilot - Offline Mode]\n\nHello! I am your Quantum Cryptography Copilot for Shor's Algorithm and Solana On-Chain decoding.\n\nShor's Algorithm factors an integer $N = p \\times q$ in polynomial time $O((\\log N)^3)$ on a quantum computer by converting the factorization problem into order finding $a^r \\equiv 1 \\pmod N$. Quantum Fourier Transform (QFT) extracts the period $r$.\n\nYou can run quantum simulations or test decoding missions directly in the interactive labs below.`,
          model: "fallback",
        });
      }

      const systemInstruction = `You are the specialized AI Quantum Cryptography Assistant for "Omniver Quantum Decoder" — an interactive platform educating researchers, developers, and students on Shor's Algorithm, Bitcoin cryptography (ECDSA secp256k1 & SHA-256 vs Quantum attacks), and Solana blockchain state progression.

Your capabilities:
1. Explain Shor's Algorithm, Quantum Phase Estimation (QPE), Quantum Fourier Transform (QFT), modular exponentiation, continued fractions, and RSA/ECDSA breaking.
2. Explain Post-Quantum Cryptography (PQC) including NIST standards (ML-KEM/Kyber, ML-DSA/Dilithium, SPHINCS+).
3. Generate and explain Qiskit (Python), OpenQASM 3.0, Cirq, and PennyLane quantum circuit codes.
4. Explain Solana smart contracts (Rust/Anchor), Relayers/Oracles, and Anna App Executa JSON-RPC 2.0 integration.
5. Format mathematical formulas clearly with LaTeX notation like $N = p \\times q$, $\\gcd(a^{r/2} \\pm 1, N)$, $\\mathcal{O}((\\log N)^3)$.

Current context provided by the app: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Mode: ${mode || "general"}. User Prompt: ${message}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({
        text: response.text || "No response generated from quantum copilot.",
        model: "gemini-3.7-flash",
      });
    } catch (error: any) {
      console.error("Gemini Copilot Error:", error);
      res.status(500).json({
        error: error.message || "Failed to generate copilot response",
      });
    }
  });

  // Executa JSON-RPC 2.0 Bridge Simulation Endpoint
  app.post("/api/executa/rpc", (req, res) => {
    const { jsonrpc, id, method, params } = req.body;

    if (jsonrpc !== "2.0") {
      return res.status(400).json({
        jsonrpc: "2.0",
        id: id || null,
        error: { code: -32600, message: "Invalid Request: must specify jsonrpc: '2.0'" },
      });
    }

    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          name: "Omniver Quantum Decoder Executa Plugin",
          version: "2.4.0",
          capabilities: ["tools", "sampling", "aps_storage", "solana_relayer"],
          supportedBackends: ["qiskit_aer", "pennylane", "classiq", "ibm_quantum"],
        },
      });
    }

    if (method === "tools.list") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "start_quantum_decoding",
              description: "Execute Shor's algorithm simulation on composite integer N to recover prime factors p and q.",
              parameters: {
                type: "object",
                properties: {
                  target_number: { type: "integer", description: "Target composite number N (e.g. 15, 21, 35, 77)" },
                  coprime_a: { type: "integer", description: "Chosen coprime base a" },
                  shots: { type: "integer", description: "Quantum measurement shots (e.g. 1024, 4096)" },
                  player_address: { type: "string", description: "Solana wallet public key" },
                },
                required: ["target_number", "player_address"],
              },
            },
            {
              name: "verify_solana_proof",
              description: "SIMULATION ONLY: returns a local demonstration result; no Solana Anchor Program call is performed.",
              parameters: {
                type: "object",
                properties: {
                  task_id: { type: "string" },
                  player_address: { type: "string" },
                  factors: { type: "array", items: { type: "integer" } },
                },
                required: ["task_id", "player_address", "factors"],
              },
            },
            {
              name: "generate_openqasm",
              description: "Generates OpenQASM 3.0 code for the Shor period finding circuit for N.",
              parameters: {
                type: "object",
                properties: {
                  target_number: { type: "integer" },
                  qubit_count: { type: "integer" },
                },
                required: ["target_number"],
              },
            },
          ],
        },
      });
    }

    if (method === "tools.call") {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === "start_quantum_decoding") {
        const N = args.target_number || 15;
        // Simple factorization logic for response
        let p = 3, q = 5;
        if (N === 21) { p = 3; q = 7; }
        else if (N === 33) { p = 3; q = 11; }
        else if (N === 35) { p = 5; q = 7; }
        else if (N === 77) { p = 7; q = 11; }
        else if (N === 91) { p = 7; q = 13; }
        else {
          for (let i = 2; i <= Math.sqrt(N); i++) {
            if (N % i === 0) {
              p = i;
              q = N / i;
              break;
            }
          }
        }

        const taskId = "task-" + Math.random().toString(36).substring(2, 10);
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            taskId,
            targetNumber: N,
            factors: [p, q],
            status: "SIMULATION_DECODED",
            simulation: true,
            quantumBackend: "NO QUANTUM BACKEND EXECUTED",
            shotsRequested: args.shots || 1024,
            executionTimeMs: null,
            playerAddress: args.player_address,
            message: `Locally factored N=${N} into p=${p}, q=${q}. This endpoint does not execute Shor's algorithm or submit a Solana transaction.`,
          },
        });
      }

      if (toolName === "verify_solana_proof") {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            success: false,
            simulation: true,
            verificationStatus: "NOT_PERFORMED_ON_CHAIN",
            signature: null,
            slot: null,
            pointsEarned: 0,
            badgeAwarded: null,
            playerAddress: args.player_address,
          },
        });
      }

      return res.status(404).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Tool '${toolName}' not found` },
      });
    }

    return res.status(400).json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method '${method}' not implemented` },
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Omniver Quantum Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
