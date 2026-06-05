import { Monster } from '@/features/monster/types';
import { StatusEffect } from '@/features/combat/types';

export type DungeonStage = 'FOREST' | 'GRAVEYARD' | 'CAVE' | 'SWAMP' | 'RUINS';
export type RunStatus = 'IN_PROGRESS' | 'CLEARED' | 'DEAD';

export interface LootDrop {
  itemDefinitionName: string;
  quantity: number;
}

export interface Encounter {
  monster: Monster;
  isCompleted: boolean;
  lootDrops: LootDrop[];
  monsterCurrentHp: number;
  playerCurrentHp: number;
  isCombatActive: boolean;
  turnCount: number;
  statusEffects: StatusEffect[];
}

export interface RunState {
  characterId: string;
  stageId: string;
  status: RunStatus;
  encounters: Encounter[];
  currentEncounterIndex: number;
  bankedExp: number;
  bankedGold: number;
  collectedLoot: LootDrop[];
}
