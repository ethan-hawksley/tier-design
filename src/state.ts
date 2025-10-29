import type { Tier, TierItem } from './types';

interface AppState {
  tiers: Tier[];
  unrankedItems: TierItem[];
}

export const state: AppState = {
  tiers: [{ name: 'S', colour: '#ff7f80', items: [] }],
  unrankedItems: [{ id: 0, content: 'Item A' }],
};
