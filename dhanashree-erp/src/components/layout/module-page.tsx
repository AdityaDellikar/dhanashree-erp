import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ModulePageProps = {
  children?: ReactNode;
  description: string;
  title: string;
};

export function ModulePage({ children, description, title }: ModulePageProps) {
  return (
    <main className="bg-background min-h-dvh">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild className="w-fit" size="sm" variant="ghost">
          <Link href="/">
            <ArrowLeft />
            Home
          </Link>
        </Button>
        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-6">
            {description}
          </p>
        </div>
        {children}
      </section>
    </main>
  );
}
