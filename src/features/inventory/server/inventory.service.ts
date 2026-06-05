import { prisma } from '@/lib/prisma';
import { calculateTotalWeight, canAddItem } from '../domain/inventory';

export async function getInventory(characterId: string) {
  const items = await prisma.inventoryItem.findMany({
    where: { characterId },
    include: {
      itemDefinition: true,
    },
  });
  return items;
}

export async function addItem(characterId: string, itemDefinitionId: string, quantity: number = 1) {
  const itemDef = await prisma.itemDefinition.findUnique({
    where: { id: itemDefinitionId },
  });

  if (!itemDef) {
    throw new Error('Item definition not found');
  }

  const currentItems = await prisma.inventoryItem.findMany({
    where: { characterId },
    include: { itemDefinition: true },
  });

  const currentWeight = calculateTotalWeight(currentItems);
  const addedWeight = itemDef.weight * quantity;

  if (!canAddItem(currentWeight, addedWeight)) {
    throw new Error('Inventory weight limit exceeded (30 KG)');
  }

  // Check if character already has this item to increment quantity instead of creating new row
  const existingItem = await prisma.inventoryItem.findFirst({
    where: { characterId, itemDefinitionId },
  });

  if (existingItem) {
    return prisma.inventoryItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } },
    });
  }

  return prisma.inventoryItem.create({
    data: {
      characterId,
      itemDefinitionId,
      quantity,
    },
  });
}

export async function removeItem(inventoryItemId: string) {
  return prisma.inventoryItem.delete({
    where: { id: inventoryItemId },
  });
}

export async function equipItem(inventoryItemId: string, slot: string) {
  return prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: {
      isEquipped: true,
      slot: slot,
    },
  });
}

export async function unequipItem(inventoryItemId: string) {
  return prisma.inventoryItem.update({
    where: { id: inventoryItemId },
    data: {
      isEquipped: false,
      slot: null,
    },
  });
}
