import { ModulePage } from "@/components/layout/module-page";

export const metadata = {
  title: "Documents",
};

export default function DocumentsPage() {
  return (
    <ModulePage
      description="Documents remain attached to projects and OCR creates drafts that require user confirmation."
      title="Documents"
    />
  );
}
