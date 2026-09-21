const GLYPHS = {
  office: '▥',
  city: '⌖',
  market: '▥',
  company: '♙',
  inventory: '▣',
  phone: '☎',
  news: '▦',
  analyst: '◔',
  risk: '◇',
  finance: '●',
  exit: '↪',
  trophy: '♜',
  lounge: '▰',
  settings: '⚙',
};
export const icon = (name) => GLYPHS[name] || '·';
