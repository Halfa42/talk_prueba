const { Pool } = require('pg');
require('../config/env');

const sslConfig = [process.env.DB_SSL, process.env.PGSSLMODE]
  .some(value => String(value).toLowerCase() === 'true' || String(value).toLowerCase() === 'require')
  ? { rejectUnauthorized: false }
  : false;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT || 5432),
      ssl: sslConfig,
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', err => {
  console.error('❌ Error en la conexión a PostgreSQL:', err);
  process.exit(1);
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
