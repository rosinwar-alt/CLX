import { CharacterStats, CharacterNature, DerivedResources } from "../types";
import { BASE_HP, BASE_MP, BASE_STAMINA } from "../constants/base-stats";
import { NATURE_MODIFIERS } from "../constants/nature-modifiers";

export function applyNatureModifiers(stats: CharacterStats, nature: CharacterNature): CharacterStats {
  const modifiers = NATURE_MODIFIERS[nature] || {};

  return {
    strength: stats.strength + (modifiers.strength || 0),
    agility: stats.agility + (modifiers.agility || 0),
    vitality: stats.vitality + (modifiers.vitality || 0),
    intelligence: stats.intelligence + (modifiers.intelligence || 0),
  };
}

export function calculateMaxHp(stats: CharacterStats): number {
  return BASE_HP + (stats.vitality * 15) + (stats.strength * 2);
}

export function calculateMaxMp(stats: CharacterStats): number {
  return BASE_MP + (stats.intelligence * 15) + (stats.agility * 2);
}

export function calculateMaxStamina(stats: CharacterStats): number {
  return BASE_STAMINA + (stats.strength * 10) + (stats.agility * 10);
}
