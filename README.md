# Vite Electron DNS

A robust DNS/DoH (DNS over HTTPS) tool built with Electron, React, and Vite. This tool allows you to test and evaluate specific domain names resolved across multiple DNS servers.

The UI and state management are powered by **React Spectrum**, **Tailwind CSS**, and **TanStack Query**.

## Getting Started

### Prerequisites

- **Node.js** - The required version is specified in `package.json` under the `engines` field.

### Setup

1.  **Install dependencies:**

    ```sh
    npm run setup
    ```

2.  **Configure Environment Variables:**
    Copy `.env.example` to a new file named `.env` and customize the variables.

    ```sh
    cp .env.example .env
    ```

3.  **Run in development mode:**
    ```sh
    npm run dev
    ```

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Type-check, lint, and build the application for production.
- `npm run build:win`: Package for Windows.
- `npm run build:mac`: Package for macOS.
- `npm run build:linux`: Package for Linux.
- `npm run lint`: Lint code with ESLint.
- `npm run lint:fix`: Automatically fix linting issues.
- `npm run format`: Format code with Prettier.
- `npm run typecheck`: Check for type errors with TypeScript.

## License

This project is licensed under the MIT License.
