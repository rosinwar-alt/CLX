import { killCharacter } from "../server/death.service";

export async function handleKillCharacter(userId: string) {
  try {
    // In this current phase, we target the user's first character.
    // This can be expanded to a specific characterId in the future.
    const { prisma } = await import("@/lib/prisma");
    const character = await prisma.character.findFirst({
      where: { userId },
    });

    if (!character) {
      return { error: "No character found", status: 404 };
    }

    const deadCharacter = await killCharacter(character.id);
    return { character: deadCharacter, status: 200 };
  } catch (error: any) {
    if (error.message === "Character not found") {
      return { error: error.message, status: 404 };
    }
    return { error: "Internal server error", status: 500 };
  }
}
