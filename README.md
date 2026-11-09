# Pequenos Infinitos — Ander & Lil

Jogo 2D mobile-first para comemorar os cinco meses de namoro contados a partir de **8 de junho de 2026**.

**Link público:** https://ceu-guardou-a-gente.vercel.app

## Aventura

- Seis capítulos (junho a novembro), com Ander (barba e boné preto) e Lil (loiro).
- Movimento lateral com animação, cenários de rua vivos, efeitos de clima, objetos e missões mensais.
- **42 portas visitáveis**: 7 estabelecimentos/casas por capítulo, cada um com nome, narrativa, paleta e ambiente interno.
- Todos os interiores podem ser acessados tocando na fachada ou escolhendo **PORTAS**, com os protagonistas caminhando até a entrada.
- Ambientes internos 2D com objetos clicáveis, móveis próprios, luzes, janelas, pequenas animações e retorno à rua.
- **11 famílias de minigames**: compras com lista, cuidados com três gatos, escolha de assentos no cinema, estrelas, sequência de música, preparo de comida, cartas, memória, fotografia e clima romântico.
- **Três gatinhos:** Cookie, do Ander, e os outros dois gatinhos do Lil (sem nomes inventados).
- **ÁLBUM** colecionável com 42 lembranças e progresso salvo somente neste navegador.
- Final romântico e compartilhamento direto pelo celular.

## Fonte das narrativas e privacidade

O diário local **Enlace**, consultado somente para leitura, contém registros reais do casal. Adaptamos para o jogo lembranças apropriadas para compartilhar, como o cinema e o parque de diversões de julho, carta e flores, açaí, esfiha, músicas, cuidado em casa, planos e Cookie tentando sair.

A origem de cada cena aparece dentro do jogo:
- **LEMBRANÇA DO ENLACE** — baseada em um acontecimento do diário.
- **INSPIRADO NO QUE VOCÊ CONTOU** — inspirado nas compras, dias em casa e encontros românticos relatados pelo Ander.
- **UMA CENA IMAGINADA PARA JOGAR** — ficção lúdica, não um acontecimento afirmado como real.

**Nenhum banco de dados, mensagem privada, nome dos gatos não confirmado, endereço, registro de saúde ou conteúdo íntimo explícito foi publicado ou copiado para o repositório.**

## Código e execução

HTML, CSS e JavaScript puros. Canvas 2D desenha todos os cenários, personagens e gatos. Sons opcionais são sintetizados no navegador, sem dependências de áudio. Abra `index.html` para jogar localmente.

Arquivos:
- `index.html` — HUD, diálogos, navegação e telas de interação;
- `styles.css` — visual responsivo;
- `script.js` — movimentação, fases, objetivos e história principal;
- `interiors.js` — 42 lugares, entradas, renderização de salas, gatos e minigames;
- `og-image.png` — prévia compartilhável no WhatsApp.

Datas: o início em 8/6 segue o informado pelo Ander, mesmo que algumas anotações antigas do diário tenham marcos diferentes.


## Atualização: cenas vivas e jogabilidade gestual (novembro/2026)

A experiência agora inclui uma camada visual dedicada (`play-scenes.js`, `play-games.js`, `play-upgrade.js`, `play-upgrade.css`). Em cada interior o personagem pode caminhar, interagir com pontos visuais e jogar desafios gestuais diferentes. Entre os desafios: arrastar compras ao carrinho, brincar com Cookie e os gatinhos do Lil, montar um filme deslizando a fita, capturar luzinhas em movimento, rebater corações, ajustar a iluminação e cortina do quarto, desenhar latte art, acertar notas musicais, organizar selos de uma carta, preparar comida na panela e fotografar com enquadramento móvel.

A conclusão gera uma cena 2D com Ander e Lil se aproximando e salva uma conquista no armazenamento local do navegador. Os textos das lembranças só aparecem ao interagir com objetos. A base do diário Enlace não é lida pelo site público.
