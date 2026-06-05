import { CombatAction } from '../types';
import * as combatService from '../server/combat.service';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getCharacterForUser(userId: string) {
  const character = await prisma.character.findFirst({
    where: { userId },
  });

  if (!character) {
    throw new Error('No character found for this user');
  }

  return character;
}

export async function handleCombatAction(userId: string, body: { action: CombatAction, skillId?: string }) {
  try {
    const character = await getCharacterForUser(userId);
    const result = await combatService.processAction(character.id, body.action, body.skillId);
    return { result };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}
