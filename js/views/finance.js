export function renderFinance(state) {
  const p = state.player;
  return `<main class="page"><div class="page-head"><div><h1>FINANCE DESK</h1><div class="subtitle">CFO · CAPITAL & LEDGER</div></div></div>
    <div class="card"><div class="grid2"><div><div class="muted micro">SOL BALANCE</div><div class="big">${p.sol.toFixed(2)} SOL</div></div><div><div class="muted micro">CREDITS</div><div class="big gold">${p.credits.toLocaleString()}</div></div></div><div class="grid2" style="margin-top:12px"><button class="btn primary" data-action="deposit">↓ DEPOSIT SOL</button><button class="btn" data-action="withdraw">↑ WITHDRAW SOL</button></div></div>
    <div class="card"><b class="card-title">RECENT TRANSACTIONS</b>${state.transactions.map((t)=>`<div class="tx"><div><b>${t[0]}</b><div class="muted">${t[1]}</div></div><b class="${t[3]}">${t[2]}</b></div>`).join('')}</div>
  </main>`;
}
