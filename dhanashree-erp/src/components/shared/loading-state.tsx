import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  className?: string;
  label?: string;
};

export function LoadingState({
  className,
  label = "Loading",
}: LoadingStateProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "text-muted-foreground flex min-h-40 items-center justify-center gap-2 text-sm",
        className,
      )}
      role="status"
    >
      <LoaderCircle className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
