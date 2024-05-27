import './tailwind.css';
import { tw } from './lib/tw.ts';

document.getElementById('app')!.innerHTML = `
      <div class="${tw`w-20 border-2 border-red-700 px-2 py-1 text-center text-2xl text-red-700`}">
        Test
      </div>
`;
