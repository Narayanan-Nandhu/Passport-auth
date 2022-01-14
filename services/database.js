const {Sequelize} = require('sequelize');
const path = require('path');

const dbName = path.join(__dirname,'./data/database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbName
});


const connectDatabase = async () => {
    try {
        console.log('Connection has been established successfully.');
        return await sequelize.authenticate();
      } catch (error) {
        console.error('Unable to connect to the database:', error);
        return error
      }
}
module.exports ={
    sequelize,
    connectDatabase
}