export function tickWorld(state) {
  state.world.tick += 1;
  if (state.world.tick % 12 === 0) {
    state.world.minute += 1;
    if (state.world.minute >= 60) { state.world.minute = 0; state.world.hour = (state.world.hour + 1) % 24; }
  }
  state.markets.next.secondsToOpen = Math.max(0, state.markets.next.secondsToOpen - 1);
}
