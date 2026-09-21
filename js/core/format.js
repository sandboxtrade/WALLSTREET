export function formatDuration(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
  return [minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
}

export function formatClock(hour, minute) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${suffix}`;
}
