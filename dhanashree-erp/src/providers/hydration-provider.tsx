import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { makeQueryClient } from "@/lib/query-client";

type HydrationProviderProps = {
  children: ReactNode;
};

export function HydrationProvider({ children }: HydrationProviderProps) {
  const queryClient = makeQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
