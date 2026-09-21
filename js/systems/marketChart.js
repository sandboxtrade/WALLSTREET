import { formatDuration } from '../core/format.js';

export function drawMarketChart(state) {
  const canvas = document.querySelector('#marketChart');
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const ctx = canvas.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=rect.width,h=rect.height,p=20,d=state.market.history;const min=Math.min(...d)-.35,max=Math.max(...d)+.35;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#050a10';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#162637';ctx.lineWidth=1;
  for(let i=0;i<6;i+=1){const y=p+(h-2*p)*i/5;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke();}
  for(let i=0;i<6;i+=1){const x=p+(w-2*p)*i/5;ctx.beginPath();ctx.moveTo(x,p);ctx.lineTo(x,h-p);ctx.stroke();}
  ctx.strokeStyle='#47df92';ctx.lineWidth=2;ctx.beginPath();d.forEach((v,i)=>{const x=p+(w-2*p)*i/(d.length-1);const y=h-p-(v-min)/(max-min)*(h-2*p);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
  ctx.fillStyle='#e5b955';ctx.font='10px monospace';ctx.fillText(state.market.price.toFixed(2),w-54,15);
}

export function updateMarketLive(state) {
  const m=state.market;const timer=document.querySelector('#marketTimer');const price=document.querySelector('#marketPrice');const pos=document.querySelector('#marketPosition');const pnl=document.querySelector('#marketPnl');
  if(timer)timer.textContent=formatDuration(m.seconds);if(price)price.textContent=m.price.toFixed(2);if(pos)pos.textContent=m.position===0?'FLAT':`${m.position>0?'LONG':'SHORT'} ${Math.abs(m.position).toFixed(2)}`;if(pnl){pnl.textContent=`${m.pnl.toFixed(3)} SOL`;pnl.className=m.pnl>=0?'green':'red';}drawMarketChart(state);
}
