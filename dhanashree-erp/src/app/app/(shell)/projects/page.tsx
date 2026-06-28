import { ComingSoonState } from "@/components/shared/coming-soon-state";

export const metadata = {
  title: "Projects",
};

export default function AppProjectsPage() {
  return (
    <ComingSoonState
      description="Project workspace screens will be added after the Sprint 1 foundation is complete."
      title="Projects coming soon"
    />
  );
}
