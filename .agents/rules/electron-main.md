---
trigger: glob
globs: "src/main/**, src/preload/**, src/shared/**"
description: Electron main process, preload security bridge, and shared IPC contracts standards.
---

# Electron Main & Preload Guidelines

Standards for backend networking, window lifecycle, and secure cross-process communication.

## 1. Process Separation & Security Boundary

- **Main Process (`src/main/`)**:
  - Responsible for Electron application lifecycle, window management, system menus, and backend networking.
  - DNS resolution and DoH logic reside in `src/main/dns.ts`.
  - Never import browser-only APIs here.
- **Preload Bridge (`src/preload/`)**:
  - Exposes typed APIs to the renderer via `contextBridge.exposeInMainWorld("api", ...)`.
  - Type definitions reside in `src/preload/index.d.ts`.
  - **Security**: Never expose raw Node.js modules or raw `ipcRenderer` directly to the renderer. Context isolation is mandatory.
- **Shared (`src/shared/`)**:
  - Cross-process interfaces in `src/shared/types.ts` (`ModeT`, `ServerT`).
  - Single Source of Truth for DNS server presets in `src/shared/servers.ts`.

## 2. Feature Development Flow

When adding or modifying an IPC capability:

1. **Define Contract**: Add request and response types to `src/shared/types.ts`.
2. **Implement Main Logic**: Write business logic in `src/main/` and register with `ipcMain.handle()`.
3. **Bridge Preload**: Expose typed method in `src/preload/index.ts` and add interface to `src/preload/index.d.ts`.
4. **Canary Contract Test**: Update `test/canary/e2e-type-contract.test.ts` to assert interface types.
