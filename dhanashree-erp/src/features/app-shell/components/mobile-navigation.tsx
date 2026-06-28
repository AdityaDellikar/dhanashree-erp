"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/features/app-shell/components/sidebar-nav";

type MobileNavigationProps = {
  organizationName: string;
};

export function MobileNavigation({ organizationName }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        aria-label="Open navigation"
        className="lg:hidden"
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </Button>
      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            type="button"
            onClick={() => setIsOpen(false)}
          />
          <aside className="bg-background absolute inset-y-0 left-0 flex w-80 max-w-[86vw] flex-col border-r shadow-xl">
            <div className="flex items-start justify-between border-b p-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">Dhanashree ERP</p>
                <p className="text-muted-foreground truncate text-xs">
                  {organizationName}
                </p>
              </div>
              <Button
                aria-label="Close navigation"
                size="icon"
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SidebarNav onNavigate={() => setIsOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
