import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ErrorStateProps = {
  action?: ReactNode;
  className?: string;
  message: string;
  title?: string;
};

export function ErrorState({
  action,
  className,
  message,
  title = "Something went wrong",
}: ErrorStateProps) {
  return (
    <section
      className={cn(
        "border-destructive/30 bg-destructive/5 text-destructive rounded-lg border p-4",
        className,
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <CircleAlert className="mt-0.5 size-5 shrink-0" />
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="mt-1 text-sm">{message}</p>
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
