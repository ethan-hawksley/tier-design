import type { Tier } from '../types';
import createDraggableItem from './DraggableItem.ts';

export default function createTierRow(tier: Tier) {
  const tierRow = document.createElement('div');
  tierRow.classList.add('tier-row');

  for (const tierItem of tier.items) {
    const draggableItem = createDraggableItem(tierItem);
    tierRow.append(draggableItem);
  }

  return tierRow;
}
