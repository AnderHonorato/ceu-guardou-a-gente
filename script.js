"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const scenes = $$(".scene");
  const soundButton = $("#soundButton");
  const progressBar = $("#progressBar");
  const chapterIndicator = $("#chapterIndicator");
  const labels = ["um presente para você", "01 / o encontro", "02 / o nosso sim", "03 / hoje", "uma carta para Lil"];
  let current = 0;
  let soundEnabled = false;
  let context = null;
  let transitioning = false;
  let lit = new Set();
  let chosen = new Set();
  let fullyJoined = false;
  let toastTimeout;

  // Original, synthesized little bell tones — sound is always opt-in.
  const tone = (freq = 580, duration = .25, delay = 0) => {
    if (!soundEnabled) return;
    try {
      context ||= new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === "suspended") context.resume();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const t = context.currentTime + delay;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, t);
      oscillator.frequency.exponentialRampToValueAtTime(freq * .66, t + duration);
      gain.gain.setValueAtTime(.0001, t);
      gain.gain.exponentialRampToValueAtTime(.075, t + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(t);
      oscillator.stop(t + duration + .03);
    } catch (_) { /* Sounds are optional. */ }
  };

  const melody = () => {
    [523, 659, 784, 1046].forEach((note, i) => tone(note, .48, i * .16));
  };

  const toast = (message) => {
    const el = $("#toast");
    clearTimeout(toastTimeout);
    el.textContent = message;
    el.classList.add("show");
    toastTimeout = setTimeout(() => el.classList.remove("show"), 3000);
  };

  const setScene = (next) => {
    if (transitioning || next === current || next < 0 || next >= scenes.length) return;
    transitioning = true;
    const previous = scenes[current];
    const upcoming = scenes[next];
    previous.classList.add("leave");
    upcoming.classList.add("is-active");
    upcoming.setAttribute("aria-hidden", "false");
    current = next;
    chapterIndicator.textContent = labels[next];
    progressBar.style.width = ((next / (scenes.length - 1)) * 100) + "%";
    tone(460 + next * 115, .4);
    window.setTimeout(() => {
      previous.classList.remove("is-active", "leave");
      previous.setAttribute("aria-hidden", "true");
      transitioning = false;
    }, 800);
    if (next === 4) {
      window.setTimeout(() => {
        melody();
        burstHearts($("#finaleEmblem"), 15);
      }, 750);
    }
  };

  scenes.forEach((scene, i) => scene.setAttribute("aria-hidden", String(i !== 0)));
  $$("[data-next]").forEach((button) => button.addEventListener("click", () => setScene(current + 1)));
  soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundButton.classList.toggle("sound-on", soundEnabled);
    soundButton.setAttribute("aria-label", soundEnabled ? "Desativar sons" : "Ativar sons");
    if (soundEnabled) {
      tone(740, .2);
      tone(987, .35, .16);
    }
  });

  // A fixed, delicate star field, deliberately seeded for consistent visuals.
  let seed = 8427;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const stars = $("#stars");
  const count = window.innerWidth < 700 ? 55 : 100;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("i");
    const large = rand() > .88;
    const diameter = large ? 2.6 : rand() > .8 ? 1.8 : 1;
    star.className = "star" + (large ? " large" : "");
    star.style.cssText = `left:${(rand() * 100).toFixed(2)}%;top:${(rand() * 92).toFixed(2)}%;width:${diameter}px;height:${diameter}px;--op:${(.35 + rand() * .5).toFixed(2)};--tw:${(2 + rand() * 5).toFixed(1)}s;--delay:-${(rand() * 7).toFixed(1)}s`;
    fragment.appendChild(star);
  }
  stars.appendChild(fragment);

  const fireflyLines = [
    "20 de junho: uma data pequena, um começo gigante.",
    "No meio de tanta gente, foi tão bonito encontrar você.",
    "Ainda bem que a vida colocou nossos caminhos lado a lado."
  ];
  $$("[data-firefly]").forEach((button) => button.addEventListener("click", () => {
    const id = Number(button.dataset.firefly);
    if (lit.has(id)) return;
    lit.add(id);
    button.classList.add("lit");
    const message = $("#fireflyMessage");
    message.textContent = fireflyLines[id];
    tone(540 + id * 175, .38);
    if (lit.size === 3) {
      $("#fireflyNext").disabled = false;
      window.setTimeout(() => {
        message.textContent = "✦ Você acendeu as três luzes do nosso começo.";
        melody();
      }, 1750);
    }
  }));
  $("#fireflyNext").addEventListener("click", () => setScene(2));

  const stage = $("#closenessStage");
  const range = $("#closeness");
  const left = $(".join-ander");
  const right = $(".join-lil");
  const updateCloseness = () => {
    const amount = Number(range.value) / 100;
    const leftCenter = left.offsetLeft + left.offsetWidth / 2;
    const rightCenter = right.offsetLeft + right.offsetWidth / 2;
    const gapToClose = Math.max(0, (rightCenter - leftCenter - left.offsetWidth * .75) / 2);
    left.style.setProperty("--move", (gapToClose * amount) + "px");
    right.style.setProperty("--move", (-gapToClose * amount) + "px");
    range.style.setProperty("--pct", range.value + "%");
    if (amount >= .94 && !fullyJoined) {
      fullyJoined = true;
      stage.classList.add("joined");
      $("#closerNext").disabled = false;
      melody();
      burstHearts($("#stageHearts"), 24);
      if (navigator.vibrate) navigator.vibrate([25, 40, 35]);
    }
  };
  range.addEventListener("input", updateCloseness);
  window.addEventListener("resize", updateCloseness);
  updateCloseness();
  $("#closerNext").addEventListener("click", () => setScene(3));

  const reasonLines = [
    "O jeito como seu sorriso consegue melhorar até os dias mais comuns.",
    "Os abraços, as conversas, as brincadeiras... tudo tem mais cor com você.",
    "O melhor ainda está por vir. E eu quero descobrir cada pedacinho com você."
  ];
  $$("[data-reason]").forEach((button) => button.addEventListener("click", () => {
    const id = Number(button.dataset.reason);
    $("#reasonText").textContent = reasonLines[id];
    if (!chosen.has(id)) {
      chosen.add(id);
      button.classList.add("picked");
      button.setAttribute("aria-pressed", "true");
      tone(620 + id * 140, .4);
    }
    $("#reasonsCount").textContent = chosen.size + "/3";
    if (chosen.size === 3) {
      $("#todayNext").disabled = false;
      melody();
    }
  }));
  $("#todayNext").addEventListener("click", () => setScene(4));

  const petals = $("#petalScene");
  for (let i = 0; i < 18; i++) {
    const el = document.createElement("i");
    el.className = "petal";
    el.style.cssText = `left:${rand() * 100}%;--dur:${(8 + rand() * 12).toFixed(2)}s;--del:-${(rand() * 20).toFixed(2)}s;opacity:${(.3 + rand() * .6).toFixed(2)}`;
    petals.appendChild(el);
  }

  function burstHearts(root, amount) {
    for (let i = 0; i < amount; i++) {
      const heart = document.createElement("span");
      heart.className = "pop-heart";
      heart.textContent = i % 3 === 0 ? "✦" : "♥";
      heart.style.setProperty("--hx", ((rand() - .5) * 250) + "px");
      heart.style.left = ((rand() - .5) * 90) + "px";
      heart.style.top = ((rand() - .5) * 35) + "px";
      heart.style.animationDelay = (rand() * .6) + "s";
      root.appendChild(heart);
      setTimeout(() => heart.remove(), 2500);
    }
  }

  $("#shareButton").addEventListener("click", async () => {
    const url = window.location.href;
    const data = {
      title: "O céu guardou a gente ♡",
      text: "Meu amor, fiz uma surpresa pra você. Abre com carinho 💛",
      url
    };
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (error) { if (error.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copiado. Agora é só enviar para quem você ama ♡");
    } catch (_) {
      toast("Copie o endereço da página para compartilhar ♡");
    }
  });

  $("#replayButton").addEventListener("click", () => setScene(0));
})();
