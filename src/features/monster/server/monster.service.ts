import { MONSTER_DEFINITIONS } from '../data/monster-definitions';
import { STAGE_DEFINITIONS } from '../data/stage-definitions';
import { MonsterDefinition, StageDefinition } from '../types';

export function getMonsterDefinition(monsterId: string): MonsterDefinition | undefined {
  return MONSTER_DEFINITIONS.find(m => m.id === monsterId);
}

export function getAllMonsters(): MonsterDefinition[] {
  return MONSTER_DEFINITIONS;
}

export function getStageDefinition(stageId: string): StageDefinition | undefined {
  return STAGE_DEFINITIONS.find(s => s.id === stageId);
}

export function getMonstersForStage(stageId: string): MonsterDefinition[] {
  const stage = getStageDefinition(stageId);
  if (!stage) return [];

  return stage.monsterPool.map(id => {
    const def = getMonsterDefinition(id);
    if (!def) throw new Error(`Monster definition not found for id: ${id}`);
    return def;
  });
}
