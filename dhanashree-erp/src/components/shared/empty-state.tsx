import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        "bg-card flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center",
        className,
      )}
    >
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
