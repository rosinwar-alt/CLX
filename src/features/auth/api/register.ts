import { createUser } from "../server/user-service";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function registerUser(body: unknown) {
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return { error: "Invalid input", details: result.error.format() };
  }

  try {
    const user = await createUser(result.data);
    return { user: { id: user.id, email: user.email, name: user.name } };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "User already exists" };
    }
    return { error: "Internal server error" };
  }
}
