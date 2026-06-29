import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Handshake,
  IndianRupee,
  LayoutDashboard,
  Settings,
  UsersRound,
} from "lucide-react";
import type { Route } from "next";
import type { ComponentType } from "react";

export type NavigationItem = {
  description: string;
  href: Route;
  icon: ComponentType<{ className?: string }>;
  isComingSoon?: boolean;
  label: string;
};

export type NavigationGroup = {
  items: NavigationItem[];
  label: string;
};

export const navigationGroups: readonly NavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        description: "Organization overview and quick links.",
        href: "/app/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
      },
      {
        description: "Project workspace foundation.",
        href: "/app/projects",
        icon: BriefcaseBusiness,
        label: "Projects",
      },
      {
        description: "Suppliers, customers, and subcontractors.",
        href: "/app/parties",
        icon: Handshake,
        label: "Parties",
      },
      {
        description: "Project income and expense ledger.",
        href: "/app/cashflow",
        icon: IndianRupee,
        label: "Cashflow",
      },
      {
        description: "Labour and attendance workspace.",
        href: "/app/workforce",
        icon: UsersRound,
        isComingSoon: true,
        label: "Workforce",
      },
      {
        description: "Document evidence workspace.",
        href: "/app/documents",
        icon: FileText,
        isComingSoon: true,
        label: "Documents",
      },
      {
        description: "Calculated analytics and reports.",
        href: "/app/reports",
        icon: BarChart3,
        isComingSoon: true,
        label: "Reports",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        description: "Organization profile and members.",
        href: "/app/settings/organization",
        icon: Settings,
        label: "Settings",
      },
    ],
  },
];

export function getNavigationItem(pathname: string) {
  return navigationGroups
    .flatMap((group) => group.items)
    .find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
}
