const DEMO_FLOW = [
  { firm:'WolfCapital', flow: .32 }, { firm:'NovaFund', flow: .18 }, { firm:'Rook', flow: -.24 },
  { firm:'Marlow Partners', flow: .41 }, { firm:'Northstar', flow: -.38 }, { firm:'WolfCapital', flow: -.14 },
  { firm:'Keystone', flow: -.31 }, { firm:'NovaFund', flow: .27 }, { firm:'Rook', flow: .12 },
  { firm:'Marlow Partners', flow: -.44 }, { firm:'Northstar', flow: .21 }, { firm:'Keystone', flow: .16 },
];

function applyFlow(state, flow) {
  const m = state.market;
  m.lastFlow = flow;
  const impact = (flow / m.depth) * 0.85;
  m.price = Math.max(1, m.price + impact);
  m.history.push(m.price);
  if (m.history.length > 96) m.history.shift();
  m.pnl = m.position ? (m.price - m.entry) * m.position : 0;
}

export function tickMarket(state) {
  const m = state.market;
  if (m.seconds > 0) m.seconds -= 1;
  const event = DEMO_FLOW[m.eventIndex % DEMO_FLOW.length];
  m.eventIndex += 1;
  applyFlow(state, event.flow);
}

export function executeTrade(state, direction, size) {
  const m = state.market;
  const amount = Math.max(.01, Math.min(5, Number(size) || .1));
  if (direction === 0) {
    if (!m.position) return;
    const closeFlow = -m.position;
    m.realized += (m.price - m.entry) * m.position;
    m.position = 0; m.entry = 0; m.pnl = 0;
    applyFlow(state, closeFlow);
    return;
  }
  if (m.position === 0 || Math.sign(m.position) === direction) {
    const oldAbs = Math.abs(m.position);
    const newAbs = oldAbs + amount;
    m.entry = oldAbs === 0 ? m.price : ((m.entry * oldAbs) + (m.price * amount)) / newAbs;
    m.position += direction * amount;
    applyFlow(state, direction * amount);
    return;
  }
  const closeFlow = -m.position;
  m.realized += (m.price - m.entry) * m.position;
  applyFlow(state, closeFlow);
  m.position = direction * amount;
  m.entry = m.price;
  m.pnl = 0;
  applyFlow(state, direction * amount);
}
