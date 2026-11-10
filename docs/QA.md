# Plano de QA

## Smoke de cada episódio
1. Abrir no Chrome mobile e desktop com acesso anônimo.
2. Conferir botões, cabeçalho, viewport e fim do episódio.
3. Arrastar cortina; aproximar e abraçar; arrastar objetos até mochila; assistir clipes por tempo mínimo; controlar iluminação, cortina e abraço noturno.
4. Observar animação de personagens/ambientes e testar controle alternativo por botão ou teclado.
5. Monitorar console JavaScript, ausência de erro e estado de conclusão.
6. Conferir link direto `?episodio=2026-11-09` e preservação da história principal.
7. Validar segurança e ausência de conteúdo privado.

## Evidências do episódio de 09/11
Executado em Chrome headless/Puppeteer no PC autorizado com viewport **390×844**: cinco etapas concluídas por gestos reais, imagens de cenas verificadas, zero erros de JS. Teste separado percorreu as telas e controles acessíveis. Publicação Vercel READY e URL HTTP 200, script HTTP 200 sem login.

## CI
`node --check` para todos os módulos JS/MJS e `node --test tests/verify-project.mjs` para integridade de recursos. Falta integrar Playwright E2E ao GitHub Actions: listado no roadmap, não declarar teste visual automático de CI antes de implementá-lo.
