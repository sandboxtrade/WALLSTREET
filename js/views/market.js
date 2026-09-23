import { escapeHTML } from '../core/dom.js';
import { formatDuration } from '../core/format.js';
import { availableCapital, sessionPnl } from '../systems/marketEngine.js';

function marketStatusText(m) {
  if (m.status === 'finished') return 'SESSION CLOSED';
  if (m.status === 'open') return 'OPEN FOR ENTRY';
  return 'INTERNAL PVP MARKET';
}

export function renderMarket(state) {
  const m = state.market;
  const side = m.position === 0 ? 'FLAT' : (m.position > 0 ? `LONG ${m.position.toFixed(2)}` : `SHORT ${Math.abs(m.position).toFixed(2)}`);
  const totalPnl = sessionPnl(state);
  const disabled = m.status !== 'active' || !m.joined || m.seconds <= 0;
  const disabledAttr = disabled ? ' disabled' : '';
  const status = marketStatusText(m);
  const capital = availableCapital(state);

  return `<main class="page market-page"><div class="page-head"><div><h1>${escapeHTML(m.id)}</h1><div class="subtitle"><span id="marketRoomStatus">${escapeHTML(status)}</span> · ${m.players}/${m.capacity} FIRMS</div></div><div class="market-timer" id="marketTimer">${formatDuration(m.seconds)}</div></div>
    <div class="market-chart-shell"><canvas id="marketChart" class="market-chart"></canvas><div class="market-chart-overlay"></div></div>
    <div class="market-core"><div class="market-stats"><div><small>CURRENT PRICE</small><b id="marketPrice">${m.price.toFixed(2)}</b></div><div><small>YOUR POSITION</small><b id="marketPosition">${side}</b></div><div><small>SESSION P&L</small><b id="marketPnl" class="${totalPnl >= 0 ? 'green':'red'}">${totalPnl.toFixed(3)} SOL</b></div></div>
    <div class="trade-controls"><div class="trade-size-head"><label>ORDER SIZE · AVAILABLE <span id="marketCapital">${capital.toFixed(2)} SOL</span></label></div><div class="trade-size-presets"><button class="size-chip" data-size="0.10"${disabledAttr}>0.10</button><button class="size-chip" data-size="0.25"${disabledAttr}>0.25</button><button class="size-chip" data-size="0.50"${disabledAttr}>0.50</button><button class="size-chip" data-size="max"${disabledAttr}>MAX</button></div><input id="tradeSize" type="number" inputmode="decimal" min="0.01" max="${m.capitalLimit.toFixed(2)}" step="0.01" value="0.10"${disabledAttr}><div class="trade-buttons"><button class="btn primary" data-trade="1"${disabledAttr}>BUY / LONG</button><button class="btn danger" data-trade="-1"${disabledAttr}>SELL / SHORT</button></div><button class="btn close-position" data-trade="0"${disabledAttr}>CLOSE POSITION</button><div class="muted micro market-hint" id="marketHint">${disabled ? 'Trading unavailable until an active room is joined.' : 'Orders move the room through market flow.'}</div></div></div>
    <div class="card market-chat-card"><div class="market-chat-head"><b class="card-title">ROOM CHAT</b><span class="muted micro">${m.players}/${m.capacity} FIRMS</span></div><div class="chat" id="chat">${state.chat.map(([name,msg])=>`<p><b>${escapeHTML(name)}:</b> ${escapeHTML(msg)}</p>`).join('')}</div><form class="chatbar" id="chatForm"><input id="chatInput" maxlength="90" placeholder="Message the room…"><button class="btn">SEND</button></form></div>
  </main>`;
}
