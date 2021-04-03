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
                timezone: 'Asia/Seoul',
                expiration: 600000,  /* ms */
                // model: 'raw',
                model: 'sequelize',
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
                timezone: 'Asia/Seoul',
                expiration: 600000,  /* ms */
                // model: 'raw',
                model: 'sequelize',
            };
            break;
        default:
            throw new Error(`Unknown execution enviorment: ${app.get('env')}`);
    }

    return dbOptions;
};

const getConnection = () => {
    return pool.getConnection();
};

const insert = async (query, elemArr) => {
    const conn = await getConnection();
    try {
        await conn.query(query, elemArr);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

const select = async (query, elemArr) => {
    const conn = await getConnection();
    try {
        const rows = await conn.query(query, elemArr);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    initDbPool: (env) => {
        if (pool) return;

        let dbOptions = getDbOptions(env);
        pool = mariadb.createPool({
            user: dbOptions.user,
            password: dbOptions.password,
            host: dbOptions.host,
            database: dbOptions.database,
            timezone: dbOptions.timezone,
            connectionLimit: 5
        });
    },
    getDbOptions,
    getConnection,
    select,
    insert,
};
