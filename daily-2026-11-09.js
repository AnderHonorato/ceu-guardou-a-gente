"use strict";
/* Episódio especial: 9 de novembro. Baseado no relato autorizado por Ander. */
(() => {
 const DATE="2026-11-09", TZ="America/Sao_Paulo";
 const $=s=>document.querySelector(s), clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
 const mix=(a,b,n)=>a+(b-a)*n, smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
 const stages=[
  ["MANHÃ","Abra a cortina","DESLIZE A CORTINA PARA A DIREITA"],
  ["O ABRAÇO","A conchinha","APROXIME E ABRACE O LIL"],
  ["TRABALHO","Um até logo","ARRASTE TRÊS ITENS PARA A MOCHILA"],
  ["EM CASA","Vídeos juntinhos","MUDE OS VÍDEOS E ASSISTA AOS TRÊS"],
  ["A NOITE","O nosso tempo","BAIXE A LUZ, FECHE A CORTINA E ABRACE"],
  ["09.11.2026","Mais um dia de nós","NOSSA HISTÓRIA CONTINUA"]
 ];
 let root,canvas,c,playing=false,last=0,raf=0;
 const S={phase:0,t:0,elapsed:0,W:480,H:880,floor:640,press:false,start:null,ptr:null,
  progress:0,hold:0,bagged:0,items:[],drag:null,clip:0,watch:0,seen:0,
  curtain:0,close:0,nightHold:0,walk:0,finished:false,transition:0,nextPhase:null,
  particles:[],noticeUntil:0};
 function dateBR(){return new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date())}
 function el(tag,cls,html){const n=document.createElement(tag);n.className=cls;n.innerHTML=html;return n}
 function ready(){
   const opening=$(".opening-paper"),ending=$(".ending-actions");
   if(opening){
     const b=el("button","daily-launch",'<span class="daily-launch-mark">✦</span><span><small>EPISÓDIO NOVO · 09 DE NOVEMBRO</small><strong>Depois daquela noite</strong></span><span>↗</span>');
     b.id="dailyLaunch";b.type="button";b.addEventListener("click",start);
     opening.insertBefore(b,opening.querySelector(".opening-help"));
   }
   if(ending){
     const b=el("button","daily-after-ending","✦ CONTINUAR A NOSSA HISTÓRIA · 09 NOV →");
     b.id="dailyAfterEnding";b.type="button";b.addEventListener("click",start);ending.prepend(b);
   }
   mount();
   const params=new URLSearchParams(location.search);
   if(params.get("episodio")===DATE && dateBR()>=DATE){
     setTimeout(start,180);
   }
 }
 function mount(){
   root=el("section","daily-episode",[
     '<canvas id="dailyCanvas" aria-label="Cena jogável 2D: amanhecer, conchinha, trabalho, vídeos e noite" tabindex="0"></canvas>',
     '<header class="daily-topbar"><button type="button" id="dailyLeave" class="daily-leave">← SAIR</button><div class="daily-heading"><small id="dailyMeta">09.11 • EPISÓDIO 07</small><strong id="dailyTitle">Depois daquela noite</strong></div><span class="daily-count" id="dailyCount">01/06</span></header>',
     '<div class="daily-progress" id="dailyProgress"></div>',
     '<div id="dailyFloating" class="daily-floating" aria-live="polite"></div>',
     '<div id="dailyGuide" class="daily-scene-guide">DESLIZE A CORTINA →</div>',
     '<footer class="daily-bottom"><div class="daily-dots">✦ ♡ ✦</div><button id="dailyAssist" class="daily-assist" type="button">✳ FAZER GESTO</button><button id="dailyNext" class="daily-next" type="button" hidden>CONTINUAR <span>→</span></button></footer>',
     '<div id="dailyEnd" class="daily-end" hidden><div class="daily-end-decoration">✦ ♥ ✦</div><h2>Mais um dia,<br><em>mais nós dois.</em></h2><p>Ontem foi difícil. Hoje começou com saudade, um abraço e uma conchinha. E terminou com a gente pertinho outra vez.</p><div class="daily-end-actions"><button id="dailyReplay" type="button">↶ REVIVER ESSE DIA</button><button id="dailyBack" type="button">VOLTAR AO NOSSO MUNDO</button></div><span class="daily-end-sign">Ander & Lil · 09 de novembro de 2026</span></div>'
   ].join(""));
   root.id="dailyEpisode";root.hidden=true;root.setAttribute("aria-label","Episódio 9 de novembro: depois daquela noite");
   $("#shell").appendChild(root);canvas=$("#dailyCanvas");c=canvas.getContext("2d",{alpha:false});
   $("#dailyProgress").innerHTML=stages.map(()=>"<span></span>").join("");
   $("#dailyLeave").addEventListener("click",leave);
   $("#dailyBack").addEventListener("click",leave);
   $("#dailyReplay").addEventListener("click",reset);
   $("#dailyNext").addEventListener("click",advance);
   $("#dailyAssist").addEventListener("click",assist);
   for(const ev of ["pointerdown","pointermove","pointerup","pointercancel"]){
     canvas.addEventListener(ev,ev==="pointerdown"?down:ev==="pointermove"?move:up,{passive:false});
   }
   document.addEventListener("keydown",e=>{
     if(root.hidden)return;
     if(e.key==="Escape"){leave();return}
     if(e.key==="Enter"||e.key===" "){e.preventDefault();assist()}
     if(e.key==="ArrowRight"&&S.phase===3)switchClip();
   });
   window.addEventListener("resize",resize);
 }
 function start(){
   if(dateBR()<DATE)return;
   root.hidden=false;$("#opening").style.visibility="hidden";$("#ending").style.visibility="hidden";
   reset();resize();playing=true;last=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
 }
 function reset(){
   Object.assign(S,{phase:0,t:0,elapsed:0,press:false,start:null,ptr:null,progress:0,hold:0,bagged:0,
    items:[],drag:null,clip:0,watch:0,seen:0,curtain:0,close:0,nightHold:0,walk:0,
    finished:false,transition:0,nextPhase:null,particles:[],noticeUntil:0});
   $("#dailyEnd").hidden=true;setStage();
 }
 function leave(){
   playing=false;cancelAnimationFrame(raf);root.hidden=true;
   $("#opening").style.visibility="";$("#ending").style.visibility="";
 }
 function resize(){
   if(!canvas||root.hidden)return;
   const b=canvas.getBoundingClientRect();if(!b.width||!b.height)return;
   const portrait=b.height/b.width>1.12;
   S.W=portrait?480:Math.max(680,Math.round(480*b.width/b.height));
   S.H=portrait?Math.round(480*b.height/b.width):480;
   S.floor=Math.round(S.H*(portrait?.74:.79));
   canvas.width=S.W;canvas.height=S.H;c.imageSmoothingEnabled=false;
   if(S.phase===2)items();
 }
 function items(){
   const W=S.W,f=S.floor;
   S.items=[
    {id:"keys",x:W*.23,y:f-191,ox:W*.23,oy:f-191,done:false},
    {id:"water",x:W*.5,y:f-243,ox:W*.5,oy:f-243,done:false},
    {id:"phones",x:W*.75,y:f-188,ox:W*.75,oy:f-188,done:false}
   ];S.bagged=0;
 }
 function setStage(){
   const a=stages[S.phase];
   $("#dailyMeta").textContent=a[0]+" • 09.11.2026";
   $("#dailyTitle").textContent=a[1];
   $("#dailyGuide").textContent=a[2];
   $("#dailyCount").textContent=String(S.phase+1).padStart(2,"0")+"/06";
   [...$("#dailyProgress").children].forEach((q,i)=>q.className=i<=S.phase?"active":"");
   $("#dailyAssist").hidden=S.phase===5||S.finished;
   $("#dailyNext").hidden=S.phase===5||!S.finished;
   if(S.phase===0)notice("DEPOIS DE UMA NOITE DIFÍCIL...",4);
   if(S.phase===1)notice("O LIL TE ABRAÇOU. AGORA VIRA E ABRAÇA ELE.",4);
   if(S.phase===2){items();notice("O TRABALHO CHAMOU... O CARINHO FICOU.",4)}
   if(S.phase===3)notice("CHEGOU EM CASA. AGORA VÍDEOS JUNTINHOS.",4);
   if(S.phase===4)notice("DEIXE O MUNDO LÁ FORA POR UM INSTANTE.",4);
   if(S.phase===5){$("#dailyEnd").hidden=false;try{localStorage.setItem("pi-daily-2026-11-09","complete")}catch(_){}}
 }
 function notice(t,d=2.7){
   $("#dailyFloating").textContent=t;$("#dailyFloating").classList.add("visible");S.noticeUntil=S.t+d;
 }
 function finish(){
   if(S.finished)return;S.finished=true;sparks(S.W*.50,S.floor-175,33);
   $("#dailyAssist").hidden=true;$("#dailyNext").hidden=S.phase===5;
   notice(["O LIL SENTIU SUA FALTA E VEIO TE ABRAÇAR ♡",
    "AQUELA CONCHINHA ANTES DE IR TRABALHAR",
    "UM BEIJO E UM ATÉ LOGO...",
    "DE VOLTA EM PAZ, VENDO VÍDEOS JUNTOS",
    "E A NOITE FOI SÓ DE VOCÊS. ♥"][S.phase]||"MAIS UM DIA JUNTOS!",4.2);
 }
 function advance(){
   if(!S.finished||S.nextPhase!==null)return;S.nextPhase=Math.min(5,S.phase+1);S.transition=0;
 }
 function step(){
   S.phase=S.nextPhase;S.nextPhase=null;S.transition=0;S.elapsed=0;S.progress=0;S.hold=0;
   S.finished=false;S.press=false;S.nightHold=0;S.drag=null;
   if(S.phase===3){S.clip=0;S.watch=0;S.seen=0}
   setStage();
 }
 function pt(e){const b=canvas.getBoundingClientRect();return {x:(e.clientX-b.left)/b.width*S.W,y:(e.clientY-b.top)/b.height*S.H}}
 function down(e){
   if(S.finished||S.nextPhase!==null||S.phase===5)return;
   e.preventDefault();canvas.setPointerCapture(e.pointerId);S.press=true;S.ptr=pt(e);S.start={...S.ptr};
   if(S.phase===2)S.drag=S.items.find(o=>!o.done&&Math.hypot(o.x-S.ptr.x,o.y-S.ptr.y)<58)||null;
   if(S.phase===3)switchClip();
 }
 function move(e){
   if(!S.press||S.finished||S.nextPhase!==null)return;
   e.preventDefault();const q=pt(e),start=S.start,W=S.W;
   if(S.phase===0)S.progress=clamp(Math.max(S.progress,(q.x-start.x)/(W*.61)),0,1);
   if(S.phase===1)S.progress=clamp(Math.max(S.progress,(q.x-start.x)/(W*.36)),0,1);
   if(S.phase===2&&S.drag){S.drag.x=q.x;S.drag.y=q.y}
   if(S.phase===4){
     if(S.progress<.87)S.progress=clamp(Math.max(S.progress,(start.x-q.x)/(W*.60)),0,1);
     else if(S.curtain<.87)S.curtain=clamp(Math.max(S.curtain,(q.x-start.x)/(W*.61)),0,1);
     else S.close=clamp(Math.max(S.close,(q.x-start.x)/(W*.34)),0,1);
   }
   S.ptr=q;
 }
 function up(e){
   if(!S.press)return;const q=pt(e);
   if(S.phase===0)S.progress=clamp(S.progress+.13,0,1);
   if(S.phase===1)S.progress=clamp(S.progress+.12,0,1);
   if(S.phase===2&&S.drag){
     if(Math.hypot(q.x-S.W*.78,q.y-(S.floor-100))<103){
       S.drag.done=true;S.bagged++;sparks(S.W*.78,S.floor-100,13);
     }else{S.drag.x=S.drag.ox;S.drag.y=S.drag.oy}
     S.drag=null;
   }
   if(S.phase===4){
     if(S.progress>=.87&&S.curtain<.87)S.curtain=clamp(S.curtain+.12,0,1);
     else if(S.progress>=.87)S.close=clamp(S.close+.12,0,1);
   }
   S.press=false;
 }
 function switchClip(){
   if(S.watch<2.6){notice("ASSISTA UM POUQUINHO ANTES DE TROCAR ♡",1.8);return}
   S.seen|=1<<S.clip;
   if(S.seen===7){finish();return}
   S.clip=(S.clip+1)%3;S.watch=0;sparks(S.W*.50,S.floor-220,9);
 }
 function assist(){
   if(S.finished){advance();return}
   if(S.phase===0)S.progress=clamp(S.progress+.36,0,1);
   else if(S.phase===1)S.progress=clamp(S.progress+.35,0,1);
   else if(S.phase===2){
     const q=S.items.find(o=>!o.done);if(q){q.done=true;S.bagged++;sparks(S.W*.78,S.floor-100,8)}
   }else if(S.phase===3)switchClip();
   else if(S.phase===4){
     if(S.progress<.87)S.progress=clamp(S.progress+.36,0,1);
     else if(S.curtain<.87)S.curtain=clamp(S.curtain+.36,0,1);
     else S.close=clamp(S.close+.36,0,1);
   }
 }
 function update(dt){
   S.t+=dt;S.elapsed+=dt;
   if(S.nextPhase!==null){
     S.transition+=dt*1.5;
     if(S.transition>=1)step();
   }
   if(S.phase===0&&S.progress>=.96){S.hold+=dt;if(S.hold>2.4)finish()}
   if(S.phase===1&&S.progress>=.90){S.hold+=dt;if(S.hold>1.95)finish()}
   if(S.phase===2&&S.bagged===3){S.walk+=dt;if(S.walk>3.0)finish()}
   if(S.phase===3){
     S.watch+=dt;
     if(S.watch>2.7&&!(S.seen&(1<<S.clip))){S.seen|=1<<S.clip;sparks(S.W*.5,S.floor-220,12)}
     if(S.seen===7&&S.watch>2.7)finish();
   }
   if(S.phase===4&&S.progress>=.87&&S.curtain>=.87&&S.close>=.87){
     S.nightHold+=dt;if(S.nightHold>2.6)finish();
   }
   if(S.t>S.noticeUntil)$("#dailyFloating").classList.remove("visible");
 }
 function loop(t){
   if(!playing)return;
   const dt=last?clamp((t-last)/1000,0,.05):.016;last=t;
   update(dt);render(dt);raf=requestAnimationFrame(loop);
 }

 function rect(col,x,y,w,h){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))}
 function rounded(col,x,y,w,h,r=7){c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
 function disk(col,x,y,r){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 function ellipse(col,x,y,rx,ry){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
 function poly(col,points){c.fillStyle=col;c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.closePath();c.fill()}
 function stroke(col,points,w=3){
   c.strokeStyle=col;c.lineWidth=w;c.lineJoin="round";c.lineCap="round";
   c.beginPath();c.moveTo(...points[0]);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.stroke();
 }
 function glow(x,y,r,col){
   const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,"#ffffff00");
   c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
 }
 function txt(msg,x,y,size=16,color="#fff1dc",align="center"){
   c.font="700 "+size+"px 'Pixelify Sans',monospace";c.textAlign=align;c.fillStyle=color;c.fillText(msg,x,y);
 }
 function heart(x,y,r,col="#f6b1b3"){
   c.fillStyle=col;c.beginPath();c.moveTo(x,y+r*.9);
   c.bezierCurveTo(x-r*1.5,y-r*.2,x-r*.85,y-r*1.4,x,y-r*.65);
   c.bezierCurveTo(x+r*.85,y-r*1.4,x+r*1.5,y-r*.2,x,y+r*.9);c.fill();
 }
 function star(x,y,t,size=7,color="#ffe3af"){
   const s=size*(.75+.25*Math.sin(t*3));
   stroke(color,[[x-s,y],[x+s,y]],2);
   stroke(color,[[x,y-s],[x,y+s]],2);
 }
 function stars(count=23,glowColor="#fff6d8"){
   for(let i=0;i<count;i++){
     const seed=i*27.7,xx=(Math.sin(seed+3.7)*23751.1)%1;
     const yy=(Math.sin(seed*3+18.5)*8738.77)%1;
     const x=(Math.abs(xx))*(S.W),y=28+Math.abs(yy)*S.H*.49;
     const pulse=.2+.8*Math.abs(Math.sin(S.t*(.9+i%3*.42)+i));
     c.globalAlpha=pulse;rect(glowColor,x,y,i%4===0?3:2,i%3===0?3:2);
   }c.globalAlpha=1;
 }
 function sparks(x,y,n){
   for(let i=0;i<n;i++){
     const a=i/n*Math.PI*2,speed=28+Math.random()*110;
     S.particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-42,life:1+Math.random()*.8,full:1.8,size:3+Math.random()*3,heart:i%4===0,
       col:["#ffe9ba","#ffd2c8","#b1d9d4"][i%3]});
   }
 }
 function particles(dt){
   for(let i=S.particles.length-1;i>=0;i--){
     const q=S.particles[i];q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=30*dt;q.life-=dt;
     if(q.life<=0){S.particles.splice(i,1);continue}
     c.globalAlpha=clamp(q.life/q.full,0,1);
     if(q.heart)heart(q.x,q.y,q.size*2.3,q.col);else disk(q.col,q.x,q.y,q.size);
   }c.globalAlpha=1;
 }
 function sky(night=false){
   const W=S.W,H=S.H;
   const g=c.createLinearGradient(0,0,0,H);
   const dawn=["#2f385c","#71618b","#d89b99","#f4c6a2"];
   const evening=["#211c44","#514269","#9b6484","#d19c99"];
   const colors=night?evening:dawn;
   for(let i=0;i<colors.length;i++)g.addColorStop(i/(colors.length-1),colors[i]);
   c.fillStyle=g;c.fillRect(0,0,W,H);
   if(night)stars(32);
   const xx=W*.78,yy=S.floor*.20;
   glow(xx,yy,120,night?"#eac8d75e":"#fff0ca9b");disk(night?"#f0d2c3":"#fff0cf",xx,yy,night?27:43);
   for(let i=0;i<5;i++){
     const x=(i*167+S.t*(i%2?2.2:4.5))%(W+180)-80;
     const y=S.floor*.10+(i%3)*37;
     c.globalAlpha=.18+i%2*.06;
     rounded("#fff9e8",x,y,58+i%3*25,10,5);
     rounded("#fff9e8",x+19,y-9,31,13,6);
   }c.globalAlpha=1;
 }
 function roomBasics(night=false){
   const W=S.W,f=S.floor;
   sky(night);
   const g=c.createLinearGradient(0,0,0,f);
   g.addColorStop(0,night?"#46385470":"#a48ca37b");g.addColorStop(1,night?"#5c4564":"#c79b9a");
   c.fillStyle=g;c.fillRect(0,0,W,f);
   rect("#f2d5b4",0,f-16,W,7);rect("#574d68",0,f-9,W,12);
   c.fillStyle=night?"#59405f":"#9f747a";c.fillRect(0,f,W,S.H-f);
   for(let i=0;i<13;i++){const y=f+20+i*23;stroke("#ffffff17",[[0,y],[W,y]],1);rect("#473e5a2b",i%2*40,y,3,25);}
   // Warm apartment wall decor
   rounded("#7d6375",W*.61,f-342,115,116,6);
   rounded(night?"#bf99a7":"#e9c2aa",W*.62,f-334,101,102,4);
   disk("#f1d5b8",W*.69,f-300,20);
   poly("#8bafa0",[[W*.64,f-247],[W*.73,f-310],[W*.80,f-248]]);
   poly("#76a194",[[W*.70,f-248],[W*.77,f-293],[W*.82,f-248]]);
   rounded("#9a7b78",W*.12,f-280,79,88,6);
   rounded("#f5e4be",W*.125,f-271,69,71,3);
   heart(W*.197,f-227,15,"#bb828d");
 }
 function windowFrame(x,y,w,h,night=false){
   rounded("#415266",x-8,y-8,w+16,h+16,7);
   const g=c.createLinearGradient(x,y,x,y+h);
   g.addColorStop(0,night?"#202640":"#93bcc4");g.addColorStop(1,night?"#735977":"#f2caac");
   c.fillStyle=g;c.fillRect(x,y,w,h);
   if(night){for(let i=0;i<10;i++)disk("#fff2c7",x+11+(i*17)%w,y+11+(i*19)%(h-16),i%3===0?2:1)}
   else{disk("#fff2c5",x+w*.77,y+h*.26,24);rounded("#f8e6d2a4",x+20+Math.sin(S.t*.6)*9,y+25,54,9,5)}
   for(let i=0;i<7;i++){
     const bx=x+i*w/7,by=y+h*.61+(i%3)*11;
     rect("#557387",bx,by,w/7+2,y+h-by);
     if(night)rect("#f1c5a2",bx+6,by+9,5,7);
   }
   rect("#e6d4bd",x+w*.48,y,5,h);rect("#e6d4bd",x,y+h*.51,w,5);
   rounded("#e6d1b7",x-13,y+h-4,w+26,12,4);
 }
 function curtain(x,y,w,h,opening,night=false){
   const leftW=w*(.48-.43*opening),rightW=leftW;
   // drapery moves by meaningful proportions
   for(let j=0;j<2;j++){
     const bx=j===0?x-10:x+w-rightW+10;
     const ww=leftW+10;
     poly(night?"#725878":"#be8c99",[[bx,y-16],[bx+ww,y-16],[bx+ww+Math.sin(S.t*.9+j)*5,y+h],[bx-8,y+h]]);
     for(let i=1;i<4;i++){
       const xx=bx+ww*i/4;
       stroke(night?"#986e95":"#e9b2ab",[[xx,y-9],[xx+4,y+h-13]],2);
     }
   }
   rounded("#e4cbb5",x-20,y-20,w+40,9,5);
 }
 function cat(x,y,scale=1,kind=0){
   const colours=[
    ["#e4d0b6","#655554","#93c4e2"],
    ["#8b919e","#596275","#e4bb7f"],
    ["#efbd9f","#a56f68","#a5d7b7"]
   ];
   const [body,tip,eyes]=colours[kind];
   c.save();c.translate(x,y+Math.sin(S.t*2+kind)*2);c.scale(scale,scale);
   ellipse("#26354a36",0,3,26,7);
   stroke(tip,[[18,-16],[27+Math.sin(S.t*3+kind)*8,-23],[22+Math.sin(S.t*4+kind)*7,-38]],7);
   rounded(body,-22,-27,44,28,12);
   rounded(body,-15,-49,32,30,10);
   poly(tip,[[-15,-43],[-16,-62],[-1,-50]]);
   poly(tip,[[5,-50],[17,-62],[17,-41]]);
   rounded(eyes,-9,-36,6,6,2);rounded(eyes,7,-36,6,6,2);
   rounded("#c97c81",0,-26,5,4,2);
   rounded(tip,-18,-5,11,9,3);rounded(tip,9,-5,11,9,3);
   c.restore();
 }
 function face(x,y,who,scale=1,rot=0,eyesOpen=true){
   const skin=who==="lil"?"#edbea0":"#c89378";
   const dark=who==="lil"?"#f5d89a":"#242937";
   c.save();c.translate(x,y);c.rotate(rot);c.scale(scale,scale);
   ellipse("#442c3940",0,13,25,27);
   rounded(skin,-21,-29,42,50,16);
   if(who==="ander"){
     rounded("#27283a",-22,-32,44,15,6);
     rounded("#212536",-25,-34,50,9,4);
     rounded("#2b2a36",-20,0,40,16,7);
     rounded(skin,-12,3,24,5,4);
   }else{
     rounded("#e8bc81",-23,-32,45,13,4);
     rounded("#ffdf9e",-20,-43,41,19,10);
     rounded("#f8d391",-26,-31,12,15,5);
     rounded("#ffe9ab",9,-38,16,15,5);
   }
   if(eyesOpen){
     rounded("#4a3d48",-12,-10,7,4,2);
     rounded("#4a3d48",6,-10,7,4,2);
   }else{
     stroke("#5c4351",[[-12,-8],[-5,-8]],2);
     stroke("#5c4351",[[6,-8],[13,-8]],2);
   }
   if(who==="lil"){ellipse("#eb9f9a",-13,3,7,4);ellipse("#eb9f9a",13,3,7,4)}
   stroke("#9d6066",[[-4,5],[1,8],[6,5]],2);
   c.restore();
 }
 function human(x,y,who,scale=1,pose="stand"){
   c.save();c.translate(x,y);c.scale(scale,scale);
   const isLil=who==="lil",skin=isLil?"#edbd9e":"#d19b7e",shirt=isLil?"#a7cbb7":"#e1b28f";
   if(pose==="sit"){
     rounded("#243b53",-18,-29,37,19,6);
     rounded("#1c2c43",-24,-10,24,11,5);rounded("#1c2c43",2,-10,22,11,5);
     rounded(shirt,-21,-69,42,46,9);
     rounded(skin,-26,-52,10,26,4);rounded(skin,16,-52,10,26,4);
     face(0,-88,who,.75,0,true);
   }else{
     const step=pose==="walk"?Math.sin(S.t*11)*7:0;
     rounded("#26394d",-17+step*.5,-28,13,29,4);rounded("#293949",4-step*.5,-28,13,29,4);
     rounded("#202737",-19+step,-3,16,7,3);rounded("#202737",4-step,-3,16,7,3);
     rounded(shirt,-21,-90,42,66,9);
     rounded(skin,-29,-76+step*.45,11,36,4);
     rounded(skin,18,-76-step*.45,11,36,4);
     face(0,-109+Math.abs(step)*.15,who,1,0,true);
   }
   c.restore();
 }
 function bed(){
   const W=S.W,f=S.floor,x=W*.065,w=W*.87;
   glow(W*.5,f-139,W*.57,"#ffe7bd32");
   rounded("#60495c",x,f-232,w,189,24);
   rounded("#aa7888",x+7,f-224,w-14,142,17);
   rounded("#e9bcae",x+14,f-215,w-28,126,15);
   rounded("#ffebd9",x+26,f-208,w*.33,68,15);
   rounded("#f4d3c6",x+w*.59,f-208,w*.29,68,15);
   // animated blanket edge breathes around the two people
   const bob=Math.sin(S.t*2)*3;
   rounded("#a77a9a",x+19,f-163+bob,w-38,106,22);
   rounded("#bc8ca6",x+21,f-158+bob,w-42,89,20);
   rounded("#eab7b2",x+22,f-99+bob,w-44,25,10);
   for(let i=0;i<7;i++)stroke("#efc8bb65",[[x+29+i*w/7,f-147+bob],[x+32+i*w/7,f-81+bob]],2);
   rounded("#8a697f",x+2,f-67,w-4,18,6);
   rounded("#5f4b68",x+25,f-48,12,39,4);
   rounded("#5f4b68",x+w-37,f-48,12,39,4);
 }

 function bedroom(){
   const W=S.W,f=S.floor,day=S.phase===0?S.progress:1;
   roomBasics();
   const wx=W*.21,wy=f-430,ww=W*.42;
   windowFrame(wx,wy,ww,170,false);
   // Morning light travels across the floor as the curtain opens.
   c.globalAlpha=.13+day*.24;
   poly("#fff6cc",[[wx+ww*.18,wy+170],[wx+ww*.80,wy+170],[W*.97,f],[W*.36,f]]);
   c.globalAlpha=1;
   curtain(wx,wy,ww,170,day);
   rounded("#8d6c72",W*.84,f-269,9,136,4);
   disk("#f6cf9f",W*.85,f-272,24);
   glow(W*.85,f-270,90,"#fce8b18a");
   // Cap on the chair by the window: Ander has no cap on in bed.
   rounded("#82677b",W*.69,f-126,77,13,6);
   rounded("#343444",W*.69+13,f-138,47,15,5);
   rounded("#24293b",W*.69+2,f-133,63,10,4);
   bed();
   const approach=S.phase===0?smooth(S.progress):1;
   const kiss=S.phase===1?smooth(S.progress):0;
   const anderX=W*(.30+.14*kiss),lilX=W*(.72-.17*approach);
   face(anderX,f-184+Math.sin(S.t*2)*2,"ander",.95,-.13+kiss*.22,S.phase===1||approach>.89);
   face(lilX,f-183+Math.sin(S.t*2+.9)*2,"lil",.95,.08-.22*approach,approach>.81);
   if(approach>.5){
     // Lil wakes up already holding Ander.
     const t=smooth((approach-.5)*2),left=lilX-22,right=anderX+18;
     stroke("#e5b493",[[left,f-162],[W*.50,f-145],[right,f-166]],6);
     disk("#e7b69a",right,f-166,5);
     if(kiss>.2){
       stroke("#d2a080",[[anderX+4,f-143],[W*.47,f-131],[lilX-14,f-158]],7);
       disk("#d6a487",lilX-14,f-158,6);
     }
     for(let i=0;i<4;i++){
       const x=W*.52+Math.sin(S.t*1.3+i*2)*W*.12;
       const y=f-258-i*18+Math.sin(S.t*2+i)*9;
       c.globalAlpha=(.25+.6*t)*(kiss>.1?1:.65);
       heart(x,y,6+i%3*3,"#ffdad0");
     }c.globalAlpha=1;
   }
   // Their actual three cats are present without invented names.
   cat(W*.14,f-14,.72,0);cat(W*.89,f-8,.68,1);
   if(S.phase===0&&S.progress<.96){
     const x=wx+ww*.55+Math.sin(S.t*2)*7;
     glow(x,wy+81,30,"#fff1b69a");
     stroke("#ffebc0",[[x-26,wy+110],[x+26,wy+110]],3);
     poly("#ffebc0",[[x+26,wy+110],[x+13,wy+102],[x+13,wy+119]]);
   }
   if(S.phase===1){
     txt("♡",W*.5,f-294,35,"#ffe0c8");
     if(S.progress>=.90){
       glow(W*.5,f-194,110,"#ffe0cc4d");
       for(let i=0;i<6;i++)heart(W*.5+Math.sin(S.t*1.1+i)*55,f-280+i*16,4+i%2*4,"#ffe4d9");
     }
   }
   if(S.phase===0)drawMeter(S.progress,"O SOL VAI ENTRANDO…",f+45);
   else drawMeter(S.progress,"CONCHINHA",f+45);
 }
 function drawMeter(value,title,y){
   const W=S.W;
   rounded("#273b4bc4",W*.18,y,W*.64,18,10);
   rounded("#f5d2a5",W*.19,y+3,(W*.62)*clamp(value,0,1),12,7);
   txt(title,W*.5,y-13,14,"#fff2d5");
 }
 function itemIcon(item){
   const x=item.x,y=item.y;
   glow(x,y,46,"#ffe0b26b");
   rounded("#f9e4bf",x-37,y-37,74,74,10);
   rounded("#384f60",x-33,y-33,66,66,7);
   if(item.id==="keys"){
     c.strokeStyle="#f6d49a";c.lineWidth=7;c.beginPath();c.arc(x-11,y-8,12,0,Math.PI*2);c.stroke();
     stroke("#f6d49a",[[x,y],[x+22,y+23],[x+17,y+28]],6);
     stroke("#f6d49a",[[x+9,y+14],[x+14,y+9]],4);
   }else if(item.id==="water"){
     rounded("#abd4d6",x-13,y-18,26,42,6);
     rounded("#f6deaf",x-10,y-30,20,12,3);
     rounded("#76b8c9",x-12,y+5,24,13,3);
     rounded("#f3e7c5",x-7,y-8,14,7,3);
   }else{
     stroke("#f6d6b0",[[x-18,y+9],[x-18,y-8],[x-9,y-20],[x+11,y-20],[x+20,y-8],[x+20,y+9]],7);
     rounded("#c99491",x-24,y+3,12,20,5);
     rounded("#c99491",x+14,y+3,12,20,5);
   }
   txt(item.id==="keys"?"CHAVES":item.id==="water"?"ÁGUA":"FONES",x,y+50,14,"#fff1dc");
 }
 function backpack(x,y){
   glow(x,y,81,"#ffe9ba6b");
   stroke("#56495b",[[x-24,y-32],[x-35,y-49],[x-42,y-28]],8);
   stroke("#56495b",[[x+24,y-32],[x+35,y-49],[x+42,y-28]],8);
   rounded("#293d55",x-48,y-60,96,126,21);
   rounded("#d9988b",x-41,y-51,82,100,15);
   rounded("#f3c19b",x-37,y-17,74,46,10);
   rounded("#49546b",x-32,y-52,64,12,4);
   rounded("#fce7c5",x-7,y-22,14,12,3);
   txt("A + L",x,y+9,20,"#614e65");
   if(S.bagged>0)for(let i=0;i<S.bagged;i++)star(x-22+i*22,y+58,S.t+i,9);
 }
 function workScene(){
   const W=S.W,f=S.floor;
   roomBasics();
   windowFrame(W*.12,f-434,W*.31,170);
   curtain(W*.12,f-434,W*.31,170,1);
   rounded("#755c6c",W*.57,f-388,108,28,7);
   rounded("#be8e91",W*.63,f-360,12,230,3);
   rounded("#604e66",W*.48,f-173,115,18,6);
   rounded("#8d7682",W*.53,f-156,9,81,3);
   rounded("#8d7682",W*.68,f-156,9,81,3);
   // Door is a real moving, opening object after bag is packed
   rounded("#514459",W*.80,f-416,W*.20,416,4);
   rounded("#e6b8a1",W*.82,f-408,W*.17,396,6);
   const opening=smooth(clamp(S.walk/2,0,1));
   poly("#fff2c4",[[W*.82,f-407],[W*.82+W*.17*opening,f-407],[W*.82+W*.17*opening,f-14],[W*.82,f-14]]);
   rounded("#ba8b8f",W*.82+opening*45,f-408,W*.17*(1-.62*opening),395,3);
   disk("#f2d09f",W*.91+opening*25,f-207,8);
   backpack(W*.78,f-95);
   for(const item of S.items)if(!item.done)itemIcon(item);
   const leave=smooth(clamp((S.walk-.3)/2.5,0,1));
   if(S.bagged===3){
     human(W*(.24+.53*leave),f-4,"ander",1.08,"walk");
     human(W*.39,f-6,"lil",.92,"stand");
     // Lil's waving hand.
     stroke("#efbd9d",[[W*.40,f-80],[W*.44,f-117+Math.sin(S.t*6)*6]],6);
     for(let i=0;i<3;i++)heart(W*.45+i*19,f-140-i*10,6,"#ffe0bf");
   }else{
     human(W*.24,f-4,"ander",1.08,"stand");
     human(W*.39,f-6,"lil",.92,"stand");
   }
   cat(W*.54,f-2,.7,0);
   drawMeter(S.bagged/3,"MOCHILA: "+S.bagged+" / 3",f+34);
   if(!S.bagged)txt("⇢",W*.78,f-203,36,"#fff1cd");
 }
 function screenClip(x,y,w,h,idx){
   c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
   if(idx===0){
     const bg=c.createLinearGradient(x,y,x,y+h);
     bg.addColorStop(0,"#8eb7b5");bg.addColorStop(1,"#e9c9a8");c.fillStyle=bg;c.fillRect(x,y,w,h);
     for(let i=0;i<6;i++)rounded("#739e97",x+i*w/5,y+h*.75-(i%3)*18,w/5+3,h*.45,5);
     const cx=x+w*(.30+.36*Math.sin(S.t*1.3)),cy=y+h*.64;
     cat(cx,cy,.95,0);
     const ballX=x+w*(.46+.30*Math.sin(S.t*2.4)),ballY=y+h*.75-32*Math.abs(Math.sin(S.t*3));
     disk("#f6a8a9",ballX,ballY,11);disk("#fff1d2",ballX-3,ballY-3,3);
     txt("COOKIE E A BOLINHA",x+w*.5,y+24,12,"#fff7dc");
   }else if(idx===1){
     c.fillStyle="#88c5be";c.fillRect(x,y,w,h);
     disk("#f8e4b7",x+w*.79,y+35,29);
     const wheelX=x+w*.52,wheelY=y+h*.49,r=Math.min(h*.33,58);
     c.strokeStyle="#e0b4a8";c.lineWidth=5;c.beginPath();c.arc(wheelX,wheelY,r,0,Math.PI*2);c.stroke();
     for(let i=0;i<8;i++){
       const a=S.t*.42+i*Math.PI/4,xx=wheelX+Math.cos(a)*r,yy=wheelY+Math.sin(a)*r;
       stroke("#f8e0c5",[[wheelX,wheelY],[xx,yy]],2);
       rounded(["#e79da8","#f2ca93","#8bb5b0"][i%3],xx-9,yy,18,14,3);
     }
     rounded("#6e8d80",x,y+h*.86,w,h*.18,4);
     txt("AQUELE PARQUE",x+w*.5,y+24,13,"#fff7dc");
   }else{
     c.fillStyle="#312a57";c.fillRect(x,y,w,h);
     for(let i=0;i<17;i++){
       const xx=x+i*w/15,yy=y+((i*59+S.t*34)%(h+30))-20;
       star(xx,yy,S.t+i,6,["#f7c4d0","#8ecbc6","#eac99e"][i%3]);
     }
     rounded("#a276a5",x+w*.13,y+h*.67,w*.74,h*.19,7);
     for(let i=0;i<5;i++){
       const xx=x+w*(.26+i*.13),yy=y+h*.45+Math.sin(S.t*4+i)*12;
       heart(xx,yy,12+i%2*3,"#f5acbe");
     }
     txt("NOSSA PARTIDA",x+w*.5,y+24,13,"#f9e5d3");
   }
   c.restore();
 }
 function eveningScene(){
   const W=S.W,f=S.floor,night=false;
   roomBasics(night);
   glow(W*.50,f-274,160,"#f5d2bf78");
   rounded("#394e60",W*.10,f-435,W*.80,265,13);
   rounded("#f3d0bb",W*.12,f-422,W*.76,229,8);
   const tvx=W*.14,tvy=f-410,tvw=W*.72,tvh=203;
   screenClip(tvx,tvy,tvw,tvh,S.clip);
   rounded("#263849",W*.15,f-207,W*.70,12,4);
   rounded("#6b586c",W*.47,f-195,W*.06,24,3);
   rounded("#e3b9a1",W*.30,f-171,W*.40,10,4);
   // Playback bar changes in real time.
   rounded("#2f3f55",tvx+15,tvy+tvh-18,tvw-30,7,3);
   rounded("#f3be9e",tvx+15,tvy+tvh-18,(tvw-30)*clamp(S.watch/2.8,0,1),7,3);
   for(let i=0;i<3;i++){
     const xx=W*.36+i*W*.15;
     rounded(S.seen&(1<<i)?"#f7d49e":"#6e6677",xx,f-183,13,8,3);
   }
   // Soft sofa, seated characters and moving cat.
   rounded("#795c77",W*.10,f-129,W*.80,120,24);
   rounded("#bd8f98",W*.12,f-134,W*.76,91,20);
   rounded("#ddb2a9",W*.17,f-122,W*.25,69,17);
   rounded("#e3bcb0",W*.60,f-122,W*.24,69,17);
   human(W*.40,f-42,"ander",.86,"sit");
   human(W*.59,f-42,"lil",.86,"sit");
   // Their joined hands rest over the sofa blanket while the screen plays.
   stroke("#c9937a",[[W*.42,f-72],[W*.51,f-63],[W*.59,f-73]],6);
   rounded("#e7b7a5",W*.31,f-42,W*.37,8,4);
   const ccx=W*.22+Math.sin(S.t*.65)*19;
   cat(ccx,f-5,.82,1);
   // Physical remote on the coffee table.
   rounded("#71576a",W*.63,f+15,88,10,5);
   rounded("#273949",W*.68,f-10,48,24,6);
   disk("#e6a6a0",W*.705,f-1,5);disk("#b6d3c8",W*.755,f-1,5);
   txt("TOQUE NA TV PARA MUDAR",W*.5,f+62,14,"#fff1d7");
 }

 function nightScene(){
   const W=S.W,f=S.floor;
   roomBasics(true);
   // Window transforms: stars outside, curtains close physically.
   const wx=W*.18,wy=f-448,ww=W*.54;
   windowFrame(wx,wy,ww,200,true);
   curtain(wx,wy,ww,200,1-S.curtain,true);
   const lampX=W*.84,lampY=f-222;
   rounded("#665065",lampX-24,f-66,47,14,6);
   rounded("#59475c",lampX-5,lampY+48,10,141,3);
   poly("#eac1b4",[[lampX-34,lampY+11],[lampX+34,lampY+11],[lampX+22,lampY-31],[lampX-20,lampY-31]]);
   const bright=1-S.progress*.87;
   c.globalAlpha=bright;
   glow(lampX,lampY+23,155,"#ffe2b6bb");
   disk("#fce1b8",lampX,lampY+15,13);
   c.globalAlpha=1;
   rounded("#684b63",W*.13,f-116,W*.71,111,18);
   rounded("#b57d91",W*.15,f-124,W*.67,86,17);
   rounded("#d3a5a7",W*.17,f-115,W*.20,58,14);
   rounded("#e2b3b1",W*.59,f-115,W*.20,58,14);
   rounded("#f2d2b5",W*.26,f-37,W*.45,13,5);
   // Animated couple performs the hug as the last physical gesture.
   const join=smooth(S.close);
   const left=W*(.33+.135*join),right=W*(.66-.135*join);
   human(left,f-8,"ander",.98,"stand");
   human(right,f-8,"lil",.98,"stand");
   if(join>.35){
     stroke("#d6a182",[[left+12,f-81],[W*.49,f-59],[right-12,f-81]],6);
     stroke("#efbfa2",[[right-13,f-65],[W*.50,f-55],[left+14,f-70]],6);
     for(let i=0;i<7;i++){
       const yy=f-185-(S.t*20+i*25)%154;
       const xx=W*.5+Math.sin(S.t*.8+i*1.7)*56;
       heart(xx,yy,6+(i%3)*2,"#f9b3bd");
     }
   }
   cat(W*.17,f-6,.82,0);
   if(S.progress<.87){
     // A real draggable lamp dimmer.
     rounded("#344359",W*.19,f+30,W*.62,19,9);
     rounded("#c493a8",W*.20,f+34,W*.60*(1-S.progress),11,7);
     disk("#ffe5b2",W*(.80-.60*S.progress),f+39,17);
     txt("1 · DEIXE A LUZ MAIS BAIXINHA",W*.50,f+19,14,"#ffe5cc");
   }else if(S.curtain<.87){
     txt("2 · FECHE AS CORTINAS",W*.50,f+26,17,"#ffe0c7");
     stroke("#ffebc0",[[W*.22,f-269],[W*.76,f-269]],4);
     poly("#ffebc0",[[W*.76,f-269],[W*.73,f-280],[W*.73,f-258]]);
   }else{
     txt("3 · TRAGA A GENTE PRA PERTO",W*.50,f+23,17,"#ffe6c8");
     drawMeter(S.close,"ABRAÇO",f+40);
     if(S.nightHold>.2)glow(W*.50,f-136,170,"#f4c1c17a");
   }
   // After the intimacy is earned, the entire scene fades into a private night sky.
   if(S.finished){
     const fade=smooth(clamp((S.elapsed-1)/3,0,1));
     c.fillStyle="rgba(33,24,59,"+(fade*.83)+")";c.fillRect(0,0,W,S.H);
     for(let i=0;i<18;i++){
       const x=(i*101)%W,y=(i*53+S.t*2)%(f*.75);
       c.globalAlpha=fade;star(x,y,S.t+i,4+(i%3)*2);
     }c.globalAlpha=1;
   }
 }
 function finaleScene(){
   const W=S.W,f=S.floor;
   sky(true);stars(29,"#ffecd5");
   glow(W*.5,f-240,180,"#e7abb577");
   // An animated balcony at night, with the two together, no explicit imagery.
   rounded("#5d4b68",0,f-18,W,42,9);
   for(let i=0;i<8;i++){
     const x=i*W/7;
     rounded("#a98695",x,f-130,10,115,3);
     rounded("#82667d",x,f-132,13,8,2);
   }
   rounded("#f0c39a",0,f-137,W,10,5);
   for(let i=0;i<12;i++){
     const x=(i*48+S.t*6)%(W+50)-10,y=f-230+Math.sin(S.t*1.3+i)*64;
     c.globalAlpha=.3+.3*Math.sin(S.t+i);
     star(x,y,S.t+i,4+(i%3)*2,"#ffe1b7");
   }c.globalAlpha=1;
   human(W*.465,f-11,"ander",1.4,"stand");
   human(W*.535,f-11,"lil",1.4,"stand");
   stroke("#d6a185",[[W*.47,f-110],[W*.51,f-88],[W*.535,f-111]],8);
   for(let i=0;i<6;i++){
     const x=W*.50+Math.sin(S.t*1.3+i*1.7)*75,y=f-247-i*22;
     heart(x,y,7+(i%2)*4,"#ffbfc9");
   }
   cat(W*.21,f-9,.8,0);cat(W*.76,f-9,.66,1);
 }
 function render(dt){
   if(!c)return;
   c.clearRect(0,0,S.W,S.H);
   if(S.phase<2)bedroom();
   else if(S.phase===2)workScene();
   else if(S.phase===3)eveningScene();
   else if(S.phase===4)nightScene();
   else finaleScene();
   particles(dt);
   if(S.transition>0&&S.nextPhase!==null){
     c.fillStyle="rgba(30,26,57,"+Math.min(.95,Math.sin(S.transition*Math.PI*.8)*.9)+")";
     c.fillRect(0,0,S.W,S.H);
   }
   if(S.phase===5){
     c.fillStyle="#131e3752";c.fillRect(0,0,S.W,S.H);
   }
 }
 function onReady(){
   if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});
   else ready();
 }
 window.__DailyEpisodeStatus=()=>({
   active:!!root&&!root.hidden,phase:S.phase,progress:Number(S.progress.toFixed(2)),
   held:S.hold,bagged:S.bagged,seen:S.seen,clip:S.clip,nightCurtain:S.curtain,
   nightClose:S.close,finished:S.finished,transitioning:S.nextPhase!==null,
   width:S.W,height:S.H
 });
 // Test interface is isolated to local file preview only.
 if(location.protocol==="file:")window.__DailyEpisodeQA={
   open:()=>start(),stage:i=>{start();S.phase=clamp(i,0,5);S.finished=false;S.elapsed=0;setStage();resize()},
   assist:()=>assist(),next:()=>{if(S.finished)advance()}
 };
 onReady();
})();
