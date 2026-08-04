# AURA Workbench — AI Multimodal Visual OS

## Project Overview

A real-time AI-powered interactive workbench that converts spoken or typed commands into domain-specific interactive visualisations. The application behaves as an intelligent visual workspace — not a chatbot.

### Key capabilities
- **Voice control**: Continuous Web Speech API (STT + TTS), with streaming pre-route that begins building scenes while the user is still speaking
- **MediaPipe hand tracking**: CDN-loaded, live 21-landmark skeleton overlay on the camera feed; gesture recognition (Pinch, Grab, Open Palm, Point) drives AR object interaction
- **Three.js AR overlay**: Transparent WebGL canvas layered on the live webcam; objects respond to hand gestures (grab/translate, point/rotate, open-palm/release)
- **Standalone 3D viewport**: Full orbit controls (left-drag = rotate, right-drag = pan, scroll = zoom), PBR materials, ACES filmic tone mapping, solar-system orbital animation
- **Domain representations**: Chemistry lab, physics pendulum, math derivation + KaTeX graph, algorithm step visualiser, code workbench, interactive diagrams, rich knowledge cards
- **Scene persistence**: Object hierarchy sidebar + timeline; undo/redo history

### Tech stack
- React 19 + TypeScript + Vite 8
- Three.js 0.185 (WebGL renderer, PBR materials, OrbitControls-equivalent)
- MediaPipe Hands (CDN, dynamic load — not pre-bundled)
- KaTeX (math rendering)
- Web Speech API (STT continuous + TTS narration)
- Lucide React icons

## Running the project

```
npm run dev      # starts Vite dev server on port 5000
npm run build    # production build
npm run lint     # oxlint
```

The Vite config excludes `@mediapipe/hands` and `@mediapipe/camera_utils` from dep optimisation to prevent WASM bundling crashes.

## Architecture

| Module | File | Responsibility |
|---|---|---|
| AI Router | `src/services/aiRouter.ts` | Maps text/voice to `RepresentationPayload` |
| Gesture Controller | `src/services/gestureController.ts` | Classifies MediaPipe landmarks → named gestures |
| Camera/AR/Hand | `src/components/CameraHandTracker.tsx` | Webcam · Three.js AR overlay · MediaPipe inference · gesture→object interaction |
| 3D Workbench | `src/components/representations/ThreeDWorkbench.tsx` | Standalone viewport with orbit controls + animated solar system |
| Speech | `src/components/SpeechController.tsx` | Headless STT + TTS |
| App state | `src/App.tsx` | State machine, streaming pre-route, gesture callbacks |

## User preferences

- Preserve existing architecture — extend, never rewrite or remove features
- Every change must be modular with a single responsibility
- Production-quality code with explanatory comments on every modified file
- Compile after major changes; resolve all dependency conflicts
- Never use placeholder cubes or primitives where quality objects are possible
