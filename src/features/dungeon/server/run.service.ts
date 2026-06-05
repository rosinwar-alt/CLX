import { prisma } from '@/lib/prisma';
import { RunState } from '../types';
import * as runDomain from '../domain/run';
import { grantExperience } from '@/features/character/server/progression.service';
import { killCharacter } from '@/features/character/server/death.service';

const activeRuns = new Map<string, RunState>();

export async function startRun(characterId: string, stageId: string): Promise<RunState> {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error('Character not found');
  }

  if (character.isDead) {
    throw new Error('Dead characters cannot enter dungeons');
  }

  if (activeRuns.has(characterId)) {
    throw new Error('Character already has an active run');
  }

  const runState = runDomain.generateRun(stageId, characterId);
  activeRuns.set(characterId, runState);
  return runState;
}

export function getActiveRun(characterId: string): RunState | null {
  return activeRuns.get(characterId) || null;
}

export async function resolveEncounter(
  characterId: string,
  expGained: number,
  goldGained: number,
  loot: any[] // Using any for LootDrop to avoid circularity if needed, but it should be okay
): Promise<RunState> {
  const run = activeRuns.get(characterId);
  if (!run) {
    throw new Error('No active run found for this character');
  }

  const updatedRun = runDomain.completeEncounter(run, expGained, goldGained, loot);
  activeRuns.set(characterId, updatedRun);

  if (updatedRun.status === 'CLEARED') {
    await finalizeRun(characterId, updatedRun);
  }

  return updatedRun;
}

async function finalizeRun(characterId: string, run: RunState): Promise<void> {
  // 1. Grant Experience
  await grantExperience(characterId, run.bankedExp);

  // 2. Grant Gold
  await prisma.character.update({
    where: { id: characterId },
    data: {
      gold: {
        increment: run.bankedGold,
      },
    },
  });

  // 3. Clear run from memory
  activeRuns.delete(characterId);
}

export async function endRun(characterId: string): Promise<void> {
  activeRuns.delete(characterId);
}

export async function killCharacterInRun(characterId: string): Promise<void> {
  const run = activeRuns.get(characterId);
  if (run) {
    runDomain.failRun(run);
    activeRuns.delete(characterId);
  }

  await killCharacter(characterId);
}
