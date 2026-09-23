let raf = 0;
let canvas = null;
let context = null;
let drops = [];
let running = false;
let currentState = null;

function resize() {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  context = canvas.getContext('2d');
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  return rect;
}

function buildDrops(count, width, height) {
  drops = Array.from({ length: count }, (_, i) => ({
    x: (i * 37.7) % Math.max(1, width),
    y: (i * 71.3) % Math.max(1, height),
    speed: 3.2 + (i % 7) * .42,
    length: 6 + (i % 5) * 2,
    alpha: .17 + (i % 6) * .045,
  }));
}

function rebuildForSize() {
  const rect = resize();
  if (!rect) return;
  buildDrops(Math.max(34, Math.floor(rect.width / 5)), rect.width, rect.height);
  drawFrame(false);
}

function drawFrame(advance = true) {
  if (!canvas || !context || !currentState) return;
  const rect = canvas.getBoundingClientRect();
  context.clearRect(0, 0, rect.width, rect.height);
  if (['rain','storm'].includes(currentState.world.weather)) {
    context.lineWidth = 1;
    for (const drop of drops) {
      context.strokeStyle = `rgba(174,197,224,${drop.alpha})`;
      context.beginPath();
      context.moveTo(drop.x, drop.y);
      context.lineTo(drop.x - 2.2, drop.y + drop.length);
      context.stroke();
      if (!advance) continue;
      drop.y += drop.speed * currentState.world.weatherIntensity;
      drop.x -= .32 * currentState.world.weatherIntensity;
      if (drop.y > rect.height + 12) { drop.y = -12; drop.x = (drop.x + 91) % Math.max(1, rect.width); }
      if (drop.x < -8) drop.x = rect.width + 6;
    }
  }
  if (currentState.world.weather === 'fog') {
    const g = context.createLinearGradient(0,0,rect.width,0); g.addColorStop(0,'rgba(200,210,220,.03)'); g.addColorStop(.5,'rgba(220,225,230,.15)'); g.addColorStop(1,'rgba(200,210,220,.04)'); context.fillStyle=g; context.fillRect(0,rect.height*.55,rect.width,rect.height*.35);
  }
}

function frame() {
  if (!running || !canvas || !context) return;
  drawFrame(true);
  raf = requestAnimationFrame(frame);
}

export function startWeather(state) {
  stopWeather();
  currentState = state;
  canvas = document.querySelector('#weatherCanvas');
  if (!canvas) return;
  rebuildForSize();
  window.addEventListener('resize', rebuildForSize);
  if (state.ui.reducedMotion) return;
  running = true;
  raf = requestAnimationFrame(frame);
}

export function stopWeather() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
  window.removeEventListener('resize', rebuildForSize);
  raf = 0; canvas = null; context = null; drops = []; currentState = null;
}
