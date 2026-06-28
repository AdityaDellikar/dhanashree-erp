"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationGroups } from "@/features/app-shell/navigation";
import { cn } from "@/lib/utils";

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6" aria-label="Application navigation">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="text-muted-foreground px-3 text-xs font-medium tracking-wide uppercase">
            {group.label}
          </p>
          <div className="mt-2 space-y-1">
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                  href={item.href}
                  onClick={onNavigate}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {"isComingSoon" in item && item.isComingSoon ? (
                    <span
                      className={cn(
                        "rounded border px-1.5 py-0.5 text-[10px] font-medium",
                        isActive
                          ? "border-primary-foreground/30"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      Soon
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
