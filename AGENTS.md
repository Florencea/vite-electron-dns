# Agent Development Guidelines

Guidelines for AI agents and developers working on this repository.

## 1. Architectural Conventions

- **Main Process (`src/main/`)**:
  - Responsible for Electron application lifecycle, window management, system menus, and backend networking.
  - DNS resolution and DoH logic reside in `src/main/dns.ts`.
  - Never import browser-only APIs here.
- **Preload Bridge (`src/preload/`)**:
  - Exposes typed APIs to the renderer via `contextBridge.exposeInMainWorld("api", ...)`.
  - Type definitions reside in `src/preload/index.d.ts`.
  - **Security**: Never expose raw Node.js modules or raw `ipcRenderer` directly to the renderer. Context isolation is mandatory.
- **Renderer (`src/renderer/`)**:
  - React single-page UI built with Adobe React Spectrum and Tailwind CSS.
  - Root `index.html` mounts `/src/renderer/main.tsx`.
  - Queries and mutations are managed through `@tanstack/react-query`.
  - All communication with the main process must pass through typed `window.api`.
- **Shared (`src/shared/`)**:
  - Cross-process interfaces in `src/shared/types.ts` (`ModeT`, `ServerT`).
  - Single Source of Truth for DNS server presets in `src/shared/servers.ts`.
- **Build & Development Architecture**:
  - Native Vite powered by Rolldown (zero third-party Electron wrapper frameworks).
  - Multi-target build: `build:main` (Node SSR), `build:preload` (Node SSR), `build:renderer` (Client SPA).
  - Native TypeScript development runner in `scripts/dev.ts` executed directly by Node.
- **Packaging & Release**:
  - `electron-builder` packages installable artifacts into `release/`.
  - Payload explicitly whitelists `dist/**/*` and `build/icon.png`.
- **Language & Documentation**:
  - Keep code comments and commit messages in concise English.
  - User-facing UI labels support English and Traditional Chinese where appropriate.

## 2. Strict Coding Standards

- **No `any`**: Always provide explicit TypeScript types or generics.
- **No `@ts-ignore`**: Use `@ts-expect-error` with a descriptive reason only if strictly unavoidable (minimum 5 characters).
- **No Floating Promises**: Always `await` or prefix with `void` when intentionally unhandled.
- **No Dead Code**: Do not leave unused dependencies, unused files, or unused exports. Knip enforces this.
- **No Linter Workarounds**: Never weaken `eslint.config.ts`. Fix code directly to satisfy strict ESLint and TypeScript rules.
- **Explicit String Conversions**: Call `.toString()` on numbers in template literals.

## 3. Testing Standards

- **Dual-Track Testing Architecture**:
  - **Renderer (`test:renderer`)**: Runs inside headless Chromium (`@vitest/browser-playwright`) using `vitest-browser-react`. Mounts components with `<QueryClientProvider>` and mock `window.api`.
  - **Main (`test:main`)**: Runs in Node.js environment. Tests DNS resolution algorithms, network error resilience, and preset server configurations.
- **End-to-End Type Safety**:
  - Static contracts in `test/canary/e2e-type-contract.test.ts` verify `Window["api"]`, `ModeT`, and `ServerT` shapes using `expectTypeOf`.
- **Selector Standards**:
  - Prefer accessible queries (`screen.getByRole`, `screen.getByLabelText`) or explicit `data-testid`.
  - Never query by volatile generated CSS classes.
- **Assertion Rigor**:
  - For browser UI elements, assert both DOM presence and visibility:
    - `await expect.element(el).toBeInTheDocument()`
    - `await expect.element(el).toBeVisible()`

## 4. Feature Development Workflow (Agent-First TDD)

When implementing a new feature or IPC handler, follow this end-to-end type-safe flow:

1. **Shared Contract First (`src/shared/types.ts`)**:
   - Define data contracts, parameters, and return types.
2. **Main Handler & Node Test (`src/main/`, `test/main/`)**:
   - Implement the logic in `src/main/`.
   - Write unit tests in `test/main/` to verify functional correctness, status codes, and edge cases.
   - Register the handler via `ipcMain.handle()` in `src/main/index.ts`.
3. **Preload Exposure & Type Declaration (`src/preload/`)**:
   - Expose the method in `src/preload/index.ts`.
   - Update `src/preload/index.d.ts` so `Window["api"]` reflects the new interface.
   - Add/update canary tests in `test/canary/e2e-type-contract.test.ts`.
4. **Renderer UI (`src/renderer/`)**:
   - Connect UI components using `useMutation` or `useQuery` from TanStack Query.
   - Build accessible Spectrum controls in `src/renderer/App.tsx` or new components.
5. **Browser Mode Test (`test/renderer/`)**:
   - Write UI interaction and mutation dispatch tests in `test/renderer/`.
   - Assert accessible selectors and state transitions.
6. **Pass Unified Verification Gate**:
   - Run `npm run check` and ensure 0 errors and 0 warnings.

## 5. Verification Gate (Definition of Done)

Before completing any task or commit, execute the unified verification gate:

```bash
npm run check
```

Runs:

1. `typecheck` (`tsc -b` in strict mode)
2. `lint` (ESLint strict + stylistic type checks)
3. `format:check` (Prettier code style verification)
4. `check:deadcode` (Knip dead-code audit)
5. `test` (Vitest dual-track tests: Chromium browser + Node tests)
6. `build` (Native Vite multi-target build: main, preload, renderer)
7. `pack` (Electron-builder unpacked directory packaging validation)

All checks must pass with 0 errors and 0 warnings.
