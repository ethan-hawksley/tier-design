import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';
import createUnrankedItemsRow from './components/UnrankedItemsRow.ts';
import './style.css';

function render() {
  console.log('Rendering Tier List');
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
  document.getElementById('tier-rows')!.replaceChildren(tierRowsFrag);

  const unrankedItemsRow = createUnrankedItemsRow(state.unrankedItems);
  document
    .getElementById('unranked-item-row')!
    .replaceChildren(unrankedItemsRow);
}

render();
