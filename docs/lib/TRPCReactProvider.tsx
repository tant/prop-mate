"use client";

import { trpcReact } from "./trpcClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import superjson from "superjson";

const queryClient = new QueryClient();

export function TRPCReactProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() =>
    trpcReact.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpcReact.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}
