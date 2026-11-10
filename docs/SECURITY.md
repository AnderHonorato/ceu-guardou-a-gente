# Segurança e privacidade

- Não publicar banco local do Enlace, anexos privados, endereços, dados médicos, senhas ou conversas íntimas.
- Diálogos sensíveis só entram no jogo se especificamente autorizados; preferir sínteses e cenas visuais.
- Não inventar nomes para os dois gatos do Lil.
- Nunca incluir chaves de serviços em HTML, JavaScript cliente, Git ou arquivos de história.
- Segregar permissões dos workflows: CI com contents:read; automação de issue com issues:write e contents:read.
- Não aceitar HTML arbitrário de usuários; componentes com texto devem usar textContent.
- Futuro backend: autenticação, criptografia em trânsito, RLS, rate limit, backup, migrações e política de retenção.
- Deploy em preview, testes e rollback para última release READY. Nunca afirmar sucesso sem HTTP, assets e teste.
- Guardar backups somente no Drive autorizado; nenhuma cópia do banco pessoal junto do pacote público.
