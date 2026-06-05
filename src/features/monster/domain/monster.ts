import { Monster, MonsterDefinition, MonsterRarity } from '../types';

export function spawnMonster(definition: MonsterDefinition, rarity: MonsterRarity): Monster {
  let hpMultiplier = 1;
  let statMultiplier = 1;

  if (rarity === 'ELITE') {
    statMultiplier = 1.5;
  } else if (rarity === 'BOSS') {
    hpMultiplier = 3;
    statMultiplier = 1.5;
  }

  return {
    ...definition,
    rarity,
    statMultiplier,
    currentHp: Math.floor(definition.baseHp * hpMultiplier),
    // Note: We store the multiplier, but when calculating actual ATK/Armor etc.
    // the combat system will use this multiplier.
  };
}

export function rollMonsterRarity(): MonsterRarity {
  const rand = Math.random();
  if (rand < 0.15) return 'ELITE';
  return 'NORMAL';
}

export function rollBossAppearance(): boolean {
  return Math.random() < 0.3;
}

export function selectRandomMonster(pool: MonsterDefinition[]): MonsterDefinition {
  return pool[Math.floor(Math.random() * pool.length)];
}
