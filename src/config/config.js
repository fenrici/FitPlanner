const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Pool de conexiones PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/fitplanner_dev',
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? {
    require: true,
    rejectUnauthorized: false
  } : false
});

// Verificar conexión al inicializar
pool.on('connect', () => {
  console.log('Database connection has been established successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;