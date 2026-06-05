import { createCharacter as createCharacterService } from "../server/character.service";
import { createCharacterSchema } from "../validation/character";

export async function handleCreateCharacter(userId: string, body: unknown) {
  const result = createCharacterSchema.safeParse(body);
  if (!result.success) {
    return { error: "Invalid input", details: result.error.format(), status: 400 };
  }

  try {
    const character = await createCharacterService(userId, result.data.name);
    return { character, status: 201 };
  } catch (error: any) {
    if (error.message === "Character name is already taken") {
      return { error: "Character name is already taken", status: 409 };
    }
    return { error: "Internal server error", status: 500 };
  }
}
