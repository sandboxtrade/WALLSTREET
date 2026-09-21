import { formatDuration } from '../core/format.js';

export function renderMarket(state) {
  const m = state.market;
  const side = m.position === 0 ? 'FLAT' : (m.position > 0 ? `LONG ${m.position.toFixed(2)}` : `SHORT ${Math.abs(m.position).toFixed(2)}`);
  return `<main class="page"><div class="page-head"><div><h1>NASDAQ PIT #184</h1><div class="subtitle">12/12 FIRMS · INTERNAL PVP MARKET</div></div><div class="market-timer" id="marketTimer">${formatDuration(m.seconds)}</div></div>
    <div class="market-chart-shell"><canvas id="marketChart" class="market-chart"></canvas><div class="market-chart-overlay"></div></div>
    <div class="card"><div class="market-stats"><div><small>CURRENT PRICE</small><b id="marketPrice">${m.price.toFixed(2)}</b></div><div><small>YOUR POSITION</small><b id="marketPosition">${side}</b></div><div><small>P&L</small><b id="marketPnl" class="${m.pnl >= 0 ? 'green':'red'}">${m.pnl.toFixed(3)} SOL</b></div></div></div>
    <div class="card trade-controls"><label>SIZE (SOL)</label><input id="tradeSize" type="number" inputmode="decimal" min="0.01" max="5" step="0.01" value="0.10"><div class="trade-buttons"><button class="btn primary" data-trade="1">↑ BUY / LONG</button><button class="btn danger" data-trade="-1">↓ SELL / SHORT</button></div><button class="btn" data-trade="0" style="width:100%;margin-top:8px">CLOSE POSITION</button><div class="muted micro" style="margin-top:8px">Every action creates market flow. Demo firms below also submit explicit deterministic orders; the price never moves from random noise.</div></div>
    <div class="card"><b class="card-title">ROOM CHAT</b><div class="chat" id="chat">${state.chat.map(([name,msg])=>`<p><b>${name}:</b> ${msg}</p>`).join('')}</div><form class="chatbar" id="chatForm"><input id="chatInput" maxlength="90" placeholder="Message the room…"><button class="btn">SEND</button></form></div>
  </main>`;
}
