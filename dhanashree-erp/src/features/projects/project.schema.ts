import { z } from "zod";

import {
  isoDateSchema,
  nonEmptyStringSchema,
  positiveMoneySchema,
  uuidSchema,
} from "@/lib/validations/common";

export const projectStatusSchema = z.enum(["active", "archived", "closed"]);

export const projectSchema = z.object({
  clientId: uuidSchema,
  code: nonEmptyStringSchema,
  companyId: uuidSchema,
  contractValue: positiveMoneySchema,
  expectedEndDate: isoDateSchema.optional(),
  name: nonEmptyStringSchema,
  stage: nonEmptyStringSchema,
  startDate: isoDateSchema,
  status: projectStatusSchema.default("active"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
