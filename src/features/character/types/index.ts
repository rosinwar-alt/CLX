import { Character as PrismaCharacter } from "@prisma/client";

export type CharacterNature = "BRAVE" | "CALM" | "AGGRESSIVE" | "GENIUS" | "RESILIENT";

export interface CharacterStats {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
}

export interface DerivedResources {
  hp: number;
  mp: number;
  stamina: number;
}

export type Character = PrismaCharacter;
