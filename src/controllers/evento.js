const con = require('../db');

const listar = (req, res) => {
    const query = 'SELECT * FROM evento;';

    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar eventos' });
        } else {
            res.json(results);
        }
    });
};

const cadastrar = (req, res) => {
    const { usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto } = req.body;

    const query = `
        INSERT INTO evento (usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    con.query(query, [usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao cadastrar evento' });
        } else {
            res.status(201).json({ message: 'Evento cadastrado com sucesso', results });
        }
    });
};

const atualizar = (req, res) => {
    const { id } = req.params;
    const { usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto } = req.body;

    const query = `
        UPDATE evento
        SET usuarioId = ?, cidade = ?, tipoEvento = ?, temperaturaMaxima = ?, data = ?, nivelImpacto = ?
        WHERE id = ?;
    `;

    con.query(query, [usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto, id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        } else if (results.affectedRows == 0) {
            res.status(404).json({ error: 'Evento nao encontrado' });
        } else {
            res.json({ message: 'Evento atualizado com sucesso' });
        }
    });
};

const excluir = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM evento WHERE id = ?;';

    con.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao excluir evento' });
        } else if (results.affectedRows == 0) {
            res.status(404).json({ error: 'Evento nao encontrado' });
        } else {
            res.json({ message: 'Evento excluido com sucesso' });
        }
    });
};

const resumo = (req, res) => {
    const query = `
        SELECT *, (SELECT AVG(temperaturaMaxima) FROM evento) AS mediaTemperaturas
        FROM evento;
    `;

    con.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar resumo' });
        } else {
            res.json({
                eventos: results,
                mediaTemperaturas: results.length > 0 ? results[0].mediaTemperaturas : null
            });
        }
    });
};

module.exports = {
    listar,
    cadastrar,
    atualizar,
    excluir,
    resumo
};