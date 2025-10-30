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
        { id: 1, type: 'text', text: 'Item 1' },
        { id: 2, type: 'text', text: 'Item 2' },
        { id: 3, type: 'text', text: 'Item 3' },
        { id: 4, type: 'text', text: 'Item 4' },
        { id: 5, type: 'text', text: 'Item 5' },
        { id: 6, type: 'text', text: 'Item 6' },
        { id: 7, type: 'text', text: 'Item 7' },
      ],
    },
    {
      id: 1,
      label: 'A',
      colour: '#ffc07f',
      items: [
        { id: 11, type: 'text', text: 'Item 11' },
        { id: 12, type: 'text', text: 'Item 12' },
        { id: 13, type: 'text', text: 'Item 13' },
        { id: 14, type: 'text', text: 'Item 14' },
        { id: 15, type: 'text', text: 'Item 15' },
        { id: 16, type: 'text', text: 'Item 16' },
        { id: 17, type: 'text', text: 'Item 17' },
      ],
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
  unrankedItems: [
    { id: 0, type: 'text', text: 'Item 0' },
    { id: 8, type: 'text', text: 'Item 8' },
    { id: 9, type: 'text', text: 'Item 9' },
    { id: 10, type: 'text', text: 'Item 10' },
  ],
};
