import { icon } from './icons.js';

const ITEMS = [
  ['office', 'office', 'OFFICE'],
  ['city', 'city', 'CITY'],
  ['market', 'market', 'TRADE'],
  ['company', 'company', 'COMPANY'],
  ['inventory', 'inventory', 'GEAR'],
];

export function renderNav(state) {
  return `<nav class="bottom-nav">${ITEMS.map(([view, glyph, label]) => `
    <button class="nav-button ${view === 'market' ? 'market-nav' : ''} ${state.view === view ? 'active' : ''}" data-view="${view}">
      <span class="nav-icon">${icon(glyph)}</span><span>${label}</span>
    </button>`).join('')}</nav>`;
}
