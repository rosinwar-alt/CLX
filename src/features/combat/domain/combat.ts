import { Monster, MonsterDefinition, MonsterRarity } from '@/features/monster/types';
import { Character } from '@prisma/client';
import { LootDrop } from '@/features/dungeon/types';
import { StatusEffect } from '../types';

export interface DamageResult {
  damage: number;
  isCrit: boolean;
  hit: boolean;
}

export function calculatePlayerDamage(
  character: Character,
  monster: Monster,
  equippedWeaponAtk: number = 0
): DamageResult {
  const baseDamage = character.strength * 2 + equippedWeaponAtk;
  const finalDamage = Math.max(1, baseDamage - monster.baseArmor);

  const hitChance = Math.min(100, character.agility * 0.5 + 95);
  const evadeChance = monster.baseEvasion;

  const isHit = Math.random() * 100 > evadeChance && Math.random() * 100 <= hitChance;
  if (!isHit) {
    return { damage: 0, isCrit: false, hit: false };
  }

  const critChance = Math.min(50, character.agility * 0.3);
  const isCrit = Math.random() * 100 <= critChance;
  const totalDamage = isCrit ? Math.floor(finalDamage * 1.5) : finalDamage;

  return { damage: totalDamage, isCrit, hit: true };
}

export function calculateMonsterDamage(
  monster: Monster,
  character: Character,
  equippedArmorBonus: number = 0
): number {
  const monsterAtk = monster.baseAtk * monster.statMultiplier;
  const damage = Math.max(1, monsterAtk - (character.vitality * 0.5 + equippedArmorBonus));
  return Math.floor(damage);
}

export function rollLoot(monster: MonsterDefinition): LootDrop[] {
  const drops: LootDrop[] = [];
  for (const entry of monster.lootTable) {
    if (Math.random() <= entry.dropChance) {
      drops.push({
        itemDefinitionName: entry.itemDefinitionName,
        quantity: entry.quantity,
      });
    }
  }
  return drops;
}

export function rollGold(rarity: MonsterRarity): number {
  switch (rarity) {
    case 'BOSS': return Math.floor(Math.random() * (150 - 80 + 1)) + 80;
    case 'ELITE': return Math.floor(Math.random() * (40 - 20 + 1)) + 20;
    case 'NORMAL': return Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    default: return 0;
  }
}

export function rollExp(rarity: MonsterRarity): number {
  switch (rarity) {
    case 'BOSS': return Math.floor(Math.random() * (300 - 150 + 1)) + 150;
    case 'ELITE': return Math.floor(Math.random() * (80 - 40 + 1)) + 40;
    case 'NORMAL': return Math.floor(Math.random() * (25 - 10 + 1)) + 10;
    default: return 0;
  }
}

export function applyStatusEffect(effect: StatusEffect, target: 'player' | 'monster'): void {
  console.log(`Applying ${effect.type} to ${target} with ${effect.stacks} stacks for ${effect.turnsRemaining} turns.`);
  // Stub: No actual application logic for now
}
