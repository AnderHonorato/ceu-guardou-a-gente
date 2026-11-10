"use strict";
/* Pequenos Infinitos — 10/11/2026: O recado que aprendeu a voar.
 * Esta é uma cena INVENTADA para jogar, não um relato factual do casal.
 * Canvas 2D autoral, física leve, coleta, evasão, movimento por touch/teclado.
 */
(()=>{
const EPISODE="2026-11-10",TZ="America/Sao_Paulo";
const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,n)=>a+(b-a)*n;
const ease=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
const W0=480,END=3050,STAR_X=[550,780,1030,1270,1510,1790,2060,2370,2630,2820],STAR_Y=[.33,.46,.28,.54,.39,.23,.48,.32,.55,.41];
let root,canvas,ctx,last=0,raf=0,running=false,seed=0,voice=null,prevScreen=null;
const s={W:480,H:880,floor:610,t:0,phase:"fold",folds:0,foldAlpha:0,pull:0,drag:null,
 progress:0,v:0,py:390,targetY:390,px:150,pointer:null,keys:{up:false,down:false},
 energy:3,score:0,stars:[],hazards:[],particles:[],hitCooldown:0,flash:0,
 arrivalTime:0,finished:false,saved:false,elapsed:0,speed:92,flightStarted:false,wind:0};
function dateLocal(){return new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
function rint(n){const z=Math.sin(n*12.9898+14.7)*43758.5453;return z-Math.floor(z)}
function sound(freq=480,duration=.11,type="sine",volume=.025){
 try{
  if(!voice)return;
  const o=voice.createOscillator(),g=voice.createGain();o.type=type;o.frequency.value=freq;
  g.gain.setValueAtTime(volume,voice.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001,voice.currentTime+duration);
  o.connect(g).connect(voice.destination);o.start();o.stop(voice.currentTime+duration);
 }catch(_){}
}
function tag(name,cl,html){
 const e=document.createElement(name);e.className=cl;e.innerHTML=html;return e;
}
function init(){
 if(root)return;
 root=tag("section","flight-episode",[
  '<canvas id="flightCanvas" role="img" aria-label="Avião de papel voando pela cidade em um cenário 2D animado"></canvas>',
  '<div class="flight-top"><button id="flightExit" type="button" aria-label="Voltar ao jogo">← VOLTAR</button><div class="flight-heading"><small>10 NOV · CENA IMAGINADA PARA JOGAR</small><strong>Nosso recado voador</strong></div><div id="flightCount">✦ 0/10</div></div>',
  '<div id="flightProgress" class="flight-progress"><div id="flightProgressFill"></div></div>',
  '<div id="flightInstruction" class="flight-instruction">ARRASTE AS ASAS PARA DOBRAR O AVIÃO</div>',
  '<div id="flightPaperTips" class="flight-paper-tips"><span id="flightFoldBadge">✧ 0/2 DOBRAS</span><span>✦ UMA SURPRESA PARA O LIL</span></div>',
  '<div id="flightBottom" class="flight-bottom"><div id="flightSteer" class="flight-steer" hidden><button id="flightUp" type="button" aria-label="Subir o avião">↑</button><button id="flightDown" type="button" aria-label="Descer o avião">↓</button></div><button id="flightSound" type="button" aria-label="Alternar sons">♫</button><button id="flightAction" type="button">DOBRAR AVIÃO ✧</button></div>',
  '<div id="flightResult" class="flight-result" hidden><div class="flight-result-mark">♡ ✦ ♡</div><h2>Chegou até você.</h2><p>Este dia ainda não tem uma lembrança contada. Então inventei uma possibilidade bonita para nós dois: um recado que cruzou a cidade só para chegar pertinho de você.</p><div class="flight-result-badges"><span id="flightBadge"></span><span>10 · NOV · 2026</span></div><button id="flightAgain" type="button">↶ VOAR DE NOVO</button><button id="flightBack" type="button">VOLTAR AO NOSSO MUNDO</button></div>',
  '<div id="flightToast" class="flight-toast" aria-live="polite"></div>'
 ].join(""));
 root.id="flightEpisode";root.hidden=true;root.setAttribute("aria-label","Episódio fictício de 10 de novembro: avião de papel");
 $("#shell").append(root);canvas=$("#flightCanvas");ctx=canvas.getContext("2d",{alpha:false});
 $("#flightExit").addEventListener("click",leave);$("#flightBack").addEventListener("click",leave);
 $("#flightAgain").addEventListener("click",reset);$("#flightAction").addEventListener("click",action);
 $("#flightSound").addEventListener("click",()=>{if(!voice){const Audio=window.AudioContext||window.webkitAudioContext;if(Audio){voice=new Audio();sound(550)}$("#flightSound").classList.add("enabled")}else{voice.close();voice=null;$("#flightSound").classList.remove("enabled")}});
 canvas.addEventListener("pointerdown",pointerDown,{passive:false});
 canvas.addEventListener("pointermove",pointerMove,{passive:false});
 canvas.addEventListener("pointerup",pointerUp,{passive:false});
 canvas.addEventListener("pointercancel",pointerUp,{passive:false});
 buttonHold("#flightUp","up");buttonHold("#flightDown","down");
 document.addEventListener("keydown",e=>{
  if(root.hidden)return;
  if(["Escape","ArrowUp","ArrowDown"," ","Enter"].includes(e.key))e.preventDefault();
  if(e.key==="Escape")leave();
  if(e.key==="ArrowUp"||e.key==="w")s.keys.up=true;
  if(e.key==="ArrowDown"||e.key==="s")s.keys.down=true;
  if((e.key===" "||e.key==="Enter")&&!e.repeat)action();
 });
 document.addEventListener("keyup",e=>{if(e.key==="ArrowUp"||e.key==="w")s.keys.up=false;if(e.key==="ArrowDown"||e.key==="s")s.keys.down=false});
 window.addEventListener("resize",resize);
}
function buttonHold(selector,key){
 const el=$(selector);
 el.addEventListener("pointerdown",e=>{e.preventDefault();el.setPointerCapture(e.pointerId);s.keys[key]=true;});
 for(const event of ["pointerup","pointercancel","lostpointercapture"]){
  el.addEventListener(event,()=>{s.keys[key]=false});
 }
}
function launchFromLink(){
 const btn=tag("button","flight-launch",'<span class="flight-launch-icon">✧</span><span><small>CAPÍTULO EXTRA · 10 NOV</small><strong>O recado que aprendeu a voar</strong><em>Uma aventura imaginada para jogar</em></span><span>↗</span>');
 btn.id="flightLauncher";btn.type="button";btn.addEventListener("click",open);
 return btn;
}
function ready(){
 const opening=$(".opening-paper");
 if(opening&&!$("#flightLauncher"))opening.insertBefore(launchFromLink(),$("#dailyLaunch")||opening.querySelector(".opening-help"));
 const end=$(".ending-actions");
 if(end&&!$("#flightContinue")){const b=tag("button","flight-after-ending","✧ EPISÓDIO DE 10 NOV — VOAR DE NOVO →");b.id="flightContinue";b.addEventListener("click",open);end.prepend(b)}
 const prev=$("#dailyEnd .daily-end-actions");
 if(prev&&!$("#flightFromYesterday")){const b=tag("button","flight-from-yesterday","10 NOV · O PRÓXIMO CAPÍTULO →");b.id="flightFromYesterday";b.addEventListener("click",open);prev.append(b)}
 init();
 if(new URLSearchParams(location.search).get("episodio")===EPISODE)setTimeout(open,200);
}
function open(){
 if(dateLocal()<EPISODE)return;
 if(!root)init();
 prevScreen={opening:$("#opening").style.visibility,ending:$("#ending").style.visibility,daily:$("#dailyEpisode")?.style.visibility};
 $("#opening").style.visibility="hidden";$("#ending").style.visibility="hidden";
 if($("#dailyEpisode"))$("#dailyEpisode").style.visibility="hidden";
 root.hidden=false;reset();
}
function leave(){
 running=false;cancelAnimationFrame(raf);root.hidden=true;
 $("#opening").style.visibility=prevScreen?.opening||"";$("#ending").style.visibility=prevScreen?.ending||"";
 if($("#dailyEpisode"))$("#dailyEpisode").style.visibility=prevScreen?.daily||"";
 s.keys.up=s.keys.down=false;
}
function reset(){
 Object.assign(s,{t:0,phase:"fold",folds:0,foldAlpha:0,pull:0,drag:null,progress:0,
  v:0,px:140,energy:3,score:0,stars:STAR_X.map((x,i)=>({x,y:STAR_Y[i],got:false})),
  hazards:Array.from({length:12},(_,i)=>({x:620+i*205+(i%3)*60,relY:.28+(i%5)*.072,phase:i*.93,hit:false})),
  particles:[],hitCooldown:0,flash:0,arrivalTime:0,finished:false,saved:false,elapsed:0,flightStarted:false,wind:0});
 s.keys.up=s.keys.down=false;
 $("#flightResult").hidden=true;$("#flightPaperTips").hidden=false;
 $("#flightSteer").hidden=true;
 $("#flightAction").hidden=false;$("#flightAction").textContent="DOBRAR AVIÃO ✧";
 $("#flightInstruction").textContent="DESLIZE AS DUAS PONTAS DO PAPEL PARA O CENTRO";
 $("#flightCount").textContent="✦ 0/10";$("#flightFoldBadge").textContent="✧ 0/2 DOBRAS";
 $("#flightProgressFill").style.width="0%";
 resize();s.py=clamp(s.H*.36,110,s.floor-110);s.targetY=s.py;running=true;last=0;
 cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
}
function resize(){
 if(!canvas||root.hidden)return;
 const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
 const portrait=rect.height>rect.width*1.14;
 s.W=portrait?480:Math.max(640,Math.round(480*rect.width/rect.height));
 s.H=portrait?Math.round(480*rect.height/rect.width):480;
 s.floor=Math.round(s.H*(portrait?.77:.80));
 canvas.width=s.W;canvas.height=s.H;ctx.imageSmoothingEnabled=false;
 s.px=s.W*.29;s.py=clamp(s.py||s.H*.46,110,s.floor-110);
}
function toast(message){
 const el=$("#flightToast");el.textContent=message;el.classList.add("show");
 const until=s.t+2.6;s.toastUntil=until;
}
function pointerCoords(e){
 const r=canvas.getBoundingClientRect();
 return {x:clamp((e.clientX-r.left)/r.width*s.W,0,s.W),y:clamp((e.clientY-r.top)/r.height*s.H,0,s.H)};
}
function pointerDown(e){
 if(root.hidden)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);
 const p=pointerCoords(e);s.drag={start:p,last:p,active:true};s.pointer=p;
 if(s.phase==="fly")s.targetY=p.y;
}
function pointerMove(e){
 if(!s.drag?.active)return;
 const p=pointerCoords(e);s.pointer=p;
 if(s.phase==="fly")s.targetY=p.y;
 if(s.phase==="fold")s.pull=clamp(Math.hypot(p.x-s.drag.start.x,p.y-s.drag.start.y)/110,0,1);
 s.drag.last=p;
}
function pointerUp(e){
 if(!s.drag)return;
 const p=pointerCoords(e);
 if(s.phase==="fold"){
  const d=Math.hypot(p.x-s.drag.start.x,p.y-s.drag.start.y);
  if(d>36)fold();
 }else if(s.phase==="fly")s.targetY=p.y;
 s.drag=null;s.pull=0;
}
function fold(){
 if(s.phase!=="fold"||s.folds>=2)return;
 s.folds++;s.foldAlpha=1;
 burst(s.W*.52,s.H*.48,14);
 sound(480+s.folds*190,.22);
 $("#flightFoldBadge").textContent="✧ "+s.folds+"/2 DOBRAS";
 if(s.folds===2){$("#flightInstruction").textContent="AVIÃO PRONTO! PREPARE O LANÇAMENTO.";$("#flightAction").textContent="LANÇAR RECADO ↗"}
 else{toast("UMA ASA DOBRADA… FALTA A OUTRA!");$("#flightAction").textContent="DOBRAR OUTRA ASA ✧"}
}
function action(){
 if(s.phase==="fold"){if(s.folds<2)fold();else startFlight()}
 else if(s.phase==="fly"){
   s.targetY=clamp(s.py-75,100,s.floor-95);
 }
 else if(s.phase==="arrival"){finish()}
}
function startFlight(){
 s.phase="fly";s.elapsed=0;s.flightStarted=true;s.targetY=s.py;
 $("#flightPaperTips").hidden=true;$("#flightSteer").hidden=false;
 $("#flightAction").textContent="SUBIR ↗";
 $("#flightInstruction").textContent="DESLIZE O DEDO PARA GUIAR • DESVIE DOS PÁSSAROS";
 sound(700,.26);toast("VAI, RECADINHO! ✦");
}
function burst(x,y,num=12,col="#ffe5b7"){
 for(let i=0;i<num;i++){
  const a=i*Math.PI*2/num,v=35+Math.random()*120;
  s.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1.3,col:i%4===0?"#f4adb5":col,heart:i%5===0});
 }
}

