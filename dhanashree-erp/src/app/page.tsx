import {
  ArrowRight,
  BarChart3,
  FileText,
  IndianRupee,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_DESCRIPTION, APP_NAME, ROUTES } from "@/config/constants";

const foundations = [
  {
    description:
      "Every project becomes the workspace for site logs, documents and money movement.",
    href: ROUTES.projects,
    icon: FileText,
    title: "Project Workspace",
  },
  {
    description:
      "Transactions stay as source facts while cashflow and profit are calculated by services.",
    href: ROUTES.dashboard,
    icon: IndianRupee,
    title: "Transaction Engine",
  },
  {
    description:
      "Attendance drives salary generation and workforce history without manual salary entry.",
    href: ROUTES.workforce,
    icon: UsersRound,
    title: "Workforce Source",
  },
  {
    description:
      "Dashboards, analytics and reports consume calculated service outputs.",
    href: ROUTES.reports,
    icon: BarChart3,
    title: "Reporting Layer",
  },
] as const;

export default function HomePage() {
  return (
    <main className="bg-background min-h-dvh">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-card flex flex-col gap-6 rounded-lg border p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-medium">
              Sprint 0 foundation
            </p>
            <h1 className="text-foreground mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              {APP_NAME}
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-7 sm:text-lg">
              {APP_DESCRIPTION}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={ROUTES.dashboard}>
                Open dashboard
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.projects}>View projects</Link>
            </Button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {foundations.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="text-primary size-5" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" variant="ghost">
                  <Link href={item.href}>Continue</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </section>
    </main>
  );
}
