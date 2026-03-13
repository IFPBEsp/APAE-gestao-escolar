# 📘 Documentação Técnica – Funções do Banco de Dados

**Projeto:** Sistema de Gestão Escolar APAE  
**Banco de Dados:** PostgreSQL  
**Retorno das funções:** JSON

---

## 🐳 Acessando o Banco Local (Docker)

Após subir o container Docker, você pode acessar o PostgreSQL com:

```bash
docker exec -it apae-gestao-escolar-db-1 psql -U apae_user -d apae_db
```

> 💡 **Dica:** O nome do container pode variar. Use `docker ps` para listar os containers em execução e identificar o nome correto.

---

## ⚙️ Como as funções são criadas hoje

- As funções **não precisam mais ser executadas manualmente** no DBeaver ou via `psql`.
- Ao iniciar o backend Spring Boot, o **Flyway** executa automaticamente o script de migração:
  - `api/src/main/resources/db/migration/V1__create_functions.sql`
- Esse script contém as funções:
  - `get_chamada_por_turma_e_data`
  - `listar_professores_com_turmas`
  - `public.listar_turmas_otimizado`

> ✅ Isso garante que, em qualquer ambiente novo, basta subir o backend que as funções serão criadas/atualizadas automaticamente.

Se você quiser apenas **verificar** se as funções existem no banco, dentro do `psql` execute, por exemplo:

```sql
\df+ get_chamada_por_turma_e_data
\df+ listar_professores_com_turmas
\df+ listar_turmas_otimizado
```

---

## 🎥 Vídeo Auxiliar

