import { prisma } from "@/lib/prisma";
import { resetCharacter } from "../domain/death";

export async function killCharacter(characterId: string) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("Character not found");
  }

  const resetState = resetCharacter(character);

  return prisma.$transaction([
    prisma.character.update({
      where: { id: characterId },
      data: {
        level: resetState.level,
        experience: resetState.experience,
        isDead: resetState.isDead,
        strength: resetState.strength,
        agility: resetState.agility,
        vitality: resetState.vitality,
        intelligence: resetState.intelligence,
        hp: resetState.hp,
        mp: resetState.mp,
        stamina: resetState.stamina,
      },
    }),
    prisma.inventoryItem.deleteMany({
      where: { characterId },
    }),
  ]);
}
