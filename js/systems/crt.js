let raf = 0;
let running = false;
let stateRef = null;
let lastDraw = 0;

function sizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(60, Math.floor(rect.width * dpr));
  const height = Math.max(32, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  return { ctx: canvas.getContext('2d'), width, height };
}

function line(ctx,w,h,t,phase=0) {
  ctx.strokeStyle='#4ce19a'; ctx.lineWidth=1.5; ctx.beginPath();
  for(let i=0;i<34;i+=1){const x=i/(33)*w;const y=h*.57-Math.sin(i*.47+phase+t*.0014)*h*.15-Math.sin(i*.13+phase)*h*.08;(i?ctx.lineTo(x,y):ctx.moveTo(x,y));} ctx.stroke();
}
function grid(ctx,w,h){ctx.strokeStyle='rgba(78,114,142,.19)';ctx.lineWidth=1;for(let i=1;i<4;i+=1){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke();}for(let i=1;i<5;i+=1){ctx.beginPath();ctx.moveTo(w*i/5,0);ctx.lineTo(w*i/5,h);ctx.stroke();}}
function candles(ctx,w,h,t){for(let i=0;i<18;i+=1){const x=4+i*(w-8)/18;const base=h*.55+Math.sin(i*.72+t*.0008)*h*.12;const up=((i*7)%11)<6;ctx.strokeStyle=up?'#50e49a':'#ff6d78';ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(x,base-h*.22);ctx.lineTo(x,base+h*.18);ctx.stroke();ctx.fillRect(x-1.8,base-h*.07,3.6,h*.13);}}
function bars(ctx,w,h,t){for(let i=0;i<9;i+=1){const val=.25+.62*((Math.sin(i*1.1+t*.001)+1)/2);ctx.fillStyle=i%3===0?'#ff6875':'#46db8d';ctx.fillRect(3+i*w/9,h*(1-val),Math.max(2,w/13),h*val);}}
function risk(ctx,w,h,t){grid(ctx,w,h);ctx.strokeStyle='#e0b652';ctx.lineWidth=2;ctx.beginPath();ctx.arc(w*.5,h*.95,Math.min(w,h)*.68,Math.PI,Math.PI*2);ctx.stroke();const a=Math.PI+(.36+.22*Math.sin(t*.001))*Math.PI;ctx.strokeStyle='#ffca68';ctx.beginPath();ctx.moveTo(w*.5,h*.95);ctx.lineTo(w*.5+Math.cos(a)*w*.28,h*.95+Math.sin(a)*w*.28);ctx.stroke();}
function ticker(ctx,w,h,t){ctx.fillStyle='#e1ba59';ctx.font=`${Math.max(7,h*.23)}px monospace`;const x=w-((t*.025)% (w*2.8));ctx.fillText('RAVEN 103.42  +0.84   PIT FLOW 52/48',x,h*.55);line(ctx,w,h,t,1.2);}
function analysis(ctx,w,h,t){grid(ctx,w,h);line(ctx,w,h,t,2.4);ctx.fillStyle='rgba(84,164,255,.6)';ctx.fillRect(w*.65,h*.12,w*.26,h*.22);}

function drawCanvas(canvas,t){const s=sizeCanvas(canvas);if(!s)return;const{ctx,width:w,height:h}=s;ctx.fillStyle='#061019';ctx.fillRect(0,0,w,h);grid(ctx,w,h);const mode=canvas.dataset.crt||'line';if(mode==='line')line(ctx,w,h,t);else if(mode==='candles')candles(ctx,w,h,t);else if(mode==='flow')bars(ctx,w,h,t);else if(mode==='risk')risk(ctx,w,h,t);else if(mode==='ticker')ticker(ctx,w,h,t);else if(mode==='analysis')analysis(ctx,w,h,t);ctx.fillStyle='rgba(87,236,167,.025)';ctx.fillRect(0,0,w,h);}

function frame(t){if(!running)return;if(!stateRef.ui.reducedMotion&&t-lastDraw>90){document.querySelectorAll('[data-crt]').forEach((c)=>drawCanvas(c,t));lastDraw=t;}raf=requestAnimationFrame(frame);}
export function startCRT(state){stopCRT();stateRef=state;running=true;raf=requestAnimationFrame(frame);}
export function stopCRT(){running=false;if(raf)cancelAnimationFrame(raf);raf=0;stateRef=null;lastDraw=0;}
