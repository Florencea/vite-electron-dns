import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { page } from "vite-plus/test/browser";
import { App } from "../../src/renderer/App";

let currentRoot: Root | null = null;

export async function cleanupApp(): Promise<void> {
  if (currentRoot !== null) {
    await act(async () => {
      currentRoot?.unmount();
    });
    currentRoot = null;
  }
  const rootElement = document.getElementById("root");
  if (rootElement !== null) {
    rootElement.innerHTML = "";
  }
}

function getOrCreateRootContainer(): HTMLElement {
  let container = document.getElementById("root");
  if (container === null) {
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  }
  return container;
}

export async function renderApp(): Promise<typeof page> {
  await cleanupApp();
  const container = getOrCreateRootContainer();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  currentRoot = createRoot(container);
  await act(async () => {
    currentRoot?.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>,
    );
  });

  return page;
}
