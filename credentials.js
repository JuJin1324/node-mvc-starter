module.exports = {
    cookieSecret: 'cookie secret sample when you working project with others, add this file to .gitignore',
    mariadb: {
        development: {
            host: 'localhost',
            port: '3306',
            user: 'scott',
            password: 'tiger',
            database: 'mvc',
            sessionTable: 'EXPRESS_SESSION',
        },
        production: {
            host: 'localhost',
            port: '3306',
            user: 'scott',
            password: 'tiger',
            database: 'mvc',
            sessionTable: 'EXPRESS_SESSION',
        },
    },
};
