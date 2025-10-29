import type { Tier } from '../types';
import createDraggableItem from './DraggableItem.ts';

export default function createTierRow(
  tier: Tier,
  onUpdate: (updatedTier: Tier) => void
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

  const rankedItemsRow = document.createElement('div');
  rankedItemsRow.classList.add('ranked-items-row');
  for (const tierItem of tier.items) {
    const draggableItem = createDraggableItem(tierItem);
    rankedItemsRow.append(draggableItem);
  }

  tierRow.append(tierLabel, rankedItemsRow);
  return tierRow;
}
