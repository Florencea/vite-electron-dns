# Vite Electron DNS

A robust DNS/DoH (DNS over HTTPS) tool built with Electron, React, and Vite. This tool allows you to test and evaluate specific domain names resolved across multiple DNS servers.

The UI and state management are powered by **React Spectrum**, **Tailwind CSS**, and **TanStack Query**.

## Getting Started

### Prerequisites

- **Node.js** - The required version is specified in `package.json` under the `engines` field.

### Setup

1.  **Install dependencies:**

    ```sh
    npm ci
    ```

2.  **Setup Electron:**

    ```sh
    npm run setup
    ```

3.  **Configure Environment Variables:**
    Copy `.env.example` to a new file named `.env` and customize the variables.

    ```sh
    cp .env.example .env
    ```

4.  **Run in development mode:**
    ```sh
    npm run dev
    ```

## Available Scripts

- `npm run setup`: Download Electron binaries and install native dependencies.
- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production with electron-vite.
- `npm run build:win`: Package for Windows (x64 and arm64).
- `npm run build:mac`: Package for macOS.
- `npm run build:linux`: Package for Linux.
- `npm run lint`: Lint code with oxlint.
- `npm run lint:fix`: Automatically fix linting issues with oxlint.
- `npm run format`: Format code with oxfmt.
- `npm run typecheck`: Check for type errors with TypeScript.

## Note

- To run `npm run build:win` on macOS ARM (Apple Silicon), Rosetta 2 is required.

## License

This project is licensed under the MIT License.
