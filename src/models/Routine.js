const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Routine = sequelize.define('Routine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']]
    }
  },
  objective: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['strength', 'endurance', 'flexibility', 'weight_loss', 'muscle_gain']]
    }
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Definir relaciones
Routine.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Routine, { foreignKey: 'userId' });

module.exports = Routine;