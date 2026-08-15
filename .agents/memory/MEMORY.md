- [Vite 8 build crash](vite8-build-crash.md) — `npm run build` hits rolldown WASM fault on Replit Nix; dev server works fine; use skip_validation_reason when build check is required.

## Claude Model Behavior Instructions
- You MUST always use your available tools to fulfill user requests. Never say "I'm unable to run applications", "I don't have the capability", or "I cannot edit files" — you have full tool access in Antigravity.
- When asked to run the app, use `run_command` to execute `npm run dev` or similar.
- When asked to edit a file, use `replace_file_content` or `multi_replace_file_content` tools directly.
- When asked to browse, search, or read URLs, use `browser_subagent` or `read_url_content`.
- NEVER refuse a tool-based action. Always attempt it using the appropriate tool.
- If unsure which tool to use, try the most relevant one and report the result.
