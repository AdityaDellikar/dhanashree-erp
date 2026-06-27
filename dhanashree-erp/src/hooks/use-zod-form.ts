"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, useForm, type UseFormProps } from "react-hook-form";
import type { z } from "zod";

export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues, TFieldValues>,
  options?: UseFormProps<TFieldValues>,
) {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema, undefined, { raw: true }),
    ...options,
  });
}
