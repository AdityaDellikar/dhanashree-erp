import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supplierStatusOptions } from "@/features/suppliers/schemas";

type SupplierFiltersProps = {
  filters: {
    search?: string;
    status?: string;
  };
};

export function SupplierFilters({ filters }: SupplierFiltersProps) {
  return (
    <form className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
      <div className="space-y-2">
        <label htmlFor="supplier-search" className="text-sm font-medium">
          Search
        </label>
        <Input
          id="supplier-search"
          name="search"
          placeholder="Name, contact, phone, GST"
          defaultValue={filters.search}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="supplier-status-filter" className="text-sm font-medium">
          Status
        </label>
        <select
          id="supplier-status-filter"
          name="status"
          defaultValue={filters.status}
          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm capitalize shadow-sm"
        >
          <option value="">All statuses</option>
          {supplierStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full md:w-auto">
          <Search />
          Apply filters
        </Button>
      </div>
    </form>
  );
}
