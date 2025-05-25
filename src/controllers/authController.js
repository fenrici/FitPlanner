const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fitplanner_secret_key_2024';
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: '7d'
  });
};

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Ya existe un usuario con este email o nombre de usuario'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { register, login, getCurrentUser }; 