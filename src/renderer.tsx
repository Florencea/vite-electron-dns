import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, ConfigProvider, theme } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "./Page";

const container = document.getElementById("root") as HTMLDivElement;

const PRIMARY_COLOR = "#722ed1";

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
        <App>
          <Page />
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>,
);

postMessage({ payload: "removeLoading" }, "*");
