<div align="center">

# 🧠 AURA — AI Multimodal Visual Workbench

**A real-time, voice-driven AI workspace that turns spoken language into living, interactive simulations.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=for-the-badge)](https://groq.com/)

</div>

---

## ✨ What is AURA?

AURA is not a chatbot. It is an **intelligent visual operating system** — a persistent workspace that listens to your voice, understands your intent, and autonomously renders immersive, scientifically accurate, interactive simulations. Say *"show me how DNA replication works"* or *"simulate a black hole"* or *"run a titration experiment"* — and watch AURA build it in real time.

> Think of it as your personal AI lab that works across **any domain** — physics, chemistry, mathematics, algorithms, engineering, and beyond.

---

## 🚀 Features

### 🎙️ Voice-First Interface
- **Continuous Speech Recognition** via Web Speech API — no button presses required
- **Text-to-Speech narration** that explains simulations as they run
- **Streaming pre-route** — scene construction begins *while you're still speaking* for zero-lag response

### 🤖 Universal AI Simulation Engine
- **Domain-agnostic** — generates accurate simulations for *any* topic from natural language
- **Groq LLM integration** (`llama-3.3-70b`) for intelligent scene parameter generation
- **Fallback canvas renderer** — works offline with procedural generation when API is unavailable
- High-fidelity physics: orbital mechanics, fluid dynamics, electromagnetic fields, quantum wavefunctions, thermodynamics

### 🧪 Specialized Domain Renderers

| Renderer | Description |
|---|---|
| **Universal Scenario Simulator** | Domain-agnostic engine: astrophysics, biology, engineering, environment & more |
| **Chemistry Lab** | Molecule builder, titration curves, reaction simulations with real element data |
| **3D Workbench** | Full WebGL viewport — PBR materials, orbit controls, ACES tone mapping |
| **Physics Simulator** | Pendulums, waves, projectile motion, collision physics |
| **Math Derivation** | Step-by-step derivations with KaTeX rendering + live graphing |
| **Algorithm Visualizer** | Animated step-by-step sorting, searching, and graph traversal |
| **Code Workbench** | Syntax-highlighted interactive code environment |
| **Rich Knowledge View** | Structured knowledge cards for factual queries |
| **Interactive Diagram** | Smart flowcharts and concept maps |

### 🖐️ Hand Tracking & AR Overlay
- **MediaPipe Hands** — real-time 21-landmark skeleton tracking at 60fps
- **Gesture recognition**: Pinch · Grab · Open Palm · Point
- **Three.js AR overlay** — transparent WebGL canvas layered directly on the live webcam feed
- Gesture-driven object interaction: grab to translate, point to rotate, open palm to release

### 🌐 Real-Time Telemetry HUD
- Live status bar with AI model info, voice activity indicator, gesture state
- Scene hierarchy sidebar with object tree
- Undo/redo history timeline

---

## 🗂️ Project Structure

```
ai-multimodal-workbench/
├── src/
│   ├── App.tsx                          # Root state machine, streaming pre-route, gesture callbacks
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Global design system & animations
│   │
│   ├── components/
│   │   ├── CameraHandTracker.tsx        # Webcam + Three.js AR overlay + MediaPipe inference
│   │   ├── SpeechController.tsx         # Headless STT (continuous) + TTS narration
│   │   ├── HUDHeader.tsx                # Top telemetry bar & status indicators
│   │   ├── DomainPresets.tsx            # Quick-access domain preset buttons
│   │   └── SceneHierarchy.tsx           # Object tree sidebar + timeline
│   │
│   │   └── representations/
│   │       ├── UniversalScenarioSimulator.tsx  # 🌟 Core universal canvas renderer
│   │       ├── ChemistryLabView.tsx            # Chemistry experiments & molecules
│   │       ├── ThreeDWorkbench.tsx             # Full 3D WebGL viewport
│   │       ├── PhysicsSimulator.tsx            # Physics pendulum, waves, etc.
│   │       ├── MathDerivationView.tsx          # KaTeX math + graphing
│   │       ├── AlgorithmVisualizer.tsx         # Step-by-step algorithm animations
│   │       ├── CodeWorkbenchView.tsx           # Code editor with syntax highlighting
│   │       ├── InteractiveDiagramView.tsx      # Flowcharts & concept maps
│   │       └── RichKnowledgeView.tsx           # Structured knowledge cards
│   │
│   ├── services/
│   │   ├── aiRouter.ts                  # Maps NL input → RepresentationPayload
│   │   ├── universalSimulationGenerator.ts  # 🌟 Domain-agnostic scene parameter engine
│   │   ├── chemistrySimulationGenerator.ts  # Chemistry-specific scene builder
│   │   ├── groqService.ts               # Groq LLM API client (llama-3.3-70b)
│   │   └── gestureController.ts         # MediaPipe landmark → gesture classifier
│   │
│   └── types/
│       └── index.ts                     # Shared TypeScript types & interfaces
│
├── index.html                           # App shell
├── vite.config.ts                       # Vite config (MediaPipe WASM exclusion)
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI framework & component model |
| **TypeScript** | 6.0 | Type safety across entire codebase |
| **Vite** | 8 | Lightning-fast dev server & bundler |
| **Three.js** | 0.185 | WebGL 3D rendering, PBR materials, AR overlay |
| **MediaPipe Hands** | 0.4 (CDN) | Real-time hand landmark detection |
| **Groq SDK** | Latest | Ultra-fast LLM inference (llama-3.3-70b) |
| **KaTeX** | 0.18 | LaTeX math formula rendering |
| **Web Speech API** | Native | STT continuous recognition + TTS |
| **Lucide React** | 1.28 | Icon system |
| **oxlint** | 1.75 | Ultra-fast Rust-based linter |

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** 20+
- **npm** 9+
- A modern browser with WebGL support (Chrome/Edge recommended for full Web Speech API)
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/Madhavan20906/Ai-Multimodal-assistant-.git
cd Ai-Multimodal-assistant-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 4. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## 🎮 How to Use

1. **Allow camera and microphone** permissions when prompted
2. **Speak a query** — e.g., *"show me photosynthesis"*, *"simulate a pulsar"*, *"explain quicksort"*
3. Watch AURA **route your query** to the best renderer and build the simulation live
4. **Use hand gestures** to interact with 3D objects in AR mode
5. Click **domain preset buttons** at the top for quick demos

### Example Prompts
```
"Show me how a solar system forms"
"Simulate acid-base titration with HCl and NaOH"
"Visualize bubble sort step by step"
"Explain how DNA replication works"
"Show a 3D model of a water molecule"
"Simulate electromagnetic wave propagation"
"Show me the Mandelbrot set"
"How does a black hole work?"
```

---

## 🔧 Configuration

### Vite Config Notes
`@mediapipe/hands` and `@mediapipe/camera_utils` are excluded from Vite's dependency optimization to prevent WASM bundling crashes:

```ts
// vite.config.ts
optimizeDeps: {
  exclude: ['@mediapipe/hands', '@mediapipe/camera_utils']
}
```

### Environment Variables
| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLM inference |

---

## 🏗️ Architecture Overview

```
Voice Input / Text Input
        │
        ▼
  SpeechController (STT)
        │
        ▼
    aiRouter.ts  ──── Groq LLM (llama-3.3-70b) ──── universalSimulationGenerator.ts
        │                                                         │
        ▼                                                         ▼
RepresentationPayload ────────────────────────── SceneConfig + AnimationParams
        │
        ▼
 ┌──────────────────────────────────────────────────┐
 │            Representation Renderer               │
 │  (UniversalScenario / Chemistry / 3D / Physics   │
 │   Math / Algorithm / Code / Diagram / Knowledge) │
 └──────────────────────────────────────────────────┘
        │
        ▼
  Canvas / WebGL / DOM Output
        │
        ▼
  TTS Narration (SpeechController)
```

---

## 📋 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5000 |
| `npm run build` | Type-check + production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run oxlint static analysis |

---

## 🤝 Contributing

Contributions are welcome! Please follow these principles:

- **Extend, never rewrite** — preserve existing features and architecture
- **Single responsibility** — each module/component does one thing well
- **Production-quality code** — explanatory comments on every modified file
- **No placeholder primitives** — use quality visuals wherever possible
- Always run `npm run lint` and `npm run build` before submitting a PR

---

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Madhavan20906](https://github.com/Madhavan20906)**

*AURA — See intelligence, don't just read it.*

</div>
