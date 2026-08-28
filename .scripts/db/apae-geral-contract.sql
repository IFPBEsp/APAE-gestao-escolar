BEGIN;

CREATE SCHEMA IF NOT EXISTS apae_geral;
CREATE SCHEMA IF NOT EXISTS atendimento;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS apae_geral.enderecos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cidade VARCHAR(255) NOT NULL,
    cep VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    rua VARCHAR(255) NOT NULL,
    numero VARCHAR(255) NOT NULL,
    complemento VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS apae_geral.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(255) UNIQUE,
    senha VARCHAR(255),
    nome_completo VARCHAR(255),
    cargo VARCHAR(255) NOT NULL,
    contato VARCHAR(255),
    rg VARCHAR(255) UNIQUE,
    endereco_id UUID REFERENCES apae_geral.enderecos(id),
    primeiro_acesso BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS apae_geral.pacientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo VARCHAR(255) NOT NULL,
    naturalidade VARCHAR(255),
    data_de_nascimento DATE NOT NULL,
    contato VARCHAR(255) NOT NULL,
    cpf VARCHAR(255) UNIQUE,
    is_aluno BOOLEAN NOT NULL DEFAULT FALSE,
    is_apagado BOOLEAN NOT NULL DEFAULT FALSE,
    endereco_id UUID REFERENCES apae_geral.enderecos(id)
);

CREATE TABLE IF NOT EXISTS apae_geral.responsaveis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(255),
    parentesco VARCHAR(255),
    endereco_id UUID REFERENCES apae_geral.enderecos(id),
    paciente_id UUID NOT NULL REFERENCES apae_geral.pacientes(id)
);

COMMIT;
