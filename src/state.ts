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
      label: 'S',
      colour: '#ff7f80',
      items: [
        { id: 1, content: 'Item B' },
        { id: 2, content: 'Item C' },
        { id: 3, content: 'Item D' },
        { id: 4, content: 'Item E' },
        { id: 5, content: 'Item F' },
        { id: 6, content: 'Item G' },
        { id: 7, content: 'Item H' },
      ],
    },
    {
      label: 'A',
      colour: '#ffc07f',
      items: [
        { id: 11, content: 'Item L' },
        { id: 12, content: 'Item M' },
        { id: 13, content: 'Item N' },
        { id: 14, content: 'Item O' },
        { id: 15, content: 'Item P' },
        { id: 16, content: 'Item Q' },
        { id: 17, content: 'Item R' },
      ],
    },
  ],
  unrankedItems: [
    { id: 0, content: 'Item A' },
    { id: 8, content: 'Item I' },
    { id: 9, content: 'Item J' },
    { id: 10, content: 'Item K' },
  ],
};
