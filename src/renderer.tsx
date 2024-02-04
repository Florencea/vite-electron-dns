import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntApp, ConfigProvider, theme } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../tailwind.config";
import App from "./App";

const container = document.getElementById("root") as HTMLDivElement;

const PRIMARY_COLOR = tailwindConfig.theme.extend.colors.primary;

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: {
              refetchOnWindowFocus: false,
              retry: false,
            },
            mutations: {
              retry: false,
            },
          },
        })
      }
    >
      <HashRouter>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: PRIMARY_COLOR,
              colorInfo: PRIMARY_COLOR,
            },
          }}
          autoInsertSpaceInButton={false}
          getPopupContainer={() => container}
        >
          <StyleProvider hashPriority="high">
            <AntApp>
              <App />
            </AntApp>
          </StyleProvider>
        </ConfigProvider>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
