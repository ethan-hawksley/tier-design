import type { Tier, TierItem } from './types';

interface AppState {
  title: string;
  tiers: Tier[];
  unrankedItems: TierItem[];
}

export const state: AppState = {
  title: 'Tier List Title',
  tiers: [
    {
      id: 0,
      label: 'S',
      colour: '#ff7f80',
      items: [],
    },
    {
      id: 1,
      label: 'A',
      colour: '#ffc07f',
      items: [],
    },
    {
      id: 2,
      label: 'B',
      colour: '#ffdf7f',
      items: [],
    },
    {
      id: 3,
      label: 'C',
      colour: '#ffff7f',
      items: [],
    },
    {
      id: 4,
      label: 'D',
      colour: '#bfff7f',
      items: [],
    },
    {
      id: 5,
      label: 'F',
      colour: '#7fff7f',
      items: [],
    },
  ],
  unrankedItems: [],
};
