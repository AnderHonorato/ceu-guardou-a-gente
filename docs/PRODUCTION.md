# Estúdio Indie — fluxo de produção

## Funções de uma equipe indie
- **Produtor:** backlog, escopo, prioridades, riscos, definição de pronto e release.
- **Roteiro/narrativa:** consistência factual, falas curtas e sensibilidade, inclusive após desentendimentos.
- **Game designer:** loops de habilidade, dificuldade, momentos memoráveis, descoberta e feedback.
- **Artista/animador 2D:** keyframes, expressões, silhuetas, ambientes, luz, efeitos de partículas e identidade autoral.
- **Programador gameplay:** entrada, física simplificada, personagem, cena e máquina de estados.
- **Engenheiro full-stack:** dados, salvamento, APIs quando necessárias, proteção de privacidade e migrações.
- **QA/acessibilidade:** smoke, regressão, E2E, performance, teclado, leitura visual e touch.
- **DevOps/segurança:** Git, CI, deploy, monitoramento, rollback e backup.

## Um ciclo por dia
GitHub Actions em `.github/workflows/daily-studio.yml` abre uma issue de ciclo a cada dia por volta das 20h em São Paulo. Esta automação **não codifica por conta própria**: a etapa de implementação precisa de execução autorizada de agente/desenvolvedor. O workflow evita duplicar a issue do mesmo dia.

## Pipeline obrigatório
Issue → história/GDD e aceites → branch → implementação com código → testes locais e automáticos → preview Vercel → revisão/PR → produção → verificação pública e backup versionado no Drive → changelog.

## Definition of Done
- Cenário interativo realmente funcionando no celular, não apenas texto ou card.
- Interações físicas concluíveis, com alternativa acessível.
- Sem erros críticos no console, sem arquivos privados e sem credenciais.
- Links do commit, preview, release e Drive quando houver backup real.
- Caso falte permissão/serviço, deixar pendência explícita e **não afirmar entrega**.

## Dados
Sem backend obrigatório agora. Caso se implemente autenticação, conquistas em nuvem ou sincronização do casal, planejar com Supabase/SQLite, RLS, migrações testadas, logs redigidos e consentimento.
