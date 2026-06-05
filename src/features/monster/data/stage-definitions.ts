import { StageDefinition } from '../types';

export const STAGE_DEFINITIONS: StageDefinition[] = [
  {
    id: 'forest',
    name: 'Forest',
    levelRange: { min: 1, max: 3 },
    monsterPool: ['green_slime', 'blue_slime', 'wolf', 'goblin_scout'],
    bossId: 'forest_guardian',
  },
  {
    id: 'graveyard',
    name: 'Graveyard',
    levelRange: { min: 3, max: 5 },
    monsterPool: ['zombie', 'skeleton', 'goblin_warrior'],
    bossId: 'lich',
  },
  {
    id: 'cave',
    name: 'Cave',
    levelRange: { min: 5, max: 8 },
    monsterPool: ['spider', 'giant_bee', 'wolf'],
    bossId: 'cave_terror',
  },
  {
    id: 'swamp',
    name: 'Swamp',
    levelRange: { min: 8, max: 12 },
    monsterPool: ['green_slime', 'spider', 'bear'],
    bossId: 'swamp_hydra',
  },
  {
    id: 'ruins',
    name: 'Ruins',
    levelRange: { min: 12, max: 15 },
    monsterPool: ['skeleton', 'goblin_warrior', 'bear'],
    bossId: 'goblin_king',
  },
];
