import './style.css';
import tierDesignLogo from './tier-design.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="min-h-screen bg-red-50 flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
      <img src="${tierDesignLogo}" alt="Tier Design Logo" class="mx-auto h-24 w-24 mb-4" />
      <h1 class="text-3xl font-extrabold text-sky-600 mb-2">Tier Design</h1>
      <p class="text-gray-600">A minimal Vite + TypeScript + Tailwind setup.</p>
    </div>
  </div>
`;
