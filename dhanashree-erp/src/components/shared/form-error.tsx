import { AlertTriangle } from "lucide-react";

type FormErrorProps = {
  message?: string;
};

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-x-2 rounded-lg border border-red-200/50 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
