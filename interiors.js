"use strict";
window.InfinitosLocais=(()=>{
 const $=s=>document.querySelector(s);
 const rooms=[
  [
   ["home","A casa da primeira conversa","O diário lembra que um encontro entre amigos acabou aproximando vocês dois. Às vezes a melhor história nasce sem roteiro.","diario"],
   ["market","Mercado do improviso","Vocês gostam de fazer compras juntos. Nesta fantasia, cada corredor vira uma oportunidade de escolher algo para dividir.","relato"],
   ["book","Livraria das palavras","Um lugar imaginário para guardar as primeiras frases que talvez nem coubessem numa mensagem.","ficcao"],
   ["cafe","Cantinho do começo","Uma cafeteria inventada para um primeiro intervalo só de vocês, com conversa sem pressa.","ficcao"],
   ["music","Loja dos discos","Um lugar para imaginar a trilha sonora de duas pessoas descobrindo sintonia.","ficcao"],
   ["home","Casa dos gatos do Lil","Um lar imaginado como refúgio para o carinho — e para dois moradores de quatro patas.","relato"],
   ["motel","Uma noite fora do tempo","Inspirado nos momentos reservados de vocês: espaço para romance, privacidade e carinho, sem pressa.","relato"]
  ],
  [
   ["cinema","O primeiro cinema","Em 3 de julho, vocês registraram uma ida ao cinema e muitas risadas durante o filme.","diario"],
   ["park","Parque das primeiras aventuras","Em 4 de julho, o diário registra um parque de diversões e a alegria de ver o outro feliz.","diario"],
   ["home","A casa das flores e do ursinho","O diário conta sobre uma cesta de doces e bolos, flores, ursinho e uma cartinha feita à mão.","diario"],
   ["market","Supermercado do jantar","Uma compra em dupla, inspirada nas idas ao mercado que vocês fazem juntos.","relato"],
   ["restaurant","Cozinha do molho branco","Em julho, o diário anotou um plano de fazer macarrão com molho branco e assistir a algo juntos.","diario"],
   ["book","Papelaria das cartas","Um espaço inspirado na carta escrita à mão e na vontade de transformar sentimentos em papel.","diario"],
   ["motel","Suíte do silêncio bom","Um cenário romântico inspirado nas escapadas a dois que você contou, sem reproduzir momentos íntimos.","relato"]
  ],
  [
   ["home","A casa arrumadinha","Em agosto, vocês registraram o carinho de arrumar tudo para a chegada do outro e passar o fim de semana juntos.","diario"],
   ["market","Comprinhas para ficar em casa","Um mercado imaginário para escolher comidas e bebidas para um fim de semana aconchegante.","relato"],
   ["arcade","Fliperama das risadas","Um desafio inventado para celebrar as brincadeiras, as manias e as gargalhadas de vocês.","ficcao"],
   ["cafe","Açaí, esfiha e música","Em agosto, vocês registraram uma noite especial com açaí, esfiha, música e companhia até tarde.","diario"],
   ["music","Madrugada de cantoria","Em 7 de agosto, o diário lembra uma madrugada de conversas e canções juntos.","diario"],
   ["home","Cookie e a porta","Em 9 de agosto, o diário registrou Cookie tentando sair de casa. Aqui, ele virou o guardião de uma missão.","diario"],
   ["motel","Luzes que desaceleram","Uma escapada inventada a partir das visitas de vocês, com um jogo de montar uma noite acolhedora.","relato"]
  ],
  [
   ["cafe","Café das tardes calmas","Uma cena imaginada a partir do prazer de ficar juntos, ouvindo música e esquecendo o relógio.","ficcao"],
   ["market","Feira dos sabores","Um passeio fictício com um desafio de lista de compras para dois.","relato"],
   ["home","Dois dias sem pressa","Você contou que às vezes passam dois ou três dias juntinhos em casa. Aqui, o sofá vira o melhor destino.","relato"],
   ["cinema","Sessão no sofá","Um cinema imaginário onde escolher o filme é quase um jogo à parte.","relato"],
   ["book","Biblioteca dos planos","Inspirada nos desejos escritos no Enlace: viajar para um lugar novo e construir uma vida juntos.","diario"],
   ["restaurant","Nosso menu secreto","Um jantar de faz de conta inspirado no prazer de cozinhar e comer juntos.","ficcao"],
   ["motel","Suíte do refúgio","Uma cena de privacidade e romance, com luzes, música suave e uma lembrança para guardar.","relato"]
  ],
  [
   ["home","O sofá de outubro","Uma pequena cena imaginária sobre fazer o tempo passar mais devagar quando vocês estão juntos.","ficcao"],
   ["market","Mercado de sexta","Um passeio divertido, inspirado nas compras que vocês fazem em dupla.","relato"],
   ["photo","Estúdio das lembranças","O Enlace guarda fotos e vídeos de vocês; aqui, brincar de fotógrafo rende uma lembrança especial.","diario"],
   ["cinema","A sessão surpresa","Um cinema fictício para rir junto de novo, como na primeira ida registrada em julho.","diario"],
   ["arcade","Fliperama das manias","Uma brincadeira inspirada nas manias e nos momentos em que vocês caem na risada.","diario"],
   ["park","Praça do próximo passeio","O diário guarda planos de visitar a Paulista e o Ibirapuera. Esta praça é uma versão inventada desse desejo.","diario"],
   ["motel","Quarto das horas livres","Um cantinho de romance inspirado nas escapadas de vocês, com atenção aos pequenos gestos.","relato"]
  ],
  [
   ["home","Nossa sala de novembro","Cinco meses desde 8 de junho. O lugar mais bonito continua sendo aquele em que vocês podem ficar à vontade juntos.","relato"],
   ["market","Lista de compras a dois","Uma pequena aventura de supermercado inspirada na rotina que você contou.","relato"],
   ["cinema","Filme dos próximos capítulos","Uma sessão imaginária para celebrar as histórias que vocês ainda vão viver.","ficcao"],
   ["park","Jardim dos planos","O diário registra o sonho de uma viagem inédita e do passeio no Ibirapuera. Aqui, o desejo ganha cenário.","diario"],
   ["arcade","A última ficha?","Uma última partida, porque vocês merecem mais jogos e risadas juntos.","ficcao"],
   ["cafe","Café dos cinco meses","Um brinde imaginário com açaí, esfiha e a alegria das pequenas rotinas.","diario"],
   ["motel","Nosso tempo particular","Um lugar inventado para celebrar o carinho, a confiança e os momentos reservados de vocês.","relato"]
  ]
 ];
 const descriptions={
  home:["Um retrato tortinho de vocês na parede.","O sofá parece pedir um abraço demorado.","A janela está aberta, mas os gatinhos ficam seguros aqui."],
  market:["A prateleira tem tudo para um lanchinho a dois.","Alguém deixou uma lista rabiscada no balcão.","O carrinho está esperando vocês escolherem juntos."],
  cinema:["O cartaz promete mais risadas que suspense.","As poltronas do meio parecem perfeitas para dois.","Cheiro de pipoca. Qual filme vocês escolheriam?"],
  park:["Uma árvore balança com o vento.","Um banco espera quem quiser conversar.","A barraca tem um prêmio fofo esperando."],
  cafe:["O balcão guarda dois pedidos especiais.","O relógio parece andar mais devagar.","O rádio toca uma música imaginária."],
  music:["Uma vitrola gira devagar.","As capas de discos contam pequenas histórias.","O microfone convida a uma cantoria."],
  motel:["O abajur deixa o quarto aconchegante.","As cortinas protegem a privacidade.","A playlist pode ficar como vocês preferirem."],
  book:["Um caderno de cartas parece ter páginas infinitas.","Os livros guardam palavras para dias felizes.","Uma caneta está pronta para escrever algo bonito."],
  arcade:["Uma máquina pisca 'JOGAR'.","O placar ainda está zerado. Por enquanto.","As luzes não param de piscar."],
  restaurant:["Uma receita está anotada na parede.","A panela ainda está quentinha.","Duas cadeiras esperam a refeição."],
  photo:["Uma câmera aponta para a melhor lembrança.","A luz está perfeita para um retrato.","A foto ainda precisa de uma moldura."],
  party:["O salão tem luzinhas coloridas.","Uma mesa espera os dois.","O letreiro parece dizer 'continuem'."]};
 const palettes=[
  {wall:"#f2ba9a",wall2:"#d69587",floor:"#b57f72",trim:"#42556a",light:"#fff1bd"},
  {wall:"#9bb9c3",wall2:"#7696a7",floor:"#677e90",trim:"#3d5770",light:"#f6e4bd"},
  {wall:"#bd92ae",wall2:"#966e9d",floor:"#694c7e",trim:"#453b66",light:"#ffe5b8"},
  {wall:"#efc29f",wall2:"#d79f82",floor:"#ad7d68",trim:"#684f65",light:"#fff3c4"},
  {wall:"#9bc2b3",wall2:"#78a69d",floor:"#739087",trim:"#3f646a",light:"#ffe7b0"},
  {wall:"#e6a3a3",wall2:"#b77b93",floor:"#88617e",trim:"#493d69",light:"#fff3c2"}
 ];
 const $button=(label,action,css="room-answer")=>{let b=document.createElement("button");b.type="button";b.className=css;b.textContent=label;b.addEventListener("click",action);return b};
 const shopPositions=Array.from({length:7},(_,i)=>40+i*185+62);
 let host=null,idx=-1,room=null,level=0,clock=0,activeGame=false,miniCancel=()=>{};
 const roomCanvas=$("#roomCanvas"),c=roomCanvas?.getContext("2d"),visitKey="pi-42-visitas-v2";
 let visited=new Set();
 try{visited=new Set(JSON.parse(localStorage.getItem(visitKey)||"[]"))}catch(_){}
 const getKey=(l,i)=>l+"-"+i;
 const getRoom=(l,i)=>{const [type,name,story,source]=rooms[l][i];return {type,name,story,source,level:l,index:i,id:getKey(l,i)}};
 const pix=(col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))};
 const line=(col,x,y,w,h)=>pix(col,x,y,w,h);
 const text=(string,x,y,size=12,color="#f9ecd1")=>{c.fillStyle=color;c.font="700 "+size+"px Pixelify Sans,monospace";c.textAlign="center";c.fillText(string,x,y)};
 const labelMap={diario:"LEMBRANÇA DO ENLACE",relato:"INSPIRADO NO QUE VOCÊ CONTOU",ficcao:"UMA CENA IMAGINADA PARA JOGAR"};
 const saved=()=>{
   try{localStorage.setItem(visitKey,JSON.stringify([...visited]))}catch(_){}
   const count=$("#memoryCounter");if(count)count.textContent=visited.size+"/42";
 };
 function markVisited(){
   if(!room)return;
   visited.add(room.id);saved();
   $("#roomMemoryMark").textContent="✦";
 }
 function setMessage(msg){const el=$("#roomGameStatus");if(el)el.textContent=msg;host?.notify?.(msg)}
 function resize(){
   if(!c)return;
   const portrait=window.innerHeight>window.innerWidth*1.22;
   roomCanvas.width=480;
   roomCanvas.height=portrait?Math.round(480*window.innerHeight/window.innerWidth):300;
   c.imageSmoothingEnabled=false;
 }
 window.addEventListener("resize",()=>{if(room)resize()});
 function open(index){
   if(!host||index<0||index>6)return;
   idx=index;level=host.state.level;room=getRoom(level,idx);clock=0;activeGame=false;
   host.state.phase="interior";host.state.keys.left=false;host.state.keys.right=false;
   host.state.autoTo=null;host.state.pendingDoor=null;
   $("#interior").hidden=false;$("#hud").hidden=true;$("#controls").hidden=true;
   $("#objective").hidden=true;$("#interactionHint").hidden=true;
   $("#roomName").textContent=room.name;
   $("#roomChapter").textContent="CAPÍTULO "+String(level+1).padStart(2,"0")+" · "+rooms[level][idx][0].toUpperCase();
   $("#roomStoryLabel").textContent=labelMap[room.source];
   $("#roomStoryText").textContent=room.story;
   $("#roomMemoryMark").textContent=visited.has(room.id)?"✦":"✧";
   $("#roomIntro").hidden=false;$("#roomActions").hidden=true;$("#roomGameLayer").hidden=true;
   $("#roomInspectIcon").textContent=room.type==="home"?"🐈":"✦";
   $("#roomInspectLabel").textContent=room.type==="home"?"BRINCAR COM OS GATOS":"EXAMINAR OBJETOS";
   resize();host.tone(660,.13);
 }
 function close(){
   activeGame=false;miniCancel();miniCancel=()=>{};idx=-1;room=null;
   $("#interior").hidden=true;$("#roomGameLayer").hidden=true;
   $("#hud").hidden=false;$("#controls").hidden=false;$("#objective").hidden=false;
   host.state.phase="playing";host.tone(480,.13);
 }
 function renderDoors(ctx,state){
   for(let i=0;i<7;i++){
     const x=40+i*185-state.camera,w=125;
     if(x<-180||x>state.width+100)continue;
     const y=state.ground;
     const filled=visited.has(getKey(state.level,i));
     ctx.fillStyle=filled?"#ffe8b1":"#d4eff0";
     ctx.fillRect(Math.round(x+43),Math.round(y-47),38,37);
     ctx.fillStyle=filled?"#ba8168":"#4d6980";
     ctx.fillRect(Math.round(x+47),Math.round(y-43),30,33);
     ctx.fillStyle="#ffedb9";ctx.fillRect(Math.round(x+68),Math.round(y-27),4,4);
     ctx.fillStyle="#273e4dcc";ctx.fillRect(Math.round(x+2),Math.round(y-115),120,18);
     ctx.textAlign="center";ctx.font="700 12px Pixelify Sans,monospace";
     ctx.fillStyle=filled?"#ffdd9c":"#fff0cf";
     const name=getRoom(state.level,i).name;
     ctx.fillText((name.length>19?name.slice(0,18)+"…":name).toUpperCase(),x+62,y-102,116);
     const pulse=Math.sin(state.time*3+i);
     ctx.fillStyle="#ffe7a8";ctx.fillRect(Math.round(x+59),Math.round(y-58+pulse*2),5,5);
     if(filled){ctx.font="bold 19px Pixelify Sans,monospace";ctx.fillText("★",x+105,y-79)}
   }
 }
 function catPix(ctx,x,y,t,kind=0,scale=1){
   ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
   const c0=["#e2c9b0","#777c8c","#eac39c"][kind],c1=["#58443c","#4e586a","#a56b53"][kind];
   const swing=Math.round(Math.sin(t*3+kind)*4),tail=Math.round(Math.sin(t*4+kind)*6);
   ctx.fillStyle="#253d4d44";ctx.fillRect(-15,0,32,3);
   ctx.fillStyle=c1;ctx.fillRect(11+tail*.2,-18,5,14);
   ctx.fillStyle=c0;ctx.fillRect(-14,-21,28,18);
   ctx.fillRect(-16,-29,32,16);
   ctx.fillStyle=c1;ctx.fillRect(-15,-34,9,9);ctx.fillRect(6,-34,9,9);
   ctx.fillStyle=kind===0?"#7ea5c9":"#f1d0a0";ctx.fillRect(-8,-25,4,4);ctx.fillRect(5,-25,4,4);
   ctx.fillStyle="#d08185";ctx.fillRect(-1,-19,3,2);
   ctx.fillStyle=kind===0?"#cbaa58":"#9cc4b2";ctx.fillRect(-12,-16,25,3);
   ctx.fillStyle=c1;ctx.fillRect(-12+swing*.3,-4,7,5);ctx.fillRect(5-swing*.3,-4,7,5);
   ctx.restore();
 }
 function streetCats(ctx,state){
   const cats=[{x:185,kind:0},{x:680,kind:1},{x:960,kind:2}];
   for(const [i,cat] of cats.entries()){
     const x=cat.x-state.camera+Math.sin(state.time*.9+i)*20;
     if(x<0||x>state.width)continue;
     catPix(ctx,x,state.ground-1,state.time+i,cat.kind,0.75);
     if(i===0&&Math.sin(state.time*.8)>0.65){
       ctx.textAlign="center";ctx.fillStyle="#fff0d0";ctx.font="bold 10px Pixelify Sans";
       ctx.fillText("COOKIE",x,state.ground-44);
     }
   }
 }
 function showDirectory(){
   if(host.state.phase!=="playing")return;
   host.state.phase="directory";$("#directory").hidden=false;$("#directory").classList.add("active");
   const grid=$("#directoryPlaces");grid.innerHTML="";
   rooms[host.state.level].forEach((_,i)=>{
     const r=getRoom(host.state.level,i);
     const b=$button((visited.has(r.id)?"★ ":"✧ ")+r.name,()=>{
       $("#directory").hidden=true;$("#directory").classList.remove("active");host.state.phase="playing";
       host.walkToDoor(i);
     },"directory-place");
     grid.appendChild(b);
   });
 }
 function closeDirectory(){if($("#directory").hidden)return;$("#directory").hidden=true;host.state.phase="playing"}
 function showJournal(){
   if(host.state.phase!=="playing")return;
   host.state.phase="journal";$("#journal").hidden=false;$("#journal").classList.add("active");
   const grid=$("#journalEntries");grid.innerHTML="";
   rooms.forEach((list,l)=>list.forEach((_,i)=>{
     const r=getRoom(l,i),row=document.createElement("div");row.className="journal-entry"+(visited.has(r.id)?" is-open":"");
     const title=document.createElement("strong");title.textContent=(visited.has(r.id)?"✦ ":"✧ ")+r.name;
     const desc=document.createElement("span");desc.textContent=visited.has(r.id)?r.story:"Um lugar ainda não explorado.";
     row.append(title,desc);grid.appendChild(row);
   }));
   saved();
 }
 function closeJournal(){if($("#journal").hidden)return;$("#journal").hidden=true;$("#journal").classList.remove("active");host.state.phase="playing"}
 function install(h){
   host=h;saved();
   let inspectionStep=0;
   $("#doorsToggle").addEventListener("click",showDirectory);
   $("#directoryExit").addEventListener("click",closeDirectory);
   $("#journalToggle").addEventListener("click",showJournal);
   $("#journalExit").addEventListener("click",closeJournal);
   $("#roomExit").addEventListener("click",close);
   $("#roomStoryNext").addEventListener("click",()=>{
     $("#roomIntro").hidden=true;$("#roomActions").hidden=false;markVisited();
   });
   $("#roomInspect").addEventListener("click",()=>{
     if(!room)return;
     const l=descriptions[room.type]||descriptions.cafe;
     setMessage(l[inspectionStep++%l.length]);
   });
   $("#roomGameStart").addEventListener("click",startGame);
   $("#roomGameCancel").addEventListener("click",()=>{
     miniCancel();miniCancel=()=>{};activeGame=false;$("#roomGameLayer").hidden=true;
   });
   roomCanvas.addEventListener("pointerdown",event=>{
     if(!room||!$("#roomIntro").hidden||!$("#roomGameLayer").hidden)return;
     const rect=roomCanvas.getBoundingClientRect();
     const x=(event.clientX-rect.left)/rect.width*480;
     const canvasY=(event.clientY-rect.top)/rect.height*roomCanvas.height;
     const y=canvasY-(roomCanvas.height>350?Math.round((roomCanvas.height-300)*.46):0);
     const boxes={
       home:[[38,48,158,146,0],[177,42,276,118,1],[294,110,450,228,1],[53,180,174,268,2]],
       market:[[23,75,137,191,0],[145,75,252,197,1],[320,75,442,195,2],[210,182,310,255,2]],
       cinema:[[25,53,450,185,0],[18,185,460,265,1],[187,188,259,248,2]],
       park:[[49,60,171,237,0],[177,170,307,255,1],[235,138,310,190,2]],
       cafe:[[31,54,149,145,0],[149,133,444,224,1],[65,180,184,249,2]],
       music:[[20,74,172,227,0],[284,92,442,222,1],[186,112,284,251,2]],
       motel:[[29,147,314,252,0],[332,42,452,163,1],[327,93,387,189,2]],
       book:[[19,60,171,244,0],[171,60,327,246,1],[319,60,466,245,2]],
       arcade:[[20,74,148,250,0],[151,74,315,250,1],[318,74,459,250,2]],
       restaurant:[[27,53,152,155,0],[154,103,444,230,1],[67,178,182,250,2]],
       photo:[[20,64,170,222,0],[184,63,390,221,1],[389,141,455,255,2]]
     };
     const spots=boxes[room.type]||boxes.cafe;
     const chosen=spots.find(([x1,y1,x2,y2])=>x>=x1&&x<=x2&&y>=y1&&y<=y2);
     if(!chosen){host.notify("Toque nos objetos para descobrir mais detalhes ✦");return}
     const idx=chosen[4],sentences=descriptions[room.type]||descriptions.cafe;
     const msg=room.type==="home"&&chosen===spots[3]
       ?"Cookie brinca com os dois gatinhos do Lil. A porta fica fechadinha para os três estarem seguros."
       :sentences[idx];
     setMessage(msg);host.tone(410+idx*130,.14);
     const spark=document.createElement("span");spark.className="room-touch-spark";spark.textContent="✦";
     const parent=$("#interior");
     const pRect=parent.getBoundingClientRect();
     spark.style.left=(event.clientX-pRect.left)+"px";spark.style.top=(event.clientY-pRect.top)+"px";
     parent.appendChild(spark);setTimeout(()=>spark.remove(),750);
   });
   document.addEventListener("keydown",e=>{
     if(e.key==="Escape"){
       if(!$("#roomGameLayer").hidden){$("#roomGameCancel").click();return}
       if(!$("#interior").hidden){close();return}
       if(!$("#directory").hidden){closeDirectory();return}
       if(!$("#journal").hidden){closeJournal();return}
     }
   });
 }

 function drawShelf(x,y,col="#896777"){
   pix("#455869",x,y,92,7);
   pix(col,x+4,y-65,85,62);
   for(let r=0;r<3;r++){
     pix("#455869",x+4,y-9-r*19,85,5);
     for(let i=0;i<5;i++){
       const bx=x+11+i*15,by=y-24-r*19;
       pix(["#edb389","#a8bfad","#e9d595","#e69a91"][(i+r)%4],bx,by,10,13);
       pix("#f9eed8",bx+2,by+3,5,2);
     }
   }
 }
 function drawWindow(x,y,w=70,h=65){
   pix("#445e68",x-5,y-5,w+10,h+10);
   pix("#b8dae1",x,y,w,h);
   pix("#c9e8e4",x,y,w,h*.48);
   const drift=Math.sin(clock*.45)*8;
   pix("#f7f3d4",x+8+drift,y+16,24,6);pix("#f7f3d4",x+16+drift,y+11,15,7);
   pix("#647f9c",x,y+h*.67,w,h*.33);
   pix("#fff2c5",x+w*.48,y,4,h);
   pix("#fff2c5",x,y+h*.52,w,4);
   pix("#f4e8d0",x-7,y+h-2,w+14,7);
 }
 function drawHouse(t){
   drawWindow(60,53,88,75);
   pix("#8b6e78",312,110,122,12);
   pix("#a87c74",303,118,140,58);
   pix("#dca78d",295,160,155,21);
   pix("#ead0aa",308,137,36,24);
   pix("#b47d79",346,138,29,22);
   pix("#f4e3be",192,47,77,56);
   pix("#9b6d7e",199,54,63,42);
   text("A + L",230,79,23,"#ffe6c5");
   pix("#8e7568",72,206,58,13);
   pix("#d9ad8a",68,196,60,19);
   pix("#4e6070",75,210,4,26);
   pix("#4e6070",117,210,4,26);
   // Household cats: Cookie (siamese) and two unnamed cats of Lil
   catPix(c,86+Math.sin(t*.9)*13,226,t,0,1.07);
   catPix(c,128+Math.sin(t*.7+1)*15,225,t,1,.86);
   catPix(c,154+Math.sin(t*.64+2)*10,231,t,2,.78);
   text("COOKIE",90,185,12,"#fff0d4");
   text("GATINHOS DO LIL",154,172,10,"#fff0d4");
 }
 function drawMarket(){
   drawShelf(35,154);drawShelf(148,170,"#72959b");drawShelf(330,156,"#c78a83");
   pix("#496173",222,203,64,12);pix("#8ca9a8",229,187,50,17);
   pix("#f5d6ae",236,178,36,10);
   text("COMPRAS",254,153,13,"#fff0d0");
   for(let i=0;i<3;i++){const x=200+i*12;pix("#e8ba8b",x,219+i%2*2,8,5)}
 }
 function drawCinema(t){
   pix("#3b4b64",20,55,440,126);
   pix("#f4ce9c",33,66,414,105);
   pix("#b96f77",39,73,400,92);
   pix("#e5b08b",50,81,380,74);
   pix("#f3d3b8",85,102,310,6);
   text("FIM?",238,135,36,"#5e4b65");
   for(let i=0;i<7;i++){
     const x=32+i*61;
     pix("#774c6b",x,187,47,66);
     pix("#a87083",x+5,189,37,40);
     pix("#bb8590",x+5,231,37,16);
   }
   pix("#e8bc94",194,205,25,26);pix("#f1d6a5",210,196,33,30);
   for(let i=0;i<6;i++)pix("#fff2b4",196+(i%3)*8,199-Math.floor(i/3)*7,5,6);
   text("PIPOCA",232,252,12,"#ffedc5");
 }
 function drawPark(t){
   drawWindow(18,42,444,122);
   // Trees and a park bench inside a panoramic glass conservatory
   for(let j=0;j<3;j++){
     const x=86+j*147;
     pix("#775e55",x,117,12,112);
     pix(["#88aa88","#a0ba98","#7faf9a"][j],x-28,66,70,55);
     pix("#c6d6a1",x-18,78,25,7);
     pix("#e5d6a1",x-39,225,102,7);
   }
   pix("#9c7a6a",181,203,113,13);pix("#715a5a",188,215,7,29);pix("#715a5a",276,215,7,29);
   pix("#d5af92",181,185,113,14);
   const spark=205+Math.sin(t*2)*5;text("✦",spark,167,19,"#ffdc92");
 }
 function drawCafe(t){
   drawWindow(37,55,104,71);
   pix("#735c66",153,142,277,14);
   pix("#9a7770",160,149,268,62);
   for(let i=0;i<5;i++){
     const x=170+i*48;
     pix("#eac9a3",x,157,29,25);
     pix("#c0877b",x+5,162,20,14);
   }
   pix("#445d67",163,210,264,11);
   pix("#9d7c6d",72,205,100,11);
   pix("#9d7c6d",84,215,7,31);pix("#9d7c6d",151,215,7,31);
   pix("#ead8bf",107,195,18,12);pix("#f3d1ae",125,191,15,13);
   for(let i=0;i<4;i++)pix("#fff3da",110+i*6+Math.sin(t+i)*2,185-i%2*7,2,4);
   text(room.type==="cafe"?"BONS ENCONTROS":"MENU DO DIA",291,122,18,"#fff0d1");
 }
 function drawMusic(t){
   pix("#5a516f",30,77,128,139);
   for(let i=0;i<4;i++){
     const col=["#dd978a","#91b6b1","#edc18b","#d3a0bc"][i];
     pix(col,47+i*26,100,20,89);
     pix("#fff3d3",50+i*26,106,15,8);
   }
   pix("#775969",292,99,135,110);
   pix("#e7bcab",310,111,101,14);
   c.fillStyle="#263f54";c.beginPath();c.arc(360,162,42,0,7);c.fill();
   c.fillStyle="#af7284";c.beginPath();c.arc(360,162,14,0,7);c.fill();
   pix("#f9dfb5",358,161,5,5);
   pix("#fff2c0",198,125,70,6);
   pix("#4f6273",234,135,4,91);
   text("♪",234,120,30,"#ffdf9d");text("♫",270,75+Math.sin(t*2)*5,25,"#f5dfbf");
 }
 function drawMotel(t){
   drawWindow(344,42,90,86);
   // Warm and affectionate, no explicit action.
   pix("#7a6478",36,152,269,67);
   pix("#f0c3aa",45,159,250,58);
   pix("#fff1d2",55,168,89,27);
   pix("#f4deb7",156,168,123,31);
   pix("#c99498",53,202,230,23);
   pix("#e8bb9a",330,174,42,7);
   pix("#6c5965",347,181,7,53);
   pix("#49546e",340,114,29,63);
   const shine=4+Math.sin(t*3)*3;
   pix("#ffe5ac",330-shine,107-shine,49+shine*2,45+shine*2);
   pix("#e9b8a4",341,106,27,41);
   pix("#bd7d7f",23,49,25,121);pix("#bd7d7f",426,49,25,121);
   pix("#f6d2bd",203,71,59,45);
   text("♡",233,105,31,"#b15b70");
 }
 function drawBook(){
   for(let s=0;s<3;s++){
     pix("#415a68",25+s*146,67,119,158);
     for(let i=0;i<6;i++){
       pix("#8b6b6c",32+s*146,83+i*22,106,5);
       for(let j=0;j<7;j++){
         const color=["#e4ab93","#93b6af","#edc99f","#bf93a5"][(i+j+s)%4];
         pix(color,36+s*146+j*14,68+i*22,10,18);
       }
     }
   }
   pix("#dba57e",187,197,95,25);
   pix("#f8e7c6",202,185,55,10);
   text("LIVRO",236,182,14,"#ffedcf");
 }
 function drawArcade(t){
   for(let i=0;i<4;i++){
     const x=24+i*112;
     pix("#3d3d65",x,80,92,157);
     pix(["#f5a7c4","#97bace","#ecc48d","#b8acda"][i],x+8,96,76,75);
     pix("#263b58",x+13,105,66,52);
     text(i===0?"♡":i===1?"★":i===2?"♫":"✳",x+46,144,35,["#e69cae","#f1d5a5","#89ccc7","#ffc397"][i]);
     pix("#f4cbad",x+15,179,62,11);
     pix("#73aab1",x+25,194,16,11);
     pix("#e7ac91",x+54,193,11,8);
     if(Math.floor(t*3+i)%2===0)pix("#ffdfb9",x+7,84,78,5);
   }
 }
 function drawRestaurant(t){
   drawCafe(t);
   pix("#6b6b71",280,115,97,19);
   pix("#e5c59f",285,135,87,12);
   pix("#f8dfbc",299,112,61,11);
   pix("#e9b28a",314,98,33,19);
   for(let i=0;i<4;i++)pix("#fef1d7",330+i*4+Math.sin(t+i)*3,84-i%2*9,3,6);
 }
 function drawPhoto(t){
   pix("#3e5566",25,74,129,130);
   for(let i=0;i<5;i++)pix("#f3d7b9",39+i*21,86+i%2*9,16,35);
   pix("#a4c6c0",194,70,183,137);
   pix("#f9c5aa",198,74,175,129);
   text("A + L",290,132,28,"#bd7a75");
   pix("#354b61",392,171,51,35);
   pix("#f1d29c",403,166,28,13);
   pix("#34475e",414,206,7,39);
   pix("#ffecd2",166,104,19,16);
   c.fillStyle="#ffdf9d55";c.beginPath();c.arc(175,107,22+Math.sin(t*2)*2,0,Math.PI*2);c.fill();
 }
 function drawRoom(t){
   if(!room||!c)return;
   clock=t;
   const pal=palettes[level];
   const tall=roomCanvas.height>350;
   if(tall){
     const H=roomCanvas.height;
     c.fillStyle=pal.wall;c.fillRect(0,0,480,H);
     pix(pal.wall2,0,Math.round(H*.63),480,H*.37);
     for(let i=0;i<20;i++){
       pix("#ffffff0b",i*28,68+(i%4)*31,13,5);
       pix("#34475912",(i*63)%480,170+i*23,36,3);
     }
     pix(pal.trim,0,94,480,5);
     pix("#ffedcb55",0,99,480,3);
     // Animated hanging lights, frames and decorations fill portrait screens naturally.
     for(let i=0;i<6;i++){
       const x=28+i*86,yy=145+Math.sin(t*1.4+i)*7;
       pix("#e8d8bb88",x,105,2,38);
       pix(pal.light,x-6,yy,16,16);
       pix("#fffbef",x-1,yy+4,5,5);
     }
     pix("#f4d5b4",28,202,105,67);
     pix(pal.trim,35,209,91,53);
     text("A + L",80,247,24,pal.light);
     pix("#e9c4a7",351,197,104,70);
     pix(pal.trim,358,204,90,56);
     text("♡",399,243,29,pal.light);
     for(let i=0;i<15;i++){
       pix("#e5c8ad30",i*35,Math.round(H*.68)+i%3*29,24,3);
     }
     c.save();c.translate(0,Math.round((H-300)*.46));
   }
   const gr=c.createLinearGradient(0,0,0,300);gr.addColorStop(0,pal.wall);gr.addColorStop(1,pal.wall2);
   c.fillStyle=gr;c.fillRect(0,0,480,300);
   for(let i=0;i<27;i++){
     const x=i*19;pix("#ffffff15",x,6+(i%5)*10,8,4);
   }
   pix(pal.trim,0,209,480,6);
   pix(pal.floor,0,215,480,85);
   for(let i=0;i<12;i++){
     pix("#ffffff1f",i*43,228,23,2);pix("#332f4224",i*43+20,267,24,2);
   }
   pix("#fff0d0",12,12,456,24);
   pix(pal.trim,12,34,456,3);
   text(room.name.toUpperCase().slice(0,36),240,30,17,pal.trim);
   for(let i=0;i<10;i++){
     const x=15+i*51;
     const y=47+Math.sin(t*.8+i)*5;
     pix(pal.light,x,y,3,3);
   }
   if(room.type==="home")drawHouse(t);
   else if(room.type==="market")drawMarket();
   else if(room.type==="cinema")drawCinema(t);
   else if(room.type==="park")drawPark(t);
   else if(room.type==="cafe")drawCafe(t);
   else if(room.type==="music")drawMusic(t);
   else if(room.type==="motel")drawMotel(t);
   else if(room.type==="book")drawBook();
   else if(room.type==="arcade")drawArcade(t);
   else if(room.type==="restaurant")drawRestaurant(t);
   else if(room.type==="photo")drawPhoto(t);
   else drawCafe(t);
   // Protagonists share the scene, not standing frozen.
   host.drawCharacter(c,244,259,"ander",t,true,.95);
   host.drawCharacter(c,277+Math.sin(t)*3,259,"lil",t+1,true,.95);
   pix("#f6d59c",0,287,480,2);
   for(let i=0;i<3;i++){
     const x=84+i*160,yy=62+Math.sin(t*2+i)*4;
     pix("#fff7cf",x,yy,4,5);
   }
   if(tall)c.restore();
 }
 function tick(dt){if(!room)return;drawRoom(clock+dt);if(activeGame&&gameTick)gameTick(dt)}
 let gameTick=null;

 function startGame(){
   if(!room)return;
   activeGame=true;
   miniCancel();miniCancel=()=>{};gameTick=null;
   $("#roomGameLayer").hidden=false;
   const body=$("#roomGameContent");body.innerHTML="";
   const status=$("#roomGameStatus");status.textContent="";
   const titles={
     market:"O carrinho de nós dois",home:"Três bigodes, um lar",
     cinema:"A melhor sessão",park:"Caça às estrelinhas",
     cafe:"Pedido de dois",music:"Nosso ritmo secreto",
     motel:"O clima perfeito",book:"A carta em pedacinhos",
     arcade:"Jogo das nossas coisas",restaurant:"A receita da saudade",
     photo:"Um clique na hora certa",party:"Chuva de abraços"
   };
   const helps={
     market:"Encontre os três produtos da lista. Cuidado com as distrações!",
     home:"Encontre um brinquedo para Cookie e para cada um dos dois gatinhos do Lil.",
     cinema:"Escolha as duas poltronas vizinhas do centro: 3 e 4.",
     park:"Apanhe cinco estrelinhas em movimento.",
     cafe:"Monte o pedido seguindo a ordem do bilhetinho.",
     music:"Reproduza a sequência de quatro notas: esquerda, meio, direita, meio.",
     motel:"Arrume o ambiente para uma noite de carinho: luz, música e abraço.",
     book:"Organize as quatro partes de uma declaração.",
     arcade:"Descubra as três duplas escondidas nas cartinhas.",
     restaurant:"Cozinhe juntos: massa, molho e queijo — nessa ordem.",
     photo:"Tire a foto quando o cursor atravessar o centro.",
     party:"Colete cinco estrelinhas nesta festa."
   };
   $("#roomGameTitle").textContent=titles[room.type]||"Uma brincadeira para dois";
   $("#roomGameInstructions").textContent=helps[room.type]||"Descubra a surpresa.";
   const say=message=>{status.textContent=message;host.tone(525,.13)};
   let completed=false;
   function success(){
     if(completed)return;completed=true;gameTick=null;
     const doneKey="pi-42-minijogos-v2";
     try{
       const set=new Set(JSON.parse(localStorage.getItem(doneKey)||"[]"));
       set.add(room.id);localStorage.setItem(doneKey,JSON.stringify([...set]));
     }catch(_){}
     markVisited();host.tone(880,.23);
     body.innerHTML="";
     const msg=document.createElement("div");msg.className="room-success";msg.textContent="✦ LEMBRANÇA DESBLOQUEADA!";
     const caption=document.createElement("p");caption.textContent=room.story;
     body.append(msg,caption,$button("CONTINUAR EXPLORANDO ↗",()=>{
       $("#roomGameLayer").hidden=true;activeGame=false;
     },"room-finish"));
     status.textContent="Guardado no nosso caderno ♡";
   }
   const steps=(labels,order)=>{
     let n=0;
     const progress=document.createElement("div");progress.className="room-miniprogress";
     progress.textContent="0 / "+order.length;body.appendChild(progress);
     const grid=document.createElement("div");grid.className="room-choice-grid";
     labels.forEach((label,index)=>{
       grid.appendChild($button(label,()=>{
         if(completed)return;
         if(index===order[n]){
           n++;progress.textContent=n+" / "+order.length;say("Isso! Mais um pedacinho...");
           if(n===order.length)success();
         }else{n=0;progress.textContent="0 / "+order.length;say("Ops, a ordem se embaralhou. Tenta outra vez!")}
       }));
     });
     body.appendChild(grid);
   };
   if(room.type==="market"){
     const target=["Macarrão","Molho branco","Suco"];
     const items=["Açaí","Macarrão","Biscoito","Suco","Chocolate","Molho branco","Pipoca","Flores"];
     const found=new Set();
     const progress=document.createElement("p");progress.className="room-miniprogress";progress.textContent="Lista: "+target.join(" · ");
     const grid=document.createElement("div");grid.className="room-choice-grid";
     for(const item of items){
       const b=$button("◻ "+item,()=>{
         if(completed)return;
         if(target.includes(item)&&!found.has(item)){
           found.add(item);b.disabled=true;b.textContent="✓ "+item;say(found.size+"/3 produtos certos");
           if(found.size===3)success();
         }else if(!target.includes(item))say("Esse pode ficar para outra compra!");
       });
       grid.appendChild(b);
     }
     body.append(progress,grid);
   }else if(room.type==="home"){
     let count=0;
     const chosen=new Set();
     const info=document.createElement("div");info.className="room-miniprogress";info.textContent="Gatinhos felizes: 0 / 3";
     body.appendChild(info);
     const grid=document.createElement("div");grid.className="room-choice-grid";
     const cats=["Cookie — bolinha amarela","Gatinho do Lil 1 — ratinho de pano","Gatinho do Lil 2 — varinha de brincar"];
     cats.forEach((cat,i)=>{
       grid.appendChild($button("🐾 "+cat,()=>{
         if(chosen.has(i))return;chosen.add(i);count++;info.textContent="Gatinhos felizes: "+count+" / 3";
         host.tone(660+i*90,.18);
         if(count===3)success();
       }));
     });
     body.appendChild(grid);
   }else if(room.type==="cinema"){
     const picked=new Set();const info=document.createElement("p");info.className="room-miniprogress";info.textContent="Escolha as poltronas 3 e 4";
     const grid=document.createElement("div");grid.className="room-seat-grid";
     for(let i=1;i<=8;i++){
       const b=$button("▣ "+i,()=>{
         if(completed)return;
         if(i===3||i===4){picked.add(i);b.classList.add("picked");say("Uma poltrona reservada ♡");if(picked.size===2)success();}
         else say("Essa está muito longe da tela... e do abraço!");
       },"room-seat");
       grid.appendChild(b);
     }
     body.append(info,grid);
   }else if(room.type==="park"||room.type==="party"){
     let stars=0;const info=document.createElement("p");info.className="room-miniprogress";info.textContent="Estrelinhas: 0 / 5";
     const grid=document.createElement("div");grid.className="room-stars-grid";
     for(let i=0;i<6;i++){
       const b=$button(i%2===0?"✦":"★",()=>{
         if(completed)return;stars++;info.textContent="Estrelinhas: "+Math.min(5,stars)+" / 5";
         b.style.transform="translateY(-8px) rotate(30deg)";
         host.tone(410+stars*87,.13);
         if(stars>=5)success();
       },"room-star-button");
       b.style.animationDelay=(-i*.4)+"s";grid.appendChild(b);
     }
     body.append(info,grid);
   }else if(room.type==="cafe"){
     steps(["🍧 Açaí","🥤 Bebida","♡ Companhia","☕ Café"],[0,1,2]);
   }else if(room.type==="music"){
     const labs=["◀ NOTA","◆ NOTA","▶ NOTA"];steps(labs,[0,1,2,1]);
   }else if(room.type==="motel"){
     steps(["◐ Luz baixinha","♫ Música suave","♡ Abraço demorado"],[0,1,2]);
   }else if(room.type==="book"){
     steps(["EU","TE","ESCOLHO","SEMPRE"],[0,1,2,3]);
   }else if(room.type==="restaurant"){
     steps(["🍝 Massa","◈ Molho branco","✦ Queijo"],[0,1,2]);
   }else if(room.type==="arcade"){
     let opened=[],matches=0,lock=false;
     const order=[0,1,2,1,2,0];const glyph=["♡","✦","♫"];
     const grid=document.createElement("div");grid.className="room-card-grid";
     order.forEach((value,i)=>{
       const b=$button("?",()=>{
         if(lock||b.classList.contains("matched")||opened.some(x=>x.index===i))return;
         b.textContent=glyph[value];opened.push({index:i,value,button:b});
         if(opened.length===2){
           if(opened[0].value===opened[1].value){
             opened.forEach(x=>x.button.classList.add("matched"));matches++;
             opened=[];say("Dupla encontrada! "+matches+"/3");if(matches===3)success();
           }else{
             lock=true;const a=opened.slice();
             const timer=setTimeout(()=>{a.forEach(x=>x.button.textContent="?");opened=[];lock=false},680);
             miniCancel=()=>clearTimeout(timer);
           }
         }
       },"room-memory-card");
       grid.appendChild(b);
     });
     body.appendChild(grid);
   }else if(room.type==="photo"){
     let cursor=0,dir=1;
     const track=document.createElement("div");track.className="room-shutter-track";
     const target=document.createElement("span");target.className="room-shutter-target";
     const indicator=document.createElement("span");indicator.className="room-shutter-cursor";
     track.append(target,indicator);
     const button=$button("▣ FOTOGRAFAR AGORA!",()=>{
       if(cursor>.41&&cursor<.59)success();
       else say("Quase! O momento perfeito ainda vai chegar.");
     },"room-finish");
     body.append(track,button);
     gameTick=dt=>{
       cursor+=dir*dt*.6;
       if(cursor>=1){cursor=1;dir=-1}
       if(cursor<=0){cursor=0;dir=1}
       indicator.style.left="calc("+(cursor*100)+"% - 8px)";
     };
   }else{
     body.appendChild($button("GUARDAR A LEMBRANÇA ♡",success));
   }
 }
 function currentRoom(){return room}
 return {install,open,close,getRoom,renderDoors,streetCats,tick,currentRoom,saved,
   getVisits:()=>visited.size};
})();
