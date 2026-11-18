# Publicacao e notificacao GitOps

O caller `.github/workflows/docker-publish.yml` publica somente em pushes e execucoes
manuais na `main`. PRs que alteram o caller executam as validacoes, sem publicar
imagens nem acessar o App de notificacao.

A publicacao depende de lint, build, verificacao de tipos e dos testes
existentes do frontend, alem de `mvnw verify` no backend.
O frontend possui uma suite Jest, executada antes do build pelo caller.
O workflow reutilizavel de publicacao usa `@main` do APAE-INFRA, que precisa
receber as correcoes da issue #106 antes do merge deste caller na `main` do
produto. Essa referencia seleciona a automacao; o codigo publicado tambem
precisa vir da `main` do produto.

As permissoes de pacotes, OIDC e atestacoes ficam somente nos jobs de
publicacao. A notificacao usa o environment `gitops-dispatch`, com a variavel
`GITOPS_DISPATCH_APP_ID` e o secret `GITOPS_DISPATCH_APP_PRIVATE_KEY` de um App
com `contents: write` somente no APAE-INFRA. O App de abertura de PRs e sua
chave permanecem exclusivamente na INFRA.

Frontend e backend sao publicados com o mesmo commit e execucao. O job
`prepare-release` rejeita outputs incompletos antes do evento
`gitops-release-published`.
A execucao manual na `main` tambem prepara e envia a notificacao. Uma falha
nas validacoes, publicacao ou preparacao impede a notificacao.

## Configuracao dos frontends

Os argumentos de build sao fixos e iguais nos dois ambientes. Nao usar
variaveis de deploy para reconstruir a imagem durante a promocao.
`NEXT_PUBLIC_API_URL=/gestao-escolar/api` e relativo ao mesmo dominio publico.
`BACKEND_URL=http://gestao-escolar-backend:8080` usa o Service Kubernetes no
namespace do frontend, com o mesmo nome nos dois ambientes.

O receptor da INFRA verifica origem, digest e proveniencia antes do PR de
homologacao. A aprovacao, promocao e rollback reutilizam os mesmos digests,
com revisao humana e sync manual. O caller nao atualiza producao diretamente.

## Validacao

```bash
actionlint .github/workflows/docker-publish.yml
git diff --check
```

Checks de PR nao comprovam publicacao no GHCR. O aceite da #106 exige uma
execucao real na `main` e evidencias de notificacao, homologacao, promocao
sem rebuild e rollback.

## Lint e contratos do frontend

O frontend usa o pacote oficial `eslint-config-next` fixado em `16.1.5`,
compativel com a versao de Next.js do lockfile, no formato flat config.
O pacote incorreto `eslint-plugin-next` foi removido e `npm run lint` chama
diretamente o ESLint CLI. O aumento do lockfile inclui as dependencias reais
das regras de Next.js, React e TypeScript; nao e uma revisao de vulnerabilidades.

Os contratos compartilhados ficam em `app/src/types/api.ts`. Erros capturados
sao tratados como `unknown` e estreitados pelos helpers de `apiError.ts`.
As regras de hooks permanecem habilitadas: formularios inicializam seus dados
quando o editor e montado, respostas obsoletas sao ignoradas nos carregamentos
ajustados e o contexto de autenticacao acompanha o armazenamento externo.

```bash
cd app
npm ci
npm run lint
npm test -- --runInBand
npm run build
npx --no-install tsc --noEmit
```

A correcao da configuracao revelou e corrigiu os erros bloqueantes existentes
no codigo. Os avisos de lint continuam visiveis. As correcoes de CVEs seguem
separadas no PR da issue #137.

## Escopo das correcoes de aplicacao neste PR

As correcoes de lint e tipos permanecem neste PR por decisao de manutencao:
nao ha responsavel dedicado pelo produto para conduzir uma entrega separada.
Elas viabilizam as validacoes obrigatorias antes da publicacao. A atualizacao
com a `dev` preserva os testes Jest e a refatoracao da pagina administrativa.
As atualizacoes de vulnerabilidades continuam no PR #504, associado a
APAE-INFRA #137; este PR nao substitui essa revisao.

Manter o PR em Draft enquanto o workflow reutilizavel e seus novos outputs
nao estiverem disponiveis na `main` do APAE-INFRA. O merge da dependencia
apenas em `dev` nao habilita a publicacao do produto.

## Verificacao local de 18/11/2026

A integracao com a `dev` preservou a refatoracao da tela administrativa e
resolveu os conflitos de manifesto, lockfile e tipos no mesmo PR.

- `npm ci` com scripts de instalacao desabilitados: dependencias instaladas
  a partir do lockfile, sem resolver novamente suas versoes.
- `npm run lint`: zero erros e 46 avisos, sem desativar regras.
- `npm test -- --runInBand`: tres suites e tres testes aprovados.
- `npm run build`: build de producao concluido com as variaveis do caller.
- `tsc --noEmit`: sem erros depois do build.
- actionlint com ShellCheck, Markdown e diff contra `origin/dev`: sem erros.

As dependencias do frontend e as configuracoes sao verificadas localmente;
esta evidencia nao comprova publicacao de imagens nem integracao real GitOps.
