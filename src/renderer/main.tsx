import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./globals.css";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
}
