const marketHistory = [];
for (let i = 0; i < 72; i += 1) {
  marketHistory.push(100 + i * 0.032 + Math.sin(i * 0.34) * 0.22 + Math.sin(i * 0.11) * 0.13);
}

export const state = {
  view: 'office',
  player: {
    company: 'RAVEN CAPITAL',
    level: 3,
    xp: 62,
    sol: 12.43,
    credits: 8520,
    solDelta: 2.31,
  },
  office: {
    level: 3,
    selectedHotspot: null,
    staff: ['trader', 'analyst', 'risk'],
  },
  world: {
    weekday: 'MON',
    month: 'OCT',
    day: 28,
    hour: 22,
    minute: 24,
    weather: 'rain',
    weatherIntensity: 0.72,
    tick: 0,
  },
  markets: {
    next: {
      id: 'NASDAQ PIT #184',
      secondsToOpen: 2112,
      players: 12,
      capacity: 12,
      durationMinutes: 10,
      buyIn: 1,
    },
  },
  market: {
    price: 103.42,
    position: 0,
    entry: 0,
    pnl: 0,
    realized: 0,
    seconds: 204,
    depth: 3.2,
    lastFlow: 0,
    history: marketHistory,
    eventIndex: 0,
  },
  ui: {
    overlay: null,
    reducedMotion: false,
    crtEffects: true,
    sound: false,
  },
  transactions: [
    ['Market payout', 'NASDAQ PIT #184', '+1.87 SOL', 'green'],
    ['Office upgrade', 'Trading Desk LVL 2 → 3', '-2,500 CR', 'red'],
    ['Deposit', 'From wallet', '+10.00 SOL', 'green'],
    ['Employee salary', 'Analyst', '-320 CR', 'red'],
    ['Market entry', 'DOW ROOM #021', '-1.00 SOL', 'red'],
  ],
  chat: [
    ['WolfCapital', 'this is going higher'],
    ['NovaFund', 'don’t get greedy'],
    ['Rook', 'watch the close'],
  ],
};
