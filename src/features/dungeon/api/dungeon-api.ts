import { prisma } from '@/lib/prisma';
import * as runService from '../server/run.service';
import { NextResponse } from 'next/server';

async function getCharacterForUser(userId: string) {
  const character = await prisma.character.findFirst({
    where: { userId },
  });

  if (!character) {
    throw new Error('No character found for this user');
  }

  return character;
}

export async function handleStartRun(userId: string, body: { stageId: string }) {
  try {
    const character = await getCharacterForUser(userId);
    const run = await runService.startRun(character.id, body.stageId);
    return { run };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handleGetRun(userId: string) {
  try {
    const character = await getCharacterForUser(userId);
    const run = runService.getActiveRun(character.id);
    if (!run) {
      return { error: 'No active run found', status: 404 };
    }
    return { run };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handleResolveEncounter(userId: string, body: { expGained: number, goldGained: number, loot: any[] }) {
  try {
    const character = await getCharacterForUser(userId);
    const run = await runService.resolveEncounter(character.id, body.expGained, body.goldGained, body.loot);
    return { run };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handlePlayerDeath(userId: string) {
  try {
    const character = await getCharacterForUser(userId);
    await runService.killCharacterInRun(character.id);
    return { success: true };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}
