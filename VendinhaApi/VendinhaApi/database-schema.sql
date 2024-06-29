-- Criação do banco de dados
CREATE DATABASE vendinha;

-- Criação da tabela cliente
CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    data_nascimento DATE NOT NULL,
    email VARCHAR(255)
);

CREATE SEQUENCE hibernate_sequence START 1;

-- Criação da tabela divida
CREATE TABLE divida (
    id SERIAL PRIMARY KEY,
    valor DECIMAL(10, 2) NOT NULL,
    esta_paga BOOLEAN NOT NULL,
    data_criacao TIMESTAMP NOT NULL,
    data_pagamento TIMESTAMP,
    descricao TEXT,
    cliente_id INT NOT NULL REFERENCES cliente(id)
);
