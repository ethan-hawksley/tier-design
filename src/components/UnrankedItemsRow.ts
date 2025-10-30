import type { TierItem } from '../types';
import createDraggableItem from './DraggableItem.ts';

export default function createUnrankedItemsRow(
  tierItems: TierItem[],
  onUpdate: (updatedUnrankedItems: TierItem[]) => void
) {
  const unrankedItemsRow = document.createElement('div');
  unrankedItemsRow.classList.add('unranked-items-row');
  unrankedItemsRow.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  for (let i = 0; i < tierItems.length; i++) {
    const tierItem = tierItems[i];
    const draggableItem = createDraggableItem(tierItem, () => {
      const updatedUnrankedItems = tierItems.filter(
        (item) => item.id !== tierItem.id
      );
      onUpdate(updatedUnrankedItems);
    });
    unrankedItemsRow.append(draggableItem);
  }

  return unrankedItemsRow;
}
