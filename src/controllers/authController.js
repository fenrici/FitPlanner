const pool = require("../config/config");
const queries = require("../utils/queries");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fitplanner_secret_key_2024';
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: '7d'
  });
};

// Función para verificar permisos
const verifyPassword = async (providedPassword, storedPasswordHash) => {
  const match = await bcrypt.compare(providedPassword, storedPasswordHash);
  if (!match) {
    throw new Error("Unauthorized: Invalid password");
  }
};

// REGISTER - Crear nuevo usuario
const register = async (req, res) => {
  let client, result;
  try {
    const { username, email, password } = req.body;

    client = await pool.connect();

    // Verificar si usuario ya existe
    const existingUser = await client.query(queries.checkUserExists, [email, username]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: 'Ya existe un usuario con este email o nombre de usuario'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const data = await client.query(queries.createUser, [username, email, hashedPassword]);
    const user = data.rows[0];

    // Generate token
    const token = generateToken(user);

    result = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// LOGIN - Autenticar usuario
const login = async (req, res) => {
  let client, result;
  try {
    const { email, password } = req.body;

    client = await pool.connect();

    // Buscar usuario por email
    const data = await client.query(queries.getUserByEmail, [email]);
    
    if (data.rows.length === 0) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const user = data.rows[0];

    // Validar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generate token
    const token = generateToken(user);

    result = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    };

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// GET CURRENT USER - Obtener usuario actual
const getCurrentUser = async (req, res) => {
  let client, result;
  try {
    client = await pool.connect();

    const data = await client.query(queries.getUserById, [req.user.id]);
    
    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    result = {
      user: {
        id: data.rows[0].id,
        username: data.rows[0].username,
        email: data.rows[0].email
      }
    };

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  } finally {
    if (client) client.release();
  }
};

// GET ALL USERS - Obtener todos los usuarios (admin)
const getAllUsers = async (providedPassword, adminPasswordHash) => {
  let client, result;
  try {
    // Verificar permisos (comentado por ahora)
    // await verifyPassword(providedPassword, adminPasswordHash);

    client = await pool.connect();
    const data = await client.query(queries.getUsers);
    result = data.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// GET USER BY ID
const getUserById = async (id) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getUserById, [id]);
    result = data.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// GET USER BY EMAIL
const getUserByEmail = async (email) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getUserByEmail, [email]);
    result = data.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// UPDATE USER
const updateUser = async (user) => {
  const { username, email, old_email } = user;
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.updateUser, [username, email, old_email]);
    result = data.rowCount;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// DELETE USER
const deleteUser = async (email, providedPassword, adminPasswordHash) => {
  let client, result;
  try {
    // Verificar permisos (comentado por ahora)
    // await verifyPassword(providedPassword, adminPasswordHash);

    client = await pool.connect();
    const data = await client.query(queries.deleteUser, [email]);
    result = data.rowCount;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

// CHECK IF USER EXISTS
const existUser = async (email) => {
  let client, result;
  try {
    client = await pool.connect();
    const data = await client.query(queries.getUserByEmail, [email]);
    result = data.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (client) client.release();
  }
  return result;
};

const authService = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  existUser,
  verifyPassword
};

module.exports = authService; 