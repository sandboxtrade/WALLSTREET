const KEY = 'wallstreet-prototype-v4.3';
const LEGACY_KEYS = ['wallstreet-prototype-v2'];

function finite(value, fallback, min = -Infinity, max = Infinity) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
}

function text(value, fallback, maxLength = 80) {
  return typeof value === 'string' && value.length ? value.slice(0, maxLength) : fallback;
}

function boolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function readPayload() {
  const keys = [KEY, ...LEGACY_KEYS];
  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try { return JSON.parse(raw); } catch { /* Try the next compatible key. */ }
  }
  return null;
}

function restorePlayer(state, saved) {
  if (!saved || typeof saved !== 'object') return;
  state.player.company = text(saved.company, state.player.company, 40);
  state.player.level = Math.floor(finite(saved.level, state.player.level, 1, 999));
  state.player.xp = finite(saved.xp, state.player.xp, 0, 100);
  state.player.sol = finite(saved.sol, state.player.sol, 0, 1e9);
  state.player.credits = Math.floor(finite(saved.credits, state.player.credits, 0, 1e12));
  state.player.solDelta = finite(saved.solDelta, state.player.solDelta, -1e9, 1e9);
}

function restoreWorld(state, saved) {
  if (!saved || typeof saved !== 'object') return;
  state.world.weekday = text(saved.weekday, state.world.weekday, 3);
  state.world.month = text(saved.month, state.world.month, 3);
  state.world.day = Math.floor(finite(saved.day, state.world.day, 1, 31));
  state.world.hour = Math.floor(finite(saved.hour, state.world.hour, 0, 23));
  state.world.minute = Math.floor(finite(saved.minute, state.world.minute, 0, 59));
  state.world.weather = text(saved.weather, state.world.weather, 16);
  state.world.weatherIntensity = finite(saved.weatherIntensity, state.world.weatherIntensity, 0, 2);
  state.world.tick = Math.floor(finite(saved.tick, state.world.tick, 0, Number.MAX_SAFE_INTEGER));
}

function restoreNextMarket(state, saved) {
  if (!saved || typeof saved !== 'object') return;
  state.markets.next.id = text(saved.id, state.markets.next.id, 48);
  state.markets.next.secondsToOpen = Math.floor(finite(saved.secondsToOpen, state.markets.next.secondsToOpen, 0, 7 * 86400));
  state.markets.next.players = Math.floor(finite(saved.players, state.markets.next.players, 0, 100));
  state.markets.next.capacity = Math.floor(finite(saved.capacity, state.markets.next.capacity, 1, 100));
  state.markets.next.durationMinutes = Math.floor(finite(saved.durationMinutes, state.markets.next.durationMinutes, 1, 120));
  state.markets.next.buyIn = finite(saved.buyIn, state.markets.next.buyIn, .01, 1e6);
}

function restoreMarket(state, saved) {
  if (!saved || typeof saved !== 'object') return;
  const allowedStatus = ['open', 'active', 'finished'];
  state.market.id = text(saved.id, state.market.id, 48);
  state.market.status = allowedStatus.includes(saved.status) ? saved.status : state.market.status;
  state.market.joined = boolean(saved.joined, state.market.joined);
  state.market.settled = boolean(saved.settled, state.market.settled);
  state.market.players = Math.floor(finite(saved.players, state.market.players, 0, 100));
  state.market.capacity = Math.floor(finite(saved.capacity, state.market.capacity, 1, 100));
  state.market.durationMinutes = Math.floor(finite(saved.durationMinutes, state.market.durationMinutes, 1, 120));
  state.market.buyIn = finite(saved.buyIn, state.market.buyIn, .01, 1e6);
  state.market.capitalLimit = finite(saved.capitalLimit, state.market.capitalLimit, .01, 1e6);
  state.market.escrow = finite(saved.escrow, state.market.escrow, 0, 1e6);
  state.market.price = finite(saved.price, state.market.price, 1, 1e9);
  state.market.position = finite(saved.position, state.market.position, -state.market.capitalLimit, state.market.capitalLimit);
  state.market.entry = finite(saved.entry, state.market.entry, 0, 1e9);
  state.market.pnl = finite(saved.pnl, state.market.pnl, -1e9, 1e9);
  state.market.realized = finite(saved.realized, state.market.realized, -1e9, 1e9);
  state.market.lastResult = saved.lastResult == null ? null : finite(saved.lastResult, 0, -1e9, 1e9);
  state.market.endedReason = saved.endedReason == null ? null : text(saved.endedReason, null, 40);
  state.market.seconds = Math.floor(finite(saved.seconds, state.market.seconds, 0, 7 * 86400));
  state.market.depth = finite(saved.depth, state.market.depth, .01, 1e6);
  state.market.lastFlow = finite(saved.lastFlow, state.market.lastFlow, -1e6, 1e6);
  state.market.eventIndex = Math.floor(finite(saved.eventIndex, state.market.eventIndex, 0, Number.MAX_SAFE_INTEGER));
  if (Array.isArray(saved.history)) {
    const history = saved.history.filter(Number.isFinite).slice(-96);
    if (history.length >= 2) state.market.history = history;
  }

  if (state.market.status === 'active' && !state.market.joined) state.market.status = 'open';
  if (state.market.status === 'finished') {
    state.market.joined = false;
    state.market.escrow = 0;
  }
}

export function saveState(state) {
  const payload = {
    version: 4.3,
    player: state.player,
    office: { level: state.office.level },
    world: state.world,
    markets: { next: state.markets.next },
    market: state.market,
    ui: {
      reducedMotion: state.ui.reducedMotion,
      crtEffects: state.ui.crtEffects,
      sound: state.ui.sound,
    },
    transactions: state.transactions.slice(0, 30),
    chat: state.chat.slice(-80),
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadState(state) {
  const saved = readPayload();
  if (!saved || typeof saved !== 'object') return;

  restorePlayer(state, saved.player);
  if (saved.office && typeof saved.office === 'object') {
    state.office.level = Math.floor(finite(saved.office.level, state.office.level, 1, 999));
  }
  restoreWorld(state, saved.world);
  restoreNextMarket(state, saved.markets?.next);
  restoreMarket(state, saved.market);

  if (saved.ui && typeof saved.ui === 'object') {
    state.ui.reducedMotion = boolean(saved.ui.reducedMotion, state.ui.reducedMotion);
    state.ui.crtEffects = boolean(saved.ui.crtEffects, state.ui.crtEffects);
    state.ui.sound = boolean(saved.ui.sound, state.ui.sound);
  }

  if (Array.isArray(saved.transactions)) {
    state.transactions = saved.transactions
      .filter((item) => Array.isArray(item) && item.length >= 4)
      .slice(0, 30)
      .map((item) => item.slice(0, 4).map((value) => String(value).slice(0, 120)));
  }
  if (Array.isArray(saved.chat)) {
    state.chat = saved.chat
      .filter((item) => Array.isArray(item) && item.length >= 2)
      .slice(-80)
      .map((item) => [String(item[0]).slice(0, 40), String(item[1]).slice(0, 120)]);
  }
}
