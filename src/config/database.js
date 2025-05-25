const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  'postgresql://tienda_final_user:nPw9WddPYxQ7GrEzwvFzd24fp6yvu8tk@dpg-d0mrhiumcj7s739ivvk0-a.frankfurt-postgres.render.com/tienda_final',
  {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize; 