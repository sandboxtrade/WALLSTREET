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

function staffSprite(name, className) {
  return `<span class="staff-sprite ${className}" style="--staff-image:url('./assets/characters/${name}.png')" aria-hidden="true"></span>`;
}

export function renderOffice(state) {
  const next = state.markets.next;
  return `<section class="office-wrap">
    <div class="office-scene" id="officeScene">
      <img class="office-art pixel-crisp" src="./assets/office/office_base.png" alt="" draggable="false" />

      <div class="window-atmosphere" aria-hidden="true">
        <canvas id="weatherCanvas" class="weather-canvas"></canvas>
        <span class="window-glass"></span>
      </div>

      <div class="ambient-light city-light" aria-hidden="true"></div>
      <div class="ambient-light desk-light-left" aria-hidden="true"></div>
      <div class="ambient-light desk-light-right" aria-hidden="true"></div>
      <div class="ambient-light exit-light" aria-hidden="true"></div>

      <div class="monitor-shell m1"><canvas class="crt-screen" data-crt="analysis"></canvas><span class="scanlines"></span></div>
      <div class="monitor-shell m2"><canvas class="crt-screen" data-crt="candles"></canvas><span class="scanlines"></span></div>
      <div class="monitor-shell m3"><canvas class="crt-screen" data-crt="flow"></canvas><span class="scanlines"></span></div>
      <div class="monitor-shell m4"><canvas class="crt-screen" data-crt="line"></canvas><span class="scanlines"></span></div>
      <div class="monitor-shell m5"><canvas class="crt-screen" data-crt="risk"></canvas><span class="scanlines"></span></div>

      <div class="tv-overlay" aria-hidden="true">
        <b>LIVE</b><span>MARKET NEWS</span><strong>TECH STOCKS SURGE</strong>
        <i>PIT #184 · FLOW WATCH · CLOSING BELL</i>
      </div>

      ${staffSprite('phone_worker', 'staff-phone')}
      ${staffSprite('newspaper', 'staff-news')}
      ${staffSprite('analyst', 'staff-analyst')}
      ${staffSprite('trader', 'staff-trader')}
      ${staffSprite('risk', 'staff-risk')}

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
