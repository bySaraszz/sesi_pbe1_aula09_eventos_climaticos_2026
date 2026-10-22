const crypto = require('crypto');
const con = require('../db');

const hashSenha = (senha) =>
  crypto.createHash('sha256').update(senha, 'utf8').digest('hex');

const cadastrar = (req, res) => {
  const { nome, email, senha } = req.body || {};
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Informe nome, email e senha.' });
  }

  const sql = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
  con.query(sql, [nome.trim(), email.trim().toLowerCase(), hashSenha(senha)], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      user: { id: result.insertId, nome: nome.trim(), email: email.trim().toLowerCase() }
    });
  });
};

const listar = (req, res) => {
  con.query('SELECT id, nome, email FROM usuario ORDER BY id', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
    return res.json(results);
  });
};

const buscarPorId = (req, res) => {
  con.query('SELECT id, nome, email FROM usuario WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (!rows.length) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json(rows[0]);
  });
};

const atualizar = (req, res) => {
  const { nome, email, senha } = req.body || {};
  if (!nome || !email) return res.status(400).json({ error: 'Informe nome e email.' });
  const values = [nome.trim(), email.trim().toLowerCase()];
  let sql = 'UPDATE usuario SET nome = ?, email = ?';
  if (senha) {
    sql += ', senha = ?';
    values.push(hashSenha(senha));
  }
  sql += ' WHERE id = ?';
  values.push(req.params.id);

  con.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
      return res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
    if (!result.affectedRows) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({ message: 'Usuário atualizado com sucesso.' });
  });
};

const excluir = (req, res) => {
  con.query('DELETE FROM usuario WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ error: 'Não é possível excluir: o usuário possui eventos associados.' });
      }
      return res.status(500).json({ error: 'Erro ao excluir usuário.' });
    }
    if (!result.affectedRows) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({ message: 'Usuário excluído com sucesso.' });
  });
};

const login = (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) return res.status(400).json({ error: 'Informe email e senha.' });

  con.query(
    'SELECT id, nome, email FROM usuario WHERE email = ? AND senha = ?',
    [email.trim().toLowerCase(), hashSenha(senha)],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erro ao realizar login.' });
      if (!rows.length) return res.status(404).json({ error: 'E-mail ou senha inválidos.' });
      return res.json({ message: 'Login realizado com sucesso.', user: rows[0] });
    }
  );
};

module.exports = { cadastrar, listar, buscarPorId, atualizar, excluir, login };
