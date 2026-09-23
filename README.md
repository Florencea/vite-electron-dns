# Vite Electron DNS

[![CI](https://github.com/Florencea/vite-electron-dns/actions/workflows/ci.yml/badge.svg)](https://github.com/Florencea/vite-electron-dns/actions/workflows/ci.yml)
[![Node Canary](https://github.com/Florencea/vite-electron-dns/actions/workflows/node-canary.yml/badge.svg)](https://github.com/Florencea/vite-electron-dns/actions/workflows/node-canary.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, high-performance DNS and DNS-over-HTTPS (DoH) benchmarking desktop application powered by **Electron**, **Native Vite**, **React**, **Adobe React Spectrum**, **Tailwind CSS**, and **TanStack Query**.

Designed for deterministic DNS evaluation across preset and custom resolvers, featuring native multi-target builds, sub-second HMR with automated process hot-restart, and zero third-party Electron wrapper meta-frameworks.

---

## Highlights

- **Strict Quality Gate**: Unified 7-step verification gate (`npm run check`) executing strict TypeScript, ESLint, Prettier, Knip dead-code audit, dual-track testing, Native Vite multi-target builds, and Electron packaging validation.
- **Native Vite & Rolldown**: Built directly with standard Vite (zero third-party Electron wrapper meta-frameworks) for sub-second builds across main, preload, and renderer.
- **Hot-Restart & Dev Runner**: Native TypeScript runner (`scripts/dev.ts`) providing true process hot-restart on main process changes, window reload on preload edits, and component-level HMR for renderer.
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

| Command                     | Description                                                       |
| :-------------------------- | :---------------------------------------------------------------- |
| `npm run dev`               | Start the development server with Vite HMR via native Node runner |
| `npm run check`             | Run the unified 8-step verification gate                          |
| `npm run test`              | Run all Vitest tests (Chromium browser + Node)                    |
| `npm run test:unit`         | Alias for running all Vitest tests                                |
| `npm run test:renderer`     | Run renderer component tests in headless Chromium                 |
| `npm run test:main`         | Run main process, DNS resolver, and type contract tests           |
| `npm run test:e2e`          | Run packaged Electron smoke & UI tests                            |
| `npm run test:setup`        | Install Playwright Chromium binary                                |
| `npm run test:smoke`        | Validate packaged Electron application launch and UI rendering    |
| `npm run typecheck`         | Check for type errors with TypeScript in strict mode              |
| `npm run lint`              | Lint code with ESLint                                             |
| `npm run lint:ci`           | Lint GitHub Actions workflows locally with actionlint             |
| `npm run lint:fix`          | Automatically fix linting issues with ESLint                      |
| `npm run lint:tailwind`     | Lint Tailwind CSS classes for canonical syntax                    |
| `npm run lint:tailwind:fix` | Auto-fix Tailwind CSS classes to canonical forms                  |
| `npm run format`            | Format code with Prettier                                         |
| `npm run format:check`      | Check code formatting with Prettier                               |
| `npm run check:deadcode`    | Detect dead code and unused exports with Knip                     |
| `npm run build`             | Build all targets (main, preload, renderer) with Native Vite      |
| `npm run pack`              | Validate Electron packaging by generating unpacked directory      |
| `npm run build:main`        | Bundle Electron main process with Native Vite SSR                 |
| `npm run build:preload`     | Bundle Electron preload script into CommonJS                      |
| `npm run build:renderer`    | Build React client application with Native Vite                   |
| `npm run build:mac`         | Package macOS application into `release/`                         |
| `npm run build:win`         | Package Windows application into `release/`                       |
| `npm run build:linux`       | Package Linux application into `release/`                         |
| `npm run setup`             | Download Electron binaries and install native dependencies        |

### Agent Verification Commands

| Command                       | Description                                                                               |
| :---------------------------- | :---------------------------------------------------------------------------------------- |
| `npm run agent:typecheck`     | Fast headless type check with no terminal colors or decorative borders (`--pretty false`) |
| `npm run agent:lint`          | Strict linting with ESLint (`--no-color --no-inline-config --max-warnings 0`) + Tailwind  |
| `npm run agent:lint:ci`       | Headless workflow validation with actionlint (`--no-color`)                               |
| `npm run agent:lint:eslint`   | Targeted ESLint run with inline escapes disabled and warnings treated as failures         |
| `npm run agent:lint:tailwind` | Targeted Tailwind CSS canonical class validation                                          |
| `npm run agent:lint:fix`      | Automatically fix ESLint and Tailwind canonical issues                                    |
| `npm run agent:test:unit`     | Vitest suite using flat TAP single-line reporter with colors and progress disabled        |
| `npm run agent:test:e2e`      | Packaged application smoke test execution                                                 |
| `npm run agent:verify:inner`  | Fast-feedback inner loop: Typecheck + Lint                                                |
| `npm run agent:verify:unit`   | Inner verification followed by unit tests                                                 |
| `npm run agent:verify:gate`   | Full automated gate: Inner loop + Unit tests + Multi-target Build + Pack + E2E smoke test |

---

## CI/CD Pipeline Architecture

- **Tiered Daily CI (`.github/workflows/ci.yml`)**:
  - **Tier 1 (`gatekeeper`)**: Runs on `ubuntu-latest` against the authoritative Node.js runtime (`package.json`). Executes dependencies installation, Playwright browser caching, the full verification gate (`format:check`, `agent:verify:inner`, `check:deadcode`, `test`, `build`, `pack`), Linux distribution packaging (`build:linux`), and full headless Electron E2E smoke testing (`xvfb-run npm run test:e2e`).
  - **Tier 2 (`platform-compat`)**: Executes only after `gatekeeper` succeeds across `windows-latest` and `macos-latest`. Validates production builds (`build`), native compiler bindings (Rolldown, LightningCSS), runtime path compatibility (`test:unit`), and platform distribution packaging (`build:mac`, `build:win`) without duplicating static checks or heavy E2E journeys.
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
