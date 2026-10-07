BEGIN;

INSERT INTO apae_geral.enderecos
    (id, cidade, cep, estado, bairro, rua, numero, complemento)
VALUES
    ('b1000000-0000-4000-8000-000000000001', 'Esperanca', '58135-000', 'PB', 'Centro', 'Rua Professor Local', '100', NULL),
    ('b1000000-0000-4000-8000-000000000002', 'Esperanca', '58135-000', 'PB', 'Centro', 'Rua Aluno Local', '200', NULL)
ON CONFLICT DO NOTHING;

INSERT INTO apae_geral.usuarios
    (id, email, cpf, senha, nome_completo, cargo, contato, rg, endereco_id, primeiro_acesso, ativo)
VALUES
    (
        'b2000000-0000-4000-8000-000000000001',
        'professor@teste.local',
        '000.000.020-46',
        '$2y$10$EwPTyxIGnTEnI8CjJ.zYOOTWYgdGCrXYl3ZIbrnGqLUoaw9SQoiBe',
        'Professor Ficticio Local',
        'GESTAO_ESCOLAR',
        '(83) 90000-0020',
        'LOCAL-PROF-ESC-01',
        'b1000000-0000-4000-8000-000000000001',
        FALSE,
        TRUE
    )
ON CONFLICT DO NOTHING;

INSERT INTO apae_geral.pacientes
    (id, nome_completo, naturalidade, data_de_nascimento, contato, cpf, is_aluno, is_apagado, endereco_id)
VALUES
    ('b4000000-0000-4000-8000-000000000001', 'Aluno Ficticio Um', 'Esperanca - PB', DATE '2013-04-12', '(83) 90000-1020', '000.000.120-46', TRUE, FALSE, 'b1000000-0000-4000-8000-000000000002'),
    ('b4000000-0000-4000-8000-000000000002', 'Aluno Ficticio Dois', 'Esperanca - PB', DATE '2015-09-22', '(83) 90000-1021', '000.000.121-27', TRUE, FALSE, 'b1000000-0000-4000-8000-000000000002')
ON CONFLICT DO NOTHING;

INSERT INTO apae_geral.responsaveis
    (id, nome, contato, parentesco, endereco_id, paciente_id)
VALUES
    ('b4100000-0000-4000-8000-000000000001', 'Responsavel Escolar Um', '(83) 90000-2020', 'Mae', NULL, 'b4000000-0000-4000-8000-000000000001'),
    ('b4100000-0000-4000-8000-000000000002', 'Responsavel Escolar Dois', '(83) 90000-2021', 'Pai', NULL, 'b4000000-0000-4000-8000-000000000002')
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.professores
    (id, usuario_id, formacao, data_contratacao, primeiro_acesso, data_nascimento)
VALUES
    (
        'b3000000-0000-4000-8000-000000000001',
        'b2000000-0000-4000-8000-000000000001',
        'Pedagogia',
        CURRENT_DATE - 365,
        FALSE,
        DATE '1990-03-15'
    )
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.turmas
    (id, nome, ano_criacao, turno, tipo, ativa, professor_id)
VALUES
    (
        'b5000000-0000-4000-8000-000000000001',
        'Turma Ficticia A',
        EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
        'MANHA',
        'REGULAR',
        TRUE,
        'b3000000-0000-4000-8000-000000000001'
    )
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.turma_aluno (id, turma_id, paciente_id, ativo)
VALUES
    ('b6000000-0000-4000-8000-000000000001', 'b5000000-0000-4000-8000-000000000001', 'b4000000-0000-4000-8000-000000000001', TRUE),
    ('b6000000-0000-4000-8000-000000000002', 'b5000000-0000-4000-8000-000000000001', 'b4000000-0000-4000-8000-000000000002', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.aulas (id, turma_id, data, descricao)
VALUES
    ('b7000000-0000-4000-8000-000000000001', 'b5000000-0000-4000-8000-000000000001', CURRENT_DATE, 'Aula ficticia de desenvolvimento')
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.presencas (id, aula_id, paciente_id, faltou)
VALUES
    ('b8000000-0000-4000-8000-000000000001', 'b7000000-0000-4000-8000-000000000001', 'b4000000-0000-4000-8000-000000000001', FALSE),
    ('b8000000-0000-4000-8000-000000000002', 'b7000000-0000-4000-8000-000000000001', 'b4000000-0000-4000-8000-000000000002', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.avaliacoes
    (id, professor_id, paciente_id, descricao, data_avaliacao)
VALUES
    (
        'b9000000-0000-4000-8000-000000000001',
        'b3000000-0000-4000-8000-000000000001',
        'b4000000-0000-4000-8000-000000000001',
        'Avaliacao ficticia para desenvolvimento local.',
        CURRENT_TIMESTAMP
    )
ON CONFLICT DO NOTHING;

INSERT INTO gestao_escolar.relatorios
    (id, professor_id, paciente_id, turma_id, atividades, habilidades, estrategias, recursos, created_at)
VALUES
    (
        'ba000000-0000-4000-8000-000000000001',
        'b3000000-0000-4000-8000-000000000001',
        'b4000000-0000-4000-8000-000000000001',
        'b5000000-0000-4000-8000-000000000001',
        'Atividades ficticias',
        'Habilidades ficticias',
        'Estrategias ficticias',
        'Recursos ficticios',
        CURRENT_TIMESTAMP
    )
ON CONFLICT DO NOTHING;

COMMIT;
