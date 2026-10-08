CREATE SCHEMA IF NOT EXISTS gestao_escolar;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabelas

CREATE TABLE gestao_escolar.professores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID NOT NULL UNIQUE,
    formacao VARCHAR(255),
    data_contratacao DATE,
    primeiro_acesso BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_prof_usuario FOREIGN KEY (usuario_id) REFERENCES apae_geral.usuarios(id)
);

CREATE TABLE gestao_escolar.turmas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL, ano_criacao INTEGER,
    turno VARCHAR(50), tipo VARCHAR(50),
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE gestao_escolar.aulas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    turma_id UUID NOT NULL,
    data DATE NOT NULL,
    descricao TEXT,
    CONSTRAINT fk_aula_turma FOREIGN KEY (turma_id) REFERENCES gestao_escolar.turmas(id)
);

CREATE TABLE gestao_escolar.turma_aluno (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    turma_id UUID NOT NULL,
    paciente_id UUID NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_ta_turma FOREIGN KEY (turma_id) REFERENCES gestao_escolar.turmas(id),
    CONSTRAINT fk_ta_paciente FOREIGN KEY (paciente_id) REFERENCES apae_geral.pacientes(id)
);

CREATE TABLE gestao_escolar.presencas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    aula_id UUID NOT NULL,
    paciente_id UUID NOT NULL,
    faltou BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_presenca_aula FOREIGN KEY (aula_id) REFERENCES gestao_escolar.aulas(id),
    CONSTRAINT fk_presenca_paciente FOREIGN KEY (paciente_id) REFERENCES apae_geral.pacientes(id)
);

CREATE TABLE gestao_escolar.avaliacoes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    professor_id UUID NOT NULL,
    paciente_id UUID NOT NULL,
    descricao TEXT,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_avaliacao_prof FOREIGN KEY (professor_id) REFERENCES gestao_escolar.professores(id),
    CONSTRAINT fk_avaliacao_paciente FOREIGN KEY (paciente_id) REFERENCES apae_geral.pacientes(id)
);

CREATE TABLE gestao_escolar.relatorios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    professor_id UUID NOT NULL,
    paciente_id UUID NOT NULL,
    turma_id UUID NOT NULL,
    atividades TEXT,
    habilidades TEXT,
    estrategias TEXT,
    recursos TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_relatorio_prof FOREIGN KEY (professor_id) REFERENCES gestao_escolar.professores(id),
    CONSTRAINT fk_relatorio_paciente FOREIGN KEY (paciente_id) REFERENCES apae_geral.pacientes(id),
    CONSTRAINT fk_relatorio_turma FOREIGN KEY (turma_id) REFERENCES gestao_escolar.turmas(id)
);

-- Fks

CREATE INDEX idx_ta_paciente ON gestao_escolar.turma_aluno(paciente_id);
CREATE INDEX idx_presenca_paciente ON gestao_escolar.presencas(paciente_id);
CREATE INDEX idx_avaliacao_paciente ON gestao_escolar.avaliacoes(paciente_id);
CREATE INDEX idx_relatorio_paciente ON gestao_escolar.relatorios(paciente_id);

-- View de aluno

CREATE VIEW gestao_escolar.alunos_view AS
SELECT
    id, nome_completo, cpf, data_de_nascimento,
    contato, endereco_id, is_aluno, is_apagado
FROM apae_geral.pacientes
WHERE is_aluno = true AND is_apagado = false;