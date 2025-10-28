import './style.css';
import tierDesignLogo from './tier-design.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
      <img src="${tierDesignLogo}" alt="Tier Design Logo"   />
      <h1 >Tier Design</h1>
      <p >A minimal Vite + TypeScript + Tailwind setup.</p>
  </div>
`;
