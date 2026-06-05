import { prisma } from '@/lib/prisma';
import { CombatAction, CombatResult, StatusEffect } from '../types';
import * as combatDomain from '../domain/combat';
import * as runService from '@/features/dungeon/server/run.service';
import { killCharacterInRun, endRun } from '@/features/dungeon/server/run.service';
import { InventoryItem } from '@prisma/client';

export async function processAction(
  characterId: string,
  action: CombatAction,
  skillId?: string
): Promise<CombatResult> {
  const run = runService.getActiveRun(characterId);
  if (!run) {
    throw new Error('No active run found');
  }

  const encounter = run.encounters[run.currentEncounterIndex];
  if (!encounter || encounter.isCompleted) {
    throw new Error('No active encounter to fight');
  }

  const character = await prisma.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new Error('Character not found');
  }

  const inventoryItems = await prisma.inventoryItem.findMany({
    where: { characterId },
    include: { itemDefinition: true },
  });

  // Helper to get equipment bonuses (currently 0 as requested in "What to Build")
  const equippedWeaponAtk = 0;
  const equippedArmorBonus = 0;

  if (action === 'ATTACK') {
    const playerDamage = combatDomain.calculatePlayerDamage(character, encounter.monster, equippedWeaponAtk);

    let monsterHpAfter = encounter.monsterCurrentHp - (playerDamage.hit ? playerDamage.damage : 0);
    let isMonsterDead = monsterHpAfter <= 0;
    let isPlayerDead = false;
    let monsterDamageDealt = 0;
    let playerHpAfter = encounter.playerCurrentHp;
    let lootDrops: any[] = [];
    let expGained = 0;
    let goldGained = 0;

    if (isMonsterDead) {
      monsterHpAfter = 0;
      lootDrops = combatDomain.rollLoot(encounter.monster);
      goldGained = combatDomain.rollGold(encounter.monster.rarity);
      expGained = combatDomain.rollExp(encounter.monster.rarity);

      // Resolve encounter in run system
      await runService.resolveEncounter(characterId, expGained, goldGained, lootDrops);
    } else {
      // Monster counter-attacks
      monsterDamageDealt = combatDomain.calculateMonsterDamage(encounter.monster, character, equippedArmorBonus);
      playerHpAfter -= monsterDamageDealt;

      if (playerHpAfter <= 0) {
        isPlayerDead = true;
        await killCharacterInRun(characterId);
      }
    }

    // Update encounter state
    encounter.monsterCurrentHp = monsterHpAfter;
    encounter.playerCurrentHp = playerHpAfter;
    encounter.turnCount++;

    return {
      action,
      hit: playerDamage.hit,
      isCrit: playerDamage.isCrit,
      playerDamageDealt: playerDamage.hit ? playerDamage.damage : 0,
      monsterDamageDealt,
      playerHpAfter,
      monsterHpAfter,
      statusEffectsApplied: [],
      isMonsterDead,
      isPlayerDead,
      isFled: false,
      lootDrops,
      expGained,
      goldGained,
      turnCount: encounter.turnCount,
    };
  }

  if (action === 'FLEE') {
    const hasTeleportStone = inventoryItems.some(
      item => item.itemDefinition.name === 'teleport_stone'
    );

    if (!hasTeleportStone) {
      throw new Error('No teleport stone in inventory');
    }

    // Remove 1 teleport stone
    const stone = inventoryItems.find(item => item.itemDefinition.name === 'teleport_stone');
    if (stone) {
      if (stone.quantity > 1) {
        await prisma.inventoryItem.update({
          where: { id: stone.id },
          data: { quantity: { decrement: 1 } },
        });
      } else {
        await prisma.inventoryItem.delete({
          where: { id: stone.id },
        });
      }
    }

    // End run (not cleared, not dead)
    await endRun(characterId);

    return {
      action,
      hit: true,
      isCrit: false,
      playerDamageDealt: 0,
      monsterDamageDealt: 0,
      playerHpAfter: character.hp,
      monsterHpAfter: encounter.monsterCurrentHp,
      statusEffectsApplied: [],
      isMonsterDead: false,
      isPlayerDead: false,
      isFled: true,
      lootDrops: [],
      expGained: 0,
      goldGained: 0,
      turnCount: encounter.turnCount,
    };
  }

  if (action === 'USE_SKILL') {
    throw new Error('Skill system not yet implemented');
  }

  throw new Error('Invalid action');
}