function update(dt){
 s.t+=dt;s.flash=Math.max(0,s.flash-dt);s.foldAlpha=Math.max(0,s.foldAlpha-dt*2.5);
 if(s.phase==="fly"){
  s.elapsed+=dt;
  if(s.keys.up)s.targetY-=255*dt;
  if(s.keys.down)s.targetY+=255*dt;
  const lo=s.H*.19,hi=s.floor-104;
  s.targetY=clamp(s.targetY,lo,hi);
  s.wind=Math.sin(s.progress*.014)*17+Math.sin(s.t*1.2)*8;
  const want=s.targetY+s.wind;
  s.v+=(want-s.py)*dt*6.3;
  s.v*=Math.pow(.36,dt);
  s.v=clamp(s.v,-230,230);
  s.py=clamp(s.py+s.v*dt,lo,hi);
  s.progress=Math.min(END,s.progress+s.speed*dt);
  $("#flightProgressFill").style.width=(s.progress/END*100).toFixed(1)+"%";
  s.hitCooldown=Math.max(0,s.hitCooldown-dt);
  for(const q of s.stars){
    if(q.got)continue;
    const x=planeScreenX(q.x),y=starScreenY(q.y);
    if(Math.abs(x-s.px)<34&&Math.abs(y-s.py)<36){
      q.got=true;s.score++;burst(x,y,19);
      sound(640+s.score*37,.17);
      $("#flightCount").textContent="✦ "+s.score+"/10";
    }
  }
  for(const q of s.hazards){
    if(q.hit||s.hitCooldown>0)continue;
    const x=planeScreenX(q.x),y=birdY(q);
    if(Math.abs(x-s.px)<27&&Math.abs(y-s.py)<26){
      q.hit=true;s.hitCooldown=1.5;s.flash=.28;s.energy=Math.max(0,s.energy-1);
      s.v+=80;burst(s.px,s.py,15,"#c9d9d5");
      sound(185,.16,"triangle",.04);
      if(s.energy===0){
        s.energy=2;
        toast("VENTO A FAVOR! CONTINUE VOANDO ♡");
      }
    }
  }
  if(s.progress>=END){
   s.phase="arrival";s.arrivalTime=0;
   $("#flightToast").classList.remove("show");
   $("#flightSteer").hidden=true;$("#flightAction").hidden=true;
   $("#flightInstruction").textContent="O LIL VIU O RECADINHO NO CÉU…";
   sound(750,.28);
  }
 }else if(s.phase==="arrival"){
   s.arrivalTime+=dt;
   if(s.arrivalTime>5.4)finish();
 }
 for(let i=s.particles.length-1;i>=0;i--){
  const q=s.particles[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=35*dt;q.life-=dt;
  if(q.life<=0)s.particles.splice(i,1);
 }
 if(s.toastUntil&&s.t>s.toastUntil)$("#flightToast").classList.remove("show");
}
function planeScreenX(worldX){return s.px+(worldX-s.progress);}
function starScreenY(rel){return s.H*.19+(s.floor-104-s.H*.19)*rel;}
function birdY(q){return starScreenY(q.relY)+Math.sin(s.t*2.3+q.phase)*37}
function finish(){
 if(s.phase==="done")return;
 s.phase="done";s.finished=true;$("#flightResult").hidden=false;
 $("#flightInstruction").textContent="ESTRELINHAS ENTREGUES: "+s.score+"/10";
 $("#flightBadge").textContent=s.score>=7?"✧ VOO LUMINOSO":s.score>=3?"✦ RECADO ENTREGUE":"♡ O AMOR CHEGOU";
 try{
  const old=JSON.parse(localStorage.getItem("pi-ep-2026-11-10")||"{}");
  localStorage.setItem("pi-ep-2026-11-10",JSON.stringify({completed:true,best:Math.max(old.best||0,s.score),date:EPISODE}));
 }catch(_){}
 burst(s.W*.51,s.floor*.47,45);
 for(const f of [660,830,980])sound(f,.4);
}
function loop(time){
 if(!running)return;
 const dt=last?clamp((time-last)/1000,0,.05):.016;last=time;
 update(dt);render(dt);raf=requestAnimationFrame(loop);
}
function box(color,x,y,w,h,r=3){
 ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();
}
function rect(color,x,y,w,h){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)))}
function polygon(color,pts){
 ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
 ctx.closePath();ctx.fill();
}
function line(color,pts,w=2){
 ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);
 ctx.lineWidth=w;ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=color;ctx.stroke();
}
function ellipse(color,x,y,rx,ry){
 ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,Math.abs(rx),Math.abs(ry),0,0,Math.PI*2);ctx.fill();
}
function circle(color,x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function glow(x,y,r,color){
 const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,"#ffffff00");
 ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);
}
function text(msg,x,y,size=16,color="#fff3d9",align="center"){
 ctx.font="700 "+size+"px 'Pixelify Sans',monospace";ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(msg,x,y);
}
function heart(x,y,size=14,color="#f4adb4"){
 ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y+size*.85);
 ctx.bezierCurveTo(x-size*1.2,y-size*.18,x-size*.9,y-size*1.16,x,y-size*.6);
 ctx.bezierCurveTo(x+size*.9,y-size*1.16,x+size*1.2,y-size*.18,x,y+size*.85);ctx.fill();
}
function spark(x,y,r=9,color="#fff0be"){
 line(color,[[x-r,y],[x+r,y]],2);line(color,[[x,y-r],[x,y+r]],2);
}
function cat(x,y,kind=0,scale=1){
 const colors=[["#e8d5bd","#6b5961","#86bce0"],["#8d99aa","#4e5870","#f0cd8e"],["#e6b29d","#a97575","#c0dfb7"]];
 const [fur,patch,eye]=colors[kind];
 ctx.save();ctx.translate(x,y+Math.sin(s.t*2+kind)*2);ctx.scale(scale,scale);
 ellipse("#22314346",0,3,29,5);
 line(patch,[[18,-17],[27+Math.sin(s.t*2+kind)*7,-26],[26,-37]],6);
 box(fur,-19,-28,40,28,12);box(fur,-16,-50,34,30,9);
 polygon(patch,[[-15,-43],[-15,-60],[-1,-50]]);
 polygon(patch,[[6,-50],[17,-61],[17,-42]]);
 box(eye,-10,-37,6,5,2);box(eye,7,-37,6,5,2);
 box("#dd8e91",-2,-26,5,4,2);
 box(patch,-17,-6,10,8,3);box(patch,8,-6,10,8,3);
 ctx.restore();
}
function person(x,y,who,scale=1,walk=false){
 const lil=who==="lil",shirt=lil?"#a9c5b1":"#e4b997",skin=lil?"#f2c3a5":"#c99277";
 ctx.save();ctx.translate(x,y+Math.sin(s.t*(walk?9:2))*(walk?4:1));ctx.scale(scale,scale);
 const stride=walk?Math.sin(s.t*11)*10:0;
 box("#2d3b57",-15+stride*.5,-30,13,29,5);
 box("#314059",2-stride*.5,-30,13,29,5);
 box("#292b43",-18+stride*.7,-5,17,7,2);
 box("#292b43",2-stride*.7,-5,17,7,2);
 box(shirt,-21,-91,42,67,11);
 box(skin,-29,-74+stride*.3,12,35,5);
 box(skin,18,-74-stride*.3,12,35,5);
 box(skin,-21,-132,42,47,15);
 if(lil){
  box("#f5d492",-23,-140,45,15,8);box("#ffe3a0",-15,-145,27,12,6);
  polygon("#f4d496",[[-21,-134],[-26,-139],[-16,-153],[-3,-140]]);
  polygon("#fff0ab",[[4,-139],[16,-153],[23,-139],[19,-131]]);
  box("#efac9c",-13,-109,10,5,3);box("#efac9c",7,-109,10,5,3);
 }else{
  box("#343346",-22,-138,44,16,8);
  box("#222538",-25,-142,50,10,5);
  box("#2a2939",-18,-112,36,20,9);
  box(skin,-11,-112,22,6,3);
 }
 box("#453b43",-11,-123,6,5,2);box("#453b43",7,-123,6,5,2);
 line("#9a6463",[[-5,-104],[0,-101],[7,-104]],2);
 ctx.restore();
}
function sky(){
 const W=s.W,H=s.H;
 const t=s.phase==="fold"?.18:s.phase==="arrival"||s.phase==="done"?.95:clamp(s.progress/END,0,1);
 const g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,lerpHex("#6b8fb1","#1b2c52",t));
 g.addColorStop(.56,lerpHex("#e6a69c","#6c527e",t));
 g.addColorStop(1,lerpHex("#f9d09b","#b27c8d",t));
 ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const moonX=W*.76,moonY=H*.18;
 glow(moonX,moonY,110,t>.5?"#ffe9b75d":"#ffefcf91");
 circle("#fff1d5",moonX,moonY,25+10*(1-t));
 for(let i=0;i<40;i++){
  const xx=rint(i+36)*W,yy=rint(i+620)*s.floor*.62;
  ctx.globalAlpha=clamp((t-.2)*1.7,0,1)*(.4+.6*Math.sin(s.t*(i%3+1)*.44+i)**2);
  rect("#ffefd7",xx,yy,2+i%3,2+i%3);
 }
 ctx.globalAlpha=1;
 // wind-blown pastel clouds at multiple parallax speeds
 for(let i=0;i<10;i++){
  const span=W+300,v=s.progress*(.04+i%3*.05)+s.t*4;
  const xx=((rint(i+8)*span-v)%span+span)%span-100;
  const yy=s.H*(.09+(i%4)*.082);
  ctx.globalAlpha=.18+i%3*.04;
  ellipse("#fffae8",xx,yy,49+i%3*18,10+i%2*5);
  ellipse("#fff6e4",xx+27,yy-9,27,15);
 }
 ctx.globalAlpha=1;
}
function lerpHex(a,b,t){
 const aa=parseInt(a.slice(1),16),bb=parseInt(b.slice(1),16);
 const r=Math.round(lerp(aa>>16,bb>>16,t)),g=Math.round(lerp(aa>>8&255,bb>>8&255,t)),v=Math.round(lerp(aa&255,bb&255,t));
 return "#"+[r,g,v].map(n=>n.toString(16).padStart(2,"0")).join("");
}

