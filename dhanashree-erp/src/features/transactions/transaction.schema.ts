import { z } from "zod";

import {
  isoDateSchema,
  nonEmptyStringSchema,
  positiveMoneySchema,
  uuidSchema,
} from "@/lib/validations/common";

export const transactionTypeSchema = z.enum(["income", "expense"]);

export const transactionSchema = z.object({
  amount: positiveMoneySchema,
  category: nonEmptyStringSchema,
  description: z.string().trim().optional(),
  labourId: uuidSchema.optional(),
  paymentMethod: nonEmptyStringSchema,
  projectId: uuidSchema,
  supplierId: uuidSchema.optional(),
  transactionDate: isoDateSchema,
  type: transactionTypeSchema,
});

export type TransactionInput = z.infer<typeof transactionSchema>;
