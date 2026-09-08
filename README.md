# Vite Electron DNS

[![CI](https://github.com/Florencea/vite-electron-dns/actions/workflows/test.yml/badge.svg)](https://github.com/Florencea/vite-electron-dns/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A robust DNS/DoH (DNS over HTTPS) tool built with Electron, React, and Vite. This tool allows you to test and evaluate specific domain names resolved across multiple DNS servers.

The UI and state management are powered by **Adobe React Spectrum**, **Tailwind CSS v4**, and **TanStack Query**.

---

## Highlights

- **Strict Quality Gate**: Unified verification command (`npm run check`) executing strict TypeScript, ESLint 10, Prettier 3, Knip dead-code audit, dual-track testing, and Native Vite 8 production build.
- **Native Vite 8 & Rolldown**: Built directly with standard Vite 8 (zero third-party Electron wrapper meta-frameworks) for sub-second builds across main, preload, and renderer.
- **Dual-Track Testing**: Component tests execute in headless Chromium browser mode via `@vitest/browser-playwright`, while main process, DNS resolver, and type contract tests run in Node.js.
- **Agent-First Workflow**: Clear architectural boundaries, strict coding rules, and TDD workflow documented in [AGENTS.md](AGENTS.md).
- **Process Isolation & Security**: Safe context bridge exposition ensuring raw Node.js internals and IPC channels remain isolated from the renderer.

---

## Getting Started

### Prerequisites

- **Node.js** - The required version is specified in `package.json` under the `engines` field (`24.20.0`).

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

3. **Configure Environment Variables:**
   Copy `.env.example` to a new file named `.env` and customize the variables.

   ```sh
   cp .env.example .env
   ```

4. **Run in development mode:**

   ```sh
   npm run dev
   ```

---

## Available Scripts

| Command                  | Description                                                          |
| :----------------------- | :------------------------------------------------------------------- |
| `npm run dev`            | Start the development server with Vite HMR via Node 24 native runner |
| `npm run check`          | Run the unified 6-step verification gate                             |
| `npm run test`           | Run all Vitest tests (Chromium browser + Node)                       |
| `npm run test:renderer`  | Run renderer component tests in headless Chromium                    |
| `npm run test:main`      | Run main process, DNS resolver, and type contract tests              |
| `npm run test:setup`     | Install Playwright Chromium binary                                   |
| `npm run typecheck`      | Check for type errors with TypeScript in strict mode                 |
| `npm run lint`           | Lint code with ESLint                                                |
| `npm run lint:fix`       | Automatically fix linting issues with ESLint                         |
| `npm run format`         | Format code with Prettier                                            |
| `npm run format:check`   | Check code formatting with Prettier                                  |
| `npm run check:deadcode` | Detect dead code and unused exports with Knip                        |
| `npm run build`          | Build all targets (main, preload, renderer) with Native Vite 8       |
| `npm run build:main`     | Bundle Electron main process with Native Vite SSR                    |
| `npm run build:preload`  | Bundle Electron preload script into CommonJS                         |
| `npm run build:renderer` | Build React client application with Native Vite                      |
| `npm run build:mac`      | Package macOS application into `release/`                            |
| `npm run build:win`      | Package Windows application into `release/`                          |
| `npm run build:linux`    | Package Linux application into `release/`                            |
| `npm run setup`          | Download Electron binaries and install native dependencies           |

---

## Guidelines

For architectural rules, security standards, and the agent-first feature development workflow, see [AGENTS.md](AGENTS.md).

---

## Note

- To run `npm run build:win` on macOS ARM (Apple Silicon), Rosetta 2 is required.

---

## License

This project is licensed under the MIT License.
