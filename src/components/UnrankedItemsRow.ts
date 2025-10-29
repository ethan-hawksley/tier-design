import type { TierItem } from '../types';
import createDraggableItem from './DraggableItem.ts';

export default function createUnrankedItemsRow(tierItems: TierItem[]) {
  const unrankedItemsRow = document.createElement('div');
  unrankedItemsRow.classList.add('unranked-items-row');
  unrankedItemsRow.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  for (const tierItem of tierItems) {
    const draggableItem = createDraggableItem(tierItem);
    unrankedItemsRow.append(draggableItem);
  }

  return unrankedItemsRow;
}
