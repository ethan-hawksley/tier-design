import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';
import createUnrankedItemsRow from './components/UnrankedItemsRow.ts';
import './style.css';

function render() {
  const tierRowsFrag = document.createDocumentFragment();
  for (const tier of state.tiers) {
    const tierRow = createTierRow(tier);
    tierRowsFrag.append(tierRow);
  }
  document.getElementById('tier-rows')!.replaceChildren(tierRowsFrag);

  const unrankedItemsRow = createUnrankedItemsRow(state.unrankedItems);
  document
    .getElementById('unranked-item-row')!
    .replaceChildren(unrankedItemsRow);
}

render();
