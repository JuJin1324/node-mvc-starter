const mariadb = require('mariadb');
const credentials = require('../../credentials');

let pool = null;
const ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
};

const getDbOptions = (env) => {
    let dbOptions;
    switch (env) {
        case ENV.DEVELOPMENT:
            dbOptions = {
                host: credentials.mariadb.development.host,
                port: credentials.mariadb.development.port,
                user: credentials.mariadb.development.user,
                password: credentials.mariadb.development.password,
                database: credentials.mariadb.development.database,
                sessionTable: credentials.mariadb.development.sessionTable,
                expiration: 600000,  /* ms */
            };
            break;
        case ENV.PRODUCTION:
            dbOptions = {
                host: credentials.mariadb.production.host,
                port: credentials.mariadb.production.port,
                user: credentials.mariadb.production.user,
                password: credentials.mariadb.production.password,
                database: credentials.mariadb.production.database,
                sessionTable: credentials.mariadb.production.sessionTable,
                expiration: 600000,  /* ms */
            };
            break;
        default:
            throw new Error(`Unknown execution enviorment: ${app.get('env')}`);
    }

    return dbOptions;
};

module.exports = {
    getDbOptions: getDbOptions,
    initDbPool: (env) => {
        if (pool) return;

        let dbOptions = getDbOptions(env);
        pool = mariadb.createPool({
            user: dbOptions.user,
            password: dbOptions.password,
            host: dbOptions.host,
            database: dbOptions.database,
            connectionLimit: 5
        });
    },
    getConnection: () => {
        return pool.getConnection();
    },
};
