import type { Tier } from '../types';
import createDraggableItem from './DraggableItem.ts';

export default function createTierRow(
  tier: Tier,
  onUpdate: (updatedTier: Tier) => void,
  onRemove: () => void
) {
  const tierRow = document.createElement('div');
  tierRow.classList.add('tier-row');

  const tierLabel = document.createElement('input');
  tierLabel.classList.add('tier-label');
  tierLabel.style.backgroundColor = tier.colour;
  tierLabel.value = tier.label;
  tierLabel.addEventListener('change', () => {
    const updatedTier: Tier = { ...tier, label: tierLabel.value };
    onUpdate(updatedTier);
  });
  tierLabel.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    onRemove();
  });

  const rankedItemsRow = document.createElement('div');
  rankedItemsRow.classList.add('ranked-items-row');
  rankedItemsRow.dataset.id = tier.id.toString();
  rankedItemsRow.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  for (let i = 0; i < tier.items.length; i++) {
    const tierItem = tier.items[i];
    const draggableItem = createDraggableItem(tierItem, () => {
      const updatedTier: Tier = {
        ...tier,
        items: tier.items.filter((item) => item.id !== tierItem.id),
      };
      onUpdate(updatedTier);
    });
    rankedItemsRow.append(draggableItem);
  }

  tierRow.append(tierLabel, rankedItemsRow);
  return tierRow;
}
