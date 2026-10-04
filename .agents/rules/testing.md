---
trigger: glob
globs: "test/**, **/*.test.ts, **/*.test.tsx"
description: Dual-track testing architecture and Vitest standards across Chromium browser and Node environments.
---

# Testing Standards & Guidelines

Standards for unit, component, and integration testing across this codebase.

## 1. Dual-Track Testing Architecture

Tests are split into two Vitest workspace projects configured directly in `vite.config.ts`:

- **Renderer Project (`test/renderer/**`)**:
  - Runs in headless Chromium via `@vitest/browser-playwright` and `vitest-browser-react`.
  - Mounts components with `<QueryClientProvider>` and mock `window.api`.
  - Verifies interactive component state, user selections, and DOM accessibility.
- **Main Project (`test/main/**`)**:
  - Runs in native Node.js runtime.
  - Tests DNS resolution algorithms, network error resilience, and preset configurations.

## 2. Invariants & Assertions

- **Browser Focus Protection**: Chromium browser instances run with `headless: true` to prevent stealing window focus.
- **Dual UI Assertions**:
  - Verify DOM presence: `await expect.element(el).toBeInTheDocument()`
  - Verify visibility: `await expect.element(el).toBeVisible()`
- **Type Canary Tests**:
  - `test/canary/e2e-type-contract.test.ts` asserts static contract fidelity using `expectTypeOf`.
- **Noise Control**: Test output uses `silent: "passed-only"` to suppress noisy logs on success while immediately detailing failures.
- **No `.only` in Automated Runs**: Vitest enforces `allowOnly: !process.env.CI`. Never commit `.only` blocks.
