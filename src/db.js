const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'registros_climaticos',
  charset: 'utf8mb4'
});

connection.connect((err) => {
  if (err) {
    console.error('Não foi possível conectar ao MariaDB:', err.message);
    return;
  }
  console.log('Conectado ao MariaDB.');
});

module.exports = connection;
