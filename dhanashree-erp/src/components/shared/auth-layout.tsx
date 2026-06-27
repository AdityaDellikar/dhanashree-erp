import type { ReactNode } from "react";

import { APP_NAME } from "@/config/constants";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-zinc-950">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-200 opacity-60 blur-3xl filter dark:bg-indigo-950/40" />
      <div className="absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-violet-200 opacity-60 blur-3xl filter dark:bg-violet-950/40" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
            <span className="text-xl font-bold tracking-tight">D</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            {APP_NAME}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
}
