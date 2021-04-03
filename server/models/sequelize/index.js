const Sequelize = require('sequelize');
const User = require('./user');
const Password = require('./password');

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../config/dbconfig');

const db = {};
let dbOptions = dbConfig.getDbOptions(env);
const sequelize = new Sequelize(dbOptions.database, dbOptions.user, dbOptions.password, {
    host: dbOptions.host,
    dialect: 'mariadb'
});
db.sequelize = sequelize;

db.User = User;
User.init(sequelize, null);

db.Password = Password;
Password.init(sequelize, null);

User.associate(db);
Password.associate(db);

module.exports = db;
