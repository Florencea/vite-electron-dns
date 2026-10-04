---
trigger: glob
globs: "src/renderer/**"
description: UI development standards for React 19, Adobe React Spectrum, and Tailwind CSS v4.
---

# UI & Styling Standards

Guidelines for renderer UI components, state management, and styling.

## 1. Component Architecture & State Management

- **UI Framework**: React 19 single-page application mounted at `src/renderer/main.tsx`.
- **Component System**: Adobe React Spectrum components paired with Tailwind CSS v4 styling.
- **Data Flow**: Asynchronous IPC queries and mutations are managed through `@tanstack/react-query`.
- **IPC Access**: All communication with the main process must pass exclusively through typed `window.api`.

## 2. Automatic Memoization (React Compiler)

- Fine-grained memoization is handled automatically via `@vitejs/plugin-react` (`compiler: true`) and `oxc-transform-react`.
- **Rule**: Do not write manual `useMemo`, `useCallback`, or `React.memo` unless handling documented, non-compiler edge cases.
- Follow strict React hooks dependencies guidelines.

## 3. Tailwind CSS v4 Canonical Classes

- Design tokens are defined in `src/renderer/index.css` under `@theme`.
- Enforce canonical class ordering and syntax via the headless Tailwind language server runner.
- Verification: `vpr agent:lint:tailwind` to diagnose non-canonical classes, `vpr agent:lint:tailwind:fix` to auto-fix.
