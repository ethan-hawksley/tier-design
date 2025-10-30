import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';
import createUnrankedItemsRow from './components/UnrankedItemsRow.ts';
import './style.css';
import type { TierItem } from './types';

function $(selector: string) {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error('Element cannot be found');
  }
  return element;
}

function insertAtPosition<T>(arr: T[], item: T, index: number): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index)];
}

function replaceAtPosition<T>(arr: T[], item: T, index: number): T[] {
  return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
}

function removeAtPosition<T>(arr: T[], index: number): T[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
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
    const tierRow = createTierRow(
      tier,
      (updatedTier) => {
        state.tiers = replaceAtPosition(state.tiers, updatedTier, i);
        render();
      },
      () => {
        console.log('removing');
        state.tiers = removeAtPosition(state.tiers, i);
        render();
      }
    );
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
    state.tiers = replaceAtPosition(
      state.tiers,
      updatedSourceTier,
      sourceTierIndex
    );
  } else {
    state.unrankedItems = state.unrankedItems.filter(
      (item) => item.id !== itemId
    );
  }

  if (targetTierIndex >= 0) {
    const targetTier = state.tiers[targetTierIndex];
    let updatedTargetTierItems: TierItem[];
    if (closestDraggableItem?.classList.contains('draggable-item')) {
      const targetTierItemId = Number(closestDraggableItem.dataset.id);
      const targetTierItemIndex = targetTier.items.findIndex(
        (item) => item.id === targetTierItemId
      );
      const boundingClientRect = closestDraggableItem.getBoundingClientRect();
      const isLeftSide =
        e.clientX < boundingClientRect.x + boundingClientRect.width / 2;
      if (isLeftSide) {
        updatedTargetTierItems = insertAtPosition(
          targetTier.items,
          tierItem,
          targetTierItemIndex
        );
      } else {
        updatedTargetTierItems = insertAtPosition(
          targetTier.items,
          tierItem,
          targetTierItemIndex + 1
        );
      }
    } else {
      updatedTargetTierItems = [...targetTier.items, tierItem];
    }
    const updatedTargetTier = {
      ...targetTier,
      items: updatedTargetTierItems,
    };
    state.tiers = replaceAtPosition(
      state.tiers,
      updatedTargetTier,
      targetTierIndex
    );
  } else {
    if (closestDraggableItem?.classList.contains('draggable-item')) {
      const targetItemId = Number(closestDraggableItem.dataset.id);
      const targetItemIndex = state.unrankedItems.findIndex(
        (item) => item.id === targetItemId
      );
      const boundingClientRect = closestDraggableItem.getBoundingClientRect();
      const isLeftSide =
        e.clientX < boundingClientRect.x + boundingClientRect.width / 2;
      if (isLeftSide) {
        state.unrankedItems = insertAtPosition(
          state.unrankedItems,
          tierItem,
          targetItemIndex
        );
      } else {
        state.unrankedItems = insertAtPosition(
          state.unrankedItems,
          tierItem,
          targetItemIndex + 1
        );
      }
    } else {
      state.unrankedItems = [...state.unrankedItems, tierItem];
    }
  }

  render();
});

function getMaxId(items: TierItem[]) {
  return items.reduce((maxId, item) => Math.max(item.id, maxId), -Infinity);
}

function getNextItemId() {
  const maxIdInTiers = state.tiers.reduce(
    (currentMax, tier) => Math.max(getMaxId(tier.items), currentMax),
    -Infinity
  );
  const maxIdInUnranked = getMaxId(state.unrankedItems);
  return Math.max(maxIdInTiers, maxIdInUnranked) + 1;
}

addTextButton.addEventListener('click', () => {
  const text = prompt('Enter text:');
  if (text) {
    const newItem: TierItem = {
      id: getNextItemId(),
      type: 'text',
      text: text,
    };
    state.unrankedItems = [...state.unrankedItems, newItem];
    render();
  }
});

// TODO: Implement image uploading
addImagesButton.addEventListener('click', () => {
  const text = prompt('Enter text:');
  if (text) {
    const newItem: TierItem = {
      id: getNextItemId(),
      type: 'text',
      text: text,
    };
    state.unrankedItems = [...state.unrankedItems, newItem];
    render();
  }
});

render();
