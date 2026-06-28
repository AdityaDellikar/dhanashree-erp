import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectForm } from "@/features/projects/components/project-form";
import { ProjectList } from "@/features/projects/components/project-list";
import { getProjects } from "@/features/projects/queries";

export const metadata = {
  title: "Projects",
};

export default async function AppProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Projects</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Project records are the foundation for Sprint 2 cashflow tracking.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Add a project under the active organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm mode="create" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project list</CardTitle>
          <CardDescription>
            Only projects from the active organization are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectList projects={projects} />
        </CardContent>
      </Card>
    </div>
  );
}
