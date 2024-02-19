# Vite Electron DoH

- This is a DoH tool created by Electron Forge and Vite, antd
- The tool could test specific domain name resolved by multiple DNS Server

## Commands

```sh
# Start Electron Forge Dev Server
npm run dev
# Build production package in /out
npm run packege
# Build and make distribution-ready achieves
npm run make
# Lint codes with ESLint
npm run lint
# Format codes with prettier
npm run format
```

## Docs

- [Electron Forge](https://www.electronforge.io/)
- [Electron](https://www.electronjs.org/)

## Things that Electron Forge Docs didn't Say

- If you scaffolding a project by using [Vite + TypeScript instruction](https://www.electronforge.io/templates/vite-+-typescript)
- Use [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#readme) instead of [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) because tsconfig is not resolved by `@vitejs/plugin-react-swc`, whitch cause error in ESM import for Electron
- Use `HashRouter` instead of `BrowserRouter`. Electron load files but not url in production mode, which conflict to frontend redirecting

## Notice

- This project current only tested on ARM based macOS
