const express = require('express');
const http = require('http');
const hbs = require('express3-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const logger = require('./lib/logger');

const indexRouter = require('./server/routes/index');
const userRouter = require('./server/routes/user');

const app = express();
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.engine('hbs', hbs({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: __dirname + '/server/views/layouts/',
    })
);
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression(null));

let server;
app.use((req, res, next) => {
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

app.use('/', indexRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

const startServer = () => {
    server = http.createServer(app).listen(app.get('port'), () => {
        logger.info(`Express started on http://localhost:${app.get('port')}; press Ctrl-C to terminate.`);
    });
};

if (require.main === module) {
    /* application run directly; start app server */
    startServer();
} else {
    /* application imported as a module via "require": export function to create server */
    module.exports = startServer;
}
