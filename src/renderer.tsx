import { StyleProvider } from "@ant-design/cssinjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider, theme } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../tailwind.config";
import { Doh } from "./Doh";

const container = document.getElementById("root") as HTMLDivElement;

const PRIMARY_COLOR = tailwindConfig.theme.extend.colors.primary;

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={new QueryClient()}>
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
          <App>
            <Doh />
          </App>
        </StyleProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
