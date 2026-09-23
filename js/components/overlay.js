import { escapeHTML } from '../core/dom.js';
import { sessionPnl } from '../systems/marketEngine.js';

export function renderOverlay(state) {
  const type = state.ui.overlay;
  if (!type) return '';

  const body = overlayBody(type, state);
  return `<div class="overlay-backdrop" data-action="close-overlay">
    <section class="overlay-panel" role="dialog" aria-modal="true" aria-label="${escapeHTML(type)}">
      <div class="overlay-head"><h2>${overlayTitle(type)}</h2><button class="icon-button" data-action="close-overlay" aria-label="Close">×</button></div>
      ${body}
    </section>
  </div>`;
}

function overlayTitle(type) {
  return ({
    settings: 'SETTINGS', phone: 'PHONE', analyst: 'ANALYST DESK', risk: 'RISK MANAGER',
    achievements: 'FIRM HISTORY', lounge: 'LOUNGE', nextMarket: 'NEXT MARKET', news: 'THE WALL STREET TIMES',
  })[type] || escapeHTML(type.toUpperCase());
}

function overlayBody(type, state) {
  if (type === 'news') return `<div class="news-sheet"><h3>THE WALL STREET TIMES</h3><div class="rule"></div><b>TECH STOCKS SURGE AS VOLUME SPIKES</b><p>Late buying pressure pushed the active pit higher before the closing bell. Raven Capital returns to the office as the next NASDAQ session approaches.</p><div class="rule"></div><p><b>ROOM WATCH:</b> Traders remain divided. Several firms are carrying aggressive exposure into the final minutes.</p></div>`;
  if (type === 'analyst') return `<div class="info-grid"><div class="info-cell"><small>BUY FLOW</small><b class="green">52%</b></div><div class="info-cell"><small>SELL FLOW</small><b class="red">48%</b></div><div class="info-cell"><small>LARGE ORDERS</small><b>3</b></div><div class="info-cell"><small>FLOW STATE</small><b>BALANCED</b></div></div><p class="muted micro">Analyst provides information, not trade signals.</p>`;
  if (type === 'risk') {
    const total = sessionPnl(state);
    return `<div class="info-grid"><div class="info-cell"><small>POSITION</small><b>${state.market.position === 0 ? 'FLAT' : `${Math.abs(state.market.position).toFixed(2)} ${state.market.position > 0 ? 'LONG' : 'SHORT'}`}</b></div><div class="info-cell"><small>SESSION P&L</small><b class="${total >= 0 ? 'green':'red'}">${total.toFixed(3)} SOL</b></div><div class="info-cell"><small>MARKET DEPTH</small><b>${state.market.depth.toFixed(2)}</b></div><div class="info-cell"><small>LAST FLOW</small><b>${state.market.lastFlow >= 0 ? '+' : ''}${state.market.lastFlow.toFixed(2)}</b></div></div>`;
  }
  if (type === 'phone') return `<div class="card"><div class="row"><div><b>NovaFund</b><div class="muted micro">Market invite · 2m ago</div></div><button class="btn" disabled>SOON</button></div></div><div class="card"><div class="row"><div><b>WolfCapital</b><div class="muted micro">“Pit opens soon.”</div></div><button class="btn" disabled>SOON</button></div></div>`;
  if (type === 'achievements') return `<div class="info-grid"><div class="info-cell"><small>SESSIONS</small><b>41</b></div><div class="info-cell"><small>BEST PAYOUT</small><b>+3.82 SOL</b></div><div class="info-cell"><small>FIRM LVL</small><b>3</b></div><div class="info-cell"><small>TROPHIES</small><b>7</b></div></div>`;
  if (type === 'lounge') return `<div class="card"><b class="card-title">LOUNGE</b><p class="muted micro">A social space for staff and future visitors. No gameplay bonus is attached to resting here.</p></div>`;
  if (type === 'nextMarket') {
    const next = state.markets.next;
    const ready = next.secondsToOpen <= 0 && state.market.status !== 'active';
    const buttonText = ready ? 'ENTER MARKET' : (next.secondsToOpen <= 0 ? 'WAITING FOR CURRENT SESSION' : 'MARKET NOT OPEN YET');
    return `<div class="info-grid"><div class="info-cell"><small>ROOM</small><b>${escapeHTML(next.id)}</b></div><div class="info-cell"><small>PLAYERS</small><b>${next.players}/${next.capacity}</b></div><div class="info-cell"><small>DURATION</small><b>${next.durationMinutes} MIN</b></div><div class="info-cell"><small>BUY-IN</small><b>${next.buyIn.toFixed(2)} SOL</b></div></div><button class="btn gold" ${ready ? 'data-view="market"' : 'disabled'} style="width:100%;margin-top:10px">${buttonText}</button>`;
  }
  if (type === 'settings') return `<div class="card"><div class="tx"><div><b>Ambient animations</b><div class="muted">Weather, staff, CRT movement</div></div><button class="btn" data-action="toggle-motion">${state.ui.reducedMotion ? 'OFF':'ON'}</button></div><div class="tx"><div><b>CRT effects</b><div class="muted">Scanlines and screen glow</div></div><button class="btn" data-action="toggle-crt">${state.ui.crtEffects ? 'ON':'OFF'}</button></div><div class="tx"><div><b>Sound</b><div class="muted">Prepared for later audio system</div></div><button class="btn" data-action="toggle-sound">${state.ui.sound ? 'ON':'OFF'}</button></div></div>`;
  return '';
}
