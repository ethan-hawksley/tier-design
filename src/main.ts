import { toBlob } from 'html-to-image';
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

function addToArray<T>(arr: T[], item: T) {
  return [...arr, item];
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

const tierListElement = $('#tier-list');
const saveButton = $('#save-button');
const copyButton = $('#copy-button');
const tierListTitle = $('#tier-list-title');
const tierListContainer = $('#tier-list-container');
const unrankedItemsContainer = $('#unranked-items-container');
const addTextButton = $('#add-text-button');
const addImagesButton = $('#add-images-button');
const imagesInput = $('#images-input') as HTMLInputElement;
const addTierButton = $('#add-tier-button');

function render() {
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
        for (const item of tier.items) {
          if ('src' in item) {
            URL.revokeObjectURL(item.src);
          }
        }
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
      updatedTargetTierItems = addToArray(targetTier.items, tierItem);
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
      state.unrankedItems = addToArray(state.unrankedItems, tierItem);
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
    0
  );
  const maxIdInUnranked = getMaxId(state.unrankedItems);
  return Math.max(maxIdInTiers, maxIdInUnranked) + 1;
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Failed to read file as data URL'));
    };
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

addTextButton.addEventListener('click', () => {
  const text = prompt('Enter text:');
  if (text) {
    const newItem: TierItem = {
      id: getNextItemId(),
      type: 'text',
      text: text,
    };
    state.unrankedItems = addToArray(state.unrankedItems, newItem);
    render();
  }
});

addImagesButton.addEventListener('click', () => {
  imagesInput.click();
});

imagesInput.addEventListener('change', async () => {
  if (!imagesInput.files) return;

  for (const file of imagesInput.files) {
    try {
      const dataUrl = await fileToDataUrl(file);
      const tierItem: TierItem = {
        id: getNextItemId(),
        type: 'image',
        src: dataUrl,
      };
      state.unrankedItems = addToArray(state.unrankedItems, tierItem);
    } catch (e) {
      console.error('Failed to load image file:', e);
    }
  }
  imagesInput.value = '';
  render();
});

function getNextTierId() {
  const maxId = state.tiers.reduce(
    (currentMax, tier) => Math.max(currentMax, tier.id),
    0
  );
  return maxId + 1;
}

addTierButton.addEventListener('click', () => {
  const label = prompt('Enter label:');
  if (!label) return;
  const colour = prompt('Enter colour code:');
  if (!colour) return;
  const newTier: Tier = {
    id: getNextTierId(),
    label,
    colour,
    items: [],
  };
  state.tiers = addToArray(state.tiers, newTier);
  render();
});

function safeFileName(name: string) {
  return name;
}

async function renderTierListToBlob() {
  const isTitleFocused = document.activeElement === tierListTitle;
  if (isTitleFocused) {
    tierListTitle.blur();
  }

  const backgroundColour = getComputedStyle(tierListElement).backgroundColor;

  const blob = await toBlob(tierListElement, {
    backgroundColor: backgroundColour,
    cacheBust: true,
    pixelRatio: 2,
    width: tierListElement.scrollWidth,
    height: tierListElement.scrollHeight,
  });

  if (!blob) throw new Error('Failed to render tier list as blob');
  return blob;
}

saveButton.addEventListener('click', async () => {
  try {
    const blob = await renderTierListToBlob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeFileName(tierListTitle.textContent);
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error('Error saving tier list:', e);
  }
});

copyButton.addEventListener('click', async () => {
  try {
    const blob = await renderTierListToBlob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob,
      }),
    ]);
  } catch (e) {
    console.error('Error copying tier list:', e);
  }
});

tierListElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

unrankedItemsContainer.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

render();
