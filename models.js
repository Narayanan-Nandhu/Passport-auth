const {User} = require('./Models/User');
const {Book} = require('./Models/Books');
const { sequelize} = require('./services/database')

module.exports = {
    User,
    Book
}