import type { TierItem } from '../types';

export default function createDraggableItem(
  tierItem: TierItem,
  onContextMenu: () => void
) {
  const draggableItem = document.createElement('div');
  draggableItem.classList.add('draggable-item');
  draggableItem.draggable = true;
  if ('text' in tierItem) {
    draggableItem.textContent = tierItem.text;
    draggableItem.classList.add('draggable-item-text');
  }
  draggableItem.dataset.id = tierItem.id.toString();
  draggableItem.addEventListener('dragstart', (e) => {
    e.dataTransfer!.setData('text', tierItem.id.toString());
  });
  draggableItem.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    onContextMenu();
  });

  return draggableItem;
}
