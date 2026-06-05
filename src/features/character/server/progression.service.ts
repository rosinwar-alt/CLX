import { prisma } from "@/lib/prisma";
import {
  calculateRequiredExp,
  canLevelUp,
  applyLevelUp
} from "../domain/progression";

export async function grantExperience(characterId: string, expAmount: number) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error("Character not found");
  }

  if (character.isDead) {
    throw new Error("Dead characters cannot gain experience");
  }

  let currentExp = character.experience + expAmount;
  let currentLevel = character.level;

  // Create a temporary object for the domain logic to operate on
  let updatedData = { ...character };

  // Level-up loop: process multiple level-ups if EXP gain is large
  while (true) {
    const required = calculateRequiredExp(currentLevel);
    if (canLevelUp(currentExp, required)) {
      updatedData = applyLevelUp(updatedData);
      currentLevel = updatedData.level!;
      currentExp = updatedData.experience!;
    } else {
      break;
    }
  }

  // Ensure the final experience is correctly set (in case of multiple level-ups)
  updatedData.experience = currentExp;

  return prisma.character.update({
    where: { id: characterId },
    data: {
      level: updatedData.level,
      experience: updatedData.experience,
      strength: updatedData.strength,
      agility: updatedData.agility,
      vitality: updatedData.vitality,
      intelligence: updatedData.intelligence,
      hp: updatedData.hp,
      mp: updatedData.mp,
      stamina: updatedData.stamina,
    },
  });
}
