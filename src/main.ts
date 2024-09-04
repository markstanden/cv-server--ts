import './tailwind/tailwind.css';
import { renderPage } from './frontend/renderPage/renderPage';

const app = document.getElementById('app')!;

addEventListener('DOMContentLoaded', async () => {
    const key = window.location.pathname.split('/')[1];
    renderPage(app, key);
});
