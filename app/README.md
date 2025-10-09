# APAE Gestão Escolar - Frontend

Interface web para o sistema de gestão escolar da APAE, desenvolvida com foco em acessibilidade, organização pedagógica e eficiência administrativa. Este projeto utiliza tecnologias modernas como **Next.js**, **TypeScript**, **ESLint** e **Prettier** para garantir qualidade, escalabilidade e padronização de código.

---

##  Objetivo do Projeto

Este sistema tem como objetivo facilitar a gestão escolar da APAE, permitindo o controle de alunos, turmas, responsáveis, professores e demais funcionalidades administrativas e pedagógicas.

---

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) — Framework React para aplicações web modernas
- [TypeScript](https://www.typescriptlang.org/) — Tipagem estática para maior segurança
- [React](https://react.dev/) — Biblioteca para construção de interfaces
- [ESLint](https://eslint.org/) — Linter para manter padrões de código
- [Prettier](https://prettier.io/) — Formatador automático de código
- [Git](https://git-scm.com/) — Controle de versão
- [VS Code](https://code.visualstudio.com/) — Editor recomendado

---

## Como Executar

```bash
# Entre na pasta `app`
cd app/
# Instale as dependências
npm install
# Inicie o servidor de desenvolvimento
npm run dev

---

Pré-requisitos
Antes de executar o projeto, certifique-se de ter instalado:
Node.js (versão recomendada: 18+)
npm ou yarn
Git

---

Instalação de dependências adicionais
# ESLint e Prettier
npm install --save-dev eslint prettier eslint-config-next eslint-plugin-prettier eslint-config-prettier
# Configuração de arquivos
touch .eslintrc.json .prettierrc

---

Estrutura de Pastas
src/
├── components/       # Componentes reutilizáveis
├── pages/            # Rotas e páginas do Next.js
├── styles/           # Estilos globais e módulos CSS
├── utils/            # Funções auxiliares
├── types/            # Tipos TypeScript
├── services/         # Integração com APIs
└── assets/           # Imagens e ícones

---

Padrões de Código
ESLint configurado com regras personalizadas

Prettier para formatação automática

TypeScript com modo estrito ativado

Commits padronizados com Conventional Commits (opcional)

---

Contribuindo
Pull Requests são bem-vindos! 

# Crie uma branch com sua feature
git checkout -b minha-feature

# Faça os commits
git commit -m "feat: minha nova funcionalidade"

# Suba a branch
git push origin minha-feature


