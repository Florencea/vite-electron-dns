import { QueryClient } from "@tanstack/react-query";

const queryClientIpc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClientIpc;
