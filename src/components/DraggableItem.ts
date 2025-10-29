import type { TierItem } from '../types';

export default function createDraggableItem(tierItem: TierItem) {
  const draggableItem = document.createElement('div');
  draggableItem.classList.add('draggable-item');
  draggableItem.textContent = tierItem.content;

  return draggableItem;
}
