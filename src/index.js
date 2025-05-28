const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/config');
const authRoutes = require('./routes/auth');
const routineRoutes = require('./routes/routines');
const exerciseRoutes = require('./routes/exercises');
const auth = require('./middlewares/auth');

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/routines', auth, routineRoutes);
app.use('/api', auth, exerciseRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to FitPlanner API' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Conexión a base de datos e inicio del servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Verificar conexión del pool
    const client = await pool.connect();
    console.log('Database connection has been established successfully.');
    client.release();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: PostgreSQL Pool Connection`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();