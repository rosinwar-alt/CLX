import { LootDrop } from '@/features/dungeon/types';

export type CombatAction = 'ATTACK' | 'USE_SKILL' | 'FLEE';
export type StatusEffectType = 'POISON' | 'BURN' | 'BLEED' | 'FREEZE' | 'STUN' | 'CURSE' | 'FEAR' | 'SILENCE';

export interface StatusEffect {
  type: StatusEffectType;
  stacks: number;
  turnsRemaining: number;
}

export interface CombatResult {
  action: CombatAction;
  hit: boolean;
  isCrit: boolean;
  playerDamageDealt: number;
  monsterDamageDealt: number;
  playerHpAfter: number;
  monsterHpAfter: number;
  statusEffectsApplied: StatusEffect[];
  isMonsterDead: boolean;
  isPlayerDead: boolean;
  isFled: boolean;
  lootDrops: LootDrop[];
  expGained: number;
  goldGained: number;
  turnCount: number;
}
