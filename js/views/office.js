import { icon } from '../components/icons.js';
import { OFFICE_OBJECTS } from '../data/officeObjects.js';
import { formatDuration } from '../core/format.js';

function skylineBuildings() {
  const buildings = [
    ['back', 2, 28, 14, ''], ['back', 18, 48, 16, 'tower'], ['back', 36, 36, 13, ''], ['back', 51, 55, 17, 'tower'], ['back', 72, 42, 13, ''], ['back', 86, 62, 13, 'tower'],
    ['mid', 6, 28, 16, ''], ['mid', 26, 51, 17, 'tower'], ['mid', 47, 35, 15, ''], ['mid', 64, 58, 18, 'tower'], ['mid', 84, 43, 14, ''],
    ['front', 0, 30, 22, ''], ['front', 25, 43, 19, ''], ['front', 51, 31, 21, ''], ['front', 76, 46, 24, ''],
  ];
  return ['back','mid','front'].map((layer) => `<div class="city-layer ${layer}">${buildings.filter((b)=>b[0]===layer).map(([,left,height,width,klass]) => `<i class="skyline-building ${klass}" style="left:${left}%;height:${height}%;width:${width}%"></i>`).join('')}</div>`).join('');
}

function character(className, extra = '') {
  return `<div class="character ${className}"><span class="chair"></span><span class="head"></span><span class="torso"></span><span class="arm a1"></span><span class="arm a2"></span>${extra}</div>`;
}

function hotspot(object) {
  return `<div class="hotspot-anchor ${object.className}"><button class="hotspot" ${object.view ? `data-view="${object.view}"` : `data-action="${object.action}"`}><span class="hotspot-icon">${icon(object.icon)}</span><span class="hotspot-copy"><strong>${object.label}</strong><span>${object.subtitle}</span></span></button></div>`;
}

export function renderOffice(state) {
  const next = state.markets.next;
  return `<section class="office-wrap"><div class="office-scene" id="officeScene">
    <div class="wall"></div><div class="brick-left"></div>
    <div class="city-window" id="cityWindow">${skylineBuildings()}<span class="neon-sign nyse">NYSE</span><span class="neon-sign dow">DOW</span><canvas id="weatherCanvas" class="weather-canvas"></canvas><span class="window-frame-v v1"></span><span class="window-frame-v v2"></span><span class="window-frame-h"></span></div>
    <div class="window-ledge"></div><div class="office-floor"></div>
    <div class="shelf"></div><div class="poster good">GOOD<br>TRADES<br>BETTER<br>HUMANS</div><div class="poster discipline">DISCIPLINE<br>PAYS</div>
    <div class="news-tv"><div class="news-tv-screen"><span class="news-anchor"></span><b class="news-live">LIVE</b><div class="news-lower">MARKET NEWS<br>TECH STOCKS SURGE</div><div class="news-ticker"><span>PIT #184 OPENS SOON · VOLUME WATCH · CLOSING BELL IN FOCUS · </span></div></div></div>
    <div class="phone-table"></div><div class="phone-prop"></div>
    <div class="cabinet c1"></div><div class="cabinet c2"></div>
    <div class="trading-desk"></div><div class="side-desk left"></div><div class="side-desk right"></div>
    <div class="monitor-shell m1"><canvas class="crt-screen" data-crt="line"></canvas><span class="scanlines"></span></div>
    <div class="monitor-shell m2"><canvas class="crt-screen" data-crt="candles"></canvas><span class="scanlines"></span></div>
    <div class="monitor-shell m3"><canvas class="crt-screen" data-crt="flow"></canvas><span class="scanlines"></span></div>
    <div class="monitor-shell m4"><canvas class="crt-screen" data-crt="ticker"></canvas><span class="scanlines"></span></div>
    <div class="monitor-shell m5"><canvas class="crt-screen" data-crt="risk"></canvas><span class="scanlines"></span></div>
    <div class="side-monitor analyst"><canvas data-crt="analysis"></canvas></div><div class="side-monitor risk"><canvas data-crt="risk"></canvas></div>
    <span class="desk-paper p1"></span><span class="desk-paper p2"></span><span class="coffee c1"></span><span class="coffee c2"></span><span class="desk-lamp l1"></span><span class="desk-lamp l2"></span>
    ${character('trader')}${character('analyst')}${character('risk')}${character('phone-worker')}${character('newspaper','<span class="paper"></span>')}
    <div class="lounge-sofa"></div><div class="coffee-table"></div><div class="finance-zone"></div>
    <div class="rug">SAME GAME<br>DIFFERENT HUNGER</div>
    <div class="exit-zone"><span class="exit-sign">EXIT</span><span class="exit-door"></span></div><div class="wall-art">WALL STREET</div>
    <span class="plant p1"></span><span class="plant p2"></span><span class="plant p3"></span><span class="plant p4"></span><span class="black-cat"></span>
    <div class="hotspot-anchor hs-next"><button class="hotspot next-market-card" data-action="nextMarket"><span class="eyebrow">NEXT MARKET</span><span class="market-name">${next.id}</span><b id="nextMarketCountdown" class="countdown">${formatDuration(next.secondsToOpen)}</b><span class="chev">›</span></button></div>
    ${OFFICE_OBJECTS.map(hotspot).join('')}
  </div></section>`;
}

export function updateOfficeLive(state) {
  const el = document.querySelector('#nextMarketCountdown');
  if (el) el.textContent = formatDuration(state.markets.next.secondsToOpen);
}