function parallax(){
 const W=s.W,H=s.H,f=s.floor;
 // Buildings form independent near/far layers with moving windows and traffic.
 for(let layer=0;layer<3;layer++){
  const count=Math.ceil(W/(95-layer*10))+4,spacing=layer===0?120:layer===1?90:75;
  const factor=[.10,.20,.35][layer],y0=f-[235,175,107][layer];
  const off=(s.progress*factor)%(spacing*count);
  const building=["#6c708f","#585b7b","#434762"][layer];
  for(let i=-2;i<count+2;i++){
   const xx=i*spacing-(off%spacing)+spacing*.2;
   const h=63+rint(i+layer*151)*[140,113,90][layer];
   const top=y0-h*.45;
   rect(building,xx,top,spacing-5,f-top+28);
   if(i%5===0){
    rect("#403f5e",xx+17,top-35,5,35);
    circle("#ecb5ab",xx+20,top-36,4+Math.sin(s.t*2+i)*1);
   }
   for(let j=0;j<4;j++)for(let k=0;k<5;k++){
    const x=xx+10+j*(spacing-20)/4,yy=top+11+k*21;
    if(yy<f){
     const lit=rint(i*7+j*43+k*31+layer*99)>.42;
     rect(lit?["#ffdcac","#f5bdb1","#d9b5b2"][layer]:"#39435f",x,yy,8,11);
    }
   }
  }
 }
 // Foreground roof ledges shift faster; street traffic animates independently.
 rect("#36465b",0,f,W,H-f);
 rect("#e4bd9b",0,f,W,9);
 rect("#715e73",0,f+8,W,13);
 rect("#27354a",0,f+41,W,H-f-41);
 for(let i=-1;i<10;i++){
  const x=((i*119-s.progress*.72)%(W+120)+(W+120))%(W+120)-50;
  rect("#a58089",x,f+21,40,7);
  rect("#dcb69d",x+20,f+24,4,17);
 }
 for(let i=0;i<5;i++){
  const x=((s.t*(i%2?17:-21)+i*147)%(W+155)+(W+155))%(W+155)-60;
  const y=f+64+i%2*27;
  box(["#d1a1a0","#b4c4bd","#e7bb95"][i%3],x,y,60,21,7);
  box("#4d526d",x+14,y-9,31,14,5);
  rect("#e3c5a9",x+17,y-7,24,8);
  circle("#232c43",x+13,y+20,9);circle("#232c43",x+47,y+20,9);
  circle("#e4bd8c",x+13,y+20,3);circle("#e4bd8c",x+47,y+20,3);
 }
}
function garden(x,y,scale=1){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 box("#8f7381",-24,-30,48,28,5);
 rect("#6b5471",-20,-12,40,9);
 line("#729c7f",[[0,-29],[0,-91]],5);
 for(let i=0;i<5;i++){
  const px=Math.sin(i*1.2+s.t*.5)*29,py=-47-i*10;
  ellipse("#8fbd98",px,py,22,10);
  ellipse("#b4c9a0",px-5,py-2,10,4);
 }
 ctx.restore();
}
function roofAnder(){
 const W=s.W,f=s.floor;
 parallax();
 const x=W*.21;
 box("#e4c2a7",W*.02,f-126,W*.46,126,5);
 rect("#6b5670",W*.02,f-128,W*.46,10);
 for(let i=0;i<5;i++)rect("#e9d5b2",W*.06+i*W*.085,f-104,10,82);
 rect("#5b4c67",W*.03,f-52,W*.44,11);
 garden(W*.08,f-4,.65);
 person(x,f-9,"ander",1.55);
 cat(W*.43,f-6,0,1);
 // Floating preparation table beneath the original, foldable paper.
 box("#a5838d",W*.43,f-79,W*.48,17,4);
 rect("#665b72",W*.49,f-62,9,64);rect("#665b72",W*.81,f-62,9,64);
 for(let i=0;i<7;i++){
  const xx=W*.25+Math.sin(s.t*1.2+i*2.4)*W*.4;
  const yy=f-260+(s.t*14+i*31)%120;
  ctx.globalAlpha=.24;heart(xx,yy,4+i%3,"#f7d7c0");
 }ctx.globalAlpha=1;
}
function roofLil(){
 const W=s.W,f=s.floor;
 parallax();
 const wallx=W*.05;
 rect("#dec5ad",wallx,f-139,W*.9,140);
 rect("#ab8895",wallx-10,f-151,W*.92,15);
 rect("#6a5574",wallx+2,f-49,W*.88,13);
 box("#bd9e9b",W*.68,f-320,W*.24,169,6);
 rect("#38465b",W*.70,f-304,W*.20,130);
 for(let i=0;i<4;i++)for(let j=0;j<3;j++)rect("#ebd7a9",W*.72+i*W*.045,f-278+j*35,10,15);
 garden(W*.16,f-7,.9);
 garden(W*.89,f-7,.8);
 cat(W*.30,f-6,1,.84);cat(W*.77,f-6,2,.84);
 const embrace=ease(clamp((s.arrivalTime-1.3)/2.2,0,1));
 const lilX=W*(.62-.09*embrace);
 const anderX=W*(.23+.21*embrace);
 person(lilX,f-8,"lil",1.4);
 person(anderX,f-8,"ander",1.4,true);
 if(embrace>.45){
  line("#c8957f",[[anderX+18,f-115],[W*.49,f-97],[lilX-11,f-113]],7);
  line("#eab99a",[[lilX-21,f-102],[W*.50,f-95],[anderX+17,f-104]],6);
  for(let i=0;i<9;i++){
   const xx=W*.50+Math.sin(s.t*1.3+i*1.5)*71;
   const yy=f-232-((i*27+s.arrivalTime*23)%160);
   ctx.globalAlpha=Math.min(1,(embrace-.35)*1.4);
   heart(xx,yy,7+i%3*4,i%2?"#ffd6c0":"#f6b2bc");
  }ctx.globalAlpha=1;
 }
 // The note lands in Lil's hand before they embrace.
 const fly=ease(clamp(s.arrivalTime/1.7,0,1));
 drawPlane(lerp(W*.11,lilX+17,fly),lerp(f-240,f-120,fly)-Math.sin(fly*Math.PI)*35,25,Math.sin(fly*4)*.15);
}
function drawPlane(x,y,size=36,rotation=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(rotation);
 glow(0,0,size*.9,"#fff4ca63");
 const a=size;
 polygon("#fff6e5",[[-a*.6,-a*.24],[a*.85,0],[-a*.6,a*.25],[-a*.25,0]]);
 polygon("#eacbb5",[[-a*.35,0],[a*.85,0],[-a*.42,a*.29]]);
 polygon("#ffffff",[[-a*.58,-a*.23],[a*.85,0],[-a*.05,-a*.01]]);
 line("#b9a3a0",[[-a*.58,-a*.24],[a*.85,0],[-a*.44,a*.30]],1.5);
 line("#c77b8b",[[-a*.23,.0],[a*.44,0]],2);
 heart(-a*.08,-a*.11,a*.105,"#e9939f");
 ctx.restore();
}
function paperFold(){
 const W=s.W,H=s.H,cx=W*.55,cy=s.floor*.50;
 glow(cx,cy,160,"#fff1cd65");
 text("FAÇA UM AVIÃO DE PAPEL",cx,cy-170,17,"#fff5e2");
 ctx.save();ctx.translate(cx,cy);
 const f=s.folds,fl=s.foldAlpha;
 // A sheet progressively transforms into airplane geometry, not a flat button.
 if(f===0){
  ctx.save();ctx.rotate(.06+Math.sin(s.t*2)*.02);
  box("#fff5dc",-89,-116,177,216,3);
  for(let i=0;i<5;i++)rect("#f4e2c2",-60,-73+i*28,119,3);
  heart(0,-14,24,"#d88e9b");
  line("#dbb0ae",[[-79,-109],[0,0],[79,-109]],2);
  ctx.restore();
  for(let i=0;i<2;i++){
   spark(cx+(i?95:-95),cy-85,11);
   text(i?"↖":"↗",cx+(i?101:-101),cy-112,31,"#ffe8bf");
  }
 }else if(f===1){
  polygon("#fff3df",[[-85,-110],[87,-110],[87,110],[-85,110]]);
  polygon("#e1bfaf",[[-85,-110],[0,-7],[0,110],[-85,110]]);
  polygon("#f7e3cb",[[87,-110],[0,-7],[0,110],[87,110]]);
  heart(23,33,19,"#d88e9b");
  spark(cx+85,cy-101,13);
  text("↖",100,-132,32,"#fff4c6");
 }else{
  ctx.save();ctx.translate(0,13);ctx.scale(2.65,2.65);
  polygon("#fff8e5",[[-40,-16],[51,0],[-40,16],[-18,0]]);
  polygon("#d8b6ac",[[-18,0],[51,0],[-25,19]]);
  polygon("#ffffff",[[-40,-16],[51,0],[-8,-2]]);
  line("#d4a5a6",[[-40,-16],[51,0],[-25,19]],.7);
  heart(-4,-3,7);
  ctx.restore();
  for(let i=0;i<10;i++){
   const x=Math.sin(i*2.3+s.t)*83,y=-95+(i*27+s.t*20)%171;
   spark(x,y,2.4+i%3,"#ffefd4");
  }
 }
 ctx.restore();
 if(fl>0){ctx.globalAlpha=fl;glow(cx,cy,105,"#ffffffba");ctx.globalAlpha=1;}
}
function drawSkyStamps(){
 for(const q of s.stars){
  if(q.got)continue;
  const x=planeScreenX(q.x),y=starScreenY(q.y);
  if(x<-60||x>s.W+65)continue;
  const pulse=1+.15*Math.sin(s.t*4+q.x);
  glow(x,y,41,"#ffe9ae99");
  ctx.save();ctx.translate(x,y);ctx.rotate(s.t*.42);
  const sz=16*pulse,verts=[];
  for(let j=0;j<10;j++){
   const a=-Math.PI/2+j*Math.PI/5,r=j%2?sz*.45:sz;
   verts.push([Math.cos(a)*r,Math.sin(a)*r]);
  }
  polygon("#ffe3a2",verts);
  ctx.restore();
  circle("#fffbea",x-3,y-3,3);
 }
}
function drawBird(x,y,phase,hit=false){
 ctx.save();ctx.translate(x,y);
 if(hit)ctx.globalAlpha=.35;
 ellipse("#36495b",0,2,16,9);
 ellipse("#8ba7a7",3,-2,11,6);
 const lift=Math.sin(s.t*8+phase)*13;
 polygon("#456074",[[-6,-3],[-30,-15-lift],[-11,7]]);
 polygon("#5b7684",[[3,-2],[30,-14-lift],[11,9]]);
 polygon("#e9b997",[[13,-2],[27,2],[13,6]]);
 circle("#fae2c6",7,-5,2);
 ctx.restore();
}
function drawHazards(){
 for(const q of s.hazards){
  const x=planeScreenX(q.x),y=birdY(q);
  if(x<-60||x>s.W+60)continue;
  drawBird(x,y,q.phase,q.hit);
 }
}
function drawFlight(){
 const W=s.W,H=s.H,f=s.floor;
 sky();parallax();
 // Three atmospheric animated elements change between districts.
 if(s.progress>850&&s.progress<1950){
  const x=W*.74+Math.sin(s.t*.8)*19,y=H*.27+Math.sin(s.t*1.6)*9;
  line("#e3d7cb",[[x,y],[x+12,y+117]],2);
  polygon("#f0bcc8",[[x,y-43],[x+23,y],[x,y+43],[x-23,y]]);
  polygon("#f7d0ac",[[x,y-43],[x+23,y],[x,y]]);
 }
 if(s.progress>1950){
  for(let i=0;i<12;i++){
   const xx=((i*31+s.t*18)%W),yy=f-80+Math.sin(s.t+i)*40;
   glow(xx,yy,17,"#fbe6a64d");circle("#fff0bd",xx,yy,3);
  }
 }
 drawSkyStamps();drawHazards();
 // Wind streaks, plane movement and a visually continuous paper trail.
 for(let i=0;i<18;i++){
  const wx=((i*47-s.progress*1.45)%(W+115)+(W+115))%(W+115)-70;
  const wy=H*.20+i*31%(f-H*.20);
  ctx.globalAlpha=.13+.12*Math.sin(s.t+i);
  line("#fff9eb",[[wx,wy],[wx+33+i%3*11,wy-6]],2);
 }ctx.globalAlpha=1;
 for(let i=0;i<13;i++){
  const xx=s.px-12-i*11,yy=s.py+Math.sin(s.t*7-i*.65)*5;
  ctx.globalAlpha=(1-i/15)*.65;
  heart(xx,yy,3+i%3,"#ffe8c4");
 }ctx.globalAlpha=1;
 if(s.hitCooldown===0||Math.floor(s.t*11)%2===0)drawPlane(s.px,s.py,43,clamp(s.v/400,-.23,.23));
 if(s.flash>0){
  ctx.globalAlpha=s.flash*.75;
  rect("#fff0ce",0,0,W,H);
  ctx.globalAlpha=1;
 }
 // Heart shield HUD in canvas, not covering the playground.
 for(let i=0;i<3;i++)heart(24+i*31,H*.15,10,i<s.energy?"#ffe0be":"#6e6579");
 text("COLETE ESTRELAS • DESVIE DOS PÁSSAROS",W*.5,f-30,13,"#ffead1");
}

