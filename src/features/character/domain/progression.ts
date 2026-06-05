import { Character, CharacterStats } from "../types";
import { calculateMaxHp, calculateMaxMp, calculateMaxStamina } from "./stats";

export function calculateRequiredExp(level: number): number {
  // Simple progressive scaling: 100 * (level ^ 1.2)
  // Level 1: 100
  // Level 2: ~230
  // Level 3: ~374
  return Math.floor(100 * Math.pow(level, 1.2));
}

export function canLevelUp(currentExp: number, requiredExp: number): boolean {
  return currentExp >= requiredExp;
}

export function applyLevelUp(character: Character): Character {
  const currentLevel = character.level;
  const currentExp = character.experience;
  const requiredExp = calculateRequiredExp(currentLevel);

  // Base stats growth
  const updatedStats: CharacterStats = {
    strength: character.strength + 1,
    agility: character.agility + 1,
    vitality: character.vitality + 1,
    intelligence: character.intelligence + 1,
  };

  // Recalculate resources
  const hp = calculateMaxHp(updatedStats);
  const mp = calculateMaxMp(updatedStats);
  const stamina = calculateMaxStamina(updatedStats);

  return {
    ...character,
    level: currentLevel + 1,
    experience: currentExp - requiredExp,
    strength: updatedStats.strength,
    agility: updatedStats.agility,
    vitality: updatedStats.vitality,
    intelligence: updatedStats.intelligence,
    hp,
    mp,
    stamina,
  };
}
