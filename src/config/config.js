const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Pool de conexiones PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://tienda_final_user:nPw9WddPYxQ7GrEzwvFzd24fp6yvu8tk@dpg-d0mrhiumcj7s739ivvk0-a.frankfurt-postgres.render.com/tienda_final',
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
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