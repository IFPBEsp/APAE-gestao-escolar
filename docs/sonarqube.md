#  SonarQube – Execução Local (APAE Gestão Escolar)

Guia para subir um servidor SonarQube local, analisar o **backend** (Spring Boot, diretório `api`) e o **frontend** (Next.js, diretório `app`) e interpretar os resultados no painel.

 Este documento segue as diretrizes da **Issue #939** e o padrão de portas adotado pelos repositórios do ecossistema APAE.

---

## 1. Pré-requisitos

| Ferramenta | Versão | Finalidade |
|------------|--------|------------|
| **Docker** | 20+ | Subir o servidor SonarQube e o scanner do frontend |
| **JDK** | 21 | Compilar o backend (Spring Boot / Java 21) |

Observações importantes:

- **Maven não precisa estar instalado.** O projeto utiliza o **Maven Wrapper** (`mvnw` / `mvnw.cmd` no diretório `api`), que baixa a versão correta do Maven automaticamente na primeira execução.
- **Node.js não é necessário na máquina para o frontend.** A análise do frontend roda dentro de um container (`sonarsource/sonar-scanner-cli`), sem exigir npm ou Node instalados localmente.

### Checagem do `vm.max_map_count`

O SonarQube embute um **Elasticsearch**, que exige no mínimo **262144** mapeamentos de memória. Verifique com:

```
sysctl vm.max_map_count
```

Se o valor retornado for inferior a `262144`, ajuste:

```
# Temporário (até reiniciar a máquina)
sudo sysctl -w vm.max_map_count=262144

# Permanente
echo "vm.max_map_count=262144" | sudo tee /etc/sysctl.d/99-sonarqube.conf
sudo sysctl --system
```

💡 **WSL2 (Windows):** o ajuste deve ser feito dentro do WSL (adicione `vm.max_map_count=262144` em `/etc/sysctl.conf` e reinicie o WSL com `wsl --shutdown`).

---

## 2. Subir o servidor

### ⚠️ Antes de subir: verifique as portas

Portas ocupadas por instâncias anteriores causam erro de bind. Liste os containers em execução e encerre instâncias antigas do SonarQube antes de continuar:

```
docker ps
```

Se houver um container `sonarqube-gestao-escolar` (ou de outro produto APAE) rodando, pare-o:

```
docker compose -f docker-compose.sonar.yml down
```

### Subir o servidor

A partir da **raiz do repositório**:

```
SONAR_PORT=9502 docker compose -f docker-compose.sonar.yml up
```

### Por que a porta 9502?

O ecossistema APAE define **uma porta fixa por produto**, permitindo que os três servidores SonarQube rodem **simultaneamente** na mesma máquina:

| Produto | Porta |
|---------|-------|
| APAE Geral | **9500** |
| APAE Atendimento | **9501** |
| **APAE Gestão Escolar** | **9502** |

Além disso, o MinIO do ambiente de desenvolvimento local usa as portas `9000`/`9001` — como o SonarQube escuta internamente na `9000`, o remapeamento para `9502` evita conflito direto com o MinIO.

⚠️ **Não use a flag `--remove-orphans`** neste comando. O Docker pode interpretar containers de outros projetos compose ativos (os servidores Sonar do Geral/Atendimento, ou o PostgreSQL/MinIO do desenvolvimento) como "órfãos" e **removê-los**, derrubando serviços que nada têm a ver com este repositório.

O primeiro start demora alguns minutos (download da imagem + inicialização do Elasticsearch). Acompanhe o log e aguarde a mensagem final:

```
SonarQube is operational
```

Somente depois dessa mensagem o servidor está pronto para receber análises.

---

## 3. Gerar o token

### 1. Primeiro login

Acesse `http://localhost:9502` e faça login com as credenciais padrão:

| Usuário | Senha |
|---------|-------|
| `admin` | `admin` |

O SonarQube **exige a troca imediata da senha** no primeiro acesso. Defina uma senha com:

- **Mínimo de 12 caracteres**;
- Diferente de `admin`.

Guarde essa senha — ela será pedida nas próximas execuções.

### 2. Gerar o token

Navegue até **My Account → Security** (ícone do usuário no canto superior direito → *My Account* → aba *Security*):

