import { CharacterNature } from "../types";

export const NATURE_MODIFIERS: Record<CharacterNature, Partial<Record<keyof import("../types").CharacterStats, number>>> = {
  BRAVE: {
    strength: 2,
    vitality: 1,
  },
  CALM: {
    intelligence: 2,
    vitality: 1,
  },
  AGGRESSIVE: {
    strength: 2,
    agility: 1,
  },
  GENIUS: {
    intelligence: 3,
    agility: 1,
  },
  RESILIENT: {
    vitality: 3,
    strength: 1,
  },
};
