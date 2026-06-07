CREATE TABLE turmas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255),
    ano_criacao INT,
    turno VARCHAR(50),
    tipo VARCHAR(50),
    is_ativa BOOLEAN,
    professor_id BIGINT
);