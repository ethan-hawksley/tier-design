import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';
import createUnrankedItemsRow from './components/UnrankedItemsRow.ts';
import './style.css';
import type { Tier, TierItem } from './types';

function $(selector: string) {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error('Element cannot be found');
  }
  return element;
}

const tierListTitle = $('#tier-list-title');
const tierListContainer = $('#tier-list-container');
const unrankedItemsContainer = $('#unranked-items-container');
const addTextButton = $('#add-text-button');
const addImagesButton = $('#add-images-button');

function render() {
  console.log('Rendering Tier List');
  tierListTitle.textContent = state.title;

  const tierRowsFrag = document.createDocumentFragment();
  for (let i = 0; i < state.tiers.length; i++) {
    const tier = state.tiers[i];
    const tierRow = createTierRow(tier, (updatedTier) => {
      state.tiers = [
        ...state.tiers.slice(0, i),
        updatedTier,
        ...state.tiers.slice(i + 1),
      ];
      render();
    });
    tierRowsFrag.append(tierRow);
  }
  tierListContainer.replaceChildren(tierRowsFrag);

  const unrankedItemsRow = createUnrankedItemsRow(
    state.unrankedItems,
    (updatedUnrankedItems) => {
      state.unrankedItems = updatedUnrankedItems;
      render();
    }
  );
  unrankedItemsContainer.replaceChildren(unrankedItemsRow);
}

tierListTitle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

tierListTitle.addEventListener('blur', () => {
  state.title = tierListTitle.textContent;
  render();
});

const mainDropArea = document.getElementById('app')!;
mainDropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  console.log(e);

  const target = e.target as HTMLElement;
  const dropZone = target.closest(
    '.ranked-items-row, .unranked-items-row'
  ) as HTMLElement | null;
  if (!dropZone) return;

  const itemId = Number(e.dataTransfer!.getData('text'));
  if (Number.isNaN(itemId)) return;

  const sourceTierIndex = state.tiers.findIndex((tier) =>
    tier.items.some((item) => item.id === itemId)
  );
  const targetTierId = Number(dropZone?.dataset.id);
  const targetTierIndex = state.tiers.findIndex(
    (tier) => tier.id === targetTierId
  );

  const tierItem =
    sourceTierIndex >= 0
      ? state.tiers[sourceTierIndex].items.find((item) => item.id === itemId)
      : state.unrankedItems.find((item) => item.id === itemId);

  if (!tierItem) {
    throw new Error('Tier Item unexpectedly missing');
  }

  const closestDraggableItem = target.closest(
    '.draggable-item'
  ) as HTMLElement | null;
  if (closestDraggableItem?.classList.contains('draggable-item')) {
    if (Number(closestDraggableItem?.dataset.id) === itemId) {
      return;
    }
  }

  if (sourceTierIndex >= 0) {
    const sourceTier = state.tiers[sourceTierIndex];
    const updatedSourceTier = {
      ...sourceTier,
      items: sourceTier.items.filter((item) => item.id !== itemId),
    };
    state.tiers = [
      ...state.tiers.slice(0, sourceTierIndex),
      updatedSourceTier,
      ...state.tiers.slice(sourceTierIndex + 1),
    ];
  } else {
    state.unrankedItems = state.unrankedItems.filter(
      (item) => item.id !== itemId
    );
  }

  if (targetTierIndex >= 0) {
    const targetTier = state.tiers[targetTierIndex];
    let updatedTargetTier: Tier;
    if (closestDraggableItem?.classList.contains('draggable-item')) {
      console.log(closestDraggableItem);
      const targetTierItemId = Number(closestDraggableItem.dataset.id);
      console.log(targetTierItemId);
      const targetTierItemIndex = targetTier.items.findIndex(
        (item) => item.id === targetTierItemId
      );
      const boundingClientRect = closestDraggableItem.getBoundingClientRect();
      console.log(boundingClientRect);
      if (e.clientX < boundingClientRect.x + boundingClientRect.width / 2) {
        console.log('left', targetTierItemIndex);
        updatedTargetTier = {
          ...targetTier,
          items: [
            ...targetTier.items.slice(0, targetTierItemIndex),
            tierItem,
            ...targetTier.items.slice(targetTierItemIndex),
          ],
        };
      } else {
        console.log('right', targetTierItemIndex);
        updatedTargetTier = {
          ...targetTier,
          items: [
            ...targetTier.items.slice(0, targetTierItemIndex + 1),
            tierItem,
            ...targetTier.items.slice(targetTierItemIndex + 1),
          ],
        };
      }
    } else {
      updatedTargetTier = {
        ...targetTier,
        items: [...targetTier.items, tierItem],
      };
    }
    state.tiers = [
      ...state.tiers.slice(0, targetTierIndex),
      updatedTargetTier,
      ...state.tiers.slice(targetTierIndex + 1),
    ];
  } else {
    if (closestDraggableItem?.classList.contains('draggable-item')) {
      const targetItemId = Number(closestDraggableItem.dataset.id);
      const targetItemIndex = state.unrankedItems.findIndex(
        (item) => item.id === targetItemId
      );
      const boundingClientRect = closestDraggableItem.getBoundingClientRect();
      if (e.clientX < boundingClientRect.x + boundingClientRect.width / 2) {
        state.unrankedItems = [
          ...state.unrankedItems.slice(0, targetItemIndex),
          tierItem,
          ...state.unrankedItems.slice(targetItemIndex),
        ];
      } else {
        state.unrankedItems = [
          ...state.unrankedItems.slice(0, targetItemIndex + 1),
          tierItem,
          ...state.unrankedItems.slice(targetItemIndex + 1),
        ];
      }
    } else {
      state.unrankedItems = [...state.unrankedItems, tierItem];
    }
  }

  render();
});

function generateNextItemId() {
  return 3;
}

addTextButton.addEventListener('click', () => {
  const text = prompt('Enter text:');
  if (text) {
    const newItem: TierItem = {
      id: generateNextItemId(),
      type: 'text',
      text: text,
    };
    state.unrankedItems = [...state.unrankedItems, newItem];
  }
});

// TODO: Implement image uploading
addImagesButton.addEventListener('click', () => {
  const text = prompt('Enter text:');
  if (text) {
    const newItem: TierItem = {
      id: generateNextItemId(),
      type: 'text',
      text: text,
    };
    state.unrankedItems = [...state.unrankedItems, newItem];
  }
});

render();
