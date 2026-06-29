"use client";

import { ChevronRight, Home } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  cashflow: "Cashflow",
  documents: "Documents",
  members: "Members",
  organization: "Organization",
  parties: "Parties",
  projects: "Projects",
  reports: "Reports",
  settings: "Settings",
  suppliers: "Suppliers",
  workforce: "Workforce",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname
    .replace(/^\/app\/?/, "")
    .split("/")
    .filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1">
      <Link
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
        href="/app/dashboard"
      >
        <Home className="size-4" />
        <span className="hidden sm:inline">App</span>
      </Link>
      {segments.map((segment, index) => {
        const href = `/app/${segments.slice(0, index + 1).join("/")}` as Route;
        const isLast = index === segments.length - 1;

        return (
          <div key={href} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="text-muted-foreground size-4 shrink-0" />
            {isLast ? (
              <span className="truncate text-sm font-medium">
                {segmentLabels[segment] ?? segment}
              </span>
            ) : (
              <Link
                className="text-muted-foreground hover:text-foreground truncate text-sm"
                href={href}
              >
                {segmentLabels[segment] ?? segment}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
