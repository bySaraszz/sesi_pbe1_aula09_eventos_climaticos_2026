const con = require('../db');

const listar = (req, res) => {
    const query = 'SELECT * FROM usuario;';

    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar usuarios' });
        } else {
            res.json(results);
        }
    });
};

const cadastrar = (req, res) => {
    const { nome, email, senha } = req.body;
    const query = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, password(?));';

    con.query(query, [nome, email, senha], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao cadastrar usuario' });
        } else {
            res.status(201).json({ message: 'Usuario cadastrado com sucesso', results });
        }
    });
};

const atualizar = (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const query = 'UPDATE usuario SET nome = ?, email = ?, senha = password(?) WHERE id = ?;';

    con.query(query, [nome, email, senha, id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar usuario' });
        } else if (results.affectedRows == 0) {
            res.status(404).json({ error: 'Usuario nao encontrado' });
        } else {
            res.json({ message: 'Usuario atualizado com sucesso' });
        }
    });
};

const excluir = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuario WHERE id = ?;';

    con.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao excluir usuario' });
        } else if (results.affectedRows == 0) {
            res.status(404).json({ error: 'Usuario nao encontrado' });
        } else {
            res.json({ message: 'Usuario excluido com sucesso' });
        }
    });
};

const login = (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT id, nome, email FROM usuario WHERE email = ? AND senha = password(?);';

    con.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao fazer login' });
        } else if (results.length == 0) {
            res.status(404).json({ error: 'Usuario ou senha incorretos' });
        } else {
            res.json(results[0]);
        }
    });
};

module.exports = {
    listar,
    cadastrar,
    atualizar,
    excluir,
    login
};