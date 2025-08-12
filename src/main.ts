import './tailwind/tailwind.css';
import { renderPage } from './frontend/renderPage/renderPage';

const app = document.getElementById('app')!;

function createLoader(): HTMLElement {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.setAttribute('aria-busy', 'true');
    loader.setAttribute('aria-live', 'polite');
    loader.className = 'mx-4 py-10';
    loader.innerHTML = `
        <div class="animate-pulse space-y-6">
            <div class="h-8 bg-gray-200 rounded w-1/3"></div>
            <div class="space-y-3">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div class="h-48 bg-gray-200 rounded"></div>
        </div>
    `;
    return loader;
}

addEventListener('DOMContentLoaded', async () => {
    const key = window.location.pathname.split('/')[1];

    // Insert a lightweight skeleton while data loads
    const loader = createLoader();
    app.appendChild(loader);

    let loaded = false;
    try {
        await renderPage(app, key);
        loaded = true;
    } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Failed to load page", err.message, err.stack);
        } else {
          console.error("Failed to load page", err);
        }
        loader.innerHTML = `
    <div class="max-w-xl text-sm text-gray-700 p-4 border-2 rounded-lg mx-auto mt-20">
      <p class="font-medium text-red-800 text-center">Sorry, we couldn't load the page.</p>
      <p class="font-medium text-center">Please refresh or try again in a moment.</p>
    </div>`;
    } finally {
        if (loaded) loader.remove();
    }
});