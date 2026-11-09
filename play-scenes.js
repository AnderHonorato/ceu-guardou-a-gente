"use strict";
window.PequeScenes=(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(v,b));
 const P=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
 const C=(c,col,x,y,r)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();};
 const R=(c,col,x,y,w,h,r=5)=>{c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
 const L=(c,col,x,y,x2,y2,width=2)=>{c.strokeStyle=col;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();};
 const T=(c,str,x,y,size=15,col="#fff4df",align="center")=>{c.font="700 "+size+"px 'Pixelify Sans',monospace";c.textAlign=align;c.fillStyle=col;c.fillText(str,x,y);};
 const G=(c,x,y,r,colour)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,colour);g.addColorStop(1,"#ffffff00");c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)};
 const themes={
  home:["#d99c9a","#ffe1ba","#a66b73","#66485e"],
  market:["#71a6a4","#e4ded0","#507f86","#2e576b"],
  cinema:["#312c4c","#695474","#252941","#181e35"],
  park:["#8bd1c1","#f6d1a2","#6199a0","#356a6b"],
  cafe:["#bb7890","#f4c69c","#a37371","#574b69"],
  music:["#46365b","#a65b83","#44305b","#292942"],
  motel:["#684568","#e3a2ad","#754b73","#433453"],
  book:["#c69e79","#eed3a9","#94765c","#5f4b4d"],
  arcade:["#2a365b","#a05e92","#38466d","#1e2947"],
  restaurant:["#c88479","#f4c39d","#986b71","#61475b"],
  photo:["#8c9ca3","#f1c29f","#758a94","#425267"],
  party:["#9e7393","#f3ba9e","#7e679b","#51456c"]
 };
 function srand(n){const x=Math.sin(n*71.71+201)*7919.11;return x-Math.floor(x)}
 function leaf(c,x,y,r,color,phase){c.save();c.translate(x,y);c.rotate(phase);R(c,color,-r/2,-r/2,r,r*.64,5);c.restore()}
 function texturedWall(c,S,a,b){
   const {W,H,ground,t}=S;
   const grad=c.createLinearGradient(0,0,0,ground+25);grad.addColorStop(0,a);grad.addColorStop(.78,b);grad.addColorStop(1,"#e9ba9f");c.fillStyle=grad;c.fillRect(0,0,W,H);
   for(let i=0;i<36;i++){
     const x=srand(i+S.level*2)*W,y=100+srand(i+23)*Math.max(100,ground-175);
     P(c,i%3===0?"#ffffff19":"#2733470a",x,y,12+i%4*7,2+i%3);
   }
   P(c,"#e8cba4",0,ground-22,W,9);P(c,"#405369",0,ground-14,W,14);
   const f=c.createLinearGradient(0,ground,0,H);f.addColorStop(0,"#a2787c");f.addColorStop(1,"#5a5267");c.fillStyle=f;c.fillRect(0,ground,W,H-ground);
   for(let i=0;i<19;i++){
     const y=ground+18+i*26;
     L(c,"#ffffff20",0,y,W,y,1);
     for(let k=0;k<5;k++)P(c,"#2635481b",(i%2)*48+k*W/4,y,3,25);
   }
 }
 function windowView(c,S,x,y,w=140,h=136){
   const {t}=S;
   R(c,"#3d5166",x-9,y-9,w+18,h+18,6);
   const sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,"#86b9c4");sky.addColorStop(1,"#f6c5a7");c.fillStyle=sky;c.fillRect(x,y,w,h);
   C(c,"#fce7c5",x+w*.74,y+h*.22,22);
   for(let i=0;i<7;i++){
     const bx=x+i*w/6,by=y+h*.6+srand(i+2)*32;
     P(c,"#5b7c8c",bx,by,w/6+2,y+h-by);
     for(let j=0;j<3;j++)P(c,"#ffe9bb9e",bx+5+j*9,by+8,w/32,7);
   }
   for(let i=0;i<3;i++){
     const drift=(t*(i+1)*3)% (w+70);
     R(c,"#fff6df72",x+((i*48+drift)%(w+60))-25,y+26+i*21,46,9,5);
   }
   P(c,"#f9e1bf",x+w*.48,y,6,h);P(c,"#f9e1bf",x,y+h*.51,w,6);P(c,"#6b5465",x-14,y+h,w+28,10);
   P(c,"#cf919a",x-12,y-6,14,h+5);P(c,"#cf919a",x+w-2,y-6,14,h+5);
 }
 function lamp(c,x,y,t,shade="#f6cd98"){
   L(c,"#5e4d62",x,y,x,y+66,6);R(c,"#725a69",x-17,y-3,34,9,2);
   G(c,x,y-4,90,"#ffe8b990");R(c,shade,x-24,y-39,48,39,6);P(c,"#fff5d4",x-12,y-22,24,4);
   P(c,"#4e4159",x-6,y+64,12,4);
 }
 function cat(c,x,y,t,k=0,size=1){
   const colors=[["#e9d4b9","#4d4245","#85b7e6"],["#858d9c","#4b5b70","#e2bf83"],["#dfb1a0","#965f60","#a5ccae"]];
   const [body,tip,eye]=colors[k];c.save();c.translate(x,y+Math.sin(t*2+k)*2);c.scale(size,size);
   const tail=Math.sin(t*3+k)*7;
   P(c,"#2d324733",-22,-3,44,6);
   R(c,body,-19,-27,39,24,9);R(c,tip,-19,-29,10,8,2);
   L(c,tip,17,-15,26+tail,-32,7);
   R(c,body,-17,-44,33,26,7);
   c.fillStyle=tip;c.beginPath();c.moveTo(-17,-37);c.lineTo(-15,-52);c.lineTo(-3,-42);c.fill();
   c.beginPath();c.moveTo(6,-42);c.lineTo(17,-52);c.lineTo(16,-36);c.fill();
   P(c,eye,-9,-32,5,5);P(c,eye,6,-32,5,5);P(c,"#c46d77",-1,-23,4,3);
   P(c,tip,-13,-5,9,6);P(c,tip,7,-5,9,6);
   c.restore();
 }
 function home(c,S){
   const {W,H,ground,t}=S;windowView(c,S,W*.1,ground-327,150,143);
   R(c,"#855b79",W*.53,ground-213,W*.34,112,13);
   R(c,"#dc9da2",W*.52,ground-230,W*.35,93,13);
   R(c,"#efd0b5",W*.56,ground-193,W*.115,43,10);
   R(c,"#f6ddba",W*.72,ground-193,W*.12,43,10);
   P(c,"#5f4b69",W*.52,ground-127,W*.35,11);
   R(c,"#d9b7a1",W*.37,ground-38,135,18,6);
   P(c,"#64495b",W*.405,ground-20,6,20);P(c,"#64495b",W*.60,ground-20,6,20);
   C(c,"#f8e0b9",W*.48,ground-40,16);
   R(c,"#dc9ba4",W*.25,ground-66,88,23,8);
   R(c,"#f5d5a8",W*.26,ground-70,70,10,4);
   R(c,"#aa778c",W*.33,ground-269,70,65,2);
   R(c,"#f9e4c2",W*.34,ground-259,50,44,3);
   T(c,"A + L",W*.405,ground-230,18,"#985972");
   for(let i=0;i<3;i++)cat(c,W*(.2+i*.155)+Math.sin(t*(.7+i*.3))*10,ground-6,t+i,i,.92);
   R(c,"#829f88",W*.13,ground-142,26,112,4);
   for(let i=0;i<7;i++)leaf(c,W*.17+(srand(i)*60-30),ground-144-i*6,19,"#9bc39d",t*.2+i);
   if(S.effect?.kind==="hug")G(c,W*.64,ground-150,130,"#ffe2b980");
 }
 function market(c,S){
   const {W,ground,t}=S;
   R(c,"#fff0d0",W*.08,ground-347,W*.84,36,5);T(c,"MERCADO DE NÓS DOIS",W*.5,ground-323,22,"#456c72");
   const colors=["#f5c79f","#b5d8bd","#ed9f91","#dfcfa8","#9bc4d0"];
   for(let row=0;row<3;row++){
     const y=ground-271+row*82;
     for(let col=0;col<7;col++){
       const x=21+col*(W-41)/7;
       R(c,"#47727a",x,y,49,72,3);
       const packageColor=colors[(col+row+S.level)%5];
       R(c,packageColor,x+7,y+10,35,46,2);
       P(c,"#fff8dfbd",x+14,y+18,22,7);P(c,"#b26e7399",x+16,y+31,18,12);
     }
     P(c,"#294858",0,y+67,W,11);P(c,"#ead9bb",0,y+69,W,4);
   }
   // cart physically rolls with Ander
   const bx=clamp(S.px+62,65,W-68);
   P(c,"#38596a",bx-30,ground-62,65,6);R(c,"#b9dad4",bx-28,ground-109,54,43,3);
   for(let i=0;i<4;i++)L(c,"#557c86",bx-23+i*13,ground-101,bx-24+i*13,ground-69,2);
   L(c,"#f3e0bd",bx-28,ground-110,bx-44,ground-128,5);
   C(c,"#273d50",bx-12,ground-48,8);C(c,"#273d50",bx+22,ground-48,8);
   for(let i=0;i<(S.game&&S.game.kind==="market"?S.game.score:0);i++){
     R(c,colors[i%5],bx-18+i*10,ground-124-(i%2)*5,12,21,3);
   }
   G(c,bx-5,ground-100,67,"#fff0c02b");
 }
 function cinema(c,S){
   const {W,ground,t}=S;
   P(c,"#27243e",W*.04,ground-354,W*.92,268);
   R(c,"#f6d8ad",W*.08,ground-337,W*.84,234,3);
   R(c,"#3b5370",W*.095,ground-320,W*.81,202,4);
   const filmFrame=Math.floor(t*3)%3;
   if(!S.game||S.game.kind!=="cinema"){
     C(c,"#f5cfa2",W*.73,ground-266,33);
     for(let i=0;i<5;i++)R(c,"#7ca4a5",W*.15+i*W*.15,ground-183-(i%2)*19,70,95,6);
     R(c,"#f1b09a",W*.28,ground-216,112,40,4);
     T(c,"08 JUL",W*.48,ground-181,23,"#fff0d1");
   }
   for(let i=0;i<7;i++){
     const x=20+i*W/7;
     R(c,"#674c70",x,ground-93,W/9,52,13);
     R(c,"#bd829a",x+6,ground-89,W/11,32,7);
   }
   P(c,"#d49aa1",0,ground-101,W,8);
   G(c,W*.5,ground-244,260,"#ffffff28");
   // animated spotlight dust
   for(let i=0;i<16;i++){P(c,"#fff0b9",W*.11+srand(i)*W*.75,ground-315+((t*7+i*28)%213),2,2)}
 }
 function park(c,S){
   const {W,H,ground,t}=S;
   const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#77c5c4");sky.addColorStop(1,"#ffe1b4");c.fillStyle=sky;c.fillRect(0,0,W,H);
   C(c,"#ffe1b1",W*.74,ground-313,49);
   for(let i=0;i<5;i++){
     const x=i*W*.25,y=ground-175-(i%3)*35;
     R(c,"#5c9b8c",x,y,160,170,60);
   }
   // ferris wheel rotates slowly in the background
   const cx=W*.65,cy=ground-232,r=94;
   c.strokeStyle="#8d7185";c.lineWidth=5;c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();
   for(let i=0;i<8;i++){const a=t*.17+i*Math.PI/4;const xx=cx+Math.cos(a)*r,yy=cy+Math.sin(a)*r;
     L(c,"#bd8692",cx,cy,xx,yy,2);R(c,["#dba2ad","#eac88f","#a1c4ae"][i%3],xx-11,yy,23,17,4);
   }
   P(c,"#997b78",cx-8,cy+10,16,202);
   for(let i=0;i<6;i++)leaf(c,35+i*W/5,ground-45-Math.sin(t+i)*6,14,"#dcefa7",Math.sin(t+i));
   P(c,"#6b9c72",0,ground-20,W,20);
 }
 function cafe(c,S){
   const {W,ground,t}=S;
   windowView(c,S,W*.1,ground-315,150,130);
   R(c,"#644d64",W*.48,ground-305,W*.43,182,5);
   for(let i=0;i<3;i++){
     R(c,"#e7b48f",W*.51+i*82,ground-290,67,119,4);
     P(c,"#f8e5c9",W*.525+i*82,ground-277,46,9);
   }
   R(c,"#e7b990",W*.43,ground-138,W*.52,27,4);
   R(c,"#b17f79",W*.44,ground-111,W*.51,76,3);
   R(c,"#f0d8b7",W*.18,ground-71,128,16,6);
   P(c,"#644d64",W*.21,ground-55,8,34);P(c,"#644d64",W*.35,ground-55,8,34);
   const cupx=W*.25;
   R(c,"#fff2d7",cupx-18,ground-96,39,26,4);
   R(c,"#fff2d7",cupx+17,ground-93,11,15,5);
   for(let i=0;i<3;i++)C(c,"#ffffff8e",cupx-12+i*13+Math.sin(t*2+i)*3,ground-109-i*12,4);
   T(c,"AÇAÍ & CAFÉ",W*.73,ground-331,19,"#fceccf");
 }
 function music(c,S){
   const {W,ground,t}=S;
   G(c,W*.5,ground-242,280,"#f3a5bf5c");
   R(c,"#483951",W*.06,ground-336,W*.88,228,9);
   for(let side=0;side<2;side++){
     const sx=side?W*.75:W*.09;
     R(c,"#26384d",sx,ground-297,W*.18,189,7);
     for(let i=0;i<3;i++){
       C(c,"#b7759b",sx+W*.09,ground-251+i*55,26-i*5);
       C(c,"#3a4961",sx+W*.09,ground-251+i*55,17-i*3);
       C(c,"#efd9b2",sx+W*.09,ground-251+i*55,4);
     }
   }
   R(c,"#a57587",W*.3,ground-232,W*.39,97,8);
   R(c,"#f0c9aa",W*.32,ground-213,W*.34,13,3);
   C(c,"#2c344e",W*.5,ground-164,37);
   C(c,"#bd8da1",W*.5,ground-164,17);
   C(c,"#f8e5c1",W*.5,ground-164,5);
   L(c,"#f2d5b4",W*.5+27,ground-173,W*.58,ground-194,4);
   for(let i=0;i<10;i++){
     const h=22+Math.abs(Math.sin(t*4+i*.65))*70;
     R(c,["#f6bbbc","#b0d8c2","#f1d394"][i%3],W*.29+i*W*.042,ground-315-h,12,h,2);
   }
   for(let i=0;i<8;i++){
     T(c,i%2?"♪":"♫",W*.17+i*W*.09,ground-319-Math.sin(t*1.6+i)*27,18,"#fff0d7");
   }
 }
 function motel(c,S){
   const {W,ground,t}=S;
   const mood=S.mood??.68,soft=c.createLinearGradient(0,0,W,ground);
   soft.addColorStop(0,"#382e4c");soft.addColorStop(1,mood>.6?"#bc718c":"#593750");
   c.fillStyle=soft;c.fillRect(0,0,W,S.H);
   for(let i=0;i<4;i++){G(c,i*W/3,ground-130,145,"#ef9baa22")}
   windowView(c,S,W*.68,ground-340,125,148);
   // Plush bedroom drawn in layers
   R(c,"#50384d",W*.1,ground-206,W*.66,148,18);
   R(c,"#e9b1a6",W*.105,ground-190,W*.65,137,19);
   R(c,"#fce6d5",W*.13,ground-175,W*.26,61,12);
   R(c,"#f8d2c4",W*.44,ground-176,W*.27,59,12);
   R(c,"#b77d99",W*.105,ground-104,W*.65,68,11);
   R(c,"#df9aa6",W*.105,ground-99,W*.65,39,12);
   P(c,"#7c5869",W*.12,ground-43,W*.59,12);
   lamp(c,W*.86,ground-184,t);
   G(c,W*.85,ground-180,150,"#ffddbb9a");
   for(let i=0;i<10;i++){
     const yy=ground-125+((t*7+i*39)%120),xx=W*.19+srand(i)*W*.48;
     leaf(c,xx,yy,8,"#f2b4be",Math.sin(t+i));
   }
   if(S.game&&S.game.kind==="motel"){
     c.fillStyle="rgba(18,15,46,"+((1-(S.game.light??.7))*.67)+")";c.fillRect(0,0,W,S.H);
     if(S.game.ready)G(c,W*.47,ground-154,210,"#ffadbf6e");
   }
 }
 function book(c,S){
   const {W,ground,t}=S;
   for(let k=0;k<5;k++){
     const x=18+k*(W-36)/5;
     R(c,"#59485a",x,ground-342,W/5-5,294,5);
     for(let r=0;r<5;r++){
       const y=ground-329+r*55;
       for(let n=0;n<5;n++)R(c,["#bc7f86","#a7bbad","#e7c39b","#927b9c"][(k+n+r)%4],x+7+n*14,y,12,43,1);
       P(c,"#d5a97e",x+5,y+43,W/5-15,6);
     }
   }
   R(c,"#d7a78b",W*.31,ground-112,W*.38,24,5);
   R(c,"#765c66",W*.32,ground-89,11,58);
   R(c,"#765c66",W*.66,ground-89,11,58);
   // open book and fluttering loose page
   R(c,"#fff4d9",W*.44,ground-139,70,34,3);
   for(let i=0;i<4;i++)L(c,"#ab8574",W*.46,ground-130+i*7,W*.55,ground-130+i*7,1);
   leaf(c,W*.73+Math.sin(t)*9,ground-203+Math.cos(t)*18,19,"#f4e2be",Math.sin(t));
 }
 function arcade(c,S){
   const {W,ground,t}=S;
   for(let i=0;i<4;i++){
     const x=12+i*W/4;
     G(c,x+55,ground-238,96,["#fa82b555","#69d7d755","#ffdc9555"][i%3]);
     R(c,"#28334e",x,ground-314,W/4-8,274,6);
     R(c,["#e789b5","#8be2d7","#edcf85","#bd94da"][i],x+10,ground-293,W/4-28,132,5);
     R(c,"#263f54",x+18,ground-281,W/4-44,105,4);
     T(c,["♡","★","♫","✦"][i],x+W/8,ground-217+Math.sin(t*4+i)*4,42,["#ffb6c4","#f7d49a","#9fe1d4","#f2a8da"][i]);
     R(c,"#b785ad",x+13,ground-157,W/4-34,32,4);
     C(c,"#c3e5e3",x+35,ground-141,6);C(c,"#f0c49e",x+70,ground-141,6);
     R(c,"#3a334f",x+11,ground-102,W/4-28,53,5);
   }
   P(c,"#e6a2bf",0,ground-20,W,6);
 }
 function restaurant(c,S){
   const {W,ground,t}=S;
   R(c,"#b78177",0,ground-335,W,75,4);
   for(let i=0;i<5;i++){
     const x=30+i*W/5;R(c,"#fbdbb5",x,ground-315,50,42,4);P(c,"#d9a480",x+8,ground-305,35,7);
   }
   R(c,"#c9a79e",0,ground-255,W,19,4);
   for(let i=0;i<4;i++){
     R(c,"#5f6770",W*.07+i*W*.23,ground-209,84,150,4);
     R(c,"#fff2d6",W*.09+i*W*.23,ground-189,62,75,3);
   }
   R(c,"#a26a6a",0,ground-109,W,79,4);
   R(c,"#e4b3a0",0,ground-116,W,23,5);
   R(c,"#465065",W*.42,ground-132,104,15,6);
   R(c,"#76747b",W*.44,ground-160,99,37,9);
   for(let i=0;i<6;i++)C(c,"#ffffff99",W*.48+(i%3)*12+Math.sin(t+i)*2,ground-170-(i%3)*13,4);
   T(c,"NOSSA RECEITA",W*.64,ground-295,21);
 }
 function photo(c,S){
   const {W,ground,t}=S;
   R(c,"#31455b",W*.04,ground-340,W*.92,267,7);
   R(c,"#f3c6b7",W*.08,ground-315,W*.84,215,8);
   for(let i=0;i<4;i++){
     R(c,"#fff0dc",W*.12+i*W*.19,ground-293,W*.14,132,4);
     R(c,["#8daab1","#e2bb94","#c69ab2","#a7c5a4"][i],W*.13+i*W*.19,ground-281,W*.12,100,3);
     T(c,"♡",W*(.19+i*.19),ground-212+Math.sin(t+i)*3,24,"#fff4dd");
   }
   R(c,"#4b5f74",W*.44,ground-193,16,152,4);
   R(c,"#eed0b4",W*.36,ground-204,115,13,3);
   R(c,"#3c4e69",W*.78,ground-184,54,57,4);
   C(c,"#b4d3d9",W*.84,ground-155,22);
   C(c,"#3c5269",W*.84,ground-155,13);
   G(c,W*.41,ground-183,100,"#ffe9bd7c");
 }
 function render(c,S,host){
   const type=themes[S.type]?S.type:"cafe",palette=themes[type];
   c.save();c.imageSmoothingEnabled=false;
   if(type==="park")park(c,S);else if(type==="motel")motel(c,S);else texturedWall(c,S,palette[0],palette[1]);
   if(type==="home")home(c,S);
   else if(type==="market")market(c,S);
   else if(type==="cinema")cinema(c,S);
   else if(type==="cafe")cafe(c,S);
   else if(type==="music")music(c,S);
   else if(type==="book")book(c,S);
   else if(type==="arcade")arcade(c,S);
   else if(type==="restaurant")restaurant(c,S);
   else if(type==="photo")photo(c,S);
   // visible hotspots act like objects instead of static list buttons
   if(!S.game){
     hotspots(S).forEach((o,i)=>{
       const glow=.5+.5*Math.sin(S.t*2+i*2);
       G(c,o.x,o.y,36,"#ffe9b759");
       C(c,"#ffe1ac",o.x,o.y-29+Math.sin(S.t*3+i)*4,5+glow*2);
       T(c,o.symbol,o.x,o.y-45+Math.sin(S.t*2+i)*3,18,"#fff4c8");
     });
   }
   const walking=!!S.move;
   const actorY=S.ground-22;
   if(host?.drawCharacter){
     host.drawCharacter(c,S.lx,actorY,"lil",S.t+.2,walking,1.7,1);
     host.drawCharacter(c,S.px,actorY,"ander",S.t,walking,1.8,1);
   }
   if(S.effect&&S.effect.until>S.t){
     const q=S.effect;
     if(q.kind==="hug"){
       G(c,(S.px+S.lx)/2,actorY-120,130,"#ffe2aa9d");
       for(let i=0;i<6;i++){
         const x=(S.px+S.lx)/2+Math.sin(S.t*3+i)*35;
         T(c,"♥",x,actorY-150+Math.cos(S.t*2+i)*40,17,"#ffb3ab");
       }
     }else{
       for(let i=0;i<9;i++){
         const x=q.x+Math.sin(S.t*3+i*9)*60,y=q.y+Math.sin(S.t*2+i)*32;
         C(c,"#ffe9a2",x,y,2+i%3);
       }
     }
   }
   for(const p of S.particles){
     c.globalAlpha=Math.max(0,p.life);
     T(c,p.glyph||"✦",p.x,p.y,p.size,p.color);
   }
   c.globalAlpha=1;c.restore();
 }
 function hotspots(S){
   const W=S.W,g=S.ground;
   return [
     {x:W*.22,y:g-175,label:S.type==="home"?"JANELA":S.type==="market"?"PRATELEIRA":"OLHAR",symbol:"✦",kind:"observe"},
     {x:W*.65,y:g-145,label:S.type==="motel"?"ABAJUR":S.type==="home"?"SOFÁ":"DESCOBRIR",symbol:"♡",kind:"moment"},
     {x:W*.48,y:g-67,label:"BRINCAR",symbol:"★",kind:"play"}
   ];
 }
 return {render,hotspots,cat,P,R,C,L,T,G,themes};
})();