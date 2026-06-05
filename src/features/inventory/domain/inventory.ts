import { InventoryItem } from '@prisma/client';

export function calculateTotalWeight(items: InventoryItem[]): number {
  // We need the ItemDefinition weight for this.
  // Since InventoryItem only has the definition ID, the weights must be passed in
  // or the items must be joined with their definitions.
  // However, the prompt says "calculateTotalWeight(items: InventoryItem[])".
  // To satisfy this while keeping it a pure function, I'll expect the items
  // to be extended with the weight property from the join.

  type InventoryItemWithWeight = InventoryItem & { itemDefinition: { weight: number } };

  const weightedItems = items as unknown as InventoryItemWithWeight[];

  return weightedItems
    .filter(item => !item.isEquipped)
    .reduce((sum, item) => sum + (item.itemDefinition.weight * item.quantity), 0);
}

export function canAddItem(currentWeight: number, itemWeight: number): boolean {
  const MAX_CARRY_WEIGHT = 30;
  return currentWeight + itemWeight <= MAX_CARRY_WEIGHT;
}

export function isOverWeight(items: InventoryItem[]): boolean {
  const MAX_CARRY_WEIGHT = 30;
  return calculateTotalWeight(items) > MAX_CARRY_WEIGHT;
}
