# Segurança de dados

Esta fundacao separa dados privados, compartilhados e administrativos no banco.

- Dados privados: `onboarding_answers`, `diagnostic_results` e `sos_sessions` usam `user_id = auth.uid()` por padrao.
- Dados compartilhados: somente linhas com `visibility = 'shared'` e `couple_id` visivel a membros ativos do casal podem ser lidas pelo parceiro.
- Administradores: `admin_users` libera area administrativa, mas nao concede acesso automatico a respostas privadas ou sessoes SOS.
- Convites: usam `public_code` aleatorio e `token_hash`, sem expor IDs previsiveis como codigo publico.
- Consentimentos: cada consentimento e registrado separadamente; opcionais nao possuem default concedido.
- Convites: criacao e aceite usam RPCs com token hasheado no banco.
- Storage: `brand-assets` e publico para leitura; `avatars` exige pasta com o UUID do usuario autenticado.

Para validar manualmente no Supabase, crie dois usuarios, vincule ambos a casais diferentes e tente selecionar respostas privadas de outro usuario. A politica esperada e retorno vazio ou erro de permissao.
