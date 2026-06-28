import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectForm } from "@/features/projects/components/project-form";
import { getProject } from "@/features/projects/queries";

type ProjectDetailPageProps = {
  params: Promise<{
    projectId: string;
  }>;
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

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  return {
    title: project.name,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{project.code}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            {project.name}
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link href="/app/projects">Back to projects</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>
            Basic project information for the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium capitalize">
                {formatStatus(project.status)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Budget</dt>
              <dd className="mt-1 font-medium">
                {formatMoney(project.budget_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Start date</dt>
              <dd className="mt-1 font-medium">
                {project.start_date ?? "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">End date</dt>
              <dd className="mt-1 font-medium">
                {project.end_date ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Location</dt>
              <dd className="mt-1 font-medium">
                {project.location ?? "Not set"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Description</dt>
              <dd className="mt-1 font-medium">
                {project.description ?? "Not set"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit project</CardTitle>
          <CardDescription>
            Update the project foundation fields before cashflow entries are
            introduced.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm mode="edit" project={project} />
        </CardContent>
      </Card>
    </div>
  );
}
