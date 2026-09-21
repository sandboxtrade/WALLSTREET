const KEY = 'wallstreet-prototype-v2';
export function saveState(state) {
  const payload = {
    player: state.player,
    office: { level: state.office.level },
    ui: {
      reducedMotion: state.ui.reducedMotion,
      crtEffects: state.ui.crtEffects,
      sound: state.ui.sound,
    },
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}
export function loadState(state) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.player) Object.assign(state.player, saved.player);
    if (saved.office) Object.assign(state.office, saved.office);
    if (saved.ui) Object.assign(state.ui, saved.ui);
  } catch {
    /* Corrupted prototype state is ignored. */
  }
}
