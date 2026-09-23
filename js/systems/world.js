const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function advanceDay(world) {
  const weekdayIndex = WEEKDAYS.indexOf(world.weekday);
  world.weekday = WEEKDAYS[(weekdayIndex >= 0 ? weekdayIndex + 1 : 1) % WEEKDAYS.length];

  let monthIndex = MONTHS.indexOf(world.month);
  if (monthIndex < 0) monthIndex = 0;
  world.day += 1;
  if (world.day > DAYS_IN_MONTH[monthIndex]) {
    world.day = 1;
    monthIndex = (monthIndex + 1) % MONTHS.length;
    world.month = MONTHS[monthIndex];
  }
}

export function tickWorld(state) {
  state.world.tick += 1;
  if (state.world.tick % 12 !== 0) return;

  state.world.minute += 1;
  if (state.world.minute < 60) return;

  state.world.minute = 0;
  state.world.hour += 1;
  if (state.world.hour < 24) return;

  state.world.hour = 0;
  advanceDay(state.world);
}
