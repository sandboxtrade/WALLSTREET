import { state } from './js/core/state.js';
import { $, $$ } from './js/core/dom.js';
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
import { enterMarket, executeTrade, tickMarket, tickMarketSchedule } from './js/systems/marketEngine.js';
import { drawMarketChart, updateMarketLive } from './js/systems/marketChart.js';
import { addTransaction } from './js/systems/ledger.js';
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
  const shellClasses = [
    'app-shell',
    state.ui.reducedMotion ? 'motion-off' : '',
    state.ui.crtEffects ? '' : 'crt-off',
  ].filter(Boolean).join(' ');
  $('#root').innerHTML = `<div class="${shellClasses}"><div class="app-main">${renderHUD(state)}${viewRenderer(state)}</div>${renderNav(state)}${renderOverlay(state)}</div>`;
  bindUI();
  startViewSystems();
  updateLiveDOM();

  if (state.ui.overlay) {
    requestAnimationFrame(() => document.querySelector('.overlay-panel [data-action="close-overlay"]')?.focus());
  }
}

function bindUI() {
  $$('[data-view]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.view)));
  $$('[data-action]').forEach((button) => button.addEventListener('click', (event) => {
    if (button.dataset.action === 'close-overlay' && event.target !== button && !event.target.matches('[data-action="close-overlay"]')) return;
    handleAction(button.dataset.action);
  }));
  $$('[data-size]').forEach((button) => button.addEventListener('click', () => {
    const input = $('#tradeSize');
    if (!input) return;
    const available = Math.max(0, Number(document.querySelector('#marketCapital')?.textContent?.split(' ')[0]) || 0);
    input.value = button.dataset.size === 'max' ? Math.max(.01, available).toFixed(2) : button.dataset.size;
  }));
  $$('[data-trade]').forEach((button) => button.addEventListener('click', () => {
    const result = executeTrade(state, Number(button.dataset.trade), Number($('#tradeSize')?.value || .1));
    if (result.ok) saveState(state);
    updateMarketLive(state);
    updateHUDLive(state);
  }));
  const chatForm = $('#chatForm');
  if (chatForm) chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = $('#chatInput');
    const message = input?.value.trim();
    if (!message) return;
    state.chat.push(['You', message.slice(0, 90)]);
    if (state.chat.length > 80) state.chat.shift();
    input.value = '';
    saveState(state);
    render();
  });
}

function navigate(view) {
  if (!VIEWS[view]) return;
  if (view === 'market') enterMarket(state);
  state.view = view;
  state.ui.overlay = null;
  window.scrollTo({ top: 0, behavior: state.ui.reducedMotion ? 'auto' : 'smooth' });
  saveState(state);
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
    state.player.solDelta = 1;
    addTransaction(state, 'Deposit', 'Demo wallet', '+1.00 SOL', 'green');
    saveState(state);
    render();
    return;
  }
  if (action === 'withdraw') {
    const amount = Math.min(1, Math.max(0, state.player.sol));
    if (amount <= 0) return;
    state.player.sol = Math.max(0, state.player.sol - amount);
    state.player.solDelta = -amount;
    addTransaction(state, 'Withdrawal', 'Demo wallet', `-${amount.toFixed(2)} SOL`, 'red');
    saveState(state);
    render();
    return;
  }
  if (action === 'toggle-motion') { state.ui.reducedMotion = !state.ui.reducedMotion; saveState(state); render(); return; }
  if (action === 'toggle-crt') { state.ui.crtEffects = !state.ui.crtEffects; saveState(state); render(); return; }
  if (action === 'toggle-sound') { state.ui.sound = !state.ui.sound; saveState(state); render(); }
}

function startViewSystems() {
  if (state.view === 'office') {
    startWeather(state);
    startCRT(state);
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
  tickMarketSchedule(state);
  const result = state.view === 'market' ? tickMarket(state) : { changed: false, settled: false };
  updateLiveDOM();
  if (result.settled || state.world.tick % 10 === 0) saveState(state);
}

function init() {
  loadState(state);
  render();
  setInterval(gameTick, 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopViewSystems();
      saveState(state);
    } else {
      startViewSystems();
      updateLiveDOM();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !state.ui.overlay) return;
    state.ui.overlay = null;
    render();
  });
  window.addEventListener('beforeunload', () => saveState(state));
}

init();
