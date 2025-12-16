#  APAE Gestão Escolar


##  Objetivo do Projeto

Facilitar a gestão escolar da APAE, permitindo o controle de:

 Alunos

 Turmas

 Responsáveis

 Professores

 Funcionalidades administrativas e pedagógicas

O sistema foi desenvolvido para melhorar a organização, a acessibilidade e a eficiência da gestão escolar.

----


##  Tecnologias Utilizadas

Next.js	       Framework React para aplicações web modernas

TypeScript	    Tipagem estática para maior segurança

React	        Biblioteca para construção de interfaces

ESLint	        Linter para manter padrões de código

Prettier	        Formatador automático de código

Git	            Controle de versão

VS Code	        Editor de código recomendado

Docker          Criação de um repositório remoto

-----


## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

Node.js (versão 18 ou superior)

npm ou yarn

Git

Docker

----

##  Como Executar o Frontend
```bash

# Clone o repositório
git clone https://github.com/IFPBEsp/APAE-gestao-escolar.git

# Acesse o diretório do projeto
cd ./app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev


O projeto será executado em:
 http://localhost:3000

```

----

##  Como Executar o Backend

```bash

# Clone o repositório
git clone https://github.com/seu-usuario/apae-gestao-escolar.git

# Acesse o diretório do projeto
cd ./api

# inicie o docker-compose
docker compose up

# Inicie o servidor Spring
javac .\src\main\java\com\apae\gestao\ApaeGestaoApplication.java


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
    APAE-gestao-escolar/
    ├── api/
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/com/apae/gestao/ApaeGestaoApplication.java
    │   │   │   └── resources/
    │   │   │       └── application.properties
    │   │   └── test/
    │   ├── pom.xml 
    │   ├── docker-compose.yml
    │   └── .gitignore
    └── app/
        ├──public/
        ├──src/
        │   ├── app/
        │   ├── components/       
        │   ├── services/         
        │   ├── styles/           
        │   ├── utils/            
        ├── tsconfig.json     
        ├── next.config.js    
        └── .gitignore
```

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

---

# Utilizando o Swagger

Primeiro, é necessário iniciar o backend.

## Acesso ao Swagger
localhost:8080/swagger-ui.html

## Acesso à documentação
localhost:8080/v3/api-docs