function drawFinal(){
 sky();roofLil();
 const W=s.W,f=s.floor;
 // Paper falls into Lil's hand, then Ander approaches and the hug unfolds.
 const t=s.arrivalTime;
 if(t<1.3){
  text("OLHA SÓ, UMA CARTINHA!",W*.5,f-280,18,"#ffe8c5");
 }
 if(t>2.0){
  glow(W*.5,f-201,172,"#ffe6b87b");
  for(let i=0;i<14;i++){
   const xx=W*.5+Math.sin(i*2.4+s.t*1.1)*W*.23;
   const yy=f-218-(i*21+s.t*20)%202;
   heart(xx,yy,6+i%4*2,"#ffc8c5");
  }
 }
 text("✦ "+s.score+" ESTRELAS ENTREGUES",W*.5,f+55,17,"#fff2d7");
}
function drawParticles(){
 for(const q of s.particles){
  ctx.globalAlpha=clamp(q.life/1.3,0,1);
  if(q.heart)heart(q.x,q.y,6,q.col);
  else circle(q.col,q.x,q.y,2.5);
 }
 ctx.globalAlpha=1;
}
function render(){
 if(!ctx||!s.W)return;
 ctx.clearRect(0,0,s.W,s.H);
 if(s.phase==="fold"){sky();roofAnder();paperFold();}
 else if(s.phase==="fly")drawFlight();
 else drawFinal();
 drawParticles();
}
window.__FlightTodayStatus=()=>({
 active:!!root&&!root.hidden,phase:s.phase,folds:s.folds,progress:Math.round(s.progress),
 score:s.score,energy:s.energy,py:Math.round(s.py),targetY:Math.round(s.targetY),
 finished:s.finished,viewport:[s.W,s.H]
});
if(location.protocol==="file:")window.__FlightTodayQA={
 open:()=>open(),fold:()=>fold(),action:()=>action(),flyStep:secs=>{const total=Math.ceil(secs/.03);for(let i=0;i<total;i++)update(.03)},
 setPlaneY:y=>{s.targetY=clamp(y,s.H*.2,s.floor-105);s.py=s.targetY},
 finish:()=>{s.progress=END;update(.04);s.arrivalTime=5.4;update(.05)}
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();
