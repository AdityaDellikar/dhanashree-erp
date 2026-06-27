import {
  isoDateSchema,
  nonEmptyStringSchema,
  positiveMoneySchema,
  uuidSchema,
} from "@/lib/validations/common";

export const validators = {
  isoDate: isoDateSchema,
  nonEmptyString: nonEmptyStringSchema,
  positiveMoney: positiveMoneySchema,
  uuid: uuidSchema,
};
