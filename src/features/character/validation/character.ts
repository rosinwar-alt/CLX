import { z } from "zod";

export const createCharacterSchema = z.object({
  name: z
    .string()
    .min(3, "Character name must be at least 3 characters")
    .max(16, "Character name must be at most 16 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Character name must be alphanumeric"),
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
