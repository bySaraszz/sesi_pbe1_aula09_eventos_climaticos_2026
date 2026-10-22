DROP DATABASE IF EXISTS registros_climaticos;
CREATE DATABASE registros_climaticos
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE registros_climaticos;

CREATE TABLE usuario (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE evento (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  cidade VARCHAR(100) NOT NULL,
  tipoEvento VARCHAR(100) NOT NULL,
  temperaturaMaxima DECIMAL(10,2) NOT NULL,
  data DATE NOT NULL,
  nivelImpacto ENUM('Baixo', 'Médio', 'Alto') NOT NULL DEFAULT 'Médio',
  CONSTRAINT fk_registra FOREIGN KEY (usuarioId)
    REFERENCES usuario(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Senhas de demonstração armazenadas com SHA2 para não manter o texto puro.
INSERT INTO usuario (nome, email, senha) VALUES
('Maria Oliveira', 'maria.oliveira@email.com', SHA2('senha123', 256)),
('João Silva', 'joao.silva@email.com', SHA2('senha123', 256)),
('Ana Souza', 'ana.souza@email.com', SHA2('senha123', 256));

INSERT INTO evento
(usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto) VALUES
(1, 'Campinas', 'Onda de calor', 38.7, '2026-09-23', 'Alto'),
(2, 'São Paulo', 'Chuva intensa', 25.3, '2026-09-24', 'Médio'),
(1, 'Rio de Janeiro', 'Tempestade', 30.1, '2026-09-25', 'Alto'),
(2, 'Belo Horizonte', 'Seca prolongada', 35.0, '2026-09-26', 'Alto'),
(3, 'Porto Alegre', 'Nevasca', -2.5, '2026-09-27', 'Médio');

SELECT id, nome, email FROM usuario;
SELECT * FROM evento;
