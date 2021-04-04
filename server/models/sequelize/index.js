const Sequelize = require('sequelize');
const User = require('./user');
const Password = require('./password');

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../config/dbconfig');

const models = {};
let dbOptions = dbConfig.getDbOptions(env);
const sequelize = new Sequelize(dbOptions.database, dbOptions.user, dbOptions.password, {
    host: dbOptions.host,
    dialect: 'mariadb'
});
models.sequelize = sequelize;

models.User = User;
User.init(sequelize, null);

models.Password = Password;
Password.init(sequelize, null);

User.associate(models);
Password.associate(models);

module.exports = models;
