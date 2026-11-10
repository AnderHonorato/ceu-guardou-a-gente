import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>readFileSync(path.join(root,p),"utf8");
test("a aplicação é servida sem backend e contém os arquivos essenciais",()=>{
  for(const f of ["index.html","styles.css","script.js","interiors.js","play-scenes.js","play-games.js","play-upgrade.js","play-upgrade.css","daily-2026-11-09.js","daily-2026-11-09.css"]){
    assert.ok(existsSync(path.join(root,f)),f+" está ausente");
    if(f!=="index.html")assert.ok(read("index.html").includes(f),f+" não está carregado no HTML");
  }
});
test("o novo episódio preserva a data e as cinco cenas de verdade",()=>{
  const js=read("daily-2026-11-09.js");
  assert.match(js,/2026-11-09/);
  for(const trecho of ["Abra a cortina","A conchinha","Um até logo","Vídeos juntinhos","O nosso tempo"]){
    assert.ok(js.includes(trecho),"Trecho ausente: "+trecho);
  }
  assert.match(js,/function pointerDown|function down\(/);
  assert.match(js,/function pointerMove|function move\(/);
  assert.match(js,/function loop\(/);
});
test("o capítulo de hoje pode ser acessado pelo link direto",()=>{
  const js=read("daily-2026-11-09.js");
  assert.match(js,/new URLSearchParams\(location.search\)/);
  assert.match(js,/params.get\("episodio"\)===DATE/);
  assert.match(js,/setTimeout\(start,180\)/);
});
test("a história e o início do namoro não foram apagados",()=>{
  const html=read("index.html");
  assert.match(html,/08\.06\.2026/);
  assert.match(html,/CINCO MESES JUNTOS/);
  assert.match(html,/id="ending"/);
});
test("o diário privado não foi incorporado ao navegador",()=>{
  const js=read("daily-2026-11-09.js");
  assert.doesNotMatch(js,/dev\.db|sqlite3|Authorization:\s*Bearer|sk-proj-/i);
  assert.doesNotMatch(js,/\/Users\/AS\/Documents|C:\\\\Users\\\\AS/i);
});
test("a rotina de desenvolvimento exige validação em vez de autopublicar conteúdo não testado",()=>{
  const workflow=read(".github/workflows/daily-studio.yml");
  assert.match(workflow,/America\/Sao_Paulo/);
  assert.match(workflow,/issues\.create/);
  assert.doesNotMatch(workflow,/force:\s*true/);
});

test("episódio 10/11 oferece aventura de voo gestual sem inventar lembranças",()=>{
 const js=read("daily-2026-11-10.js");
 const html=read("index.html");
 assert.match(js,/2026-11-10/);
 assert.match(js,/CENA IMAGINADA PARA JOGAR/);
 assert.match(js,/function fold\(/);
 assert.match(js,/function pointerMove\(/);
 assert.match(js,/function drawHazards\(/);
 assert.match(js,/function drawFlight\(/);
 assert.match(js,/function drawFinal\(/);
 assert.ok(html.includes('daily-2026-11-10.js'));
 assert.ok(html.includes('daily-2026-11-10.css'));
 const story=JSON.parse(read("stories/2026-11-10.json"));
 assert.equal(story.kind,"cena_imaginada_para_jogar");
 assert.equal(story.date,"2026-11-10");
});
