import { RunState, Encounter, LootDrop, RunStatus } from '../types';
import {
  MonsterDefinition,
  Monster
} from '@/features/monster/types';
import {
  spawnMonster,
  rollMonsterRarity,
  rollBossAppearance,
  selectRandomMonster
} from '@/features/monster/domain/monster';
import { getMonstersForStage, getStageDefinition, getMonsterDefinition } from '@/features/monster/server/monster.service';

export function generateRun(stageId: string, characterId: string): RunState {
  const pool = getMonstersForStage(stageId);
  const encounterCount = Math.floor(Math.random() * 3) + 3; // 3-5 encounters
  const encounters: Encounter[] = [];

  for (let i = 0; i < encounterCount; i++) {
    const definition = selectRandomMonster(pool);
    const rarity = rollMonsterRarity();
    encounters.push({
      monster: spawnMonster(definition, rarity),
      isCompleted: false,
      lootDrops: [],
    });
  }

  // 30% chance for a boss at the end
  if (rollBossAppearance()) {
    const stageDef = getStageDefinition(stageId);
    const bossDef = getMonsterDefinition(stageDef?.bossId);
    if (bossDef) {
      encounters[encounters.length - 1] = {
        monster: spawnMonster(bossDef, 'BOSS'),
        isCompleted: false,
        lootDrops: [],
      };
    }
  }

  return {
    characterId,
    stageId,
    status: 'IN_PROGRESS',
    encounters,
    currentEncounterIndex: 0,
    bankedExp: 0,
    bankedGold: 0,
    collectedLoot: [],
  };
}

export function getCurrentEncounter(run: RunState): Encounter | null {
  if (run.currentEncounterIndex >= run.encounters.length) return null;
  return run.encounters[run.currentEncounterIndex];
}

export function completeEncounter(
  run: RunState,
  expGained: number,
  goldGained: number,
  loot: LootDrop[]
): RunState {
  const newRun = { ...run };
  const encounters = [...newRun.encounters];

  encounters[newRun.currentEncounterIndex] = {
    ...encounters[newRun.currentEncounterIndex],
    isCompleted: true,
    lootDrops: loot,
  };

  newRun.encounters = encounters;
  newRun.bankedExp += expGained;
  newRun.bankedGold += goldGained;
  newRun.collectedLoot = [...newRun.collectedLoot, ...loot];
  newRun.currentEncounterIndex++;

  if (newRun.currentEncounterIndex >= newRun.encounters.length) {
    newRun.status = 'CLEARED';
  }

  return newRun;
}

export function failRun(run: RunState): RunState {
  return {
    ...run,
    status: 'DEAD',
  };
}
