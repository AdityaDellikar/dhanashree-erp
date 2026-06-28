"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/shared/form-error";
import { LoadingButton } from "@/components/shared/loading-button";
import { Input } from "@/components/ui/input";
import { createProject, updateProject } from "@/features/projects/actions";
import type { Project } from "@/features/projects/queries";
import {
  normalizeOptionalAmount,
  normalizeOptionalText,
  type ProjectFormInput,
  projectFormSchema,
  projectStatusOptions,
} from "@/features/projects/schemas";

type ProjectFormProps = {
  mode: "create" | "edit";
  project?: Project;
};

function fieldError(message?: string) {
  if (!message) return null;

  return <p className="text-destructive text-xs font-medium">{message}</p>;
}

function formatStatus(status: string) {
  return status.replace("_", " ");
}

export function ProjectForm({ mode, project }: ProjectFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ProjectFormInput>({
    defaultValues: {
      budget_amount: project?.budget_amount ?? undefined,
      code: project?.code ?? "",
      description: project?.description ?? "",
      end_date: project?.end_date ?? undefined,
      location: project?.location ?? "",
      name: project?.name ?? "",
      start_date: project?.start_date ?? undefined,
      status: project?.status ?? "planned",
    },
    resolver: zodResolver(projectFormSchema),
  });

  const onSubmit = (values: ProjectFormInput) => {
    setError(undefined);

    startTransition(async () => {
      const response =
        mode === "create"
          ? await createProject(values)
          : await updateProject(project?.id ?? "", values);

      if (!response.success) {
        setError(response.message);
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      if (mode === "create") {
        reset();
      }

      if (response.id) {
        router.push(`/app/projects/${response.id}` as Route);
      }

      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            Project name
          </label>
          <Input id="project-name" disabled={isPending} {...register("name")} />
          {fieldError(errors.name?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-code" className="text-sm font-medium">
            Code
          </label>
          <Input
            id="project-code"
            autoCapitalize="characters"
            disabled={isPending}
            {...register("code")}
          />
          {fieldError(errors.code?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="project-status"
            disabled={isPending}
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm disabled:opacity-50"
            {...register("status")}
          >
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>
          {fieldError(errors.status?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-start-date" className="text-sm font-medium">
            Start date
          </label>
          <Input
            id="project-start-date"
            disabled={isPending}
            type="date"
            {...register("start_date", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.start_date?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-end-date" className="text-sm font-medium">
            End date
          </label>
          <Input
            id="project-end-date"
            disabled={isPending}
            type="date"
            {...register("end_date", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.end_date?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-budget" className="text-sm font-medium">
            Budget amount
          </label>
          <Input
            id="project-budget"
            disabled={isPending}
            min="0"
            step="0.01"
            type="number"
            {...register("budget_amount", {
              setValueAs: normalizeOptionalAmount,
            })}
          />
          {fieldError(errors.budget_amount?.message)}
        </div>

        <div className="space-y-2">
          <label htmlFor="project-location" className="text-sm font-medium">
            Location
          </label>
          <Input
            id="project-location"
            disabled={isPending}
            {...register("location", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.location?.message)}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="project-description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="project-description"
            disabled={isPending}
            rows={4}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description", { setValueAs: normalizeOptionalText })}
          />
          {fieldError(errors.description?.message)}
        </div>
      </div>

      <FormError message={error} />

      <LoadingButton type="submit" isLoading={isPending}>
        <Save />
        {mode === "create" ? "Create project" : "Save project"}
      </LoadingButton>
    </form>
  );
}
