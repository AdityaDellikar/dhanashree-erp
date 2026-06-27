import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AuthCardProps = {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  title: string;
};

export function AuthCard({
  children,
  description,
  footer,
  title,
}: AuthCardProps) {
  return (
    <Card className="border-slate-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="flex flex-col space-y-2 border-t border-slate-100 px-6 py-4 dark:border-zinc-800/60">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
