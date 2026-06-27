import { CheckCircle2 } from "lucide-react";

type FormSuccessProps = {
  message?: string;
};

export function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-lg border border-emerald-200/50 bg-emerald-50 p-3 text-sm text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
