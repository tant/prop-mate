"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState, type ReactNode } from "react";
import superjson from "superjson";
import { api } from "./client";
import { auth } from "@/lib/firebase/client";

interface TRPCProviderProps {
  children: ReactNode;
}

export default function TRPCProvider({ children }: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
          async headers() {
            let token: string | undefined;
            try {
              if (auth.currentUser) {
                token = await auth.currentUser.getIdToken();
              }
            } catch {
              // Không lấy được token, bỏ qua
            }
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    })
  );
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}