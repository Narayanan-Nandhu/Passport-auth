const { DataTypes} = require('sequelize');

const { connectDatabase, sequelize} = require('../services/database')


// connectDatabase();

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync({ force: true });
  })()

module.exports = {
    User
}