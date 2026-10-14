# Execução Local do SonarQube

Este documento fornece as instruções para configurar e executar a análise estática de código com o SonarQube localmente, abrangendo tanto o frontend quanto o backend do repositório de Gestão Escolar da APAE.

## 1. Pré-requisitos

* Docker 20+ para subir o SonarQube e executar scanners em containers.
* JDK 21 para compilação do backend quando necessário (o projeto usa Maven Wrapper no diretório `api`).
* Verificação do vm.max_map_count: o SonarQube inclui Elasticsearch, que exige pelo menos 262144.

Comando para checar:

```
sysctl vm.max_map_count
```

Ajuste temporário:

```
sudo sysctl -w vm.max_map_count=262144
```

Para aplicar permanentemente:

```
echo "vm.max_map_count=262144" | sudo tee /etc/sysctl.d/99-sonarqube.conf
sudo sysctl --system
```

## 2. Subir o servidor

* Antes de iniciar, verifique containers em execução e finalize instâncias antigas que possam conflitar:

```
docker ps
```

* A partir da raiz do repositório, iniciar o servidor SonarQube:

```
docker compose -f docker-compose.sonar.yml up
```

* Atenção sobre containers órfãos: a opção `--remove-orphans` pode causar remoção de containers de outros projetos compose indevidamente; usar com cautela e somente quando tiver certeza do impacto.

* Aguarde até o log exibir a linha: "SonarQube is operational". O primeiro start baixa imagens e inicializa o Elasticsearch, o que pode levar alguns minutos.

## 3. Gerar o token

* Acesse http://localhost:9500 e efetue o primeiro login com as credenciais padrão: `admin` / `admin`.
* O SonarQube solicita a troca obrigatória da senha no primeiro acesso. Defina uma senha com no mínimo 12 caracteres e diferente de `admin`.
* Preferência: gere um Token de usuário (User Token) em My Account → Security. NÃO use o "Project Analysis Token" — esse tipo de token é vinculado a um projeto já existente e falha na primeira execução quando o projeto ainda não existe.
* Após gerar, copie o token (começa com `squ_...`) e exporte na sessão onde rodará as análises:

```
export SONAR_TOKEN="squ_seu_token_aqui"
```

* Observação: o comando `docker compose -f docker-compose.sonar.yml down -v` apaga volumes e reseta a instalação; entre os efeitos está o reset da senha administrativa para `admin`/`admin`.

## 4. Analisar o backend

* Diretório do backend: `api`.
* Comandos a executar (a partir da raiz do repositório):

```
cd api
./mvnw clean verify sonar:sonar -Dmaven.test.skip=true
cd ..
```

* Justificativa técnica:
  * A fase `verify` do Maven compila o projeto e gera os artefatos em `target/classes` — estes `.class` são necessários para a análise estática Java que o SonarQube realiza.
  * A flag `-Dmaven.test.skip=true` é utilizada temporariamente porque testes conhecidos (por exemplo `MinioConnectionTest`) tentam conexões externas e provocam falhas na fase de testes, e há erros de compilação em classes de teste da suíte (ex.: `AuthControllerTest`), impedindo que a execução de testes e a geração de relatórios JaCoCo ocorram corretamente. Pular os testes garante a geração dos binários da aplicação principal para que o scanner Java possa analisar o código. Essa prática é temporária até a resolução da issue de integração do JaCoCo e a estabilização da suíte de testes.
  * Não inclua parâmetros de host ou URL do Sonar na linha de comando; a análise deve usar as configurações locais conforme o ambiente.

## 5. Analisar o frontend

* Comando a partir da raiz do repositório:

```
./.scripts/sonar-scan-frontend.sh
```

* O script executa o `sonar-scanner` dentro de um container Docker e monta o diretório do frontend (`app`) do repositório dentro do container para que os arquivos de código e os relatórios de cobertura (por exemplo, `coverage/lcov.info`) fiquem acessíveis ao scanner.
* Certifique-se de que o `SONAR_TOKEN` esteja exportado na sessão onde o script será executado.

## 6. Ler o painel

* Acesse o painel de projetos em: http://localhost:9500/projects
* Chaves de projeto esperadas neste servidor local:
  * `apae-gestao-escolar-backend`
  * `apae-gestao-escolar-frontend`
* Métricas principais a observar:
  * Security
  * Reliability
  * Maintainability
  * Security Hotspot
  * Duplications

## 7. Cobertura

* Backend: a cobertura aparece zerada enquanto a análise do backend for executada com `-Dmaven.test.skip=true`, pois essa opção impede a execução/geração dos relatórios JaCoCo (por exemplo `target/site/jacoco/jacoco.xml`); sem esse relatório o SonarQube não recebe dados de cobertura.
* Frontend: a cobertura aparece zerada enquanto o arquivo `coverage/lcov.info` não existir; o scanner do frontend depende desse arquivo para enviar métricas de cobertura.
* Observação técnica: a ausência de relatório de cobertura pode fazer com que certas condições do Quality Gate fiquem sem dados e não causem falha imediata; isso não substitui a necessidade de restaurar a geração de relatórios para avaliação completa.

## 8. Encerrar e limpar

* Parar containers mantendo volumes (recomendado):

```
docker compose -f docker-compose.sonar.yml down
```

* Parar e remover volumes (reset completo):

```
docker compose -f docker-compose.sonar.yml down -v
```

* Alerta: usar `down -v` apaga volumes do SonarQube, removendo projetos, histórico de análises, plugins instalados e a senha administrativa definida. Após `down -v`, o login administrativo volta a ser `admin`/`admin` e toda a configuração local é perdida.

