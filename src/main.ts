import './style.css';
import tierDesignLogo from './tier-design.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Tier Design</h1>
    <img src="${tierDesignLogo}" alt="Tier Design Logo">
  </div>
`;
