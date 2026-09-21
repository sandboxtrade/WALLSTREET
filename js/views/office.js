import { icon } from '../components/icons.js';
import { OFFICE_OBJECTS } from '../data/officeObjects.js';
import { formatDuration } from '../core/format.js';

function hotspot(object) {
  const target = object.view ? `data-view="${object.view}"` : `data-action="${object.action}"`;
  return `<div class="hotspot-anchor ${object.className}">
    <button class="hotspot" ${target} aria-label="${object.label}: ${object.subtitle}">
      <span class="hotspot-icon">${icon(object.icon)}</span>
      <span class="hotspot-copy"><strong>${object.label}</strong><span>${object.subtitle}</span></span>
    </button>
  </div>`;
}

function asset(path, className, alt = '') {
  return `<img class="office-asset ${className}" src="./assets/${path}" alt="${alt}" draggable="false">`;
}

function staff(path, className, label) {
  return `<span class="staff-sprite ${className}" style="--staff-image:url('./assets/characters/${path}.png')" role="img" aria-label="${label}"></span>`;
}

function screen(className, mode) {
  return `<div class="asset-screen ${className}" aria-hidden="true"><canvas class="crt-screen" data-crt="${mode}"></canvas><span class="screen-glass"></span></div>`;
}

export function renderOffice(state) {
  const next = state.markets.next;

  return `<section class="office-wrap">
    <div class="office-scene" id="officeScene">
      <img class="office-base" src="./assets/office/office_base.jpg" alt="Raven Capital office" draggable="false">

      <div class="window-weather" aria-hidden="true">
        <canvas id="weatherCanvas" class="weather-canvas"></canvas>
        <span class="window-reflection"></span>
      </div>

      <div class="scene-light light-window" aria-hidden="true"></div>
      <div class="scene-light light-trading" aria-hidden="true"></div>
      <div class="scene-light light-left" aria-hidden="true"></div>
      <div class="scene-light light-right" aria-hidden="true"></div>
      <div class="scene-light light-exit" aria-hidden="true"></div>

      ${asset('furniture/tv_block.png', 'asset-tv')}
      ${asset('furniture/trading_desk.png', 'asset-trading-desk')}
      ${asset('furniture/analyst_desk.png', 'asset-analyst-desk')}
      ${asset('furniture/risk_desk.png', 'asset-risk-desk')}
      ${asset('furniture/lounge.png', 'asset-lounge')}
      ${asset('furniture/finance_desk.png', 'asset-finance-desk')}
      ${asset('furniture/exit_zone.png', 'asset-exit')}

      ${asset('props/cat.png', 'asset-cat')}
      ${asset('props/newspapers.png', 'asset-newspapers')}

      ${staff('newspaper_worker', 'staff-news', 'News employee')}
      ${staff('phone_worker', 'staff-phone', 'Phone employee')}
      ${staff('trader', 'staff-trader', 'Trader')}
      ${staff('analyst', 'staff-analyst', 'Analyst')}
      ${staff('analyst', 'staff-risk staff-risk-placeholder', 'Risk manager placeholder')}

      ${screen('screen-tv', 'ticker')}

      ${screen('screen-trade-1', 'line')}
      ${screen('screen-trade-2', 'analysis')}
      ${screen('screen-trade-3', 'candles')}
      ${screen('screen-trade-4', 'flow')}
      ${screen('screen-trade-5', 'risk')}

      ${screen('screen-analyst-1', 'analysis')}
      ${screen('screen-analyst-2', 'candles')}
      ${screen('screen-analyst-3', 'flow')}

      ${screen('screen-risk-1', 'risk')}
      ${screen('screen-risk-2', 'line')}
      ${screen('screen-risk-3', 'flow')}

      ${screen('screen-finance-1', 'ticker')}
      ${screen('screen-finance-2', 'analysis')}

      <div class="tv-news-copy" aria-hidden="true">
        <b>LIVE</b>
        <span>MARKET NEWS</span>
        <strong>TECH STOCKS SURGE</strong>
        <i>PIT #184 · FLOW WATCH · CLOSING BELL</i>
      </div>

      <div class="next-market-anchor hs-next">
        <button class="next-market-card" data-action="nextMarket">
          <span class="eyebrow">NEXT MARKET</span>
          <span class="market-name">${next.id}</span>
          <b id="nextMarketCountdown" class="countdown">${formatDuration(next.secondsToOpen)}</b>
          <span class="market-meta">${next.players}/${next.capacity} FIRMS · ${next.durationMinutes} MIN</span>
          <span class="chev">›</span>
        </button>
      </div>

      ${OFFICE_OBJECTS.map(hotspot).join('')}
      <div class="scene-vignette" aria-hidden="true"></div>
    </div>
  </section>`;
}

export function updateOfficeLive(state) {
  const el = document.querySelector('#nextMarketCountdown');
  if (el) el.textContent = formatDuration(state.markets.next.secondsToOpen);
}
