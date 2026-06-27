import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

type LoadingButtonProps = ButtonProps & {
  children: ReactNode;
  isLoading: boolean;
};

export function LoadingButton({
  children,
  disabled,
  isLoading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
