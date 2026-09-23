import { escapeHTML } from '../core/dom.js';

export function renderCompany(state) {
  return `<main class="page"><div class="page-head"><div><h1>${escapeHTML(state.player.company)}</h1><div class="subtitle">FIRM OPERATIONS · LVL ${state.player.level}</div></div></div>
    <div class="card"><div class="row"><div><b>Trading Desk</b><div class="muted micro">Core market access</div></div><b class="gold">LVL 3</b></div></div>
    <div class="card"><b class="card-title">STAFF 3/4</b><div class="tx"><div><b>Trader</b><div class="muted">Executes your orders</div></div><span>LVL 2</span></div><div class="tx"><div><b>Analyst</b><div class="muted">Unlocks market intelligence</div></div><span>LVL 1</span></div><div class="tx"><div><b>Risk Manager</b><div class="muted">Exposure & limits</div></div><span>LVL 1</span></div></div>
    <div class="card"><b class="card-title">NEXT PHYSICAL UNLOCK</b><p class="muted micro">Brokerage Desk · Office LVL 5</p><div class="progress-track"><i></i></div></div>
  </main>`;
}
