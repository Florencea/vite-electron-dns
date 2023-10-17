/// <reference types="vite/client" />
import "@tanstack/react-query";

// Extends the QueryMeta interface from react-query to include our custom notification message types
declare module "@tanstack/react-query" {
  export interface QueryMeta {
    /**
     * Exposes a `meta.onError` event to `useQuery` options.
     */
    onError: QueryCacheConfig["onError"];
  }
}
