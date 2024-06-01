import './tailwind/tailwind.css';
import { tw } from './tailwind/tw/tw.ts';

addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app')!;

    app.innerHTML = `
      <div class="${tw`w-20 border-2 border-red-700 px-2 py-1 text-center text-red-700`}">
        Test
      </div>
`;

    const res = await fetch('/full');
    const json = await res.json();
    console.log(json);
});
