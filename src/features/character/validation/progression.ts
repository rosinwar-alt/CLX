import { z } from "zod";

export const gainExpSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("EXP amount must be a positive integer")
    .max(100000, "EXP gain exceeds reasonable limit"),
});

export type GainExpInput = z.infer<typeof gainExpSchema>;
