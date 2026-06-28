import { ComingSoonState } from "@/components/shared/coming-soon-state";

export const metadata = {
  title: "Documents",
};

export default function AppDocumentsPage() {
  return (
    <ComingSoonState
      description="Document evidence and OCR review workflows will be introduced in later batches."
      title="Documents coming soon"
    />
  );
}
