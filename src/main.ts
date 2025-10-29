import { state } from './state.ts';
import createTierRow from './components/TierRow.ts';

function render() {
  const frag = document.createDocumentFragment();
  for (const tier of state.tiers) {
    const tierRow = createTierRow(tier);
    frag.append(tierRow);
  }

  document.getElementById('tier-rows')!.replaceChildren(frag);
}

render();
