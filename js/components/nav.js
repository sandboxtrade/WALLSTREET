import { icon } from './icons.js';

const ITEMS = [
  ['office', 'office', 'OFFICE'],
  ['city', 'city', 'CITY'],
  ['market', 'market', 'MARKETS'],
  ['company', 'company', 'COMPANY'],
  ['inventory', 'inventory', 'INVENTORY'],
];

export function renderNav(state) {
  return `<nav class="bottom-nav">${ITEMS.map(([view, glyph, label]) => `
    <button class="nav-button ${view === 'market' ? 'market-nav' : ''} ${state.view === view ? 'active' : ''}" data-view="${view}">
      <span class="nav-icon">${icon(glyph)}</span><span>${label}</span>
    </button>`).join('')}</nav>`;
}
