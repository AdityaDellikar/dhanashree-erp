import { ComingSoonState } from "@/components/shared/coming-soon-state";

export const metadata = {
  title: "Workforce",
};

export default function AppWorkforcePage() {
  return (
    <ComingSoonState
      description="Attendance, labour history, and payroll workflows are reserved for future module batches."
      title="Workforce coming soon"
    />
  );
}
