import { addTransaction } from './ledger.js';

const DEMO_FLOW = [
  { firm:'WolfCapital', flow: .32 }, { firm:'NovaFund', flow: .18 }, { firm:'Rook', flow: -.24 },
  { firm:'Marlow Partners', flow: .41 }, { firm:'Northstar', flow: -.38 }, { firm:'WolfCapital', flow: -.14 },
  { firm:'Keystone', flow: -.31 }, { firm:'NovaFund', flow: .27 }, { firm:'Rook', flow: .12 },
  { firm:'Marlow Partners', flow: -.44 }, { firm:'Northstar', flow: .21 }, { firm:'Keystone', flow: .16 },
];

const EPSILON = 1e-8;
const NEXT_MARKET_DELAY = 30 * 60;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundSol(value) {
  return Math.round((Number(value) + Number.EPSILON) * 1e6) / 1e6;
}

function roomNumber(id) {
  const match = String(id).match(/#(\d+)/);
  return match ? Number(match[1]) : 184;
}

function nextRoomId(id) {
  const number = roomNumber(id) + 1;
  return `NASDAQ PIT #${String(number).padStart(3, '0')}`;
}

function buildHistory(basePrice, seed = 1) {
  const history = [];
  for (let i = 0; i < 72; i += 1) {
    history.push(basePrice + i * 0.018 + Math.sin(i * .31 + seed) * .19 + Math.sin(i * .09 + seed * .3) * .1);
  }
  return history;
}

export function sessionPnl(state) {
  const m = state.market;
  return roundSol(m.realized + m.pnl);
}

export function availableCapital(state) {
  return Math.max(0, roundSol(state.market.capitalLimit - Math.abs(state.market.position)));
}

function positionPnl(position, entry, price) {
  if (!position || !entry) return 0;
  const move = (price - entry) / entry;
  return roundSol(Math.abs(position) * move * Math.sign(position));
}

function refreshPnl(state) {
  const m = state.market;
  m.pnl = positionPnl(m.position, m.entry, m.price);
}

function applyFlow(state, flow) {
  const m = state.market;
  if (!Number.isFinite(flow) || Math.abs(flow) < EPSILON) return;
  m.lastFlow = flow;
  const impact = (flow / Math.max(.01, m.depth)) * .85;
  m.price = Math.max(1, m.price + impact);
  m.history.push(m.price);
  if (m.history.length > 96) m.history.shift();
}

function realizeClose(state, closeAmount) {
  const m = state.market;
  const side = Math.sign(m.position);
  if (!side || closeAmount <= 0) return 0;

  const amount = Math.min(Math.abs(m.position), closeAmount);
  applyFlow(state, -side * amount);
  const realized = positionPnl(side * amount, m.entry, m.price);
  m.realized = roundSol(m.realized + realized);
  m.position = roundSol(m.position - side * amount);

  if (Math.abs(m.position) < EPSILON) {
    m.position = 0;
    m.entry = 0;
  }
  refreshPnl(state);
  return amount;
}

function openAmount(state, direction, amount) {
  const m = state.market;
  if (amount <= 0) return 0;

  const capacity = Math.max(0, m.capitalLimit - Math.abs(m.position));
  const fillAmount = Math.min(amount, capacity);
  if (fillAmount <= EPSILON) return 0;

  const oldAbs = Math.abs(m.position);
  applyFlow(state, direction * fillAmount);
  const fillPrice = m.price;
  const newAbs = oldAbs + fillAmount;
  m.entry = oldAbs <= EPSILON
    ? fillPrice
    : ((m.entry * oldAbs) + (fillPrice * fillAmount)) / newAbs;
  m.position = roundSol(m.position + direction * fillAmount);
  refreshPnl(state);
  return fillAmount;
}

function settleMarket(state, reason = 'closing-bell') {
  const m = state.market;
  if (m.status === 'finished' || m.settled) return false;

  if (m.position) realizeClose(state, Math.abs(m.position));

  const result = roundSol(m.realized);
  const payout = Math.max(0, roundSol(m.escrow + result));
  state.player.sol = roundSol(state.player.sol + payout);
  state.player.solDelta = result;

  if (m.joined || m.escrow > 0) {
    addTransaction(state, 'Market payout', m.id, `+${payout.toFixed(3)} SOL`, 'green');
  }

  m.lastResult = result;
  m.escrow = 0;
  m.joined = false;
  m.settled = true;
  m.status = 'finished';
  m.endedReason = reason;
  m.seconds = 0;
  m.pnl = 0;
  return true;
}

function resetMarketFromNext(state) {
  const next = state.markets.next;
  const number = roomNumber(next.id);
  const basePrice = 100 + (number % 9) * .37;
  const history = buildHistory(basePrice, number * .07);
  const price = history[history.length - 1];

  Object.assign(state.market, {
    id: next.id,
    status: 'open',
    joined: false,
    settled: false,
    players: next.players,
    capacity: next.capacity,
    durationMinutes: next.durationMinutes,
    buyIn: next.buyIn,
    capitalLimit: next.buyIn,
    escrow: 0,
    price,
    position: 0,
    entry: 0,
    pnl: 0,
    realized: 0,
    lastResult: null,
    endedReason: null,
    seconds: next.durationMinutes * 60,
    depth: 3.2,
    lastFlow: 0,
    history,
    eventIndex: 0,
  });

  const followingId = nextRoomId(next.id);
  const followingNumber = roomNumber(followingId);
  state.markets.next = {
    id: followingId,
    secondsToOpen: NEXT_MARKET_DELAY,
    players: 8 + (followingNumber % 5),
    capacity: 12,
    durationMinutes: 10,
    buyIn: next.buyIn,
  };
}

export function tickMarketSchedule(state) {
  const next = state.markets.next;
  if (next.secondsToOpen > 0) next.secondsToOpen -= 1;
}

export function enterMarket(state) {
  const m = state.market;

  if (m.status === 'active' && m.joined) return { ok: true, joined: false };

  const nextIsReady = state.markets.next.secondsToOpen <= 0;
  if (nextIsReady && !m.joined && (m.status === 'finished' || m.status === 'open')) {
    resetMarketFromNext(state);
  } else if (m.status === 'finished') {
    return { ok: false, reason: 'next-market-not-open' };
  }

  if (state.market.status !== 'open') return { ok: false, reason: 'market-not-open' };
  if (state.player.sol + EPSILON < state.market.buyIn) return { ok: false, reason: 'insufficient-sol' };

  state.player.sol = roundSol(state.player.sol - state.market.buyIn);
  state.player.solDelta = -state.market.buyIn;
  state.market.escrow = state.market.buyIn;
  state.market.capitalLimit = state.market.buyIn;
  state.market.joined = true;
  state.market.settled = false;
  state.market.status = 'active';
  state.market.endedReason = null;
  addTransaction(state, 'Market entry', state.market.id, `-${state.market.buyIn.toFixed(2)} SOL`, 'red');
  return { ok: true, joined: true };
}

export function tickMarket(state) {
  const m = state.market;
  if (m.status !== 'active' || !m.joined) return { changed: false, settled: false };

  if (m.seconds <= 0) {
    return { changed: true, settled: settleMarket(state) };
  }

  m.seconds -= 1;
  const event = DEMO_FLOW[m.eventIndex % DEMO_FLOW.length];
  m.eventIndex += 1;
  applyFlow(state, event.flow);
  refreshPnl(state);

  if (m.seconds <= 0) {
    return { changed: true, settled: settleMarket(state) };
  }
  return { changed: true, settled: false };
}

export function executeTrade(state, direction, size) {
  const m = state.market;
  if (m.status !== 'active' || !m.joined || m.seconds <= 0) {
    return { ok: false, reason: 'market-not-active' };
  }

  if (direction === 0) {
    if (!m.position) return { ok: false, reason: 'no-position' };
    realizeClose(state, Math.abs(m.position));
    return { ok: true };
  }

  if (direction !== 1 && direction !== -1) return { ok: false, reason: 'invalid-direction' };

  const requested = Number(size);
  if (!Number.isFinite(requested) || requested <= 0) return { ok: false, reason: 'invalid-size' };
  const amount = clamp(requested, .01, m.capitalLimit);
  const currentSide = Math.sign(m.position);

  if (currentSide === 0 || currentSide === direction) {
    const opened = openAmount(state, direction, amount);
    if (opened <= EPSILON) return { ok: false, reason: 'capital-limit' };
    return { ok: true };
  }

  let remaining = amount;
  const closed = realizeClose(state, Math.min(Math.abs(m.position), remaining));
  remaining = Math.max(0, remaining - closed);

  if (remaining > EPSILON) openAmount(state, direction, remaining);
  refreshPnl(state);
  return { ok: true };
}

export function forceFinishMarket(state, reason = 'closing-bell') {
  return settleMarket(state, reason);
}
