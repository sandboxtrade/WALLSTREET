import { state } from './js/core/state.js';
import { $, $$, escapeHTML } from './js/core/dom.js';
import { renderHUD, updateHUDLive } from './js/components/hud.js';
import { renderNav } from './js/components/nav.js';
import { renderOverlay } from './js/components/overlay.js';
import { renderOffice, updateOfficeLive } from './js/views/office.js';
import { renderMarket } from './js/views/market.js';
import { renderFinance } from './js/views/finance.js';
import { renderCompany } from './js/views/company.js';
import { renderCity } from './js/views/city.js';
import { renderInventory } from './js/views/inventory.js';
import { tickWorld } from './js/systems/world.js';
import { startWeather, stopWeather } from './js/systems/weather.js';
import { startCRT, stopCRT } from './js/systems/crt.js';
import { tickMarket, executeTrade } from './js/systems/marketEngine.js';
import { drawMarketChart, updateMarketLive } from './js/systems/marketChart.js';
import { loadState, saveState } from './js/systems/storage.js';

const VIEWS = {
  office: renderOffice,
  market: renderMarket,
  finance: renderFinance,
  company: renderCompany,
  city: renderCity,
  inventory: renderInventory,
};

function render() {
  stopViewSystems();
  const viewRenderer = VIEWS[state.view] || VIEWS.office;
  $('#root').innerHTML = `<div class="app-shell"><div class="app-main">${renderHUD(state)}${viewRenderer(state)}</div>${renderNav(state)}${renderOverlay(state)}</div>`;
  bindUI();
  startViewSystems();
  updateLiveDOM();
}

function bindUI() {
  $$('[data-view]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view)));
  $$('[data-action]').forEach((button) => button.addEventListener('click', (event) => {
    if (button.dataset.action === 'close-overlay' && event.target !== button && !event.target.matches('[data-action="close-overlay"]')) return;
    handleAction(button.dataset.action);
  }));
  $$('[data-trade]').forEach((button) => button.addEventListener('click', () => {
    executeTrade(state, Number(button.dataset.trade), Number($('#tradeSize')?.value || .1));
    updateMarketLive(state);
  }));
  const chatForm = $('#chatForm');
  if (chatForm) chatForm.addEventListener('submit', (event) => {
    event.preventDefault(); const input = $('#chatInput'); const message = input?.value.trim();
    if (!message) return; state.chat.push(['You', escapeHTML(message)]); input.value = ''; render();
  });
}

function navigate(view) {
  if (!VIEWS[view]) return;
  state.view = view;
  state.ui.overlay = null;
  window.scrollTo({ top: 0, behavior: state.ui.reducedMotion ? 'auto' : 'smooth' });
  render();
}

function handleAction(action) {
  if (['news','analyst','risk','phone','achievements','lounge','nextMarket','settings'].includes(action)) {
    state.ui.overlay = action;
    render();
    return;
  }
  if (action === 'close-overlay') { state.ui.overlay = null; render(); return; }
  if (action === 'deposit') {
    state.player.sol += 1;
    state.transactions.unshift(['Deposit','Demo wallet','+1.00 SOL','green']);
    saveState(state); render(); return;
  }
  if (action === 'withdraw') {
    state.player.sol = Math.max(0, state.player.sol - 1);
    state.transactions.unshift(['Withdrawal','Demo wallet','-1.00 SOL','red']);
    saveState(state); render(); return;
  }
  if (action === 'toggle-motion') { state.ui.reducedMotion = !state.ui.reducedMotion; saveState(state); render(); return; }
  if (action === 'toggle-crt') { state.ui.crtEffects = !state.ui.crtEffects; saveState(state); render(); return; }
  if (action === 'toggle-sound') { state.ui.sound = !state.ui.sound; saveState(state); render(); }
}

function startViewSystems() {
  if (state.view === 'office') {
    if (!state.ui.reducedMotion) startWeather(state);
    if (state.ui.crtEffects) startCRT(state);
  }
  if (state.view === 'market') drawMarketChart(state);
}

function stopViewSystems() {
  stopWeather();
  stopCRT();
}

function updateLiveDOM() {
  updateHUDLive(state);
  if (state.view === 'office') updateOfficeLive(state);
  if (state.view === 'market') updateMarketLive(state);
}

function gameTick() {
  tickWorld(state);
  tickMarket(state);
  updateLiveDOM();
}

function init() {
  loadState(state);
  render();
  setInterval(gameTick, 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopViewSystems(); else startViewSystems();
  });
}

init();
