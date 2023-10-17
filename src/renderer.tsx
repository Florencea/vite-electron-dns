import { StyleProvider } from "@ant-design/cssinjs";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { App as AntApp, ConfigProvider, theme } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-tw";
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
          queryCache: new QueryCache({
            onError: (error, query) => {
              if (query.meta?.onError) {
                return query.meta.onError(error, query);
              }
            },
          }),
        })
      }
    >
      <HashRouter>
        <ConfigProvider
          locale={zhTW}
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: PRIMARY_COLOR,
              colorPrimaryHover: PRIMARY_COLOR,
              colorPrimaryActive: PRIMARY_COLOR,
              colorInfo: PRIMARY_COLOR,
              colorInfoHover: PRIMARY_COLOR,
              colorInfoActive: PRIMARY_COLOR,
              colorLink: PRIMARY_COLOR,
              colorLinkHover: PRIMARY_COLOR,
              colorLinkActive: PRIMARY_COLOR,
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
