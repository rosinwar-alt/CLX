export const ITEM_DEFINITIONS = [
  {
    name: 'health_potion',
    category: 'CONSUMABLE' as const,
    weight: 1,
    description: 'Restores a small amount of HP.',
  },
  {
    name: 'mana_potion',
    category: 'CONSUMABLE' as const,
    weight: 1,
    description: 'Restores a small amount of MP.',
  },
  {
    name: 'stamina_potion',
    category: 'CONSUMABLE' as const,
    weight: 1,
    description: 'Restores a small amount of Stamina.',
  },
  {
    name: 'teleport_stone',
    category: 'CONSUMABLE' as const,
    weight: 1,
    description: 'Teleports you back to the safety of the city.',
  },
  {
    name: 'iron_sword',
    category: 'EQUIPMENT' as const,
    weight: 3,
    description: 'A basic sword made of iron.',
  },
  {
    name: 'leather_armor',
    category: 'EQUIPMENT' as const,
    weight: 5,
    description: 'Simple armor made from treated leather.',
  },
  {
    name: 'wolf_fang',
    category: 'MATERIAL' as const,
    weight: 1,
    description: 'A sharp fang from a wolf.',
  },
  {
    name: 'slime_core',
    category: 'MATERIAL' as const,
    weight: 1,
    description: 'A jiggly core from a slime.',
  },
] as const;

export type ItemDefinitionData = typeof ITEM_DEFINITIONS[number];
