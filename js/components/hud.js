import { escapeHTML } from '../core/dom.js';
import { icon } from './icons.js';
import { formatClock } from '../core/format.js';

export function renderHUD(state) {
  const p = state.player;
  const w = state.world;
  const xp = Math.max(0, Math.min(100, Number(p.xp) || 0));
  const deltaClass = p.solDelta >= 0 ? 'green' : 'red';
  const deltaSign = p.solDelta >= 0 ? '+' : '';
  return `
    <header class="top-hud">
      <div class="hud-card company-card">
        <div class="company-mark">⌁</div>
        <div class="company-copy">
          <div class="hud-title">${escapeHTML(p.company)}</div>
          <div class="level-line"><span class="hud-sub">LVL ${p.level}</span><span class="level-bar"><i style="width:${xp}%"></i></span></div>
          <span class="hud-sub">DISCIPLINE PAYS.</span>
        </div>
      </div>
      <div class="hud-card balance-card"><div class="balance-main">◉ <span id="hudSol">${p.sol.toFixed(2)}</span> SOL</div><div id="hudSolDelta" class="balance-delta ${deltaClass}">${deltaSign}${p.solDelta.toFixed(2)}</div></div>
      <div class="hud-card balance-card"><div class="balance-main gold">★ <span id="hudCredits">${p.credits.toLocaleString()}</span></div><div class="hud-sub">CREDITS</div></div>
      <div class="hud-card time-card"><div class="time-date" id="hudDate">${w.weekday}, ${w.month} ${w.day}</div><div class="time-clock" id="hudClock">${formatClock(w.hour,w.minute)}</div></div>
      <button class="settings-button" data-action="settings" aria-label="Settings">${icon('settings')}</button>
    </header>`;
}

export function updateHUDLive(state) {
  const sol = document.querySelector('#hudSol');
  const delta = document.querySelector('#hudSolDelta');
  const credits = document.querySelector('#hudCredits');
  const clock = document.querySelector('#hudClock');
  const date = document.querySelector('#hudDate');
  if (sol) sol.textContent = state.player.sol.toFixed(2);
  if (delta) {
    delta.textContent = `${state.player.solDelta >= 0 ? '+' : ''}${state.player.solDelta.toFixed(2)}`;
    delta.className = `balance-delta ${state.player.solDelta >= 0 ? 'green' : 'red'}`;
  }
  if (credits) credits.textContent = state.player.credits.toLocaleString();
  if (clock) clock.textContent = formatClock(state.world.hour, state.world.minute);
  if (date) date.textContent = `${state.world.weekday}, ${state.world.month} ${state.world.day}`;
}
