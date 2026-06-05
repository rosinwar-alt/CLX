import { Character } from "../types";
import { BASE_STAT_POINTS } from "../constants/base-stats";
import {
  applyNatureModifiers,
  calculateMaxHp,
  calculateMaxMp,
  calculateMaxStamina
} from "./stats";

export function resetCharacter(character: Character) {
  const baseStats = {
    strength: BASE_STAT_POINTS,
    agility: BASE_STAT_POINTS,
    vitality: BASE_STAT_POINTS,
    intelligence: BASE_STAT_POINTS,
  };

  const resetStats = applyNatureModifiers(baseStats, character.nature);

  return {
    level: 1,
    experience: 0,
    isDead: true,
    strength: resetStats.strength,
    agility: resetStats.agility,
    vitality: resetStats.vitality,
    intelligence: resetStats.intelligence,
    hp: calculateMaxHp(resetStats),
    mp: calculateMaxMp(resetStats),
    stamina: calculateMaxStamina(resetStats),
  };
}
