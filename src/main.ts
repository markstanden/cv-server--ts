import './tailwind/tailwind.css';
import { tw } from './tailwind/tw/tw.ts';
import { getCvFromApi } from './frontend/getCvFromApi.ts';

addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app')!;

    app.innerHTML = `
      <div class="${tw` border-2 border-red-700 px-2 py-1`}">
        ${JSON.stringify(await getCvFromApi('full'), null, 4)} 
      </div>
`;
});
