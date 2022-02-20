const { DataTypes} = require('sequelize');
const { sequelize} = require('../services/database')


const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

(async () => {
    await sequelize.sync({ force: false });
  })()

module.exports = {
    Book
}