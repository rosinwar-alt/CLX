import { prisma } from "@/lib/prisma";
import { CharacterNature } from "../types";
import { BASE_STAT_POINTS } from "../constants/base-stats";
import { applyNatureModifiers, calculateMaxHp, calculateMaxMp, calculateMaxStamina } from "../domain/stats";

export async function createCharacter(userId: string, name: string) {
  // 1. Check for duplicate name
  const existing = await prisma.character.findUnique({
    where: { name },
  });

  if (existing) {
    throw new Error("Character name is already taken");
  }

  // 2. Randomly assign nature
  const natures: CharacterNature[] = ["BRAVE", "CALM", "AGGRESSIVE", "GENIUS", "RESILIENT"];
  const nature = natures[Math.floor(Math.random() * natures.length)];

  // 3. Initialize base stats
  const baseStats = {
    strength: BASE_STAT_POINTS,
    agility: BASE_STAT_POINTS,
    vitality: BASE_STAT_POINTS,
    intelligence: BASE_STAT_POINTS,
  };

  // 4. Apply nature modifiers
  const modifiedStats = applyNatureModifiers(baseStats, nature);

  // 5. Calculate derived resources
  const hp = calculateMaxHp(modifiedStats);
  const mp = calculateMaxMp(modifiedStats);
  const stamina = calculateMaxStamina(modifiedStats);

  // 6. Create database record
  return prisma.character.create({
    data: {
      userId,
      name,
      nature,
      strength: modifiedStats.strength,
      agility: modifiedStats.agility,
      vitality: modifiedStats.vitality,
      intelligence: modifiedStats.intelligence,
      hp,
      mp,
      stamina,
    },
  });
}
