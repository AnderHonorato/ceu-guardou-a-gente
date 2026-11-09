"use strict";
(()=>{
 const original=window.InfinitosLocais;
 if(!original||!window.PequeScenes||!window.PequeGames)return;
 const $=s=>document.querySelector(s),clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
 const faces=["ENCONTRO","PRIMEIRO MÊS","MÚSICA","ACONCHEGO","RETRATOS","5 MESES"];
 let shell=null,canvas=null,ctx=null,host=null,world=null,pressed=false;
 let controls={left:false,right:false};
 function mount(){
   if(shell)return;
   shell=document.createElement("section");shell.id="pxExperience";shell.className="px-world";shell.hidden=true;
   shell.innerHTML=[
    '<canvas id="pxCanvas" aria-label="Ambiente interativo em 2D com objetos, personagens e minijogos" tabindex="0"></canvas>',
    '<header class="px-head"><button class="px-back" id="pxBack" type="button">← SAIR</button><div class="px-title"><div class="px-kicker" id="pxKicker">NOSSOS LUGARES</div><h2 id="pxTitle">Uma aventura para dois</h2></div></header>',
    '<div class="px-gamebar" id="pxGamebar" hidden><span id="pxGameInstruction"></span><button id="pxCloseGame" class="px-closegame">VOLTAR</button></div>',
    '<div class="px-toast" id="pxToast" role="status" aria-live="polite"></div>',
    '<div class="px-cutscene" id="pxCutscene"><strong class="px-gold">♥ ✦ ♥</strong><span>Mais uma memória que virou aventura!</span></div>',
    '<div class="px-tip" id="pxTip"><strong>✦</strong><span id="pxHint">TOQUE EM ALGUM OBJETO PARA EXPLORAR</span></div>',
    '<div class="px-bottom"><div class="px-move"><button id="pxLeft" aria-label="Andar para a esquerda">◀</button><button id="pxRight" aria-label="Andar para a direita">▶</button></div><div class="px-buttons"><button id="pxAct" class="px-act" type="button">AÇÃO</button><button id="pxPlay" class="px-play" type="button">★ JOGAR</button></div></div>'
   ].join("");
   $("#interior").appendChild(shell);
   canvas=$("#pxCanvas");ctx=canvas.getContext("2d",{alpha:false});
   $("#pxBack").addEventListener("click",()=>{if(world?.game){stopGame();return} original.close();});
   $("#pxCloseGame").addEventListener("click",stopGame);
   $("#pxAct").addEventListener("click",()=>{if(!world)return;if(world.game){world.game.action();return}interactNearest()});
   $("#pxPlay").addEventListener("click",()=>{if(!world)return;if(world.game){world.game.action();return}startGame()});
   bindMove("#pxLeft","left");bindMove("#pxRight","right");
   canvas.addEventListener("pointerdown",onDown);
   canvas.addEventListener("pointermove",onMove);
   canvas.addEventListener("pointerup",onUp);
   canvas.addEventListener("pointercancel",onUp);
   window.addEventListener("resize",resize);
   document.addEventListener("keydown",keydown,true);
   document.addEventListener("keyup",keyup,true);
 }
 function bindMove(selector,key){
   const el=$(selector);
   el.addEventListener("pointerdown",e=>{
     if(!world)return;e.preventDefault();el.setPointerCapture(e.pointerId);controls[key]=true;el.classList.add("down");world.autoX=null;
   });
   for(const ev of ["pointerup","pointercancel","lostpointercapture"])
     el.addEventListener(ev,()=>{controls[key]=false;el.classList.remove("down")});
 }
 function keydown(e){
   if(!world)return;
   const key=e.key;
   if(["Escape","ArrowLeft","ArrowRight"," ","Enter","e","E","a","A","d","D","s","S"].includes(key))e.preventDefault();
   if(key==="Escape"){e.stopImmediatePropagation();if(world.game)stopGame();else original.close();return}
   if(world.game){
     if(!e.repeat)world.game.key(key);
     if((key===" "||key==="Enter"||key==="e"||key==="E")&&!e.repeat)world.game.action();
     return;
   }
   if(key==="ArrowLeft"||key==="a"||key==="A"){controls.left=true;world.autoX=null}
   if(key==="ArrowRight"||key==="d"||key==="D"){controls.right=true;world.autoX=null}
   if((key===" "||key==="Enter"||key==="e"||key==="E")&&!e.repeat)interactNearest();
 }
 function keyup(e){
   if(!world)return;
   if(["ArrowLeft","a","A"].includes(e.key))controls.left=false;
   if(["ArrowRight","d","D"].includes(e.key))controls.right=false;
 }
 function coords(e){
   const r=canvas.getBoundingClientRect();return {
     x:(e.clientX-r.left)/r.width*world.W,
     y:(e.clientY-r.top)/r.height*world.H
   };
 }
 function onDown(e){
   if(!world)return;e.preventDefault();pressed=true;canvas.setPointerCapture(e.pointerId);
   const p=coords(e);
   if(world.game){world.game.down(p.x,p.y);return}
   const spots=window.PequeScenes.hotspots(world);
   const chosen=spots.find(o=>Math.hypot(o.x-p.x,(o.y-30)-p.y)<70);
   if(chosen){world.autoX=chosen.x;world.nextHotspot=chosen;}else{world.autoX=clamp(p.x,45,world.W-45);world.nextHotspot=null}
 }
 function onMove(e){
   if(!world)return;
   if(world.game&&pressed){const p=coords(e);world.game.move(p.x,p.y)}
 }
 function onUp(e){
   if(!world)return;
   if(world.game&&pressed){const p=coords(e);world.game.up(p.x,p.y)}
   pressed=false;
 }
 function resize(){
   if(!canvas||!world)return;
   const rect=canvas.getBoundingClientRect();
   if(rect.width<=0||rect.height<=0)return;
   const portrait=rect.height>rect.width;
   const w=portrait?480:Math.round(430*rect.width/rect.height);
   const h=portrait?Math.round(480*rect.height/rect.width):430;
   world.W=clamp(w,480,1300);world.H=clamp(h,430,1300);
   world.ground=portrait?Math.round(world.H*.70):Math.round(world.H*.78);
   canvas.width=world.W;canvas.height=world.H;ctx.imageSmoothingEnabled=false;
   world.px=clamp(world.px||world.W*.29,40,world.W-40);
   world.lx=clamp(world.lx||world.W*.18,30,world.W-30);
   if(!world.game)world.autoX=null;
 }
 function say(text,seconds=2.7){
   if(!world)return;world.message=text;world.messageUntil=world.t+seconds;
   const el=$("#pxToast");el.textContent=text;el.classList.add("visible");
 }
 function popAt(x,y,n=13){
   if(!world)return;
   for(let i=0;i<n;i++){
     world.particles.push({
       x:x+(Math.random()-.5)*40,y:y+(Math.random()-.5)*30,
       vx:(Math.random()-.5)*120,vy:-40-Math.random()*70,
       life:1.2+Math.random()*.5,size:11+Math.random()*10,
       color:["#ffebb6","#ffc2ba","#b7e7d0"][i%3],glyph:i%4===0?"♥":"✦"
     });
   }
 }
 function showHint(str){$("#pxHint").textContent=str;}
 function interactNearest(){
   if(!world||world.game)return;
   const near=window.PequeScenes.hotspots(world).reduce((best,o)=>{
     const d=Math.abs(o.x-world.px);return d<(best?.d??1e9)?{o,d}:best
   },null);
   if(!near)return;
   if(near.d>75){world.autoX=near.o.x;world.nextHotspot=near.o;return}
   trigger(near.o);
 }
 const thoughts={
   home:["JÁ IMAGINOU QUANTO CARINHO CABE NESTA CASA?","UM SOFÁ, DOIS GAROTOS E OS TRÊS GATINHOS.","COOKIE ESTÁ PROCURANDO ALGO PARA BRINCAR."],
   market:["A LISTA DE COMPRAS JÁ ESTÁ PELA METADE?","UMA CESTA CHEIA DE COISAS GOSTOSAS.","O CARRINHO ESTÁ PRONTO PARA VOCÊS DOIS."],
   cinema:["RISADAS NAQUELA PRIMEIRA SESSÃO.","PIPOCA PARA DIVIDIR?","QUE TAL MONTAR NOSSO PRIMEIRO FILME?"],
   park:["VOCÊ LEMBRA DO DIA EM QUE FOMOS AO PARQUE?","MAIS UMA AVENTURA QUE A GENTE NÃO ESQUECE.","OLHA AQUELAS ESTRELINHAS VOANDO!"],
   motel:["UMA ESCAPADA A DOIS, SÓ NOSSO TEMPO.","UMA LUZ BAIXINHA E UM ABRAÇO.","AJUSTE O CLIMA DA NOSSA NOITE."],
   cafe:["AÇAÍ, ESFIHA E UMA CONVERSA BOA.","O CHEIRINHO DE CAFÉ ESTÁ INCRÍVEL.","UM AÇAÍ PARA ENFEITAR JUNTINHOS."],
   music:["UMA MADRUGADA CANTANDO JUNTOS.","ESSA MÚSICA DÁ VONTADE DE DANÇAR.","VOCÊ CONSEGUE ACERTAR O RITMO?"],
   arcade:["A GENTE DEVERIA DISPUTAR MAIS VEZES.","AS LUZES NÃO PARAM DE PISCAR.","DESAFIO: PEGAR OS CORAÇÕES QUE CAEM."],
   photo:["QUERO GUARDAR ESSE INSTANTE.","UMA FOTO IMPERFEITA TAMBÉM É LINDA.","MIRA NA GENTE, VAI!"],
   restaurant:["MACARRÃO COM MOLHO BRANCO, LEMBRA?","A PANELA AINDA ESTÁ QUENTINHA.","BORA COZINHAR JUNTINHOS?"],
   book:["NOSSA CARTA FEITA À MÃO.","TEM COISAS QUE NÃO CABEM NUMA MENSAGEM.","ORGANIZE OS PEDACINHOS DA CARTA."]
 };
 function trigger(hotspot){
   if(!world)return;
   if(hotspot.kind==="play"){startGame();return}
   world.effect={kind:hotspot.kind==="moment"?"hug":"spark",x:hotspot.x,y:hotspot.y,until:world.t+3.4};
   if(hotspot.kind==="moment")world.lx+=(world.px-world.lx)*.7;
   popAt(hotspot.x,hotspot.y,15);
   const arr=thoughts[world.type]||thoughts.cafe;
   say(arr[hotspot.kind==="observe"?0:1],3.3);host.tone(720,.24);
 }
 function startGame(){
   if(!world||world.game)return;
   world.autoX=null;controls.left=false;controls.right=false;
   world.game=window.PequeGames.create(world,()=>{
     world.won=true;world.wonAt=world.t;
     world.effect={kind:"hug",until:world.t+5};
     const k="pi-visual-achievements-v3";
     try{
       const data=new Set(JSON.parse(localStorage.getItem(k)||"[]"));data.add(world.room.id);
       localStorage.setItem(k,JSON.stringify([...data]));
     }catch(_){}
     popAt(world.W*.5,world.ground-185,45);
     $("#pxCutscene").classList.add("show");
     say("✦ LEMBRANÇA VIVA DESBLOQUEADA!",4.2);
     host.tone(930,.36);
   },host.tone,say);
   $("#pxGamebar").hidden=false;
   $("#pxGameInstruction").textContent=world.game.instruction;
   $("#pxPlay").textContent="★ AGIR";
   $("#pxTip").hidden=true;
 }
 function stopGame(){
   if(!world||!world.game)return;
   world.game=null;world.won=false;
   $("#pxGamebar").hidden=true;$("#pxPlay").textContent="★ JOGAR";
   $("#pxCutscene").classList.remove("show");
   $("#pxTip").hidden=false;showHint("TOQUE EM UM OBJETO OU ANDE PELA SALA");
 }
 function open(index){
   originalOpen(index);
   const room=original.currentRoom();
   if(!room)return;
   mount();
   world={level:room.level,index,room,type:room.type,name:room.name,W:480,H:720,
     ground:500,px:155,lx:106,t:0,autoX:null,nextHotspot:null,move:false,
     game:null,won:false,effect:null,particles:[],message:"",messageUntil:0,
     mood:.65};
   $("#interior").classList.add("px-pro");
   const already=$("#roomIntro").hidden;
   if(!already)$("#roomStoryNext").click();
   shell.hidden=false;$("#pxTip").hidden=false;$("#pxGamebar").hidden=true;
   $("#pxCutscene").classList.remove("show");
   $("#pxPlay").textContent="★ JOGAR";
   $("#pxKicker").textContent="CAPÍTULO "+String(room.level+1).padStart(2,"0")+" / "+faces[room.level];
   $("#pxTitle").textContent=room.name;
   $("#pxToast").classList.remove("visible");
   controls.left=false;controls.right=false;resize();
   showHint("TOQUE NOS OBJETOS OU CAMINHE PELA SALA");
   host.tone(580,.2);
 }
 function close(){
   if(world){world=null;pressed=false;controls.left=false;controls.right=false}
   if(shell)shell.hidden=true;
   $("#interior").classList.remove("px-pro");
   originalClose();
 }
 function tick(dt){
   if(!world){originalTick(dt);return}
   dt=clamp(dt,0,.04);const S=world;S.t+=dt;
   if(S.game)S.game.update(dt);
   else{
     let dir=(controls.right?1:0)-(controls.left?1:0);
     if(!dir&&S.autoX!==null){
       const delta=S.autoX-S.px;
       if(Math.abs(delta)<9){
         S.px=S.autoX;S.autoX=null;
         const hotspot=S.nextHotspot;S.nextHotspot=null;
         if(hotspot)trigger(hotspot);
       }else dir=delta>0?1:-1;
     }
     S.move=!!dir;
     if(dir)S.px=clamp(S.px+dir*165*dt,42,S.W-42);
     const target=clamp(S.px-54,32,S.W-32);
     S.lx+=(target-S.lx)*Math.min(1,dt*3);
   }
   for(const p of S.particles){
     p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=30*dt;p.life-=dt;
   }
   S.particles=S.particles.filter(p=>p.life>0);
   window.PequeScenes.render(ctx,S,host);
   if(S.H>670&&!S.game)drawAtmosphere(S);
   if(S.game)S.game.render(ctx);
   if(S.won){
     ctx.fillStyle="#122b3bc5";ctx.fillRect(0,S.ground-330,S.W,330);
     const pulse=1+Math.sin(S.t*4)*.05;
     ctx.save();ctx.translate(S.W*.5,S.ground-190);ctx.scale(pulse,pulse);
     window.PequeScenes.G(ctx,0,0,160,"#ffdcadbe");
     window.PequeScenes.T(ctx,"♥",0,30,105,"#ffd6c8");
     ctx.restore();
     window.PequeScenes.T(ctx,"MEMÓRIA DESBLOQUEADA",S.W*.5,S.ground-75,23,"#fff4ce");
     if(S.t-S.wonAt>3.5)stopGame();
   }
   if(S.messageUntil<S.t)$("#pxToast").classList.remove("visible");
   if(S.game)$("#pxGameInstruction").textContent=S.game.instruction;
 }
 function drawAtmosphere(S){
   const D=window.PequeScenes,{W,ground,t}=S,top=ground-430;
   if(top<100)return;
   D.G(ctx,W*.5,top*.8,230,"#ffefcf24");
   D.T(ctx,"ANDER  ♡  LIL",W*.5,top-14,Math.min(39,W*.082),"#fff0d2");
   for(let i=0;i<16;i++){
     const x=(W*.12+i*W*.21)%W,y=top-95+(i%4)*39+Math.sin(t*.8+i)*6;
     D.T(ctx,i%2===0?"✦":"·",x,y,12+i%3*3,"#ffe2c5ac");
   }
 }
 const originalOpen=original.open.bind(original);
 const originalClose=original.close.bind(original);
 const originalTick=original.tick.bind(original);
 const originalInstall=original.install.bind(original);
 original.open=open;original.close=close;original.tick=tick;
 original.install=function(h){
   host=h;originalInstall(h);mount();
   const preview=new URLSearchParams(location.search).get("preview-room");
   if(preview&&/^[0-5]-[0-6]$/.test(preview)){
     const parts=preview.split("-").map(Number);
     setTimeout(()=>{
       document.querySelector("#startButton")?.click();
       setTimeout(()=>{
         host.state.level=parts[0];
         if(document.querySelector("#dialogue"))document.querySelector("#dialogue").hidden=true;
         open(parts[1]);
         if(new URLSearchParams(location.search).get("preview-game")==="1")setTimeout(()=>document.querySelector("#pxPlay")?.click(),450);
       },750);
     },180);
   }
 };
 window.__PequenosVisualStatus=()=>world?{
   level:world.level,room:world.name,type:world.type,playing:!!world.game,
   score:world.game?.score||0,phase:world.game?.phase||0,won:world.won,
   x:Math.round(world.px)
 }:null;
})();