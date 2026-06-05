export type MonsterCategory = 'SLIME' | 'GOBLIN' | 'UNDEAD' | 'BEAST' | 'INSECT' | 'BOSS';
export type MonsterRarity = 'NORMAL' | 'ELITE' | 'BOSS';

export interface MonsterSkill {
  id: string;
  name: string;
  cooldown: number;
}

export interface LootEntry {
  itemDefinitionName: string;
  dropChance: number;
  quantity: number;
}

export interface MonsterDefinition {
  id: string;
  name: string;
  category: MonsterCategory;
  baseHp: number;
  baseAtk: number;
  baseArmor: number;
  baseEvasion: number;
  skills: MonsterSkill[];
  lootTable: LootEntry[];
}

export interface Monster extends MonsterDefinition {
  rarity: MonsterRarity;
  currentHp: number;
  statMultiplier: number;
}
