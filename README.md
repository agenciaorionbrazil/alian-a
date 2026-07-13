# ALIANCA

**Fortaleca sua fe. Proteja seu relacionamento.**

Fundacao tecnica em Next.js App Router, TypeScript estrito, Tailwind CSS e Supabase para uma plataforma crista de crescimento para casais.

## Como rodar

1. Copie `.env.example` para `.env.local`.
2. Configure `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Instale as dependencias com `npm install`.
4. Rode `npm run dev`.

## Deploy

- GitHub/Netlify: veja `docs/deploy-github-netlify.md`.
- Supabase: veja `docs/supabase-setup.md`.

## Scripts

- `npm run typecheck`: verifica TypeScript.
- `npm run lint`: executa ESLint.
- `npm run test`: executa testes unitarios.
- `npm run build`: gera build de producao.
- `npm run check`: executa as verificacoes principais.

## Banco

As migracoes Supabase estao em `supabase/migrations`. A primeira migracao cria a fundacao de perfis, casais, convites, onboarding, consentimentos, auditoria e politicas RLS.

Veja `docs/supabase-setup.md` para configurar Auth, Storage, variaveis, redirects e testes manuais.

## Logo

O arquivo oficial da logo ainda nao foi anexado neste workspace. Quando estiver disponivel, coloque o arquivo original em `public/brand/logo.*` sem edicoes. O componente `BrandLogo` passa a usar esse ativo.
