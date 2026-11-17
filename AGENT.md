# AGENT.md

Instruções para agentes de IA (Claude Code e outros) que trabalham neste repositório.

## Visão geral do projeto

Sistema de gestão escolar da APAE, com backend e frontend no mesmo repositório:

| Caminho | Stack | Comandos |
|---|---|---|
| `api` | Backend Java 21 (Spring Boot 3.3 / Maven, Spring Security com JWT, Flyway) | `npm run dev:backend`, `cd api && ./mvnw test` |
| `app` | Frontend Next.js 16 + React 18 + Jest | `npm run dev:frontend`, `cd app && npm run lint`, `cd app && npm test` |
| infraestrutura | Docker Compose (PostgreSQL, MinIO, migrações e seed) em `api/docker-compose.yml` | `npm run dev:infra`, `npm run db:migrate`, `npm run db:seed` |

`npm run dev` prepara o banco e sobe backend e frontend juntos.

O sistema lida com **dados pessoais de alunos com deficiência (muitos deles menores de idade) e de professores**, além de frequência, avaliações e relatórios pedagógicos. Trate qualquer exposição desses dados como impacto alto, por envolver dados sensíveis sob a LGPD.

O controle de acesso usa os papéis `ADMIN` e `TEACHER`, e as operações do professor são restritas pelo vínculo com a turma e com o aluno. Falhas nesse controle (um professor lendo ou alterando dados de turma ou aluno sem vínculo) são o principal limite de confiança a verificar.

## Skills disponíveis

As skills do projeto ficam em `.claude/skills/` e são versionadas no repositório.

### `security-audit` (Cloudflare)

Revisão de segurança e detecção de vulnerabilidades, focada no código-fonte. Origem: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill).

**Modos de uso:**

| Pedido | Modo | Gera arquivos? |
|---|---|---|
| "use a skill security-audit para revisar X" | Orientação (pergunta ou revisão pontual) | Não |
| "faça uma auditoria de segurança completa com a skill security-audit, perfil `quick`/`standard`/`deep`" | Auditoria completa (6 fases) | Sim |
| "auditoria com security-audit só em `api`" ou "do diff entre `dev` e esta branch" | Auditoria restrita a um trecho | Sim (cobertura parcial) |

- Perfis: `quick` (uma rodada de busca), `standard` (padrão) e `deep` (sistemas críticos).
- Orçamento: o usuário pode limitar o custo, por exemplo "orçamento máximo de 15 agentes".
- Saída padrão, fora do repositório: `~/security-audit-skill/APAE-gestao-escolar/run-<N>/`.
- Nunca testar ambientes implantados (Vercel, Render, Neon), endpoints reais nem dados reais de alunos e professores. Use só análise de código e testes locais com dados fictícios.

> Não confundir com a skill nativa `security-review`, que analisa apenas as alterações pendentes da branch atual.

## Regra: relatório de vulnerabilidades em português

**Todo relatório de vulnerabilidades gerado neste repositório deve ser escrito em português do Brasil.** A regra vale para a skill `security-audit` (modo orientação ou auditoria completa), para `/security-review` e para qualquer análise de segurança pedida ao agente.

### O que traduzir

- Todo o texto em prosa de `REPORT.md`, `FINDINGS-DETAIL.md` e `NEEDS-VALIDATION.md`: títulos de seção, resumos, descrições, impacto, justificativa da prioridade, reprodução e correção recomendada.
- Respostas no terminal sobre achados de segurança.

### O que NÃO traduzir

- **`findings.json` e `coverage-ledger.json`**: nomes de campos e valores de enumeração (`confirmed`, `needs_validation`, `rejected`, `critical`, `high` etc.) ficam em inglês, porque os validadores `validate-findings.cjs` e `validate-coverage-ledger.cjs` e o `report-schema.json` dependem deles. Campos de texto livre dentro do JSON (título, descrição, impacto, correção) devem estar em português.
- Código, caminhos de arquivo, nomes de classes e métodos, comandos, mensagens de erro e identificadores (CWE, CVE, fingerprints).

### Estrutura do `REPORT.md`

Siga a estrutura definida pela skill, com estes títulos:

1. **Escopo da execução**: perfil, escopo, orçamento (agentes usados vs. planejados), commit analisado, política de execução (só código-fonte e testes locais em sandbox), execuções anteriores consideradas, itens adiados e fora do escopo. Execuções `quick`, restritas a um trecho ou incompletas devem dizer claramente que a cobertura é **parcial**.
2. **Resumo da postura de segurança**: um parágrafo curto.
3. **Vulnerabilidades confirmadas** (tabela): Gravidade | Título | Limite de confiança afetado | Resultado observado.
4. **Detalhamento de cada vulnerabilidade**: localização no código, principal de menor privilégio (atacante), reprodução local delimitada, condições, resultado obtido, impacto, justificativa da prioridade e menor correção eficaz no código.
5. **Pendentes de validação** (tabela, sem gravidade): título, rastro no código, bloqueio exato, próximo passo local e verificação segura a ser feita pelo responsável pelo deploy.
6. **Recomendações de hardening e boas práticas encontradas**.
7. **Resumo da cobertura**: quantidade de unidades cobertas, candidatas, bloqueadas e adiadas, exclusões importantes e resultado da revisão final de cobertura.

### Gravidade

Na prosa, use o rótulo em português com o valor original entre parênteses:

| JSON | Relatório |
|---|---|
| `critical` | Crítica (critical) |
| `high` | Alta (high) |
| `medium` | Média (medium) |
| `low` | Baixa (low) |
| `informational` | Informativa (informational) |
| `needs_validation` | Pendente de validação (sem gravidade) |

### Cuidados com dados sensíveis

- Nunca incluir no relatório dados reais de alunos, responsáveis ou professores, credenciais, tokens, conteúdo de `.env` ou segredos encontrados. Cite apenas o arquivo e a linha, com o valor mascarado (por exemplo `JWT_SECRET=****`).
- Nas reproduções, use somente dados fictícios (por exemplo `aluno-teste`, CPF `000.000.000-00`, o administrador fictício do `.env.example`).
- Quando a vulnerabilidade expõe dados pessoais de alunos ou professores, diga isso explicitamente no impacto e mencione a LGPD.

## Convenções gerais

- Branch principal para PRs: `dev`.
- Mensagens de commit seguem Conventional Commits em português, no formato `tipo: descrição` (ver a seção "Conventional Commits" do `README.md`).
- O hook de pre-commit roda o `gitleaks` nos arquivos em stage. Não contorne o hook nem commite segredos.
- Os relatórios de auditoria não devem ser commitados no repositório, salvo pedido explícito. Nesse caso, use uma pasta ignorada pelo `.gitignore`.
