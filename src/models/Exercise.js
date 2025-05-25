const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Routine = require('./Routine');

const Exercise = sequelize.define('Exercise', {
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
  sets: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 20
    }
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 1000
    }
  },
  routineId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Routine,
      key: 'id'
    }
  }
});

// Definir relaciones
Exercise.belongsTo(Routine, { foreignKey: 'routineId' });
Routine.hasMany(Exercise, { foreignKey: 'routineId' });

module.exports = Exercise;