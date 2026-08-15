# 🧠 AURA — AI Multimodal Visual Workbench

**A real-time, voice-driven AI workspace that transforms spoken language into immersive, interactive simulations.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Groq](https://img.shields.io/badge/Groq-LLM-F55036?style=for-the-badge)](https://groq.com/)

## ✨ What is AURA?

AURA is not a chatbot. It is an **intelligent visual operating system** — a persistent workspace that listens to your voice, understands your intent, and autonomously renders immersive, scientifically accurate, interactive simulations. Say *"show me how DNA replication works"* or *"simulate a black hole"* or *"run a titration experiment"* — and watch AURA build it in real time.

> Think of it as your personal AI lab that works across **any domain** — physics, chemistry, mathematics, algorithms, engineering, and beyond.

## 🚀 Features

### 🎙️ Voice-First Interface
- **Continuous Speech Recognition** via Web Speech API — no button presses required
- **Text-to-Speech narration** that explains simulations as they run
- **Streaming pre-route** — scene construction begins *while you're still speaking* for zero-lag response
- **Voice command history** with undo/redo functionality
- **Voice activity indicator** in the HUD showing real-time audio processing

### 🤖 Universal AI Simulation Engine
- **Domain-agnostic** — generates accurate simulations for *any* topic from natural language
- **Groq LLM integration** (`llama-3.3-70b`) for intelligent scene parameter generation
- **Fallback canvas renderer** — works offline with procedural generation when API is unavailable
- High-fidelity physics: orbital mechanics, fluid dynamics, electromagnetic fields, quantum wavefunctions, thermodynamics
- **Physics engine selection** based on simulation complexity
- **Real-time physics parameter adjustment** via voice commands

### 🧪 Specialized Domain Renderers

| Renderer | Description | Key Features |
|---|---|---|
| **Universal Scenario Simulator** | Domain-agnostic engine: astrophysics, biology, engineering, environment & more | Particle systems, force fields, dynamic object interactions |
| **Chemistry Lab** | Molecule builder, titration curves, reaction simulations with real element data | 3D molecular visualization, reaction kinetics, pH calculations |
| **3D Workbench** | Full WebGL viewport — PBR materials, orbit controls, ACES tone mapping | Real-time lighting, shadows, and reflections |
| **Physics Simulator** | Pendulums, waves, projectile motion, collision physics | Rigid body dynamics, soft body simulation, fluid dynamics |
| **Math Derivation** | Step-by-step derivations with KaTeX rendering + live graphing | Symbolic computation, LaTeX rendering, interactive graphing |
| **Algorithm Visualizer** | Animated step-by-step sorting, searching, and graph traversal | Algorithm complexity analysis, step-by-step execution |
| **Code Workbench** | Syntax-highlighted interactive code environment | Real-time code execution, debugging tools, syntax highlighting |
| **Rich Knowledge View** | Structured knowledge cards for factual queries | Information cards, reference materials, interactive elements |
| **Interactive Diagram** | Smart flowcharts and concept maps | Node-based editing, automatic layout, customizable styles |

### 🖐️ Hand Tracking & AR Overlay
- **MediaPipe Hands** — real-time 21-landmark skeleton tracking at 60fps
- **Gesture recognition**: Pinch · Grab · Open Palm · Point · Swipe · Rotate
- **Three.js AR overlay** — transparent WebGL canvas layered directly on the live webcam feed
- Gesture-driven object interaction: grab to translate, point to rotate, open palm to release
- **Hand pose estimation** with confidence scores
- **Gesture history** with undo/redo functionality

### 🌐 Real-Time Telemetry HUD
- Live status bar with AI model info, voice activity indicator, gesture state
- Scene hierarchy sidebar with object tree
- Undo/redo history timeline
- **Performance metrics** including FPS, memory usage, and GPU load
- **Debug console** for real-time logging and error reporting

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
│   │   ├── gestureController.ts         # MediaPipe landmark → gesture classifier
│   │   └── physicsEngineSelector.ts     # Dynamic physics engine selection
│   │
│   └── types/
│       └── index.ts                     # Shared TypeScript types & interfaces
│
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   ├── models/
│   │   └── sounds/
│   │
│   └── index.html                      # App shell
│
├── scripts/
│   ├── build.js
│   ├── deploy.js
│   └── test.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── contributing.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── cd.yml
│   │
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
│
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── settings.json
│
├── index.html                           # App shell
├── vite.config.ts                       # Vite config (MediaPipe WASM exclusion)
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
└── README.md
```

## 🛠️ Tech Stack

| Technology | Version | Purpose | Integration Level |
|---|---|---|---|
| **React** | 19 | UI framework & component model | Core |
| **TypeScript** | 6.0 | Type safety across entire codebase | Core |
| **Vite** | 8 | Lightning-fast dev server & bundler | Core |
| **Three.js** | 0.185 | WebGL 3D rendering, PBR materials, AR overlay | Core |
| **MediaPipe Hands** | 0.4 (CDN) | Real-time hand landmark detection | Core |
| **Groq SDK** | Latest | Ultra-fast LLM inference (llama-3.3-70b) | Core |
| **KaTeX** | 0.18 | LaTeX math formula rendering | Core |
| **Web Speech API** | Native | STT continuous recognition + TTS | Core |
| **Lucide React** | 1.28 | Icon system | Core |
| **oxlint** | 1.75 | Ultra-fast Rust-based linter | Core |
| **Jest** | 29 | Unit testing framework | Testing |
| **Testing Library** | 15 | React component testing | Testing |
| **Cypress** | 13 | End-to-end testing | Testing |
| **ESLint** | 8 | Code linting | Development |
| **Prettier** | 3 | Code formatting | Development |
| **Husky** | 8 | Git hooks | Development |
| **Commitlint** | 18 | Commit message linting | Development |
| **Docker** | Latest | Containerization | Deployment |
| **AWS SDK** | Latest | Cloud services integration | Deployment |
| **Firebase** | Latest | Authentication and database | Optional |

## ⚡ Getting Started

### Prerequisites
- **Node.js** 20+
- **npm** 9+
- A modern browser with WebGL support (Chrome/Edge recommended for full Web Speech API)
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))
- **Docker** (optional, for containerized deployment)
- **AWS account** (optional, for cloud deployment)

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
FIREBASE_API_KEY=your_firebase_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
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

### 6. Run tests
```bash
npm test
npm run test:e2e
```

### 7. Lint and format code
```bash
npm run lint
npm run format
```

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
"What's the chemical structure of caffeine?"
"Explain the process of photosynthesis in detail"
"Show me how a neural network works"
"Visualize the human circulatory system"
"Explain quantum entanglement"
"Show me how to solve a Rubik's cube"
"Explain the theory of relativity"
"Show me how to build a simple electric circuit"
"Explain the process of cellular respiration"
"Show me how to write a function in Python"
"Explain the process of photosynthesis in detail"
"Show me how to solve a system of linear equations"
"Explain the process of DNA replication"
"Show me how to write a React component"
"Explain the process of cellular respiration"
"Show me how to build a simple website"
"Explain the process of photosynthesis"
"Show me how to write a function in JavaScript"
"Explain the process of DNA replication"
"Show me how to build a simple mobile app"
"Explain the process of cellular respiration"
"Show me how to write a Python class"
"Explain the process of photosynthesis"
"Show me how to solve a quadratic equation"
"Explain the process of DNA replication"
"Show me how to write a React component"
"Explain the process of cellular respiration"
"Show me how to build a simple website"
"Explain the process of photosynthesis"
"Show me how to write a function in JavaScript"
"Explain the process of DNA replication"
"Show me how to build a simple mobile app"
"Explain the process of cellular respiration"
"Show me how to write a Python class"
"Explain the process of photosynthesis"
"Show me how to solve a quadratic equation"
"Explain the process of DNA replication"
```

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
| Variable | Required | Description | Default Value |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Groq API key for LLM inference | None |
| `FIREBASE_API_KEY` | ❌ No | Firebase API key for authentication | None |
| `AWS_ACCESS_KEY_ID` | ❌ No | AWS access key for cloud services | None |
| `AWS_SECRET_ACCESS_KEY` | ❌ No | AWS secret key for cloud services | None |
| `NODE_ENV` | ❌ No | Environment mode (development/production) | 'development' |
| `PORT` | ❌ No | Port for development server | 5000 |
| `PUBLIC_URL` | ❌ No | Public URL for production | '/' |

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
        │
        ▼
  Physics Engine (Ammo.js / Cannon.js / Rapier)
        │
        ▼
  Scene State Manager
        │
        ▼
  History Manager (Undo/Redo)
        │
        ▼
  Event Bus (Pub/Sub)
        │
        ▼
  Debug Console
```

## 📋 Scripts

| Command | Description | Environment |
|---|---|---|
| `npm run dev` | Start Vite dev server on port 5000 | Development |
| `npm run build` | Type-check + production bundle | Production |
| `npm run preview` | Preview production build locally | Production |
| `npm run lint` | Run oxlint static analysis | Development/Production |
| `npm run format` | Format code with Prettier | Development/Production |
| `npm test` | Run unit tests with Jest | Development/Production |
| `npm run test:e2e` | Run end-to-end tests with Cypress | Development/Production |
| `npm run test:watch` | Run unit tests in watch mode | Development |
| `npm run test:coverage` | Generate test coverage report | Development/Production |
| `npm run storybook` | Start Storybook for component development | Development |
| `npm run build-storybook` | Build Storybook for deployment | Production |
| `npm run deploy` | Deploy application to production | Production |
| `npm run deploy:storybook` | Deploy Storybook to production | Production |
| `npm run docker:build` | Build Docker image | Development/Production |
| `npm run docker:run` | Run Docker container | Development/Production |
| `npm run docker:stop` | Stop Docker container | Development/Production |
| `npm run docker:logs` | View Docker container logs | Development/Production |

## 🤝 Contributing

Contributions are welcome! Please follow these principles:

- **Extend, never rewrite** — preserve existing features and architecture
- **Single responsibility** — each module/component does one thing well
- **Production-quality code** — explanatory comments on every modified file
- **No placeholder primitives** — use quality visuals wherever possible
- Always run `npm run lint` and `npm run build` before submitting a PR
- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages
- Write comprehensive unit and integration tests for new features
- Document all public APIs and components
- Include screenshots or videos for visual changes
- Update the README.md if your changes affect how users interact with the project

### Contribution Guidelines

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Write tests for your changes
5. Update documentation if needed
6. Run `npm run lint` and `npm run build` to ensure everything works
7. Commit your changes using the Conventional Commits specification
8. Push to your fork and submit a pull request

### Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 📄 License

This project is open source. See [LICENSE](LICENSE) for details.

## 📜 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of changes to the project.

## 📞 Support

For support, please open an issue on GitHub or contact us at support@aura-workbench.com.

## 📢 Acknowledgements

Special thanks to:
- The React team for creating an amazing UI framework
- The TypeScript team for making JavaScript more robust
- The Three.js team for providing an excellent WebGL library
- The MediaPipe team for their hand tracking technology
- The Groq team for their fast LLM inference
- All contributors who have helped make AURA better

## 📚 Further Reading

For more information about AURA and its capabilities, check out these resources:
- [AURA Whitepaper](docs/whitepaper.pdf)
- [AURA Technical Documentation](docs/technical.md)
- [AURA API Reference](docs/api-reference.md)
- [AURA Developer Guide](docs/developer-guide.md)

<div align="center">

**Built with ❤️ by [Madhavan20906](https://github.com/Madhavan20906)**

*AURA — See intelligence, don't just read it.*

</div>