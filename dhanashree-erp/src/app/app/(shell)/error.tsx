"use client";

import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

type AppShellErrorProps = {
  reset: () => void;
};

export default function AppShellError({ reset }: AppShellErrorProps) {
  return (
    <ErrorState
      action={
        <Button size="sm" type="button" variant="outline" onClick={reset}>
          Try again
        </Button>
      }
      message="The workspace could not be loaded."
      title="Workspace unavailable"
    />
  );
}
