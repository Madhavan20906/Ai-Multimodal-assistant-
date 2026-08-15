# AURA Multimodal Workbench — Claude Code Project Guide

## Project Overview
This is a **Vite + React + TypeScript** web application called the AURA Multimodal Workbench.
- Uses MediaPipe for hand tracking via webcam
- Voice input for AI-powered visual simulations
- Groq API for LLM processing

## Stack
- **Framework**: Vite 8 + React 19 + TypeScript 6
- **Styling**: Vanilla CSS
- **Key libs**: MediaPipe Hands, Three.js, Lucide React, KaTeX

## Common Commands

### Run the development server
```bash
npm run dev
```
The app runs at **http://localhost:5000**

### Build for production
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Install dependencies
```bash
npm install
```

## Key Files
- `src/` — All source code
- `src/services/aiRouter.ts` — AI routing logic (Groq, fallbacks)
- `src/services/groqService.ts` — Groq LLM API integration
- `src/components/` — React components
- `vite.config.ts` — Vite configuration (port: 5000)
- `package.json` — Dependencies and scripts

## Notes
- Port is fixed at **5000** in vite.config.ts
- If port 5000 is busy, kill the process using: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`
- The app requires webcam access for hand tracking features
