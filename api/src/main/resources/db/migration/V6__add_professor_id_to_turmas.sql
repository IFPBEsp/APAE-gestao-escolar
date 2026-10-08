ALTER TABLE gestao_escolar.turmas
    ADD COLUMN IF NOT EXISTS professor_id UUID;

ALTER TABLE gestao_escolar.turmas
    ADD CONSTRAINT fk_turma_professor
    FOREIGN KEY (professor_id)
    REFERENCES gestao_escolar.professores(id);

CREATE INDEX IF NOT EXISTS idx_turmas_professor
    ON gestao_escolar.turmas(professor_id);