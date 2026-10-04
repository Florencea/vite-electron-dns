# Vite Electron DNS

[![CI](https://github.com/Florencea/vite-electron-dns/actions/workflows/ci.yml/badge.svg)](https://github.com/Florencea/vite-electron-dns/actions/workflows/ci.yml)
[![Node Canary](https://github.com/Florencea/vite-electron-dns/actions/workflows/node-canary.yml/badge.svg)](https://github.com/Florencea/vite-electron-dns/actions/workflows/node-canary.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, high-performance DNS and DNS-over-HTTPS (DoH) benchmarking desktop application powered by **Electron**, **Native Vite**, **React**, **Adobe React Spectrum**, **Tailwind CSS**, and **TanStack Query**.

Designed for deterministic DNS evaluation across preset and custom resolvers, featuring native multi-target builds, sub-second HMR with automated process hot-restart, and zero third-party Electron wrapper meta-frameworks.

---

## Highlights

- **Strict Quality Gate**: Unified verification gate (`vpr agent:verify:gate`) executing strict TypeScript, Oxlint, Oxfmt, Knip dead-code audit, dual-track testing, Vite+ multi-target builds, and Electron packaging validation.
- **Native Vite & Rolldown**: Built directly with standard Vite (zero third-party Electron wrapper meta-frameworks) for sub-second builds across main, preload, and renderer.
- **Hot-Restart & Dev Runner**: Native Vite+ dev runner (`vp dev`) providing true process hot-restart on main process changes, window reload on preload edits, and component-level HMR for renderer.
- **Dual-Track Testing**: Component tests execute in headless Chromium browser mode via `@vitest/browser-playwright`, while main process, DNS resolver, and type contract tests run in Node.js.
- **Agent-First Workflow**: Clear architectural boundaries, strict coding rules, and TDD workflow documented in [AGENTS.md](AGENTS.md).
- **Process Isolation & Security**: Safe context bridge exposition ensuring raw Node.js internals and IPC channels remain isolated from the renderer.

---

## Tech Stack

| Layer                | Technology                                           |
| :------------------- | :--------------------------------------------------- |
| **Runtime & Shell**  | Electron (Context Isolation, Safe IPC Bridge)        |
| **Frontend UI**      | React, Adobe React Spectrum, Tailwind CSS            |
| **State & Fetching** | TanStack Query                                       |
| **Build & Dev**      | Native Vite, Rolldown, Native Node Dev Runner        |
| **Testing**          | Vitest (Chromium Browser Mode + Node Backend Tests)  |
| **Packaging**        | electron-builder (Cross-compilation, DMG, NSIS, Deb) |
| **Code Quality**     | TypeScript (strict), ESLint, Prettier, Knip          |

---

## Getting Started

### Prerequisites

- **Node.js** - The required version is specified in `package.json` under the `engines` field.

### Setup

1. **Install dependencies:**

   ```sh
   npm ci
   ```

2. **Setup Electron & Playwright:**

   ```sh
   npm run setup
   npm run test:setup
   ```

3. **Run in development mode:**

   ```sh
   npm run dev
   ```

---

## Available Scripts

### Developer Commands

| Command              | Description                                                         |
| :------------------- | :------------------------------------------------------------------ |
| `vp dev`             | Start development environment with Electron runner (Vite+ built-in) |
| `vp check`           | Run format, Oxlint, and type checks together (Vite+ built-in)       |
| `vp fmt`             | Format code with Oxfmt (Vite+ built-in)                             |
| `vp lint`            | Lint code with Oxlint (Vite+ built-in)                              |
| `vp test`            | Run all Vitest tests (Chromium browser + Node) (Vite+ built-in)     |
| `vpr check:deadcode` | Detect dead code and unused exports with Knip                       |
| `vpr app:pack`       | Validate Electron packaging by generating unpacked directory        |
| `vpr app:mac`        | Package macOS application into `release/`                           |
| `vpr app:win`        | Package Windows application into `release/`                         |
| `vpr app:linux`      | Package Linux application into `release/`                           |
| `vpr test:setup`     | Install Playwright Chromium binary                                  |

### Agent Verification Commands

| Command                   | Description                                                                              |
| :------------------------ | :--------------------------------------------------------------------------------------- |
| `vpr agent:typecheck`     | Fast headless type check (`tsc -b --pretty false`)                                       |
| `vpr agent:lint`          | Strict linting with Oxlint + Tailwind CSS validator                                      |
| `vpr agent:lint:ci`       | Headless workflow validation with actionlint (`actionlint`)                              |
| `vpr agent:lint:tailwind` | Targeted Tailwind CSS canonical class validation                                         |
| `vpr agent:lint:fix`      | Automatically fix Oxlint and Tailwind canonical issues                                   |
| `vpr agent:test:unit`     | Vitest suite using flat TAP single-line reporter with colors and progress disabled       |
| `vpr agent:test:e2e`      | Packaged application smoke test execution                                                |
| `vpr agent:verify:inner`  | Fast-feedback inner loop: Typecheck + Lint                                               |
| `vpr agent:verify:unit`   | Inner verification followed by unit tests                                                |
| `vpr agent:verify:gate`   | Full automated gate: Inner loop + Unit tests + Multi-target Build + App Pack + E2E smoke |

---

## CI/CD Pipeline Architecture

- **Tiered Daily CI (`.github/workflows/ci.yml`)**:
  - **Tier 1 (`gatekeeper`)**: Runs on `ubuntu-latest` against the authoritative Node.js runtime (`package.json`). Executes dependencies installation, Playwright browser caching, the full verification gate (`vp check`, `agent:verify:inner`, `check:deadcode`, `agent:test:unit`, `build`, `app:pack`), Linux distribution packaging (`app:linux`), and full headless Electron E2E smoke testing (`xvfb-run vp run test:e2e`).
  - **Tier 2 (`platform-compat`)**: Executes only after `gatekeeper` succeeds across `windows-latest` and `macos-latest`. Validates production builds (`build`), native compiler bindings (Rolldown, LightningCSS), runtime path compatibility (`agent:test:unit`), and platform distribution packaging (`app:mac`, `app:win`) without duplicating static checks or heavy E2E journeys.
- **Proactive Node Canary (`.github/workflows/node-canary.yml`)**:
  - Scheduled weekly cron job targeting upcoming Node.js releases (Node 26 line) with `--engine-strict=false` and `continue-on-error: true` to detect upstream regressions early without breaking repository status badges.

---

## Guidelines

For architectural rules, security standards, and the agent-first feature development workflow, see [AGENTS.md](AGENTS.md).

---

## Note

- To run `npm run build:win` on macOS ARM (Apple Silicon), Rosetta 2 is required.

---

## License

This project is licensed under the MIT License.
