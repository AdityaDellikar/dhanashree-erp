import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import type { Project } from "@/features/projects/queries";

type ProjectListProps = {
  projects: Project[];
};

function formatStatus(status: string) {
  return status.replace("_", " ");
}

function formatMoney(value: number | null) {
  if (value == null) return "Not set";

  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        description="Create your first project to start organizing future cashflow entries."
        title="No projects yet"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/40 grid grid-cols-2 gap-3 px-4 py-3 text-xs font-medium md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]">
        <span>Project</span>
        <span className="hidden md:block">Status</span>
        <span className="hidden md:block">Budget</span>
        <span className="hidden md:block">Location</span>
        <span className="text-right">Action</span>
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          className="grid grid-cols-2 items-center gap-3 border-t px-4 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto]"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{project.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {project.code}
            </p>
          </div>
          <p className="hidden capitalize md:block">
            {formatStatus(project.status)}
          </p>
          <p className="text-muted-foreground hidden md:block">
            {formatMoney(project.budget_amount)}
          </p>
          <p className="text-muted-foreground hidden truncate md:block">
            {project.location ?? "Not set"}
          </p>
          <div className="text-right">
            <Button asChild size="sm" variant="outline">
              <Link href={`/app/projects/${project.id}`}>Open</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
