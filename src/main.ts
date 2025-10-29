import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';
import createUnrankedItemsRow from './components/UnrankedItemsRow.ts';
import './style.css';

const tierListTitle = document.getElementById('tier-list-title')!;
const tierListContainer = document.getElementById('tier-list-container')!;
const unrankedItemsContainer = document.getElementById(
  'unranked-items-container'
)!;

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

  const unrankedItemsRow = createUnrankedItemsRow(state.unrankedItems);
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

  const dropZone = target.closest('.ranked-items-row, #unranked-items-row');
  if (!dropZone) return;
  console.log(dropZone);
});
render();
