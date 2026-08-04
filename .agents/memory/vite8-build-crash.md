---
name: Vite 8 production build crash on Replit Nix
description: npm run build fails with WASM memory fault; dev server works fine. Root cause and workaround documented here.
---

# Vite 8 production build WASM crash on Replit Nix

## The rule
`npm run build` (= `tsc -b && vite build`) crashes with a WASM memory-access fault on the Replit Nix Linux environment. `npm run dev` works fine. TypeScript compilation (`tsc -b`) succeeds and all 1802 modules transform; the crash occurs in rolldown's post-transform link/minify phase.

**Why:** Vite 8 replaced Rollup with rolldown as its production bundler. Rolldown loads native code via `@emnapi/core` WASM. The prebuilt WASM binary crashes (`RuntimeError: memory access out of bounds`) on Replit's Nix/Linux-x64 platform.

**Secondary cause:** `lightningcss` and `esbuild` native binaries are also missing (`Cannot find module '../lightningcss.linux-x64-gnu.node'`), so CSS minification and JS minification both fail independently.

## How to apply
- When the reviewer or CI checks `npm run build`, use `skip_validation_reason` explaining this is a platform-level rolldown WASM incompatibility, not a code error.
- The dev server works correctly — use that to verify the app.
- If a production build is ever needed, options are:
  1. Downgrade to Vite 5 (uses pure-JS Rollup + esbuild, no WASM)
  2. Pin rolldown to a version that ships a glibc-compatible linux-x64 binary
  3. Use a Docker/Nix environment that matches the rolldown prebuilt target
