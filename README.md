<div align="center">
  <img src="./app/public/apae-logo.png" alt="APAE Gestão Escolar" width="320px" />
  
  <h1>APAE Gestão Escolar</h1>
  
  <p>
    <strong>Sistema completo para gestão escolar da APAE</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render" height="25"/>
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" height="25"/>
    <img src="https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white" alt="Neon" height="25"/>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" height="25"/>
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" height="25"/>
    <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" height="25"/>
    <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" height="25"/>
  </p>

  <br />

  <a href="https://github.com/IFPBEsp/APAE-gestao-escolar/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/IFPBEsp/APAE-gestao-escolar/main?style=for-the-badge" height="22">
  </a>
  <a href="https://github.com/IFPBEsp/APAE-gestao-escolar/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/IFPBEsp/APAE-gestao-escolar?style=for-the-badge" height="22">
  </a>
  <a href="https://github.com/IFPBEsp/APAE-gestao-escolar/blob/main/LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/IFPBEsp/APAE-gestao-escolar?style=for-the-badge" height="22">
  </a>
</div>

<br />
<br />


## 📋 Sobre o Projeto

Sistema desenvolvido para **otimizar a gestão escolar da APAE**, oferecendo uma plataforma unificada para controle administrativo e pedagógico. A solução foi pensada para melhorar a organização, acessibilidade e eficiência dos processos diários da instituição.

### ✨ Funcionalidades Principais

- **👥 Gestão** de alunos, professores e turmas
- **📊 Controle pedagógico** e acompanhamento do desenvolvimento dos alunos
- **🔐 Módulo administrativo** para gerenciamento de permissões e acessos
- **📱 Interface responsiva** e acessível para diferentes dispositivos

<br />


## 🌐 Acesso à Produção

O projeto está disponível online! Acesse:

<div>
  <a href="https://apae-gestao-escolar.vercel.app/">
    <img src="https://img.shields.io/badge/APAE_Gestão_Escolar-6DB33F?style=for-the-badge&logo=vercel&logo" />
  </a>
</div>

<br />

| Ambiente | URL |
|----------|-----|
| **Frontend (Produção)** | [https://apae-gestao-escolar.vercel.app/](https://apae-gestao-escolar.vercel.app/) |
| **Backend (Produção)** | [https://apae-gestao-escolar.onrender.com/](https://apae-gestao-escolar.onrender.com/) |
| **API Docs (Produção)** | [https://apae-gestao-escolar.onrender.com/swagger-ui/index.html?urls.primaryName=Turmas#/Turmas/listarTodas](https://apae-gestao-escolar.onrender.com/swagger-ui/index.html?urls.primaryName=Turmas#/Turmas/listarTodas) |

> ⚡ **Disponibilidade:** O serviço pode levar alguns segundos para iniciar em caso de inatividade (free tier).

## 🚀 Tecnologias

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| [Next.js](https://nextjs.org/) | Framework React com renderização híbrida |
| [TypeScript](https://www.typescriptlang.org/) | Superset JavaScript com tipagem estática |
| [React](https://reactjs.org/) | Biblioteca para interfaces de usuário |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) | Padronização e formatação de código |
| [Vercel](https://vercel.com/) | Plataforma de deploy para frontend |

### Backend & Infraestrutura
| Tecnologia | Descrição |
|------------|-----------|
| [Spring Boot](https://spring.io/projects/spring-boot) | Framework Java para APIs REST |
| [Docker](https://www.docker.com/) | Containerização da aplicação |
| [Neon](https://neon.tech/) | Banco de dados PostgreSQL serverless |
| [Render](https://render.com/) | Hospedagem do backend e banco de dados |

### Ferramentas
| Tecnologia | Descrição |
|------------|-----------|
| [Git](https://git-scm.com/) | Controle de versão |
| [VS Code](https://code.visualstudio.com/) | Editor de código recomendado |

<br />

## 📁 Estrutura do Projeto

```
APAE-gestao-escolar/
├── api/                    # Backend Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/      # Código fonte Java
│   │   │   └── resources/ # Configurações e propriedades
│   │   └── test/          # Testes unitários
│   ├── pom.xml            # Gerenciamento de dependências
│   ├── docker-compose.yml # Configuração Docker
│   └── .gitignore
│
└── app/                   # Frontend Next.js
    ├── public/            # Arquivos estáticos
    │   └── apae-logo.png  # Logo do projeto
    ├── src/
    │   ├── app/           # Páginas e rotas
    │   ├── components/    # Componentes reutilizáveis
    │   ├── services/      # Integrações com API
    │   ├── styles/        # Estilos globais
    │   └── utils/         # Funções auxiliares
    ├── tsconfig.json      # Configuração TypeScript
    ├── next.config.js     # Configuração Next.js
    └── .gitignore
```

<br />

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, você precisá ter instalado em sua máquina:

| Ferramenta | Versão | Finalidade |
|------------|--------|------------|
| **Node.js** | 18+ | Executar o frontend Next.js |
| **npm** ou **yarn** | - | Gerenciar pacotes do frontend |
| **Docker** | 20+ | Subir o banco de dados PostgreSQL |
| **Java** | 17+ | Compilar e executar o backend Spring Boot |
| **Git** | - | Clonar o repositório |

---

### 1. Clone o repositório

Primeiro, faça o download do código fonte do projeto:

```bash
git clone https://github.com/IFPBEsp/APAE-gestao-escolar.git
```

Acesse a pasta raiz do projeto:

```bash
cd APAE-gestao-escolar
```

---

### 2. Configure e inicie o Backend

Navegue até a pasta da API:

```bash
cd api
```

#### 2.1 Suba o banco de dados com Docker

O comando abaixo inicia o container PostgreSQL configurado no `docker-compose.yml`:

```bash
docker compose up -d
```
**O banco de dados estará disponível em `localhost:5432`**

#### 2.2 Compile o código (opcional)

Caso precise apenas compilar o projeto sem executar:

```bash
./mvnw clean package   # Linux/Mac
mvnw.cmd clean package # Windows
```
> O arquivo `.jar` será gerado na pasta `target/`



**A API estará disponível em:** `http://localhost:8080`

**Documentação Swagger:** `http://localhost:8080/swagger-ui.html`

---

### 3. Configure e inicie o Frontend

Abra um **novo terminal** e navegue até a pasta do frontend:

```bash
cd app
```

#### 3.1 Instale as dependências

```bash
npm install
```
> Este comando baixa todas as bibliotecas necessárias listadas no `package.json`

#### 3.2 Inicie o servidor de desenvolvimento

```bash
npm run dev
```
> O frontend será iniciado em modo desenvolvimento com hot reload

**Acesse: `http://localhost:3000`**

#### 3.3 Compile para produção (opcional)

Caso queira gerar os arquivos estáticos otimizados:

```bash
npm run build
```

Execute a versão compilada:

```bash
npm start
```



## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Siga o passo a passo:

```bash
# 1. Crie uma branch para sua feature
git checkout -b feature/nova-funcionalidade

# 2. Faça commits das suas alterações
git commit -m "feat: adiciona nova funcionalidade"

# 3. Envie para o repositório remoto
git push origin feature/nova-funcionalidade

# 4. Abra um Pull Request no GitHub
```

**Padrões de commit:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação de código
- `refactor:` - Refatoração
- `test:` - Testes
