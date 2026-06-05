import { prisma } from '@/lib/prisma';
import * as inventoryService from '../server/inventory.service';
import { NextResponse } from 'next/server';

async function verifyCharacterOwnership(userId: string, characterId: string) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error('Character not found');
  }

  if (character.userId !== userId) {
    throw new Error('Unauthorized: Character does not belong to this user');
  }

  return character;
}

export async function handleGetInventory(userId: string, body: { characterId: string }) {
  try {
    await verifyCharacterOwnership(userId, body.characterId);
    const inventory = await inventoryService.getInventory(body.characterId);
    return { inventory };
  } catch (error: any) {
    return { error: error.message, status: 403 };
  }
}

export async function handleAddItem(userId: string, body: { characterId: string, itemDefinitionId: string, quantity?: number }) {
  try {
    await verifyCharacterOwnership(userId, body.characterId);
    const item = await inventoryService.addItem(body.characterId, body.itemDefinitionId, body.quantity);
    return { item };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handleRemoveItem(userId: string, body: { characterId: string, inventoryItemId: string }) {
  try {
    await verifyCharacterOwnership(userId, body.characterId);
    const item = await inventoryService.removeItem(body.inventoryItemId);
    return { item };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handleEquipItem(userId: string, body: { characterId: string, inventoryItemId: string, slot: string }) {
  try {
    await verifyCharacterOwnership(userId, body.characterId);
    const item = await inventoryService.equipItem(body.inventoryItemId, body.slot);
    return { item };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}

export async function handleUnequipItem(userId: string, body: { characterId: string, inventoryItemId: string }) {
  try {
    await verifyCharacterOwnership(userId, body.characterId);
    const item = await inventoryService.unequipItem(body.inventoryItemId);
    return { item };
  } catch (error: any) {
    return { error: error.message, status: 400 };
  }
}
