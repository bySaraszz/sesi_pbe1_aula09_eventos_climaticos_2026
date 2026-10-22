const con = require('../db');

const camposValidos = (body) => {
  const { usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto } = body || {};
  const niveis = ['Baixo', 'Médio', 'Alto'];
  return Number.isInteger(Number(usuarioId)) && Number(usuarioId) > 0 &&
    Boolean(cidade && tipoEvento && data) &&
    temperaturaMaxima !== undefined && Number.isFinite(Number(temperaturaMaxima)) &&
    (!nivelImpacto || niveis.includes(nivelImpacto));
};

const listar = (req, res) => {
  const sql = `SELECT e.id, e.cidade, e.tipoEvento, e.temperaturaMaxima,
    DATE_FORMAT(e.data, '%Y-%m-%d') AS data, e.nivelImpacto, e.usuarioId,
    u.nome AS usuarioNome
    FROM evento e JOIN usuario u ON u.id = e.usuarioId ORDER BY e.id`;
  con.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar eventos.' });
    return res.json(rows);
  });
};

const cadastrar = (req, res) => {
  if (!camposValidos(req.body)) {
    return res.status(400).json({
      error: 'Informe usuarioId, cidade, tipoEvento, temperaturaMaxima, data e nivelImpacto válido (Baixo, Médio ou Alto).'
    });
  }
  const { usuarioId, cidade, tipoEvento, temperaturaMaxima, data } = req.body;
  const nivelImpacto = req.body.nivelImpacto || 'Médio';
  const sql = `INSERT INTO evento
    (usuarioId, cidade, tipoEvento, temperaturaMaxima, data, nivelImpacto)
    VALUES (?, ?, ?, ?, ?, ?)`;
  con.query(sql, [Number(usuarioId), cidade.trim(), tipoEvento.trim(), Number(temperaturaMaxima), data, nivelImpacto], (err, result) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'usuarioId não existe.' });
      console.error(err);
      return res.status(500).json({ error: 'Erro ao cadastrar evento.' });
    }
    return res.status(201).json({ message: 'Evento cadastrado com sucesso.', id: result.insertId });
  });
};

const buscarPorId = (req, res) => {
  con.query('SELECT * FROM evento WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar evento.' });
    if (!rows.length) return res.status(404).json({ error: 'Evento não encontrado.' });
    return res.json(rows[0]);
  });
};

const atualizar = (req, res) => {
  if (!camposValidos(req.body)) return res.status(400).json({ error: 'Dados do evento inválidos ou incompletos.' });
  const { usuarioId, cidade, tipoEvento, temperaturaMaxima, data } = req.body;
  const nivelImpacto = req.body.nivelImpacto || 'Médio';
  const sql = `UPDATE evento SET usuarioId = ?, cidade = ?, tipoEvento = ?,
    temperaturaMaxima = ?, data = ?, nivelImpacto = ? WHERE id = ?`;
  con.query(sql, [Number(usuarioId), cidade.trim(), tipoEvento.trim(), Number(temperaturaMaxima), data, nivelImpacto, req.params.id], (err, result) => {
    if (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'usuarioId não existe.' });
      return res.status(500).json({ error: 'Erro ao atualizar evento.' });
    }
    if (!result.affectedRows) return res.status(404).json({ error: 'Evento não encontrado ou nenhum dado foi alterado.' });
    return res.json({ message: 'Evento atualizado com sucesso.' });
  });
};

const excluir = (req, res) => {
  con.query('DELETE FROM evento WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao excluir evento.' });
    if (!result.affectedRows) return res.status(404).json({ error: 'Evento não encontrado.' });
    return res.json({ message: 'Evento excluído com sucesso.' });
  });
};

const resumo = (req, res) => {
  const sql = `SELECT COUNT(*) AS totalEventos,
    ROUND(AVG(temperaturaMaxima), 2) AS mediaTemperatura,
    MIN(temperaturaMaxima) AS temperaturaMinima,
    MAX(temperaturaMaxima) AS temperaturaMaxima
    FROM evento`;
  con.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao gerar resumo.' });
    return res.json(rows[0]);
  });
};

module.exports = { listar, cadastrar, buscarPorId, atualizar, excluir, resumo };
