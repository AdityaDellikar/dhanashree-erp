import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoaderProps = {
  className?: string;
  label?: string;
};

export function Loader({ className, label = "Loading" }: LoaderProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm",
        className,
      )}
      role="status"
    >
      <LoaderCircle className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