1. Em **Generate Tokens**, dê um nome ao token (ex.: `analise-local`);
2. No campo de tipo, selecione **"Token de usuário" (User Token)**;
3. Clique em **Generate** e copie o valor exibido (começa com `squ_`).

⛔ **Atenção técnico:** **não utilize a opção "Project Analysis Token"**. Esse tipo de token é vinculado a um projeto já existente no servidor e **falha na 1ª execução**, pois o projeto ainda não existe no SonarQube no momento da primeira análise. Use sempre o **Token de usuário**, que tem permissão para criar o projeto automaticamente.

### 3. Exportar o token

Exporte o token como variável de ambiente no terminal onde rodará as análises:

```
export SONAR_TOKEN="squ_seu_token_aqui"
```

💡 A variável `SONAR_TOKEN` é usada tanto pelo Maven (backend) quanto pelo script do frontend. Ela vale apenas na sessão atual do terminal — exporte novamente ao abrir um novo terminal.

---

## 4. Analisar o backend

O backend fica no diretório **`api`** (Spring Boot / Java 21). A partir dele, execute:

```
cd api
./mvnw clean verify sonar:sonar -Dmaven.test.skip=true -Dsonar.host.url=http://localhost:9502
```

### Explicação dos parâmetros

| Parâmetro | Função |
|-----------|--------|
| `clean verify` | Limpa `target/` e executa a fase `verify` do Maven, **compilando o projeto e gerando os `.class` em `target/classes`** — material que o scanner de Java precisa para analisar o código. |
| `-Dmaven.test.skip=true` | Flag **temporária e necessária** neste momento por dois motivos: (1) o `MinioConnectionTest` tenta uma conexão externa (MinIO) e derruba a fase `verify`, impedindo que o goal `sonar:sonar` encadeado seja executado; (2) classes da suíte unitária, como `AuthControllerTest`, apresentam falha de compilação em `testCompile` (`cannot find symbol: AuthService`), o que também bloqueia a execução dos testes. O `-Dmaven.test.skip=true` pula **a compilação e execução dos testes quebrados**, garantindo a geração limpa dos binários da aplicação principal em `target/classes` — material que o scanner de Java precisa para analisar o código no SonarQube. Esta flag **sairá do comando assim que a issue de integração do JaCoCo deste módulo for concluída e a suíte for destravada**. |
| `-Dsonar.host.url=http://localhost:9502` | Direciona a análise para a **porta 9502 deste repositório**. Sem essa flag, o Maven usaria o valor padrão do `pom.xml` (`http://localhost:9500`), que pertence ao produto APAE Geral. |

ℹ️ A chave do projeto backend (`apae-gestao-escolar-backend`), o nome, o caminho do relatório JaCoCo e as exclusões de cobertura já estão configurados no `api/pom.xml` — não é necessário passá-los por linha de comando.

A primeira execução baixa o plugin `sonar-maven-plugin` e o envio do relatório pode levar alguns minutos. Ao final, o log exibe o link do painel do projeto.

---

## 5. Analisar o frontend

A análise do frontend é feita a partir da **raiz do repositório**, com o script dedicado:

```
SONAR_HOST_URL=http://localhost:9502 ./.scripts/sonar-scan-frontend.sh
```

Requisitos:

- A variável **`SONAR_TOKEN` deve estar exportada** (Seção 3) — o script aborta sem ela;
- A variável **`SONAR_HOST_URL` deve apontar para a porta 9502** — sem ela, o script cai no padrão `http://localhost:9500` (APAE Geral) e a análise vai para o servidor errado.

### Como o script funciona

O script `.scripts/sonar-scan-frontend.sh` roda o **`sonar-scanner-cli` em container Docker** (`sonarsource/sonar-scanner-cli`), montando o diretório **`app`** do repositório dentro do container (`/usr/src`) e usando a rede do host (`--network host`) para alcançar o servidor em `localhost:9502`.

ℹ️ As configurações do projeto frontend (chave `apae-gestao-escolar-frontend`, fontes em `src`, testes e caminho do relatório LCOV) estão em `app/sonar-project.properties`.

---

## 6. Ler o painel

Após as duas análises, acesse:

**`http://localhost:9502/projects`**

Você encontrará dois projetos:

| Projeto | Chave |
|---------|-------|
| Backend (Spring Boot) | `apae-gestao-escolar-backend` |
| Frontend (Next.js) | `apae-gestao-escolar-frontend` |

