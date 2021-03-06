const express = require('express');
const http = require('http');
const hbs = require('express3-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require("express-session");
const MariaDBStore = require('express-session-mariadb-store');
const logger = require('../lib/logger');
const bodyParser = require('body-parser');

const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const dbConfig = require("./config/dbconfig");
const credentials = require("../credentials");
const passport = require('passport');
const flash = require('connect-flash');

const index = express();
index.set('port', process.env.PORT || 3000);

// view engine setup
index.set('views', path.join(__dirname, 'server/views'));
index.engine('hbs', hbs({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: __dirname + '/server/views/layouts/',
    })
);
index.set('view engine', 'hbs');

const env = process.env.NODE_ENV || 'development';
dbConfig.initDbPool(env);
index.use(session({
    secret: credentials.cookieSecret,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    store: new MariaDBStore(dbConfig.getDbOptions(env)),
}));

index.use(bodyParser.urlencoded({extended: false}));
index.use(bodyParser.json());
index.use(cookieParser());
index.use(flash());
index.use(express.static(path.join(__dirname, 'public')));
index.use(compression(null));

require('./config/passport')(passport);
index.use(passport.initialize({}));
index.use(passport.session({}));

let server;
index.use((req, res, next) => {
    let domain = require('domain').create();
    domain.on('error', err => {
        logger.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            setTimeout(() => {
                logger.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);
            let worker = require('cluster').worker;
            if (worker) worker.disconnect();
            server.close();

            try {
                next(err);
            } catch (error) {
                logger.error('Express error mechanism failed.\n', error.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch (error) {
            logger.error('Unable to send 500 response.\n', error.stack);
        }
    });

    domain.add(req);
    domain.add(res);

    domain.run(next);
});

index.use('/', indexRouter);
index.use('/user', userRouter);
index.use('/comment', commentRouter);

// catch 404 and forward to error handler
index.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
index.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

const startServer = () => {
    server = http.createServer(index).listen(index.get('port'), () => {
        logger.info(`Express started on http://localhost:${index.get('port')}; press Ctrl-C to terminate.`);
    });
};

if (require.main === module) {
    /* application run directly; start index server */
    startServer();
} else {
    /* application imported as a module via "require": export function to create server */
    module.exports = startServer;
}
