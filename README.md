# Eventos Climáticos — Aula 09

API REST para registro e consulta de eventos climáticos, desenvolvida com Node.js, Express e MariaDB.

## Objetivo

Praticar conexão com banco de dados relacional, persistência de dados, arquitetura MVC e operações CRUD.

## Tecnologias

- Node.js
- Express
- MariaDB
- MySQL driver (`mysql`)
- Thunder Client (testes HTTP)

## Modelo de dados (DER)

![(print1)](./mer_der_conceitual.png)

Um usuário pode registrar vários eventos; cada evento pertence a um usuário.

## Diagrama de classes 

![(print1)](./uml_dc.png)

## Instalação e configuração

1. Instale Node.js e MariaDB.
2. Crie o banco e as tabelas executando `db/script.sql` no MariaDB (por exemplo, pelo HeidiSQL ou terminal).
3. No terminal, dentro desta pasta, execute:

   ```bash
   npm install
   ```

4. Configure a conexão. Por padrão, a API usa `localhost`, usuário `root`, senha vazia e banco `registros_climaticos`. Se necessário, defina as variáveis de ambiente `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`.
5. Inicie:

   ```bash
   npm start
   ```

6. Acesse `http://localhost:3000/`. A resposta deve informar que o back-end está respondendo.

> Observação: o script SQL recria o banco do zero e apaga qualquer banco existente com o mesmo nome. Faça backup antes de executá-lo em um banco com dados importantes.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Verifica se a API está ativa |
| POST | `/usuarios` | Cadastra usuário |
| GET | `/usuarios` | Lista usuários (sem senhas) |
| GET | `/usuarios/:id` | Busca usuário |
| PUT | `/usuarios/:id` | Atualiza nome/e-mail e, opcionalmente, senha |
| DELETE | `/usuarios/:id` | Exclui usuário sem eventos associados |
| POST | `/login` | Valida e-mail e senha |
| POST | `/eventos` | Cadastra evento |
| GET | `/eventos` | Lista eventos com nome do usuário |
| GET | `/eventos/:id` | Busca evento |
| PUT | `/eventos/:id` | Atualiza evento |
| DELETE | `/eventos/:id` | Exclui evento |
| GET | `/resumo` | Retorna quantidade e estatísticas de temperatura |

## Exemplos para Thunder Client

Todas as requisições usam `http://localhost:3000`. Para POST e PUT, selecione **Body → JSON**.

### Cadastrar usuário — POST `/usuarios`

```json
{
  "nome": "Carlos Pereira",
  "email": "carlos.pereira@example.com",
  "senha": "senha123"
}
```

### Login — POST `/login`

```json
{
  "email": "carlos.pereira@example.com",
  "senha": "senha123"
}
```

### Cadastrar evento — POST `/eventos`

```json
{
  "usuarioId": 1,
  "cidade": "Campinas",
  "tipoEvento": "Onda de calor",
  "temperaturaMaxima": 38.7,
  "data": "2026-10-22",
  "nivelImpacto": "Alto"
}
```

### Atualizar evento — PUT `/eventos/1`

```json
{
  "usuarioId": 1,
  "cidade": "Campinas",
  "tipoEvento": "Onda de calor",
  "temperaturaMaxima": 39.2,
  "data": "2026-10-22",
  "nivelImpacto": "Alto"
}
```

### Excluir evento — DELETE `/eventos/1`

Sem body.

### Resumo — GET `/resumo`

Exemplo de formato da resposta:

```json
{
  "totalEventos": 5,
  "mediaTemperatura": 25.32,
  "temperaturaMinima": -2.5,
  "temperaturaMaxima": 38.7
}
```

Os valores retornados dependem dos registros atuais no banco.

## Prints dos testes

Salve as capturas reais do Thunder Client nesta pasta: `docs/prints/`. Insira as imagens abaixo quando os testes forem executados.

- `docs/prints/usuarios-post.png` — cadastro de usuário
- `docs/prints/usuarios-get.png` — listagem de usuários
- `docs/prints/eventos-post.png` — cadastro de evento
- `docs/prints/eventos-get.png` — listagem de eventos
- `docs/prints/atualizar.png` — atualização
- `docs/prints/excluir.png` — exclusão
- `docs/prints/login.png` — login
- `docs/prints/resumo.png` — resumo

As imagens não estão incluídas porque precisam ser capturas reais das requisições e respostas executadas no seu computador.

## Entrega no GitHub

Crie o repositório `sesi_pbe1_aula09_eventos_climaticos_2026` e envie o projeto:

```bash
git init
git add .
git commit -m "Projeto Aula 09 - Eventos Climáticos"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/sesi_pbe1_aula09_eventos_climaticos_2026.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu usuário do GitHub. Se o repositório já estiver conectado a outro remoto, confira `git remote -v` antes de adicionar um novo.

## Segurança e limitações

- As senhas de demonstração são armazenadas como SHA-256 para evitar texto puro; em sistemas reais, prefira `bcrypt` ou `argon2` com salt.
- Este projeto didático não implementa tokens/sessões de autenticação.
- Não exponha credenciais reais no repositório.
