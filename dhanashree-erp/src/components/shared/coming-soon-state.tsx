import { Clock3 } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ComingSoonStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title: string;
};

export function ComingSoonState({
  action,
  className,
  description,
  title,
}: ComingSoonStateProps) {
  return (
    <section
      className={cn(
        "bg-card flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center",
        className,
      )}
    >
      <div className="bg-muted text-muted-foreground rounded-md p-3">
        <Clock3 className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold tracking-normal">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
