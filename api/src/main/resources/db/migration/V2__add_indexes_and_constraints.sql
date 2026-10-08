CREATE INDEX IF NOT EXISTS idx_aulas_turma
    ON gestao_escolar.aulas(turma_id);

CREATE INDEX IF NOT EXISTS idx_presencas_aula
    ON gestao_escolar.presencas(aula_id);

CREATE INDEX IF NOT EXISTS idx_turma_aluno_turma
    ON gestao_escolar.turma_aluno(turma_id);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_professor
    ON gestao_escolar.avaliacoes(professor_id);

CREATE INDEX IF NOT EXISTS idx_relatorios_professor
    ON gestao_escolar.relatorios(professor_id);

CREATE INDEX IF NOT EXISTS idx_relatorios_turma
    ON gestao_escolar.relatorios(turma_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_aulas_turma_data'
          AND connamespace = 'gestao_escolar'::regnamespace
    ) THEN
        ALTER TABLE gestao_escolar.aulas
            ADD CONSTRAINT uk_aulas_turma_data
            UNIQUE (turma_id, data);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_turma_aluno_turma_paciente'
          AND connamespace = 'gestao_escolar'::regnamespace
    ) THEN
        ALTER TABLE gestao_escolar.turma_aluno
            ADD CONSTRAINT uk_turma_aluno_turma_paciente
            UNIQUE (turma_id, paciente_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'uk_presencas_aula_paciente'
          AND connamespace = 'gestao_escolar'::regnamespace
    ) THEN
        ALTER TABLE gestao_escolar.presencas
            ADD CONSTRAINT uk_presencas_aula_paciente
            UNIQUE (aula_id, paciente_id);
    END IF;
END $$;
