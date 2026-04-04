# Vite Electron DNS

![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220)

A robust DNS/DoH (DNS over HTTPS) tool built with Electron, React, and Vite. This tool allows you to test and evaluate specific domain names resolved across multiple DNS servers.

The UI and state management are powered by **React Spectrum**, **Tailwind CSS**, and **TanStack Query**.

## Table of Contents

- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Scripts](#️-available-scripts)
- [Building & Packaging](#-building--packaging)
- [Resources & Docs](#-resources--docs)
- [License](#️-license)

---

## Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **PNPM** (Used as the package manager)

### Installation & Setup

1. **Install dependencies**

```sh
pnpm install
```

2. **Configure Environment Variables**

The application requires specific environment variables for development and packaging. Create a `.env` file in the root directory:

```sh
# Application ID for electron-builder (e.g., com.example.dns)
VITE_APPID="com.yourdomain.vite-electron-dns"
# Product Name used for the executable and shortcuts
VITE_TITLE="Vite Electron DNS"
```

3. **Start the Development Server**

```sh
pnpm dev
```

This will start the Electron app in development mode with Hot Module Replacement (HMR).

---

## Project Structure

This project follows a standard `electron-vite` architecture:

- `src/main/`: Electron **Main Process** code (window management, native menus, `electron-store` configuration).
- `src/preload/`: Electron **Preload** scripts (bridge between main and renderer processes for secure IPC communication).
- `src/renderer/`: **Renderer Process** code (React app, UI components, styles).
- `build/`: Icons and configuration files used by `electron-builder` (e.g., macOS entitlements).
- `resources/`: Static assets that need to be explicitly unpacked when the application is packaged.

---

## Available Scripts

In the project directory, you can run:

- `pnpm dev`: Starts the `electron-vite` dev server.
- `pnpm lint`: Lints the codebase with ESLint and performs type checking with TypeScript.
- `pnpm format`: Formats code globally using Prettier.
- `pnpm build`: Lints the code and builds the production-ready application files into the `/out` directory.

---

## Building & Packaging

This project uses `electron-builder` to generate distribution-ready packages for various operating systems. Ensure you have run `pnpm install` and configured your `.env` file before packaging.

- **Windows**: Builds an NSIS installer `.exe` for x64 and arm64 architectures.
  ```sh
  pnpm build:win
  ```
- **macOS**: Builds an Apple Disk Image `.dmg`.
  ```sh
  pnpm build:mac
  ```
- **Linux**: Builds `AppImage`, `.snap`, and `.deb` packages.
  ```sh
  pnpm build:linux
  ```

---

## Resources & Docs

- [electron-vite](https://electron-vite.org/)
- [electron-builder](https://www.electron.build/)
- [Electron](https://www.electronjs.org/)
- [React Spectrum](https://react-spectrum.adobe.com/react-spectrum/index.html)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/)

---

## License

This project is licensed under the [MIT License](LICENSE).
