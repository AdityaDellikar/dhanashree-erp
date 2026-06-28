import { ComingSoonState } from "@/components/shared/coming-soon-state";

export const metadata = {
  title: "Reports",
};

export default function AppReportsPage() {
  return (
    <ComingSoonState
      description="Reports will consume calculated service outputs after source modules are implemented."
      title="Reports coming soon"
    />
  );
}
