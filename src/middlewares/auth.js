const jwt = require('jsonwebtoken');
const pool = require('../config/config');
const queries = require('../utils/queries');

const auth = async (req, res, next) => {
  let client;
  try {
    // Skip authentication for login and register routes only
    if (req.originalUrl === '/api/auth/login' || req.originalUrl === '/api/auth/register') {
      return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'fitplanner_secret_key_2024';
    const decoded = jwt.verify(token, secret);
    
    // Buscar usuario con pool de conexiones
    client = await pool.connect();
    const data = await client.query(queries.getUserById, [decoded.id]);

    if (data.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = data.rows[0];
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    res.status(401).json({ message: 'Please authenticate.' });
  } finally {
    if (client) client.release();
  }
};

module.exports = auth; 