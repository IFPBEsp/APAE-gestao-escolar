#  APAE Gestão Escolar – Frontend

Interface web para o sistema de gestão escolar da APAE, desenvolvida com foco em acessibilidade, organização pedagógica e eficiência administrativa.

O projeto utiliza tecnologias modernas como Next.js, TypeScript, ESLint e Prettier para garantir qualidade, escalabilidade e padronização de código.

-----


#  Objetivo do Projeto

Facilitar a gestão escolar da APAE, permitindo o controle de:

 Alunos

 Turmas

 Responsáveis

 Professores

 Funcionalidades administrativas e pedagógicas

O sistema foi desenvolvido para melhorar a organização, a acessibilidade e a eficiência da gestão escolar.

----


#  Tecnologias Utilizadas

Next.js	       Framework React para aplicações web modernas

TypeScript	    Tipagem estática para maior segurança

React	        Biblioteca para construção de interfaces

ESLint	        Linter para manter padrões de código

Prettier	        Formatador automático de código

Git	            Controle de versão

VS Code	        Editor de código recomendado

-----


# Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

Node.js (versão 18 ou superior)

 npm ou yarn

 Git

----

#  Como Executar o Projeto
```bash

# Clone o repositório
git clone https://github.com/seu-usuario/apae-gestao-escolar.git

# Acesse o diretório do projeto
cd apae-gestao-escolar/frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev


O projeto será executado em:
 http://localhost:3000

```

----


#  Instalação de Dependências Adicionais
```bash
# ESLint e Prettier
npm install --save-dev eslint prettier eslint-config-next eslint-plugin-prettier eslint-config-prettier

# Crie os arquivos de configuração
touch .eslintrc.json .prettierrc
```


#  Estrutura de Pastas
```bash
src/
├── app/
│   ├── components/       # Componentes reutilizáveis (Button, Header, Input, Layout)
│   ├── services/         # Configuração da API com Axios
│   ├── styles/           # Estilos globais e temas
│   ├── utils/            # Funções auxiliares e constantes
├── public/               # Assets públicos (favicon, imagens)
├── tsconfig.json         # Configuração do TypeScript
├── next.config.js        # Configuração do Next.js

```
----

#  Padrões de Código

ESLint configurado com regras personalizadas

Prettier para formatação automática

TypeScript com modo estrito ativado

Commits padronizados com Conventional Commits (opcional)

----

# Contribuindo
```bash

# Crie uma branch com sua feature
git checkout -b minha-feature

# Faça os commits
git commit -m "feat: minha nova funcionalidade"

# Suba a branch
git push origin minha-feature

Abra um Pull Request descrevendo suas alterações.
```