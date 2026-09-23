const MAX_TRANSACTIONS = 30;

export function addTransaction(state, title, detail, amount, color = '') {
  state.transactions.unshift([String(title), String(detail), String(amount), String(color)]);
  if (state.transactions.length > MAX_TRANSACTIONS) state.transactions.length = MAX_TRANSACTIONS;
}
