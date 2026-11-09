"use strict";
window.PequeGames=(()=>{
 const sc=()=>window.PequeScenes;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const dist=(a,b,x,y)=>Math.hypot(a-x,b-y);
 const random=(n)=>{let x=Math.sin(n*94.71+11.3)*8734.94;return x-Math.floor(x)};
 function create(S,complete,tone,say){
   const kind=S.type, W=S.W, G=S.ground;
   let g={kind,score:0,goal:6,phase:0,active:true,elapsed:0,drag:-1,playing:false,
     cursor:{x:W*.5,y:G-110},balls:[],items:[],notes:[],paddle:W*.5,
     catHeart:[0,0,0],catX:[W*.22,W*.49,W*.75],light:1,curtain:0,hold:0,
     film:0,seen:new Set(),turns:0,swirl:0,lastAngle:null,stamps:[],polaroids:0,
     actionLabel:"INTERAGIR",instruction:""};
   const finish=()=>{
     if(!g.active)return;g.active=false;g.playing=false;
     complete();
   };
   const sound=(f=630)=>tone(f,.12);
   const actionSound=()=>sound(420+g.score*85);
   const message=(str)=>{g.instruction=str;say(str)};
   if(kind==="market"){
     g.goal=4;g.instruction="ARRASTE AS COMPRAS PARA O CARRINHO";
     g.items=["MACARRÃO","MOLHO","AÇAÍ","SUCO"].map((title,i)=>({
       title,x:W*(.14+i*.24),y:G-222,homeX:W*(.14+i*.24),homeY:G-222,
       color:["#f6ca92","#dc9788","#ae83b7","#9fcec1"][i],packed:false
     }));
     g.actionLabel="CONFERIR";
   }else if(kind==="home"){
     g.goal=3;g.instruction="SEGURE E MOVA O BRINQUEDO PARA OS GATINHOS";
     g.cursor={x:W*.5,y:G-85};g.catX=[W*.17,W*.45,W*.73];g.actionLabel="CHAMAR";
   }else if(kind==="cinema"){
     g.goal=3;g.instruction="ARRASTE A FITA PARA REVELAR AS TRÊS CENAS";
     g.actionLabel="RODAR FILME";
   }else if(kind==="park"||kind==="party"){
     g.goal=7;g.instruction="CAPTURE AS LUZINHAS QUE VOAM PELO PARQUE";
     g.balls=Array.from({length:10},(_,i)=>({x:W*(.1+random(i+S.level)*.8),y:G-275+random(i+12)*185,phase:i*1.77,caught:false}));
     g.actionLabel="SOPRAR";
   }else if(kind==="arcade"){
     g.goal=8;g.instruction="DESLIZE PARA PEGAR OS CORAÇÕES QUE CAEM";
     g.balls=Array.from({length:4},(_,i)=>({x:W*(.12+random(i+5)*.75),y:G-470-i*130,speed:84+i*19,live:true}));
     g.actionLabel="PEGAR";
   }else if(kind==="motel"){
     g.goal=3;g.instruction="DESLIZE A LUZ, FECHE A CORTINA E SEGURE O CORAÇÃO";
     g.actionLabel="UM ABRAÇO";
   }else if(kind==="cafe"){
     g.goal=2;g.instruction="DESENHE CÍRCULOS NO CAFÉ PARA CRIAR ARTE";
     g.actionLabel="SERVIR";
   }else if(kind==="music"){
     g.goal=8;g.instruction="TOQUE NAS TRÊS FAIXAS NO RITMO DAS NOTAS";
     g.actionLabel="TOCAR";
     g.notes=Array.from({length:12},(_,i)=>({lane:[0,1,2,1,2,0,1,0,2,1,0,2][i],y:G-560-i*100,hit:false}));
   }else if(kind==="book"){
     g.goal=4;g.instruction="ARRASTE OS QUATRO SELOS PARA A CARTA";
     g.items=["CUIDADO","RISADAS","CASA","FUTURO"].map((title,i)=>({
       title,x:W*(.18+i*.21),y:G-75,homeX:W*(.18+i*.21),homeY:G-75,
       color:["#a6c6b6","#e7b098","#e6ce93","#b5a1c5"][i],packed:false
     }));
     g.actionLabel="LER";
   }else if(kind==="restaurant"){
     g.goal=4;g.instruction="ARRASTE OS INGREDIENTES PARA A PANELA E MEXA";
     g.items=["MASSA","MOLHO","QUEIJO"].map((title,i)=>({
       title,x:W*(.18+i*.32),y:G-223,homeX:W*(.18+i*.32),homeY:G-223,
       color:["#edc784","#e8a3a1","#ffecd0"][i],packed:false
     }));
     g.actionLabel="MEXER";
   }else if(kind==="photo"){
     g.goal=3;g.instruction="MIRE NO CASAL EM MOVIMENTO E CLIQUE NO DISPARADOR";
     g.cursor={x:W*.5,y:G-193};g.actionLabel="FOTOGRAFAR";
   }else{
     g.goal=6;g.balls=Array.from({length:8},(_,i)=>({x:W*(.15+random(i)*.7),y:G-220-random(i+9)*130,phase:i,caught:false}));
     g.instruction="TOQUE NAS LUZINHAS PARA CELEBRAR";g.actionLabel="SOPRAR";
   }
   function pointOnItem(x,y){return g.items.findIndex(o=>!o.packed&&dist(x,y,o.x,o.y)<50)}
   function registerDrag(x,y){
     const idx=pointOnItem(x,y);
     if(idx!==-1){g.drag=idx;g.cursor={x,y};sound(560);}
   }
   const down=(x,y)=>{
     if(!g.active)return;
     g.playing=true;g.cursor={x,y};
     if(kind==="market"||kind==="book"||kind==="restaurant"){
       if(g.phase===0)registerDrag(x,y);
       else if(kind==="restaurant")angle(x,y);
     }else if(kind==="home"){g.pressed=true;g.cursor={x,y}}
     else if(kind==="cinema"){g.pressed=true;filmMove(x)}
     else if(kind==="park"||kind==="party"){catchLight(x,y)}
     else if(kind==="arcade"){g.paddle=x}
     else if(kind==="motel"){moodDown(x,y)}
     else if(kind==="cafe"){g.pressed=true;angle(x,y)}
     else if(kind==="music"){hitLane(Math.floor(x/(W/3)))}
     else if(kind==="photo"){g.pressed=true}
   };
   const move=(x,y)=>{
     if(!g.active)return;
     g.cursor={x,y};
     if(g.drag>=0&&g.items[g.drag]){g.items[g.drag].x=x;g.items[g.drag].y=y}
     if(kind==="home"&&g.pressed){g.cursor={x,y}}
     if(kind==="cinema"&&g.pressed)filmMove(x);
     if(kind==="arcade")g.paddle=clamp(x,38,W-38);
     if(kind==="motel"&&g.pressed)moodMove(x,y);
     if(kind==="cafe"&&g.pressed)angle(x,y);
     if(kind==="restaurant"&&g.phase===1&&g.pressed)angle(x,y);
     if(kind==="photo"&&g.pressed){g.cursor={x,y}}
   };
   const up=(x,y)=>{
     if(!g.active)return;
     g.pressed=false;
     if(g.drag>=0&&g.items[g.drag]){
       const o=g.items[g.drag];const success=
         kind==="market"?x>W*.56&&x<W*.94&&y>G-169&&y<G+18:
         kind==="book"?x>W*.26&&x<W*.78&&y>G-319&&y<G-109:
         kind==="restaurant"?x>W*.32&&x<W*.75&&y>G-158&&y<G-46:false;
       if(success){
         o.packed=true;g.score++;actionSound();
         if(kind==="restaurant"&&g.score===3){g.phase=1;g.lastAngle=null;g.swirl=0;message("AGORA MEXA A PANELA COM MOVIMENTOS CIRCULARES");}
         else if(g.score===g.goal)finish();
       }else{o.x=o.homeX;o.y=o.homeY;sound(210)}
       g.drag=-1;
     }
     g.lastAngle=null;
   };
   function filmMove(x){
     const next=clamp((x-W*.11)/(W*.78),0,1);
     g.film=next;g.seen.add(Math.min(2,Math.floor(next*3)));
     if(g.seen.size>=3&&next>.94)finish();
   }
   function catchLight(x,y){
     for(const b of g.balls)if(!b.caught){
       const yy=b.y+Math.sin(g.elapsed*2+b.phase)*20,xx=b.x+Math.cos(g.elapsed+b.phase)*13;
       if(dist(xx,yy,x,y)<34){
         b.caught=true;g.score++;actionSound();if(g.score>=g.goal)finish();
         return;
       }
     }
   }
   function moodDown(x,y){
     if(g.phase===0&&y>G-287&&y<G-211){g.pressed=true;moodMove(x,y)}
     else if(g.phase===1&&y>G-245&&y<G-130){g.pressed=true;moodMove(x,y)}
     else if(g.phase===2&&dist(x,y,W*.5,G-154)<86){g.pressed=true}
   }
   function moodMove(x,y){
     if(g.phase===0){
       g.light=clamp((x-W*.12)/(W*.76),0,1);
       if(g.light<.24){g.phase=1;g.score=1;actionSound();message("AGORA FECHE A CORTINA");}
     }else if(g.phase===1){
       g.curtain=clamp((x-W*.15)/(W*.66),0,1);
       if(g.curtain>.86){g.phase=2;g.score=2;actionSound();message("SEGURE O CORAÇÃO PARA UM ABRAÇO");}
     }
   }
   function angle(x,y){
     const cx=W*.5,cy=G-157;
     const a=Math.atan2(y-cy,x-cx);
     if(g.lastAngle!==null){
       let da=a-g.lastAngle;
       if(da>Math.PI)da-=Math.PI*2;if(da<-Math.PI)da+=Math.PI*2;
       if(dist(x,y,cx,cy)<145&&dist(x,y,cx,cy)>30)g.swirl+=Math.abs(da);
     }
     g.lastAngle=a;
     if(g.swirl>Math.PI*3.3){
       g.score=g.goal;finish();
     }
   }
   function hitLane(lane){
     const targetY=G-91;
     let best=null,range=75;
     for(const note of g.notes){
       const d=Math.abs(note.y-targetY);
       if(!note.hit&&note.lane===lane&&d<range){best=note;range=d;}
     }
     if(best){best.hit=true;g.score++;actionSound();if(g.score>=g.goal)finish();}
     else sound(208);
   }
   function action(){
     if(!g.active)return;
     if(kind==="motel"&&g.phase===2){g.pressed=true}
     else if(kind==="photo"){
       const targetX=W*.5+Math.sin(g.elapsed*.9)*95,targetY=G-182+Math.cos(g.elapsed*1.2)*25;
       if(dist(g.cursor.x,g.cursor.y,targetX,targetY)<78){
         g.score++;g.polaroids++;actionSound();g.cursor.x=W*.36+random(g.score)*W*.3;
         if(g.score>=3)finish();
       }else sound(220);
     }else if(kind==="cinema")filmMove(Math.min(W*.9,W*(.11+.78*(g.film+.25))));
     else if(kind==="music")hitLane(Math.round(random(Math.round(g.elapsed*10))*2));
     else if(kind==="arcade")g.paddle=clamp(g.balls[0].x,35,W-35);
     else if(kind==="park"||kind==="party")catchLight(g.balls.find(b=>!b.caught)?.x||W*.5,g.balls.find(b=>!b.caught)?.y||G-150);
     else if(kind==="cafe"||kind==="restaurant")message("FAÇA O GESTO CIRCULAR COM O DEDO");
   }
   function key(k){
     if(kind==="music"){
       const keys={a:0,ArrowLeft:0,s:1," ":1,d:2,ArrowRight:2};
       if(Object.prototype.hasOwnProperty.call(keys,k))hitLane(keys[k]);
     }
   }
   function update(dt){
     if(!g.active)return;
     g.elapsed+=dt;
     if(kind==="home"){
       for(let i=0;i<3;i++){
         if(g.catHeart[i]>=1)continue;
         const goalX=g.cursor.x;
         g.catX[i]+=(goalX-g.catX[i])*dt*(.45+i*.26);
         if(g.pressed&&Math.abs(g.catX[i]-goalX)<34&&g.cursor.y>G-170){
           g.catHeart[i]=clamp(g.catHeart[i]+dt*(.42+i*.09),0,1);
           if(g.catHeart[i]>=1){g.score++;actionSound();if(g.score>=3)finish();}
         }
       }
     }else if(kind==="arcade"){
       for(const b of g.balls){
         b.y+=dt*b.speed;
         if(b.y>G-65){
           if(Math.abs(b.x-g.paddle)<65){g.score++;actionSound();if(g.score>=g.goal){finish();return}}
           else sound(220);
           b.y=G-430-random(Math.round(g.elapsed*50))*95;
           b.x=W*(.1+random(Math.round(g.elapsed*90)+b.speed)*.8);
         }
       }
     }else if(kind==="music"){
       for(const n of g.notes){
         n.y+=dt*124;
         if(n.y>G+8){n.y=G-590-random(n.lane+Math.round(g.elapsed))*125;n.hit=false;}
       }
     }else if(kind==="motel"){
       if(g.phase===2&&g.pressed){
         g.hold+=dt; if(g.hold>2.3){g.score=3;g.ready=true;finish();}
       }
     }else if(kind==="park"||kind==="party"){
       // If every nearby firefly has been caught, spawn more for a longer playful scene.
       if(g.balls.filter(x=>!x.caught).length<2){
         g.balls.forEach((b,i)=>{if(b.caught){b.caught=false;b.phase+=1.2;b.x=W*(.1+random(i+g.elapsed)*.8)}})
       }
     }
   }
   const frame=(c)=>{
     const D=sc(),{P,R,C,L,T,G:GLOW}=D;
     const x0=W*.055,top=G-320,width=W*.89;
     c.save();
     R(c,"#172a3deb",x0,top,width,285,13);
     R(c,"#30475b",x0+5,top+6,width-10,271,10);
     R(c,"#f0ca98",x0+12,top+14,width-24,36,7);
     T(c,""+String(kind).toUpperCase()+"  •  "+g.score+"/"+g.goal,W*.5,top+39,17,"#294456");
     if(kind==="market"||kind==="book"||kind==="restaurant"){
       if(kind==="restaurant"&&g.phase===1){
         pot(c);swirlArt(c,g.swirl);T(c,"FAÇA CÍRCULOS NA PANELA",W*.5,G-69,15);
       }else{
         for(const it of g.items){
           if(it.packed)continue;
           R(c,it.color,it.x-34,it.y-29,68,57,7);
           R(c,"#fffae4",it.x-29,it.y-16,58,22,3);
           T(c,it.title,it.x,it.y+1,13,"#445069");
           P(c,"#fff5db",it.x-17,it.y-23,34,4);
         }
         if(kind==="market"){
           R(c,"#e9c498",W*.6,G-123,W*.27,61,8);
           L(c,"#fbedd1",W*.58,G-134,W*.85,G-134,7);
           C(c,"#2c4257",W*.65,G-55,12);C(c,"#2c4257",W*.82,G-55,12);
           T(c,"CARRINHO",W*.74,G-82,18,"#394657");
         }else if(kind==="book"){
           R(c,"#e9b6a3",W*.26,G-319,W*.52,194,5);
           R(c,"#fff5de",W*.3,G-310,W*.44,175,4);
           T(c,"NOSSA HISTÓRIA",W*.52,G-269,21,"#9f6174");
           for(let i=0;i<4;i++){
             L(c,"#bca79d",W*.33,G-231+i*21,W*.7,G-231+i*21,1);
             if(g.items[i].packed)T(c,"♥",W*.38+i*W*.095,G-235,19,"#b56e83");
           }
         }else{
           pot(c);T(c,"ARASTE OS INGREDIENTES",W*.5,G-73,15);
         }
       }
     }else if(kind==="home"){
       R(c,"#c999a8",W*.16,G-123,W*.68,70,32);
       for(let i=0;i<3;i++){
         const x=g.catX[i],h=g.catHeart[i];
         D.cat(c,x,G-75,g.elapsed+i,i,1.35);
         R(c,"#273b4d",x-38,G-48,76,11,3);
         R(c,"#f7c885",x-36,G-46,72*h,7,2);
         if(h>=1)T(c,"♥",x,G-150+Math.sin(g.elapsed*3+i)*7,29,"#f7b5b5");
       }
       GLOW(c,g.cursor.x,g.cursor.y,43,"#ffe89fba");
       C(c,"#ffe2a4",g.cursor.x,g.cursor.y,11);T(c,"✦",g.cursor.x,g.cursor.y+6,20,"#c67972");
       T(c,"COOKIE • 2 AMIGUINHOS",W*.5,G-230,17);
     }else if(kind==="cinema"){
       R(c,"#172a3d",W*.12,G-293,W*.76,169,7);
       R(c,"#e0ab95",W*.15,G-280,W*.7,144,4);
       const scene=Math.min(2,Math.floor(g.film*3));
       const colors=["#8eb8b4","#9dbf93","#c78ea2"];
       R(c,colors[scene],W*.17,G-271,W*.66,130,4);
       C(c,"#ffe0a8",W*.69,G-245,27);
       for(let i=0;i<5;i++)R(c,"#526a7e",W*.18+i*W*.12,G-189-i%2*19,62,60,5);
       if(scene===1){
         C(c,"#edb7a6",W*.52,G-209,46);
         for(let i=0;i<5;i++){const a=g.elapsed*.5+i*Math.PI*.4;L(c,"#fff0d2",W*.52,G-209,W*.52+Math.cos(a)*46,G-209+Math.sin(a)*46,2)}
       }
       if(scene===2){T(c,"♡",W*.5,G-177,73,"#fff0d8")}
       T(c,["CINEMA","PARQUE","O NOSSO SIM"][scene],W*.5,G-262,19,"#fff1d7");
       L(c,"#e3be97",W*.11,G-102,W*.89,G-102,12);
       R(c,"#f8e4c7",W*(.11+.78*g.film)-12,G-120,24,35,6);
       for(let i=0;i<3;i++)T(c,"▣",W*(.25+i*.25),G-68,27,"#fff0d4");
     }else if(kind==="park"||kind==="party"){
       for(const b of g.balls)if(!b.caught){
         const xx=b.x+Math.cos(g.elapsed+b.phase)*13,yy=b.y+Math.sin(g.elapsed*2+b.phase)*20;
         GLOW(c,xx,yy,28,"#ffe3a2a6");T(c,"✦",xx,yy,25,"#ffeabd");
       }
       T(c,"TOQUE NAS ESTRELINHAS",W*.5,G-62,16);
     }else if(kind==="arcade"){
       for(const b of g.balls)T(c,"♥",b.x,b.y,36,"#ffbdc3");
       R(c,"#f9d392",g.paddle-62,G-67,124,16,6);
       T(c,"← DESLIZE A RAQUETE →",W*.5,G-85,16);
     }else if(kind==="motel"){
       if(g.phase===0){
         T(c,"ILUMINAÇÃO DO QUARTO",W*.5,G-251,19);
         R(c,"#f8e2c6",W*.12,G-239,W*.76,12,6);
         R(c,"#d99e98",W*.12,G-239,W*.76*g.light,12,6);
         C(c,"#fff4dc",W*(.12+.76*g.light),G-233,17);
         GLOW(c,W*.52,G-160,110,"#f6bba18f");
         T(c,"ARRASTE PARA ESCURECER",W*.5,G-78,17);
       }else if(g.phase===1){
         T(c,"FECHAR AS CORTINAS",W*.5,G-252,20);
         R(c,"#9cc2c2",W*.16,G-222,W*.68,110,7);
         R(c,"#d8a0b2",W*.16,G-222,W*.68*g.curtain,110,4);
         T(c,"ARRASTE PARA A DIREITA",W*.5,G-76,17);
       }else{
         GLOW(c,W*.5,G-169,125,"#ffa6bd8a");
         T(c,"♥",W*.5,G-137,95,"#ffd0ce");
         R(c,"#f3d9b8",W*.21,G-69,W*.58,15,6);
         R(c,"#db8897",W*.21,G-69,W*.58*clamp(g.hold/2.3,0,1),15,6);
         T(c,"SEGURE NO CORAÇÃO",W*.5,G-250,18);
       }
     }else if(kind==="cafe"){
       cup(c);swirlArt(c,g.swirl);
       T(c,"DESENHE CÍRCULOS NO AÇAÍ",W*.5,G-75,16);
     }else if(kind==="music"){
       const topY=G-275,target=G-90;
       for(let i=0;i<3;i++){
         const xx=W*(.22+i*.28);
         R(c,"#21334d",xx-40,topY-9,80,210,5);
         R(c,["#e3acb3","#a5d1c5","#e9cf9a"][i],xx-38,target-12,76,26,5);
         T(c,["A","S","D"][i],xx,target+4,22,"#2e4055");
       }
       for(const n of g.notes)if(!n.hit&&n.y>topY-40&&n.y<G+10){
         const xx=W*(.22+n.lane*.28);
         T(c,"♪",xx,n.y,31,["#f7c3ca","#b4eed8","#fff0ae"][n.lane]);
       }
       T(c,"TOQUE NAS FAIXAS QUANDO A NOTA CHEGAR",W*.5,G-58,12);
     }else if(kind==="photo"){
       const tx=W*.5+Math.sin(g.elapsed*.9)*95,ty=G-182+Math.cos(g.elapsed*1.2)*25;
       GLOW(c,tx,ty,82,"#f4b2bb6b");
       T(c,"♥",tx,ty+15,69,"#ffdee0");
       const {x,y}=g.cursor;
       L(c,"#fff0c7",x-38,y-32,x-12,y-32,4);
       L(c,"#fff0c7",x-38,y-32,x-38,y-8,4);
       L(c,"#fff0c7",x+38,y-32,x+12,y-32,4);
       L(c,"#fff0c7",x+38,y-32,x+38,y-8,4);
       L(c,"#fff0c7",x-38,y+32,x-12,y+32,4);
       L(c,"#fff0c7",x-38,y+32,x-38,y+8,4);
       L(c,"#fff0c7",x+38,y+32,x+12,y+32,4);
       L(c,"#fff0c7",x+38,y+32,x+38,y+8,4);
       for(let i=0;i<g.polaroids;i++)R(c,"#f8e8cc",W*.23+i*W*.2,G-79,52,28,4);
       T(c,"MIRE NO CORAÇÃO E FOTOGRAFE",W*.5,G-263,15);
     }
     c.restore();
   };
   function pot(c){
     const D=sc(),{R,C,G:GLOW,T}=D;
     R(c,"#465b6b",W*.34,G-176,W*.32,115,15);
     R(c,"#ddaaa0",W*.35,G-177,W*.3,27,10);
     GLOW(c,W*.5,G-181,100,"#ffe5ae5e");
     for(let i=0;i<5;i++)C(c,"#ffeac7",W*.4+i*W*.045,G-166+Math.sin(g.elapsed*3+i)*6,7);
   }
   function cup(c){
     const D=sc(),{R,C,G:GLOW}=D;
     GLOW(c,W*.5,G-155,167,"#f9e1a573");
     C(c,"#fff4e1",W*.5,G-160,107);
     C(c,"#9f6377",W*.5,G-160,88);
     C(c,"#b78380",W*.5,G-160,76);
     R(c,"#fff4dd",W*.64,G-199,28,60,12);
   }
   function swirlArt(c,amount){
     const D=sc(),{T}=D;const turns=Math.min(6,amount/Math.PI);
     c.strokeStyle="#fbe8c7";c.lineWidth=6;c.beginPath();
     for(let i=0;i<100;i++){
       const a=i/100*Math.PI*2*turns,r=i/100*53;
       const x=W*.5+Math.cos(a)*r,y=G-157+Math.sin(a)*r;
       if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
     }
     c.stroke();
     T(c,(Math.floor(amount/Math.PI*10))+"%",W*.5,G-47,16);
   }
   return Object.assign(g,{down,move,up,action,key,update,render:frame,finish});
 }
 return {create};
})();