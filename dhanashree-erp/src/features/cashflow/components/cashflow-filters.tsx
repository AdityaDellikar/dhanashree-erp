import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  cashflowEntryTypeOptions,
  cashflowStatusOptions,
} from "@/features/cashflow/schemas";
import type { Project } from "@/features/projects/queries";

type CashflowFiltersProps = {
  filters: {
    dateFrom?: string;
    dateTo?: string;
    entryType?: string;
    projectId?: string;
    search?: string;
    status?: string;
  };
  projects: Project[];
};

function formatLabel(value: string) {
  return value.replace("_", " ");
}

export function CashflowFilters({ filters, projects }: CashflowFiltersProps) {
  return (
    <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
      <div className="space-y-2 xl:col-span-2">
        <label htmlFor="cashflow-search" className="text-sm font-medium">
          Search
        </label>
        <Input
          id="cashflow-search"
          name="search"
          placeholder="Category, reference, notes"
          defaultValue={filters.search}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cashflow-project-filter"
          className="text-sm font-medium"
        >
          Project
        </label>
        <select
          id="cashflow-project-filter"
          name="projectId"
          defaultValue={filters.projectId}
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm shadow-sm"
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.code}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cashflow-entry-type-filter"
          className="text-sm font-medium"
        >
          Type
        </label>
        <select
          id="cashflow-entry-type-filter"
          name="entryType"
          defaultValue={filters.entryType}
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm"
        >
          <option value="">All types</option>
          {cashflowEntryTypeOptions.map((type) => (
            <option key={type} value={type}>
              {formatLabel(type)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="cashflow-status-filter" className="text-sm font-medium">
          Status
        </label>
        <select
          id="cashflow-status-filter"
          name="status"
          defaultValue={filters.status}
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm"
        >
          <option value="">All statuses</option>
          {cashflowStatusOptions.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:col-span-2 xl:col-span-6 xl:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-2">
          <label htmlFor="cashflow-date-from" className="text-sm font-medium">
            From
          </label>
          <Input
            id="cashflow-date-from"
            name="dateFrom"
            type="date"
            defaultValue={filters.dateFrom}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="cashflow-date-to" className="text-sm font-medium">
            To
          </label>
          <Input
            id="cashflow-date-to"
            name="dateTo"
            type="date"
            defaultValue={filters.dateTo}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full xl:w-auto">
            <Search />
            Apply filters
          </Button>
        </div>
      </div>
    </form>
  );
}
