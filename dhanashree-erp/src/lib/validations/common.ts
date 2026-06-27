import { z } from "zod";

export const uuidSchema = z.string().uuid();
export const nonEmptyStringSchema = z.string().trim().min(1);
export const positiveMoneySchema = z.coerce.number().positive();
export const isoDateSchema = z.iso.date();
