import { ModulePage } from "@/components/layout/module-page";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <ModulePage
      description="Settings will manage company configuration, users, roles, storage and category rules."
      title="Settings"
    />
  );
}
