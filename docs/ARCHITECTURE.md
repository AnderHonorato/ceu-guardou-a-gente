# Arquitetura do jogo

## Estado atual
Jogo web estático com HTML/CSS/JavaScript e Canvas 2D. Deploy Vercel a partir do branch main; GitHub como fonte. O jogo local não deve requerer API paga.

- `script.js`: mapa externo, capítulos de junho a novembro, progresso.
- `interiors.js`: locais, gatos, histórias e minigames da primeira geração.
- `play-scenes.js` + `play-games.js` + `play-upgrade.js`: arte e jogabilidade gestual em ambientes visitáveis.
- `daily-2026-11-09.js` + CSS: continuação do dia 09, seis telas desenhadas em tempo real.
- `stories/YYYY-MM-DD.json`: fonte narrativa versionável; 09/11 presente; **ainda não é loader universal**.
- `tests/`: verificações estáticas. Smoke real com Puppeteer foi executado localmente.
- `.github/workflows/`: CI e planejamento diário.

## Próxima modularização (incremental)
`src/engine/{loop,input,particles,audio,storage}`, `src/game/{world,characters,cats,scenes,achievements}`, `src/ui/`, `stories/`, `assets/`, `scripts/`, `tests/e2e/`.
Evitar refatorações grandes sem testes de regressão. Consolidar renderização responsiva e gerência de memória ao avançar.

## Calendário
Usar `Intl.DateTimeFormat` com `America/Sao_Paulo`, data local no formato YYYY-MM-DD e versão de história; não desbloquear episódio futuro nem confundir data de edição com data do acontecimento. Episódios anteriores continuam acessíveis.

## Segurança
Nenhum token em front-end. Estado não sensível via armazenamento local do navegador. Não inserir dados do Enlace ou registros íntimos no bundle público.
