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
      items: [
        { id: 1, type: 'text', text: 'Item B' },
        { id: 2, type: 'text', text: 'Item C' },
        { id: 3, type: 'text', text: 'Item D' },
        { id: 4, type: 'text', text: 'Item E' },
        { id: 5, type: 'text', text: 'Item F' },
        { id: 6, type: 'text', text: 'Item G' },
        { id: 7, type: 'text', text: 'Item H' },
      ],
    },
    {
      id: 1,
      label: 'A',
      colour: '#ffc07f',
      items: [
        { id: 11, type: 'text', text: 'Item L' },
        { id: 12, type: 'text', text: 'Item M' },
        { id: 13, type: 'text', text: 'Item N' },
        { id: 14, type: 'text', text: 'Item O' },
        { id: 15, type: 'text', text: 'Item P' },
        { id: 16, type: 'text', text: 'Item Q' },
        { id: 17, type: 'text', text: 'Item R' },
      ],
    },
  ],
  unrankedItems: [
    { id: 0, type: 'text', text: 'Item A' },
    { id: 8, type: 'text', text: 'Item I' },
    { id: 9, type: 'text', text: 'Item J' },
    { id: 10, type: 'text', text: 'Item K' },
  ],
};
