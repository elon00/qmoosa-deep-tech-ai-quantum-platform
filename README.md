# Omniverse Quantum Decoder 🚀

An interactive, gamified Quantum Computing Simulator and Quantum Mechanics visualizer designed for students, researchers, and quantum enthusiasts. Powered by Gemini AI, D3.js, statevector math, and OpenQASM 2.0 integration for real IBM Quantum hardware testing.

## 🌟 Key Features

- **Interactive Quantum Circuit Studio**: Drag & drop Hadamard ($H$), Pauli ($X, Y, Z$), Phase ($S, T, R_x, R_y, R_z$), and Multi-Qubit Entanglement gates ($CNOT, CZ, SWAP$).
- **Student & Researcher Game Hub**:
  - **Problem Box**: Mission goals, quantum challenges, and academic context.
  - **Ask Box**: Interactive Q-Core AI Assistant powered by Gemini 3.6 Flash.
  - **Seek Box**: Quantum physics concept encyclopedia (Bell Pairs, Grover Search, Superposition).
  - **Find Box**: Real-time statevector, complex amplitude, entanglement fidelity & noise metrics.
  - **Solution Box**: Verified mission guide, auto-loader, and executable Qiskit Python code.
- **D3.js State Visualizer**: Real-time probability bar charts with HSL phase hue mapping, Bloch sphere vectors, and complex amplitude phase wheels.
- **IBM Quantum Hardware Integration**: Converts circuits directly to OpenQASM 2.0 and Qiskit Python code.

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

The application runs on `http://localhost:3000`.

---

## 📦 Netlify Deployment

This repository includes pre-configured `netlify.toml` and `public/_redirects` files for 1-click Netlify deployment.

1. Connect your GitHub repository to [Netlify](https://www.netlify.com/).
2. Netlify will automatically detect build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Click **Deploy Site**.

---

## 🐙 GitHub Pages Deployment

1. Push this project to your GitHub repository.
2. In GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** or set source branch to `main` (`/dist`).
4. Run `npm run build` and push the `dist` folder, or use the standard Static Web GitHub Action.

---

## 🛠️ Built With

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4**
- **D3.js** for quantum statevector visualization
- **Lucide React** icons
- **Google Gemini API** (`@google/genai`)
