import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AccessDeniedStateProps = {
  action?: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function AccessDeniedState({
  action,
  className,
  description = "Your current organization role does not allow this action.",
  title = "Access denied",
}: AccessDeniedStateProps) {
  return (
    <section
      className={cn(
        "bg-card flex min-h-56 flex-col items-center justify-center rounded-lg border p-6 text-center",
        className,
      )}
    >
      <div className="bg-destructive/10 text-destructive rounded-md p-3">
        <ShieldAlert className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-normal">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