### As 5 categorias de métricas

Cada projeto exibe os resultados organizados em cinco categorias:

| Categoria | O que mede | Como ler |
|-----------|------------|----------|
| **Security** | Vulnerabilidades no código (injeção, dados sensíveis expostos, criptografia fraca etc.) | Nota de **A** (melhor) a **E**. Qualquer nota abaixo de A merece atenção imediata. |
| **Reliability** | Bugs potenciais — trechos que certamente vão falhar em runtime (NPE, recursos não fechados, lógica invertida etc.) | Nota de **A** a **E**. |
| **Maintainability** | Código confuso ou mal estruturado que dificulta manutenção (complexidade, funções longas, código morto etc.) | Nota de **A** a **E**. |
| **Security Hotspot** | Pontos que **podem** ser um risco de segurança, mas exigem **revisão humana** (ex.: senha padrão, CORS permissivo). Não é bug confirmado — é alerta para revisar | Liste os hotspots e marque cada um como **Safe** (justificando) ou resolva o problema. |
| **Duplications** | Percentual de linhas duplicadas entre arquivos | Quanto menor, melhor. Duplicação alta indica necessidade de extrair funções/componentes reutilizáveis. |

💡 Explore também as abas **Issues** (por severidade) e **Measures** (detalhamento numérico) dentro de cada projeto.

---

## 7. Cobertura

Neste momento, os dois projetos exibem **cobertura baixa ou zerada**. Isso é esperado e tem causas conhecidas:

### Backend (`-Dmaven.test.skip=true`)

A análise do backend roda com `-Dmaven.test.skip=true` por causa do `MinioConnectionTest`, que tenta conexão externa com o MinIO e derruba a fase `verify`, e das falhas de compilação em `testCompile` da suíte unitária (ex.: `AuthControllerTest` — `cannot find symbol: AuthService`) (detalhes na Seção 4). Com essa flag, a compilação e execução dos testes são puladas para garantir a geração limpa dos binários da aplicação principal em `target/classes`. Sem testes, o **JaCoCo não gera o relatório** (`target/site/jacoco/jacoco.xml`) e o SonarQube não recebe nenhum dado de cobertura. A cobertura volta a ser reportada quando a issue de integração do JaCoCo deste módulo for concluída, a suíte for destravada e a flag sair do comando.

### Frontend (aguardando `coverage/lcov.info`)

O `app/sonar-project.properties` já aponta para `sonar.javascript.lcov.reportPaths=coverage/lcov.info`, mas esse arquivo **ainda não é gerado** pela suíte de testes do frontend. Enquanto o relatório LCOV não existir, a cobertura do frontend permanece em 0.0%.

### Por que o Quality Gate exibe "Passed" mesmo com 0.0%?

O Quality Gate padrão (**Sonar way**) avalia a cobertura **apenas sobre o Novo Código** (código alterado nas últimas análises / novo em relação ao baseline). Como não há relatório de cobertura, **não existe valor de cobertura para o novo código** — a condição fica **sem dado** e, portanto, **não falha**. Resultado: o gate aparece como **"Passed"** mesmo com 0.0% de cobertura geral.

⚠️ **"Passed" aqui não significa "qualidade aprovada"** — significa apenas que a condição de cobertura não pôde ser avaliada. Não trate o gate verde como garantia de qualidade enquanto os relatórios de cobertura não estiverem sendo gerados.

---

## 8. Encerrar e limpar

A partir da **raiz do repositório**:

### Opção 1 — `down` (recomendado para o dia a dia)

```
docker compose -f docker-compose.sonar.yml down
```

- Para e remove os containers, **mantendo os volumes** (`sonarqube_data`, `sonarqube_extensions`, `sonarqube_logs`);
- Projetos, histórico de análises, plugins e a **senha do admin que você definiu** permanecem salvos;
- Na próxima execução, o servidor sobe com tudo no lugar.

### Opção 2 — `down -v` (reset completo)

```
docker compose -f docker-compose.sonar.yml down -v
```

- Além dos containers, **apaga todos os volumes**;

⚠️ **Cuidado:** o `down -v` apaga projetos, histórico de análises, plugins instalados **e a senha do admin** — no próximo start, o login volta a ser `admin`/`admin` e toda a configuração será refeita do zero. Use apenas quando quiser um reset completo do servidor.

---
