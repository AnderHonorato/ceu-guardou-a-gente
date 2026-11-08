"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const canvas = $("#world"), ctx = canvas.getContext("2d",{alpha:false});
  const interiores = window.InfinitosLocais;
  const endCanvas = $("#endingCanvas"), endCtx = endCanvas.getContext("2d");
  const chapterData = [
    {
      month:"JUN", date:"08.06.2026", name:"O começo de tudo", place:"Rua dos Possíveis", mood:"city",
      sky:["#69b5bb","#f8d29f"], skyline:"#729ea0", skyline2:"#456f7c", soil:"#d7a67f", dark:"#314b60", highlight:"#f6d2a0",
      intro:[["ander","Se a nossa história fosse uma cidade... onde ela começaria?"],["lil","Num lugar qualquer. Desde que você estivesse por perto."]],
      objects:[
        {x:315,title:"Um bilhete diferente",label:"O bilhete",icon:"ticket",type:"choice",help:"Qual mensagem você deixaria para alguém especial?",options:["Oi, você. Acho que gostei de te encontrar.","Volto daqui a pouco.","Que horas passa o ônibus?"],reply:["ander","Acho que a melhor parte foi te encontrar, Lil."]},
        {x:735,title:"Dois copos, uma mesa",label:"O café",icon:"coffee",type:"find",help:"Parece que cabem duas pessoas nessa mesa.",button:"PEGAR ESTE INSTANTE",reply:["lil","Gosto de quando até os momentos simples ficam bons com você."]}
      ],
      end:"Não foi a cidade que mudou. Foi a maneira de enxergá-la quando o outro chegou.",symbol:"✳"
    },
    {
      month:"JUL", date:"08.07.2026", name:"Chuva de julho", place:"Avenida das Poças", mood:"rain",
      sky:["#425d84","#719bac"],skyline:"#5d7798",skyline2:"#354b68",soil:"#667a85",dark:"#263d55",highlight:"#a8ccd2",
      intro:[["lil","Hum... parece que vai chover."],["ander","Então a gente inventa um jeito de continuar."]],
      objects:[
        {x:320,title:"Um guarda-chuva para dois",label:"O guarda-chuva",icon:"umbrella",type:"hold",help:"Segure o botão por um instante. Tem coisa que merece cuidado.",reply:["ander","Pronto. Agora tem espaço para nós dois."]},
        {x:748,title:"O reflexo na poça",label:"A poça",icon:"puddle",type:"find",help:"Às vezes a vista mais bonita está no chão, depois da chuva.",button:"GUARDAR O REFLEXO",reply:["lil","Até a chuva ficou mais legal. E olha que eu nem estava esperando."]}
      ],
      end:"Um mês. Chuva ou sol, o melhor lugar ainda era do mesmo lado.",symbol:"☂"
    },
    {
      month:"AGO", date:"08.08.2026", name:"Nosso próprio ritmo", place:"Rua do Fliperama", mood:"arcade",
      sky:["#5b456d","#c0727b"],skyline:"#7e5376",skyline2:"#503a67",soil:"#755a79",dark:"#332c52",highlight:"#f2b38e",
      intro:[["ander","Um jogo dentro do nosso jogo? Isso já está ficando interessante."],["lil","Só não vale roubar! Vamos ver se você acerta o ritmo."]],
      objects:[
        {x:325,title:"Um ritmo só nosso",label:"O fliperama",icon:"arcade",type:"rhythm",help:"Repita a sequência de quatro notas: esquerda, meio, direita, meio.",reply:["lil","Aê! Até a música ficou do nosso lado."]},
        {x:735,title:"A fita do nosso dia",label:"A fita",icon:"record",type:"find",help:"Toda aventura merece uma trilha sonora.",button:"GUARDAR A FITA",reply:["ander","Tem música que me faz sorrir só de lembrar de você."]}
      ],
      end:"Dois meses e uma trilha que só a gente sabe reconhecer.",symbol:"♫"
    },
    {
      month:"SET", date:"08.09.2026", name:"Café com conversa", place:"Viela do Café", mood:"cafe",
      sky:["#f4bb9d","#f5dfad"],skyline:"#d7987e",skyline2:"#a86f67",soil:"#d5a47d",dark:"#715365",highlight:"#ffe4b5",
      intro:[["lil","Qual é a receita de um dia bom?"],["ander","Eu começaria com você. E depois... acho que precisamos testar."]],
      objects:[
        {x:330,title:"A receita impossível",label:"O balcão",icon:"coffee",type:"recipe",help:"Monte a receita do dia nesta ordem: coragem, risada, abraço.",reply:["ander","É. Acho que essa receita a gente pode repetir sempre."]},
        {x:735,title:"O guardanapo rabiscado",label:"O recadinho",icon:"note",type:"find",help:"Um desenho bobo pode guardar um momento inteiro.",button:"GUARDAR O RECADO",reply:["lil","Adoro essas coisas pequenas que só a gente entende."]}
      ],
      end:"Três meses e uma receita sem segredo: continuar escolhendo conversar.",symbol:"☕"
    },
    {
      month:"OUT", date:"08.10.2026", name:"Uma foto que respira", place:"Rua do Retrato", mood:"autumn",
      sky:["#72a9a4","#d6c99b"],skyline:"#8daba3",skyline2:"#5b8887",soil:"#be9677",dark:"#3a5a60",highlight:"#f5d6a7",
      intro:[["ander","A gente consegue guardar um dia inteiro numa foto?"],["lil","Não sei. Mas a gente pode tentar guardar o que ele fez a gente sentir."]],
      objects:[
        {x:340,title:"O clique perfeito",label:"A câmera",icon:"camera",type:"shutter",help:"Toque em fotografar quando a barrinha estiver no quadrinho central.",reply:["lil","Ficou linda! A gente nem precisa posar tanto assim."]},
        {x:745,title:"O envelope da foto",label:"A fotografia",icon:"photo",type:"find",help:"Fotografia revelada. Um pedacinho do tempo que não vai embora.",button:"COLOCAR NO ÁLBUM",reply:["ander","Pronto. Uma lembrança que vai comigo."]}
      ],
      end:"Quatro meses. A melhor fotografia é aquela que ainda estamos vivendo.",symbol:"▣"
    },
    {
      month:"NOV", date:"08.11.2026", name:"Hoje, nós dois", place:"Festival dos Instantes", mood:"festival",
      sky:["#ef9b91","#f9d9a7"],skyline:"#bc8297",skyline2:"#785877",soil:"#ad7b78",dark:"#553b65",highlight:"#ffe3ac",
      intro:[["lil","Olha só... chegamos até aqui."],["ander","Cinco meses. E ainda tem tanto lugar pra gente inventar juntos."]],
      objects:[
        {x:345,title:"Um convite para amanhã",label:"O convite",icon:"ticket",type:"find",help:"Não tem data nem endereço. Só um lugar reservado para nós dois.",button:"ACEITAR O CONVITE",reply:["ander","O melhor plano que eu tenho é continuar fazendo planos com você."]},
        {x:745,title:"Um desejo bem pequeno",label:"O desejo",icon:"gift",type:"choice",help:"Se você pudesse guardar uma coisa desta aventura...",options:["Os momentos em que rimos juntos.","As coisas novas que ainda viveremos.","Um abraço que durasse mais um pouquinho."],reply:["lil","Ainda bem que a gente não precisa escolher só uma coisa."]}
      ],
      end:"Cinco meses de namoro. O fim desta pequena viagem é só mais um começo.",symbol:"✦"
    }
  ];
  const WORLD_WIDTH=1220;
  const state={
    level:0,x:92,partnerX:44,direction:1,phase:"opening",solved:new Set(),camera:0,
    width:480,height:300,ground:220,time:0,keys:{left:false,right:false},
    autoTo:null,pendingDoor:null,pendingDialog:[],dialogueIndex:0,dialogueEnd:null,challengeObject:null,
    holdValue:0,holdActive:false,beatStep:0,shutter:0,shutterDir:1,
    audio:false,audioCtx:null,started:false,particles:[],noise:0,freeze:false
  };
  window.__gameStatus=()=>({level:state.level,phase:state.phase,x:Math.round(state.x),solved:[...state.solved]});
  const rand=(i=1)=>{let n=Math.sin(i*127.1+48.2)*43758.5453;return n-Math.floor(n)};
  const clamp=(n,a,b)=>Math.max(a,Math.min(n,b));
  const g=()=>chapterData[state.level];
  function tone(freq=540,len=.16){
    if(!state.audio)return;
    try{
      state.audioCtx ||=new (window.AudioContext||window.webkitAudioContext)();
      const ac=state.audioCtx,o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;
      o.type="triangle";o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.79,t+len);
      v.gain.setValueAtTime(.0001,t);v.gain.exponentialRampToValueAtTime(.052,t+.012);v.gain.exponentialRampToValueAtTime(.0001,t+len);
      o.connect(v).connect(ac.destination);o.start(t);o.stop(t+len+.01);
    }catch(_){}
  }
  function fanfare(){[520,650,780,1040].forEach((f,i)=>setTimeout(()=>tone(f,.2),i*140))}
  const setPhase=(s)=>{state.phase=s};
  function hide(id){$(id).hidden=true;$(id).classList.remove("active")}
  function show(id){$(id).hidden=false;$(id).classList.add("active")}
  function notify(message){
    const t=$("#toast");t.textContent=message;t.classList.add("show");
    clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>t.classList.remove("show"),2600);
  }
  function updateHUD(){
    const ch=g();
    $("#chapterLabel").textContent="CAP. "+String(state.level+1).padStart(2,"0")+" · "+ch.date;
    $("#chapterName").textContent=ch.name;
    $("#monthChip").textContent=ch.month+" 2026";
    $("#stampTrack").innerHTML=chapterData.slice(0,5).map((_,i)=>'<span class="stamp '+(i<state.level?"filled":"")+'"></span>').join("");
    const done=state.solved.size;
    $("#objectiveText").textContent=done===2?"Siga até a placa da saída →":"Descubra "+(2-done)+" lembrança"+(2-done===1?"":"s")+" nesta rua";
    $("#objectiveMini").textContent=ch.place.toUpperCase();
  }
  function dialogue(lines,onFinish){
    state.pendingDialog=lines.slice();state.dialogueIndex=0;state.dialogueEnd=onFinish||null;
    setPhase("dialogue");$("#dialogue").hidden=false;displayDialogue();
  }
  function displayDialogue(){
    const entry=state.pendingDialog[state.dialogueIndex];
    if(!entry)return;
    $("#dialogueSpeaker").textContent=entry[0]==="lil"?"LIL":"ANDER";
    $("#dialogueText").textContent=entry[1];
    drawPortrait($("#dialogueFace"),entry[0]);
    tone(entry[0]==="lil"?620:480,.09);
  }
  function nextDialogue(){
    if(state.phase!=="dialogue")return;
    state.dialogueIndex++;
    if(state.dialogueIndex<state.pendingDialog.length){displayDialogue();return}
    $("#dialogue").hidden=true;
    const callback=state.dialogueEnd;state.dialogueEnd=null;
    setPhase("playing");if(callback)callback();
  }
  $("#dialogueNext").addEventListener("click",nextDialogue);
  function setLevel(index){
    if(index>=chapterData.length){startEnding();return}
    state.level=index;state.x=92;state.partnerX=42;state.direction=1;
    state.solved=new Set();state.autoTo=null;state.pendingDoor=null;state.camera=0;
    updateHUD();setPhase("playing");
    window.setTimeout(()=>dialogue(g().intro),360);
  }
  function availableTarget(){
    const objects=g().objects.filter((_,i)=>!state.solved.has(i));
    const exits=state.solved.size===2?[{x:1128,title:"Próximo capítulo",exit:true}]:[];
    return [...objects,...exits].reduce((best,obj)=>{
      const dist=Math.abs(obj.x-state.x);
      return dist<65 && (!best||dist<best.dist)?{obj,dist}:best;
    },null);
  }
  function interact(){
    if(state.phase==="dialogue"){nextDialogue();return}
    if(state.phase!=="playing")return;
    const target=availableTarget();
    const nearestDoor=Array.from({length:7},(_,i)=>({i,d:Math.abs(state.x-(40+i*185+62))})).sort((a,b)=>a.d-b.d)[0];
    if(nearestDoor.d<35&&(!target||target.dist>40)){interiores.open(nearestDoor.i);return}
    if(!target){notify("Toque em uma fachada ou use PORTAS para entrar nos locais ✦");return}
    if(target.obj.exit){finishChapter();return}
    openChallenge(target.obj);
  }
  $("#actionButton").addEventListener("click",interact);
  $("#startButton").addEventListener("click",()=>{
    hide("#opening");$("#hud").hidden=false;$("#controls").hidden=false;$("#objective").hidden=false;
    state.started=true;setLevel(0);tone(650,.3);canvas.focus({preventScroll:true});
  });
  function completeObject(obj){
    if(state.solved.has(g().objects.indexOf(obj)))return;
    const index=g().objects.indexOf(obj);
    state.solved.add(index);
    hide("#challenge");state.challengeObject=null;state.holdActive=false;state.holdValue=0;
    updateHUD();fanfare();burst(obj.x,18);
    dialogue([obj.reply],()=>{if(state.solved.size===2)notify("A saída está à direita →")});
  }
  function openChallenge(obj){
    setPhase("challenge");state.challengeObject=obj;show("#challenge");
    $("#challengeDate").textContent=g().date.slice(0,5);
    $("#challengeTitle").textContent=obj.title;$("#challengeIntro").textContent=obj.help;
    const body=$("#challengeBody");body.innerHTML="";
    function button(label,fn,cls="option-button"){
      const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=label;b.addEventListener("click",fn);return b;
    }
    function feedback(content){let el=body.querySelector(".challenge-feedback");if(!el){el=document.createElement("div");el.className="challenge-feedback";el.setAttribute("role","status");body.appendChild(el)}el.textContent=content}
    if(obj.type==="find"){
      body.appendChild(button("✦ "+obj.button,()=>completeObject(obj)));
    }else if(obj.type==="choice"){
      const list=document.createElement("div");list.className="option-list";
      obj.options.forEach((opt,i)=>list.appendChild(button("0"+(i+1)+"  "+opt,()=>completeObject(obj))));
      body.appendChild(list);
    }else if(obj.type==="hold"){
      const track=document.createElement("div");track.className="hold-track";
      const fill=document.createElement("div");fill.className="hold-fill";track.appendChild(fill);
      const hold=button("SEGURE PARA ABRIR ☂",()=>{},"hold-button");
      body.appendChild(hold);body.appendChild(track);
      feedback("Segure até completar.");
      state.holdValue=0;
      const stop=()=>{state.holdActive=false;hold.textContent="SEGURE PARA ABRIR ☂"};
      hold.addEventListener("pointerdown",e=>{e.preventDefault();hold.setPointerCapture(e.pointerId);state.holdActive=true;hold.textContent="PROTEGENDO A GENTE…"});
      hold.addEventListener("pointerup",stop);hold.addEventListener("pointercancel",stop);
      hold.addEventListener("keydown",e=>{if(e.key===" "||e.key==="Enter"){state.holdActive=true;e.preventDefault()}});
      hold.addEventListener("keyup",stop);
      state.holdTick=dt=>{
        state.holdValue=clamp(state.holdValue+(state.holdActive?dt*.82:-dt*.35),0,1);
        fill.style.width=(100*state.holdValue).toFixed(1)+"%";
        if(state.holdValue>=1){state.holdTick=null;completeObject(obj)}
      };
    }else if(obj.type==="rhythm"||obj.type==="recipe"){
      state.beatStep=0;
      const recipe=obj.type==="recipe";
      const sequence=recipe?[0,1,2]:[0,1,2,1];
      const notes=recipe?["✦ Coragem","☻ Risada","♡ Abraço"]:["◀","◆","▶"];
      const info=document.createElement("div");info.className="pattern-view";info.textContent="PASSOS: 0 / "+sequence.length;
      const area=document.createElement("div");area.className="rhythm-pad";
      const explain=document.createElement("div");explain.className="challenge-feedback";explain.textContent=recipe?"Misture os ingredientes na ordem indicada.":"Toque esquerda, meio, direita, meio.";
      notes.forEach((label,i)=>area.appendChild(button(label,()=>{
        if(i===sequence[state.beatStep]){
          state.beatStep++;tone(430+state.beatStep*120,.11);
          info.textContent="PASSOS: "+state.beatStep+" / "+sequence.length;
          explain.textContent=recipe?"Misturando...":"Boa! Continue o ritmo.";
          if(state.beatStep===sequence.length){state.beatStep=0;completeObject(obj)}
        }else{
          state.beatStep=0;info.textContent="PASSOS: 0 / "+sequence.length;
          explain.textContent="Ops! Tenta de novo do início.";tone(190,.16);
        }
      },"beat-button")));
      body.appendChild(info);body.appendChild(area);body.appendChild(explain);
    }else if(obj.type==="shutter"){
      state.shutter=0;state.shutterDir=1;
      const rail=document.createElement("div");rail.className="shutter-zone";
      rail.innerHTML='<span class="shutter-target"></span><span class="shutter-mark" id="shutterMark"></span>';
      const snap=button("▣ FOTOGRAFAR!",()=>{
        if(state.shutter>.43&&state.shutter<.56){state.shutterTick=null;completeObject(obj)}
        else{feedback("Quase! Tenta enquadrar no centro.");tone(210,.15)}
      },"shutter-button");
      body.appendChild(rail);body.appendChild(snap);
      const help=document.createElement("div");help.className="shutter-help";help.textContent="O segredo é pegar o instante certo.";body.appendChild(help);
      state.shutterTick=dt=>{
        state.shutter+=state.shutterDir*dt*.64;
        if(state.shutter>=1){state.shutter=1;state.shutterDir=-1}
        if(state.shutter<=0){state.shutter=0;state.shutterDir=1}
        const mark=$("#shutterMark");if(mark)mark.style.left="calc("+(state.shutter*100)+"% - 6px)";
      };
    }
  }
  $("#challengeClose").addEventListener("click",()=>{hide("#challenge");state.challengeObject=null;state.holdTick=null;state.shutterTick=null;state.holdActive=false;setPhase("playing")});
  function finishChapter(){
    state.autoTo=null;setPhase("chapter");show("#chapterCard");fanfare();
    $("#cardSymbol").textContent=g().symbol;
    $("#cardTitle").textContent=state.level===5?"Chegamos até aqui.":g().name;
    $("#cardText").textContent=g().end;
    $("#cardContinue").querySelector("span").textContent="→";
    $("#cardContinue").firstChild.textContent=state.level===5?"ABRIR O FINAL ":"SEGUIR NOSSA HISTÓRIA ";
  }
  $("#cardContinue").addEventListener("click",()=>{hide("#chapterCard");setLevel(state.level+1)});
  function startEnding(){
    setPhase("ending");$("#controls").hidden=true;$("#interactionHint").hidden=true;
    show("#ending");fanfare();drawEnding(0);
  }
  $("#restartButton").addEventListener("click",()=>{
    hide("#ending");$("#controls").hidden=false;state.particles=[];setLevel(0);
  });
  $("#shareButton").addEventListener("click",async()=>{
    const data={title:"Pequenos Infinitos — Ander & Lil",text:"Meu amor, fiz um joguinho de verdade pra você. Joga até o final 💛",url:location.href};
    if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==="AbortError")return}}
    try{await navigator.clipboard.writeText(location.href);notify("Link copiado para enviar ao Lil ♡")}
    catch(e){notify("Copie o endereço da página para compartilhar")}
  });
  $("#soundToggle").addEventListener("click",()=>{
    state.audio=!state.audio;$("#soundToggle").classList.toggle("on",state.audio);
    $("#soundToggle").setAttribute("aria-label",state.audio?"Desativar efeitos sonoros":"Ativar efeitos sonoros");
    tone(600,.18);
  });
  const release=()=>{state.keys.left=false;state.keys.right=false};
  function walkToDoor(i){release();state.pendingDoor=i;state.autoTo=clamp(40+i*185+62,35,WORLD_WIDTH-34)}
  function bindMove(id,direction){
    const b=$(id);const key=direction<0?"left":"right";
    b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture(e.pointerId);state.keys[key]=true;state.autoTo=null;b.classList.add("active")});
    for(const ev of ["pointerup","pointercancel","lostpointercapture"])b.addEventListener(ev,()=>{state.keys[key]=false;b.classList.remove("active")});
  }
  bindMove("#moveLeft",-1);bindMove("#moveRight",1);
  window.addEventListener("blur",release);
  document.addEventListener("keydown",e=>{
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","Enter"].includes(e.key))e.preventDefault();
    if(state.phase==="dialogue"&&["Enter"," ","e","E"].includes(e.key)){nextDialogue();return}
    if(state.phase==="playing"){
      if(["ArrowLeft","a","A"].includes(e.key)){state.keys.left=true;state.autoTo=null}
      if(["ArrowRight","d","D"].includes(e.key)){state.keys.right=true;state.autoTo=null}
      if([" ","Enter","e","E","ArrowUp"].includes(e.key)&&!e.repeat){interact()}
    }
  });
  document.addEventListener("keyup",e=>{
    if(["ArrowLeft","a","A"].includes(e.key))state.keys.left=false;
    if(["ArrowRight","d","D"].includes(e.key))state.keys.right=false;
  });
  canvas.addEventListener("pointerdown",e=>{
    if(state.phase!=="playing")return;
    const r=canvas.getBoundingClientRect();const sx=(e.clientX-r.left)/r.width*state.width;
    const targetX=clamp(state.camera+sx,40,WORLD_WIDTH-55);
    const near=g().objects.find(o=>!state.solved.has(g().objects.indexOf(o))&&Math.abs(o.x-targetX)<42);
    const exit=state.solved.size===2&&Math.abs(1128-targetX)<48;
    const sy=(e.clientY-r.top)/r.height*state.height;
    const shop=Array.from({length:7},(_,i)=>({i,x:40+i*185})).find(o=>targetX>=o.x-4&&targetX<=o.x+129);
    if(shop&&sy>state.ground-225&&sy<state.ground-68){walkToDoor(shop.i);return}
    state.pendingDoor=null;
    state.autoTo=near?near.x:exit?1128:targetX;
  });
  function updateInput(dt){
    if(state.phase!=="playing")return;
    let dir=Number(state.keys.right)-Number(state.keys.left);
    if(!dir&&state.autoTo!==null){
      const delta=state.autoTo-state.x;
      if(Math.abs(delta)<7){
        state.x=state.autoTo;state.autoTo=null;
        if(state.pendingDoor!==null){const door=state.pendingDoor;state.pendingDoor=null;interiores.open(door);return}
        if(availableTarget())interact();
      }else dir=delta>0?1:-1;
    }
    if(dir){
      state.direction=dir;state.x=clamp(state.x+dir*175*dt,35,WORLD_WIDTH-34);
    }
    const behind=state.x-state.direction*50;
    state.partnerX+=(clamp(behind,25,WORLD_WIDTH-25)-state.partnerX)*Math.min(1,dt*4.2);
    const cameraTarget=clamp(state.x-state.width*.35,0,WORLD_WIDTH-state.width);
    state.camera+=(cameraTarget-state.camera)*Math.min(1,dt*7);
    const target=availableTarget();
    $("#interactionHint").hidden=!target;
    if(target)$("#hintText").textContent=target.obj.exit?"Ir para o próximo capítulo":"Interagir: "+target.obj.label;
    state.walking=!!dir;
  }
  function burst(x,n){
    for(let i=0;i<n;i++)state.particles.push({x:x+(rand(i*7+state.time)*36-18),y:state.ground-45,dx:(rand(i+12)-.5)*80,dy:-30-rand(i+50)*70,life:1,size:2+rand(i+70)*3,color:i%3===0?"#ffe7b3":"#ffb19c"});
  }
  function resize(){
    const r=canvas.getBoundingClientRect();
    state.height=r.height>r.width?520:350;
    state.width=Math.round(state.height*r.width/r.height);
    state.width=clamp(state.width,210,1200);
    canvas.width=state.width;canvas.height=state.height;
    state.ground=state.height-(state.height>400?145:104);
    ctx.imageSmoothingEnabled=false;
  }
  window.addEventListener("resize",resize);
  resize();

  const paint=(c,color,x,y,w,h)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h))};
  function pixelLine(c,color,x1,y1,x2,y2,width=1){
    c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();
  }
  function drawCharacter(c,x,y,who,time=0,walking=false,scale=1,direction=1,expression="happy"){
    c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
    const step=walking?Math.sin(time*12)*5:0;
    const bob=walking?Math.abs(Math.sin(time*12))*1.7:Math.sin(time*2.4)*.55;
    c.fillStyle="#263c4761";c.beginPath();c.ellipse(0,1,15,3,0,0,Math.PI*2);c.fill();
    c.translate(0,-bob);
    // Animated shoes and legs
    paint(c,"#1c2b37",-11+step*.3,-16,9,14);
    paint(c,"#243346",2-step*.3,-16,9,14);
    paint(c,"#171e30",-12+step,-4,11,5);
    paint(c,"#1d2736",1-step,-4,11,5);
    const ander=who==="ander",skin=ander?"#c88c6c":"#efbb98",shirt=ander?"#e7c58d":"#a5c9bd",shadow=ander?"#a36655":"#c78b75";
    // Sleeves swing with the walking stride
    paint(c,shadow,-16,-35+step*.3,6,18);
    paint(c,skin,-16,-25+step*.3,6,9);
    paint(c,shadow,10,-35-step*.3,6,18);
    paint(c,skin,10,-25-step*.3,6,9);
    paint(c,shirt,-12,-40,24,28);
    paint(c,ander?"#c69c76":"#7ea99e",-12,-18,24,6);
    paint(c,"#f7e1b9",-4,-40,8,7);
    // Collar and neck
    paint(c,skin,-5,-46,10,9);
    paint(c,shadow,-13,-66,26,24);
    paint(c,skin,-12,-68,24,28);
    paint(c,skin,-15,-57,5,8);
    paint(c,skin,10,-57,5,8);
    paint(c,ander?"#b47b61":"#dba584",-12,-42,24,4);
    // Male hairstyles: black cap + black beard; blond short quiff + short sides
    if(ander){
      paint(c,"#202631",-13,-70,26,10);
      paint(c,"#151e2c",-17,-68,32,6);
      paint(c,"#2c3241",-10,-73,21,4);
      paint(c,"#312933",-11,-48,22,9);
      paint(c,skin,-7,-48,14,5);
      paint(c,"#302831",-5,-43,10,3);
    }else{
      paint(c,"#c59a60",-13,-69,26,8);
      paint(c,"#f4d18d",-13,-75,24,10);
      paint(c,"#ffe4a6",-7,-79,18,8);
      paint(c,"#f6d69c",6,-74,10,12);
      paint(c,"#d5b079",-13,-65,3,13);
    }
    // Expressive eyes, raised eyebrows, and smile
    paint(c,"#554344",-7,-56,4,3);
    paint(c,"#554344",4,-56,4,3);
    if(expression==="surprised"){
      paint(c,"#f5d9c8",-2,-50,4,5);
    }else{
      paint(c,ander?"#e6be9e":"#a65b59",-4,-49,8,2);
      paint(c,ander?"#a76757":"#ef9a8f",-11,-50,3,2);
      paint(c,ander?"#a76757":"#ef9a8f",8,-50,3,2);
    }
    c.restore();
  }
  function drawPortrait(el,who){
    const c=el.getContext("2d"),w=el.width,h=el.height;
    c.imageSmoothingEnabled=false;
    const g=c.createLinearGradient(0,0,w,h);
    if(who==="lil"){g.addColorStop(0,"#c3d8bb");g.addColorStop(1,"#f8c2a2")}
    else{g.addColorStop(0,"#f3b79b");g.addColorStop(1,"#c5a4ae")}
    c.fillStyle=g;c.fillRect(0,0,w,h);
    // Portrait background texture
    for(let i=0;i<12;i++)paint(c,"#ffffff20",rand(i*16)*w,rand(i*19)*h,5,4);
    drawCharacter(c,w/2,h+25,who,0,false,2.05,1);
    paint(c,"#f6dfbb",0,h-4,w,4);
  }
  $$("[data-face]").forEach(el=>drawPortrait(el,el.dataset.face));
  function sun(c,x,y,r,color){
    c.fillStyle=color;
    c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();
    for(let i=0;i<5;i++)paint(c,"#ffffff25",x-r*.7,y-r*.5+i*8,r*1.4,2);
  }
  function cloud(x,y,width,t,alpha=.5){
    ctx.save();ctx.globalAlpha=alpha;
    paint(ctx,"#fff5e7",x,y,width,10);
    paint(ctx,"#fff5e7",x+width*.15,y-6,width*.55,9);
    paint(ctx,"#fff5e7",x+width*.41,y-12,width*.28,9);
    paint(ctx,"#fff5e7",x+width*.7,y+2,width*.3,6);
    ctx.restore();
  }
  function drawSky(){
    const c=g(),w=state.width,h=state.height;
    const grad=ctx.createLinearGradient(0,0,0,h);
    grad.addColorStop(0,c.sky[0]);grad.addColorStop(1,c.sky[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    const pulse=Math.sin(state.time*.7);
    const orbX=w*.75-state.camera*.06,orbY=h*.17;
    if(c.mood==="rain"){
      sun(ctx,orbX,orbY,33,"#dce0d67c");
    }else if(c.mood==="arcade"){
      sun(ctx,orbX,orbY,29,"#f8b7a2b0");
    }else{
      sun(ctx,orbX,orbY,36+pulse*.4,"#ffefd0b8");
    }
    for(let i=0;i<7;i++){
      const x=(i*151+rand(i+8)*70-state.camera*.12+state.time*(i%2?2:5))%(w+240)-110;
      cloud(x,24+i%3*32,43+i%3*20,state.time,.19+(i%2)*.14);
    }
  }
  function windowBlock(x,y,lit=false){
    paint(ctx,lit?"#f5d293":"#355267",x,y,8,11);
    paint(ctx,lit?"#f6d5a060":"#8ca4ac44",x+3,y,2,11);
  }
  function drawFarCity(){
    const c=g(),w=state.width,ground=state.ground;
    const offset=state.camera*.23;
    for(let i=-3;i<Math.ceil(w/83)+5;i++){
      const bx=i*83-(offset%83),h=70+rand(i+111)*70;
      paint(ctx,c.skyline,bx,ground-h-36,75,h+70);
      paint(ctx,"#ffffff15",bx+8,ground-h-33,4,3);
      for(let row=0;row<4;row++)for(let col=0;col<4;col++){
        if(rand(i*100+row*19+col)>.3)windowBlock(bx+11+col*14,ground-h-22+row*23,rand(i*23+row*7+col)>.65);
      }
    }
    const offset2=state.camera*.5;
    for(let i=-2;i<Math.ceil(w/115)+4;i++){
      const bx=i*115-(offset2%115),h=55+rand(i+73)*55;
      paint(ctx,c.skyline2,bx,ground-h-10,110,h+38);
      for(let row=0;row<3;row++)for(let col=0;col<5;col++)
        if(rand(i*12+row*6+col)>.38)windowBlock(bx+9+col*18,ground-h+8+row*24,rand(i*24+row*4+col)>.7);
    }
  }
  function drawShop(x,w,h,i){
    const c=g(),ground=state.ground;
    const top=ground-h;
    const color=c.mood==="arcade"?["#4b365d","#63435f","#644366"][i%3]:
      c.mood==="rain"?["#49627a","#627d8b","#3b566a"][i%3]:
      c.mood==="cafe"?["#bd8575","#d7a18a","#ab7872"][i%3]:
      c.mood==="autumn"?["#60817c","#77958a","#57777a"][i%3]:
      ["#a97877","#ca8e80","#92757b"][i%3];
    paint(ctx,"#2945546c",x+5,top+6,w,h);
    paint(ctx,color,x,top,w,h);
    paint(ctx,"#ffffff2d",x+4,top+3,w-8,4);
    // Pixel window grid
    for(let row=0;row<2;row++)for(let col=0;col<3;col++){
      const wx=x+13+col*((w-25)/3),wy=top+18+row*38;
      paint(ctx,"#2e4e63",wx,wy,21,24);
      paint(ctx,c.mood==="arcade"?"#eda28a":"#ffd6a79a",wx+3,wy+3,15,17);
      paint(ctx,"#ffeacb66",wx+10,wy+3,2,17);
      paint(ctx,"#354552",wx,wy+21,21,3);
    }
    paint(ctx,"#2b4052",x+9,ground-43,w-18,39);
    paint(ctx,"#dcad92",x+12,ground-40,w-24,35);
    paint(ctx,"#4c6472",x+14,ground-38,w-28,32);
    // Characterful fabric awning
    const awningColors=c.mood==="arcade"?["#ed8c9c","#765f9c"]:c.mood==="rain"?["#a7cdd0","#587f98"]:["#f6d7a9","#df806d"];
    paint(ctx,awningColors[0],x+4,ground-57,w-8,16);
    for(let sx=x+4,j=0;sx<x+w-4;sx+=13,j++)paint(ctx,awningColors[j%2],sx,ground-57,13,16);
    paint(ctx,"#263b4a",x+4,ground-41,w-8,3);
    const signs=["PADARIA","LIVROS","CAFÉ","DISC.","FOTOS","FLIPERAMA"];
    const name=c.mood==="arcade"&&i===2?"ARCADE":c.mood==="cafe"&&i===1?"CAFÉ":signs[(i+state.level)%signs.length];
    paint(ctx,c.mood==="arcade"?"#f185a5":"#f1d3ae",x+14,ground-82,w-28,18);
    ctx.font="bold 11px Pixelify Sans,monospace";ctx.textAlign="center";
    ctx.fillStyle=c.dark;ctx.fillText(name,x+w/2,ground-68);
    // Bright moving neon
    if(c.mood==="arcade"&&(Math.floor(state.time*3+i)%3!==0)){
      paint(ctx,"#e99cbe",x+8,top+13,3,17);
      paint(ctx,"#f3b591",x+w-10,top+15,3,22);
    }
  }
  function drawTrees(){
    const c=g();
    if(c.mood==="arcade"||c.mood==="festival")return;
    [150,550,945].forEach((wx,i)=>{
      const x=wx-state.camera,y=state.ground;
      if(x<-40||x>state.width+40)return;
      paint(ctx,"#6c594d",x-4,y-92,9,90);
      paint(ctx,"#927055",x-2,y-87,2,68);
      const wobble=Math.round(Math.sin(state.time*1.1+i)*2);
      const canopy=c.mood==="autumn"?["#d58b65","#e9bb73","#c97759"][i%3]:
        c.mood==="rain"?"#527c7c":"#73978a";
      paint(ctx,canopy,x-27+wobble,y-141,53,21);
      paint(ctx,canopy,x-40+wobble,y-124,79,30);
      paint(ctx,canopy,x-31+wobble,y-99,61,18);
      paint(ctx,"#ffffff25",x-18+wobble,y-135,15,5);
      paint(ctx,"#294f5b70",x+14+wobble,y-113,15,5);
    });
  }
  function drawStreet(){
    const c=g(),w=state.width,y=state.ground;
    paint(ctx,c.soil,0,y-8,w,state.height-y+8);
    paint(ctx,"#fff1c88c",0,y-7,w,4);
    paint(ctx,"#a37c68",0,y-3,w,4);
    paint(ctx,"#425666",0,y+36,w,state.height-y);
    paint(ctx,"#6d7885",0,y+36,w,6);
    for(let i=-2;i<Math.ceil(w/68)+3;i++){
      const pos=i*68-(state.camera%68);
      paint(ctx,"#ffffff1c",pos,y+16,39,1);
      paint(ctx,"#40526a30",pos+25,y+19,24,2);
      paint(ctx,"#f7e0b35e",pos+12,y+72,30,3);
    }
    // Cobblestone texture
    for(let i=0;i<Math.ceil(w/26)+3;i++){
      const x=i*26-(state.camera%26);
      paint(ctx,"#513d4b32",x,y+12,12,1);
      paint(ctx,"#f5c49a3f",x+13,y+23,10,1);
    }
  }
  function drawStreetDecor(){
    const c=g(),y=state.ground;
    const xOf=wx=>wx-state.camera;
    [510,990].forEach((wx,i)=>{
      const x=xOf(wx);
      if(x<-40||x>state.width+30)return;
      // Warm street lamp
      paint(ctx,"#344b58",x-2,y-147,5,148);
      paint(ctx,"#243b48",x-10,y-153,20,7);
      paint(ctx,"#ffe2a6",x-9,y-147,18,11);
      if(c.mood==="rain"||c.mood==="arcade"||c.mood==="festival"){
        ctx.fillStyle="#fff4c41d";ctx.beginPath();ctx.arc(x,y-143,28+Math.sin(state.time*2+i)*2,0,Math.PI*2);ctx.fill();
      }
    });
    if(c.mood==="cafe"){
      [420,890].forEach(wx=>{
        const x=xOf(wx);paint(ctx,"#956e64",x-20,y-25,40,5);
        paint(ctx,"#6b5856",x-16,y-20,5,21);paint(ctx,"#6b5856",x+13,y-20,5,21);
        paint(ctx,"#fce0b8",x-7,y-29,13,6);
        for(let i=0;i<3;i++)paint(ctx,"#ffffff6d",x-5+i*4+Math.sin(state.time+i)*2,y-37-i*6,2,5);
      });
    }
    if(c.mood==="festival"){
      // A street carnival with pennants and animated lanterns
      for(let i=0;i<12;i++){
        const wx=110+i*100;
        const x=xOf(wx),by=65+Math.sin(i*1.3)*12;
        pixelLine(ctx,"#ffe0b17d",x-60,by+5,x+60,by+4,2);
        const cl=["#ef8c82","#f6d18c","#8ac2b4"][i%3];
        paint(ctx,cl,x-5,by,10,13+Math.sin(state.time+i)*2);
        paint(ctx,"#ffedc7",x-2,by+4,4,5);
      }
    }
    if(c.mood==="autumn"){
      for(let i=0;i<19;i++){
        const px=(rand(i)*1230-state.camera+(state.time*(10+i%3)*.4))%(state.width+80)-20;
        const py=rand(i*13)*state.ground;
        paint(ctx,i%2?"#edaf77":"#e18763",px,py+Math.sin(state.time+i)*8,4,3);
      }
    }
    if(c.mood==="rain"){
      for(let i=0;i<100;i++){
        let xx=(rand(i+2)*1527-state.time*(65+(i%4)*13))%(state.width+100);
        if(xx<0)xx+=state.width+100;
        const yy=(rand(i*29+3)*1123+state.time*260)%(state.height+50);
        pixelLine(ctx,"#d3ecf598",xx,yy,xx-5,yy+11,1);
      }
      for(let i=0;i<10;i++){
        const x=i*127-state.camera%127;
        paint(ctx,"#b0d3e16c",x,state.ground+8,22,2);
      }
    }
    if(c.mood==="arcade"){
      for(let i=0;i<22;i++){
        const x=i*59-state.camera%59;
        const yy=state.ground-155+Math.sin(state.time+i)*3;
        if(i%3===0)paint(ctx,"#f5b7ca99",x,yy,2,8);
      }
    }
  }
  function drawIcon(icon,x,y,t){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    if(icon==="ticket"){
      paint(ctx,"#f5d6a1",-15,-9,30,18);
      paint(ctx,"#9c6b69",-15,-9,30,3);paint(ctx,"#a5696b",-5,-2,10,4);
      paint(ctx,"#b8997d",10,-4,2,10);
    }else if(icon==="coffee"){
      paint(ctx,"#fce2bb",-12,-9,23,20);paint(ctx,"#9e776a",-9,-5,17,13);
      paint(ctx,"#fce2bb",11,-5,7,11);paint(ctx,"#ffffffaa",13,-2,3,5);
      paint(ctx,"#f2e0c7",-13,11,28,3);
      for(let i=0;i<3;i++)paint(ctx,"#fff8dd",i*6-7+Math.sin(t*3+i)*2,-18-i%2*4,3,6);
    }else if(icon==="umbrella"){
      ctx.fillStyle="#e1b2a7";ctx.beginPath();ctx.arc(0,-4,18,Math.PI,0);ctx.fill();
      paint(ctx,"#c87f83",-18,-5,36,5);
      paint(ctx,"#3a5065",-1,-4,3,25);paint(ctx,"#3a5065",0,19,10,3);
    }else if(icon==="puddle"){
      ctx.fillStyle="#b6d8d4";ctx.beginPath();ctx.ellipse(0,8,24,9,0,0,Math.PI*2);ctx.fill();
      paint(ctx,"#f9eac7",1,3,12,2);paint(ctx,"#f9eac7",-15,9,8,2);
    }else if(icon==="arcade"){
      paint(ctx,"#253b54",-20,-29,40,46);paint(ctx,"#dd899d",-16,-26,32,27);
      paint(ctx,"#354661",-13,-23,26,20);
      paint(ctx,"#efc87e",-7,-17,14,8);paint(ctx,"#eab4b4",-11,2,22,4);
      paint(ctx,"#5b92a0",-8,8,6,6);paint(ctx,"#f4c98f",6,9,6,5);
    }else if(icon==="record"){
      paint(ctx,"#2e4962",-18,-14,37,29);paint(ctx,"#eab2a5",-15,-11,31,23);
      paint(ctx,"#fff0d4",-10,-6,22,12);paint(ctx,"#75546b",-6,-2,14,3);
      paint(ctx,"#354054",-10,8,7,5);paint(ctx,"#354054",5,8,7,5);
    }else if(icon==="note"){
      paint(ctx,"#fff0d1",-15,-16,28,31);
      for(let i=0;i<3;i++)paint(ctx,"#ac7f75",-9,-8+i*7,17,2);
      paint(ctx,"#d38676",3,11,7,3);
    }else if(icon==="camera"){
      paint(ctx,"#334a5b",-19,-8,38,26);
      paint(ctx,"#e4c3a0",-16,-12,13,7);
      ctx.fillStyle="#d8b1a1";ctx.beginPath();ctx.arc(0,5,11,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#3f5c69";ctx.beginPath();ctx.arc(0,5,7,0,Math.PI*2);ctx.fill();
      paint(ctx,"#f3d0b0",12,-3,4,4);
    }else if(icon==="photo"){
      paint(ctx,"#fff6e4",-16,-15,34,34);
      paint(ctx,"#84a1a0",-12,-11,26,23);
      paint(ctx,"#f3c38c",-12,-4,26,10);
      paint(ctx,"#4f6e7a",-5,-2,11,8);
    }else if(icon==="gift"){
      paint(ctx,"#f2bca0",-17,-7,34,28);
      paint(ctx,"#e6a281",-20,-12,40,8);
      paint(ctx,"#b55b65",-3,-12,7,33);
      paint(ctx,"#b55b65",-20,0,40,5);
      paint(ctx,"#ffdfc3",-3,-20,7,8);
    }
    ctx.restore();
  }
  function drawObjects(){
    const y=state.ground;
    g().objects.forEach((obj,i)=>{
      const x=obj.x-state.camera;
      if(x<-80||x>state.width+80)return;
      const done=state.solved.has(i),b=Math.sin(state.time*3+i)*4;
      if(!done){
        ctx.fillStyle="#fbe5a21b";ctx.beginPath();ctx.ellipse(x,y-34+b,28,34,0,0,Math.PI*2);ctx.fill();
        drawIcon(obj.icon,x,y-39+b,state.time);
        ctx.font="bold 21px Pixelify Sans,monospace";ctx.textAlign="center";
        ctx.fillStyle="#fff0bd";ctx.fillText("◆",x,y-69+b);
        paint(ctx,"#253d4cc9",x-31,y-17,62,16);
        ctx.font="bold 11px Pixelify Sans,monospace";ctx.fillStyle="#fff2d3";
        ctx.fillText(obj.label,x,y-5);
      }else{
        ctx.globalAlpha=.4;drawIcon(obj.icon,x,y-36,state.time);ctx.globalAlpha=1;
        ctx.fillStyle="#b9e7c1";ctx.font="bold 19px Pixelify Sans,monospace";ctx.textAlign="center";ctx.fillText("✓",x,y-65);
      }
    });
    const x=1128-state.camera;
    if(x>-100&&x<state.width+80){
      const active=state.solved.size===2;
      paint(ctx,"#2e4555",x-30,y-104,60,101);
      paint(ctx,active?"#f8d6a1":"#a5aab2",x-27,y-100,54,23);
      ctx.font="bold 12px Pixelify Sans,monospace";ctx.fillStyle="#344653";ctx.textAlign="center";
      ctx.fillText(state.level===5?"FINAL":"SAÍDA",x,y-84);
      paint(ctx,active?"#fce6a9":"#8095a2",x-22,y-73,44,69);
      paint(ctx,active?"#ecae87":"#687a83",x-19,y-70,38,65);
      paint(ctx,"#385269",x+8,y-46,6,5);
      if(active){
        ctx.fillStyle="#fff3c8";ctx.font="bold 26px Pixelify Sans,monospace";ctx.fillText("→",x,y-115+Math.sin(state.time*4)*3);
      }
    }
  }
  function drawFloatingParticles(dt){
    for(let i=state.particles.length-1;i>=0;i--){
      const p=state.particles[i];p.x+=p.dx*dt;p.y+=p.dy*dt;p.life-=dt*.75;
      if(p.life<=0){state.particles.splice(i,1);continue}
      ctx.globalAlpha=clamp(p.life,0,1);paint(ctx,p.color,p.x-state.camera,p.y,p.size,p.size);ctx.globalAlpha=1;
    }
  }
  function drawWorld(dt){
    const c=g(),w=state.width,y=state.ground;
    drawSky();drawFarCity();
    // A second, closer street layer so the scene scrolls with the player
    for(let i=0;i<7;i++){
      const bx=40+i*185-state.camera;
      if(bx>state.width+170||bx<-160)continue;
      const h=120+rand(i+5)*70;
      drawShop(bx,125,h,i);
    }
    drawTrees();drawStreet();drawStreetDecor();
    interiores.renderDoors(ctx,state);
    drawObjects();
    const closer=state.partnerX>state.x;
    const walking=!!state.walking;
    const px=state.x-state.camera,fx=state.partnerX-state.camera;
    // Character order changes as they cross so depth looks natural
    if(closer){drawCharacter(ctx,px,y-2,"ander",state.time,walking,1.1,state.direction);drawCharacter(ctx,fx,y-2,"lil",state.time+.5,walking,1.1,state.direction)}
    else{drawCharacter(ctx,fx,y-2,"lil",state.time+.5,walking,1.1,state.direction);drawCharacter(ctx,px,y-2,"ander",state.time,walking,1.1,state.direction)}
    interiores.streetCats(ctx,state);
    drawFloatingParticles(dt);
    // The city has tiny moving creatures and cars independent of the protagonist
    const taxiX=(((state.time*22+state.level*70)% (WORLD_WIDTH+200))-100)-state.camera;
    const taxiY=y+47;
    paint(ctx,"#314d66",taxiX,taxiY,45,14);
    paint(ctx,"#e5ab7d",taxiX+6,taxiY-8,29,11);
    paint(ctx,"#f9dab2",taxiX+12,taxiY-7,12,7);
    paint(ctx,"#243746",taxiX+7,taxiY+9,9,9);paint(ctx,"#243746",taxiX+30,taxiY+9,9,9);
    for(let i=0;i<3;i++){
      const birdX=((i*93+state.time*(10+i*4))%(w+120))-40,birdY=72+i*15+Math.sin(state.time*3+i)*4;
      pixelLine(ctx,"#354f658c",birdX,birdY,birdX+4,birdY+2,1);
      pixelLine(ctx,"#354f658c",birdX+4,birdY+2,birdX+8,birdY,1);
    }
    // An unobtrusive timeline etched into the road
    if(state.phase!=="opening"){
      ctx.font="bold 10px Pixelify Sans,monospace";ctx.fillStyle="#ffe1bd99";ctx.textAlign="left";
      ctx.fillText(c.place.toUpperCase(),10,state.height-17);
      ctx.textAlign="right";ctx.fillText(String(state.level+1).padStart(2,"0")+" / 06",w-11,state.height-17);
    }
  }
  function drawEnding(t){
    const c=endCtx,w=endCanvas.width,h=endCanvas.height;
    c.fillStyle="#e6b79a";c.fillRect(0,0,w,h);
    paint(c,"#839e96",0,120,w,56);
    paint(c,"#a3b5a4",0,109,w,12);
    for(let i=0;i<9;i++){
      const x=30+i*37,yy=24+Math.sin(i*1.6)*5;
      pixelLine(c,"#f6e8c2",x-24,yy-5,x+22,yy-4,2);
      paint(c,["#e5857f","#f3d18e","#71b2a7"][i%3],x-4,yy,8,13);
      paint(c,"#ffeed0",x-1,yy+3,3,6);
    }
    for(let i=0;i<11;i++)paint(c,"#fff4d7",20+i*29+Math.sin(t+i)*3,65+(i%5)*12,2,2);
    drawCharacter(c,142,151,"ander",t,true,1.66);
    drawCharacter(c,179,151,"lil",t+1,true,1.66);
    // Shared scarf/ribbon floating between the couple, not another static heart
    pixelLine(c,"#ed927c",152,92,170+Math.sin(t*2)*4,88,5);
    paint(c,"#f6e6c4",0,165,w,11);
  }
  let last=0;
  function frame(timestamp){
    const dt=clamp((timestamp-last)/1000,0,.05);last=timestamp;
    state.time+=dt;
    if(state.phase==="interior"){interiores.tick(dt);requestAnimationFrame(frame);return}
    if(state.holdTick&&state.phase==="challenge")state.holdTick(dt);
    if(state.shutterTick&&state.phase==="challenge")state.shutterTick(dt);
    updateInput(dt);drawWorld(dt);
    if(state.phase==="ending")drawEnding(state.time);
    requestAnimationFrame(frame);
  }
  interiores.install({state,drawCharacter,notify,tone,walkToDoor});
  requestAnimationFrame(frame);
})();