[**Assista ao tutorial no YouTube**](https://www.youtube.com/watch?v=Z79Swlhwmm0)

---

# 1️⃣ Função: get_chamada_por_turma_e_data

## 📌 Objetivo
Responsável por buscar a chamada (presença) de uma turma em uma data específica.

Essa função centraliza todas as informações necessárias para exibir a tela de chamada.

## 🎯 Por que usamos essa função?
- Evita múltiplas consultas no backend
- Retorna todos os dados organizados em um único JSON
- Melhora performance
- Centraliza regra de presença no banco

## 📥 Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|------------|
| p_turma_id | BIGINT | ID da turma |
| p_data | DATE | Data da aula |

## 📤 Retorno

JSON contendo:

- turmaId
- turmaNome
- dataChamada
- descricao da aula
- totalAlunosNaTurma
- totalPresentes
- listaPresencas (com status PRESENTE ou FALTA)

## 🧠 Regras aplicadas

- Valida se a turma existe
- Considera apenas alunos ativos
- Organiza lista por nome do aluno

## 💻 Código da Função

```sql
CREATE OR REPLACE FUNCTION get_chamada_por_turma_e_data(
    p_turma_id BIGINT,
    p_data DATE
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_result JSON;
    v_turma_existe BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM turmas WHERE id = p_turma_id) INTO v_turma_existe;
    
    IF NOT v_turma_existe THEN
        RAISE EXCEPTION 'Turma não encontrada com id: %', p_turma_id;
    END IF;

    WITH turma_info AS (
        SELECT t.id as turma_id, t.nome as turma_nome
        FROM turmas t
        WHERE t.id = p_turma_id
    ),
    aula_info AS (
        SELECT a.id as aula_id, a.descricao
        FROM aulas a
        WHERE a.turmas_id = p_turma_id 
          AND a.data_da_aula = p_data
        LIMIT 1
    ),
    alunos_ativos AS (
        SELECT a.id as aluno_id, a.nome as aluno_nome
        FROM turma_aluno ta
        INNER JOIN alunos a ON ta.aluno_id = a.id
        WHERE ta.turma_id = p_turma_id
          AND ta.is_aluno_ativo = true
    ),
    presencas_aula AS (
        SELECT p.alunos_id as aluno_id, p.id as presenca_id, p.faltou
        FROM presencas p
        INNER JOIN aulas au ON p.aulas_id = au.id
        WHERE au.turmas_id = p_turma_id
          AND au.data_da_aula = p_data
    )
    SELECT json_build_object(
        'turmaId', ti.turma_id,
        'turmaNome', ti.turma_nome,
        'dataChamada', p_data,
        'descricao', ai.descricao,
        'totalAlunosNaTurma', (SELECT COUNT(*) FROM alunos_ativos),
        'totalPresentes', (
            SELECT COUNT(*) 
            FROM alunos_ativos aa
            LEFT JOIN presencas_aula pa ON aa.aluno_id = pa.aluno_id
            WHERE COALESCE(pa.faltou, false) = false
        ),
        'listaPresencas', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'alunoId', aa.aluno_id,
                    'alunoNome', aa.aluno_nome,
                    'presencaId', pa.presenca_id,
                    'status', CASE 
                        WHEN COALESCE(pa.faltou, false) = true THEN 'FALTA'
                        ELSE 'PRESENTE'
                    END
                )
                ORDER BY aa.aluno_nome
            ), '[]'::json)
            FROM alunos_ativos aa
            LEFT JOIN presencas_aula pa ON aa.aluno_id = pa.aluno_id
        )
    ) INTO v_result
    FROM turma_info ti
    LEFT JOIN aula_info ai ON true;

    RETURN v_result;
END;
$$;
```

---

# 2️⃣ Função: listar_professores_com_turmas

## 📌 Objetivo
Listar professores com filtros opcionais, incluindo as turmas vinculadas a cada professor.

## 🎯 Por que usamos essa função?

- Permite filtros dinâmicos
- Retorna professores com suas turmas agregadas
- Reduz múltiplas consultas no backend
- Melhora performance

## 📥 Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|------------|
| p_id | BIGINT | Filtra por ID |
| p_nome | VARCHAR | Filtra por nome |
| p_cpf | VARCHAR | Filtra por CPF |
| p_email | VARCHAR | Filtra por email |
| p_ativo | BOOLEAN | Filtra por status ativo |

## 📤 Retorno

Lista JSON contendo:

- id
- nome
- cpf
- email
- telefone
- formacao
- dataContratacao
- ativo
- turmas (array com nomes das turmas)

## 🧠 Observações

- Caso o professor não tenha turmas, retorna array vazio
- Ordenação por nome
- Filtros opcionais (podem ser nulos)

## 💻 Código da Função

```sql
CREATE OR REPLACE FUNCTION listar_professores_com_turmas(
    p_id BIGINT DEFAULT NULL,
    p_nome VARCHAR DEFAULT NULL,
    p_cpf VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_ativo BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_result JSON;
BEGIN
    WITH professores_filtrados AS (
        SELECT 
            p.id,
            p.nome,
            p.cpf,
            p.email,
            p.telefone,              
            p.formacao,              
            p.data_contratacao,   
            p.data_nascimento,
            p.endereco,
            p.ativo
        FROM professores p
        WHERE 
            (p_id IS NULL OR p.id = p_id)
            AND (p_nome IS NULL OR LOWER(p.nome) LIKE LOWER('%' || p_nome || '%'))
            AND (p_cpf IS NULL OR p.cpf = p_cpf)
            AND (p_email IS NULL OR LOWER(p.email) LIKE LOWER('%' || p_email || '%'))
            AND (p_ativo IS NULL OR p.ativo = p_ativo)
        ORDER BY p.nome
    ),
    professores_com_turmas AS (
        SELECT 
            pf.id,
            pf.nome,
            pf.cpf,
            pf.email,
            pf.telefone,             
            pf.formacao,             
            pf.data_contratacao,
            pf.data_nascimento,    
            pf.endereco,        
            pf.ativo,
            COALESCE(
                json_agg(t.nome ORDER BY t.nome) FILTER (WHERE t.nome IS NOT NULL),
                '[]'::json
            ) AS turmas
        FROM professores_filtrados pf
        LEFT JOIN turmas t ON t.professor_id = pf.id
        GROUP BY pf.id, pf.nome, pf.cpf, pf.email, pf.telefone, pf.formacao, pf.data_contratacao,pf.data_nascimento, pf.endereco, pf.ativo
    )
    SELECT COALESCE(
        json_agg(
            json_build_object(
                'id', id,
                'nome', nome,
                'cpf', cpf,
                'email', email,
                'telefone', telefone,                    
                'formacao', formacao,                    
                'dataContratacao', data_contratacao,
                'dataNascimento', data_nascimento, 
                'endereco', endereco,
                'ativo', ativo,
                'turmas', turmas
            )
            ORDER BY nome
        ),
        '[]'::json
    ) INTO v_result
    FROM professores_com_turmas;

    RETURN v_result;
END;
$$;
```

---

# 3️⃣ Função: listar_turmas_otimizado

## 📌 Objetivo
Listar turmas com filtros opcionais e retornar dados agregados como quantidade de alunos.

## 🎯 Por que usamos essa função?

- Evita N+1 queries no backend
- Melhora performance
- Centraliza contagem de alunos no banco
- Permite filtros flexíveis

## 📥 Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|------------|
| p_id | BIGINT | Filtra por ID da turma |
| p_nome | VARCHAR | Filtra por nome |
| p_ano_criacao | INTEGER | Filtra por ano |
| p_turno | VARCHAR | Filtra por turno |
| p_tipo | VARCHAR | Filtra por tipo |
| p_is_ativa | BOOLEAN | Filtra por status |
| p_professor_id | BIGINT | Filtra por professor |

## 📤 Retorno

Lista JSON contendo:

- id
- nome
- anoCriacao
- turno
- tipo
- isAtiva
- professorNome
- totalAlunos
- totalAlunosAtivos
- horario (gerado dinamicamente com base no turno)

## 🧠 Regras aplicadas

- Usa LEFT JOIN LATERAL para melhor performance
- Usa filtros opcionais
- Retorna array vazio caso não existam registros

## 💻 Código da Função

```sql
CREATE OR REPLACE FUNCTION public.listar_turmas_otimizado(p_id bigint DEFAULT NULL::bigint, p_nome character varying DEFAULT NULL::character varying, p_ano_criacao integer DEFAULT NULL::integer, p_turno character varying DEFAULT NULL::character varying, p_tipo character varying DEFAULT NULL::character varying, p_is_ativa boolean DEFAULT NULL::boolean, p_professor_id bigint DEFAULT NULL::bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
v_result JSON;
BEGIN
SELECT COALESCE(
               json_agg(
                       json_build_object(
                               'id', t.id,
                               'nome', t.nome,
                               'anoCriacao', t.ano_criacao,
                               'turno', t.turno,
                               'tipo', t.tipo,
                               'isAtiva', t.is_ativa,
                               'professorNome', p.nome,
                               'professorId', t.professor_id,
                               'totalAlunos', COALESCE(stats.total, 0),
                               'totalAlunosAtivos', COALESCE(stats.ativos, 0),
                               'horario', CASE
                                              WHEN UPPER(t.turno) = 'MANHA' THEN 'Segunda a Sexta - 8h as 12h'
                                              WHEN UPPER(t.turno) = 'TARDE' THEN 'Segunda a Sexta - 14h as 18h'
                                              ELSE 'Horário não definido'
                                   END
                       )
                           ORDER BY t.nome
               ),
               '[]'::json
       ) INTO v_result
FROM turmas t
         LEFT JOIN professores p ON t.professor_id = p.id
         LEFT JOIN LATERAL (
    SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_aluno_ativo = true) as ativos
    FROM turma_aluno ta
    WHERE ta.turma_id = t.id
        ) stats ON true
WHERE
    (p_id IS NULL OR t.id = p_id)
  AND (p_nome IS NULL OR LOWER(t.nome) LIKE LOWER('%' || p_nome || '%'))
  AND (p_ano_criacao IS NULL OR t.ano_criacao = p_ano_criacao)
  AND (p_turno IS NULL OR LOWER(t.turno) = LOWER(p_turno))
  AND (p_tipo IS NULL OR LOWER(t.tipo) LIKE LOWER('%' || p_tipo || '%'))
  AND (p_is_ativa IS NULL OR t.is_ativa = p_is_ativa)
  AND (p_professor_id IS NULL OR t.professor_id = p_professor_id);

RETURN v_result;
END;
$function$
```

---

# 🎯 Estratégia Arquitetural

As funções foram criadas com foco em:

- **Performance**: Consultas otimizadas e agregadas no banco
- **Redução de múltiplas queries**: Evita N+1 no backend
- **Centralização de regras**: Lógica de negócio no banco
- **Retorno estruturado**: Dados em JSON prontos para a API
- **Facilidade de integração**: Compatível com Spring Boot

---

# 📌 Conclusão

O uso de funções no PostgreSQL permite:

- Melhor organização da lógica
- Consultas otimizadas
- Menor carga no backend
- Melhor manutenção do sistema

---

### ✅ Verificação das Funções

Após executar as funções, teste com:

```sql
-- Testar listagem de turmas
SELECT listar_turmas_otimizado();

-- Testar listagem de professores
SELECT listar_professores_com_turmas();

-- Testar chamada (substitua 1 pela ID de uma turma existente)
SELECT get_chamada_por_turma_e_data(1, CURRENT_DATE);
```

---

### ⚠️ Nota de Segurança

As credenciais do banco de dados (usuário/senha) e demais configurações sensíveis **não devem ser versionadas**. Utilize variáveis de ambiente ou arquivos `.env` ignorados pelo Git para gerenciar essas informações em desenvolvimento e produção.

