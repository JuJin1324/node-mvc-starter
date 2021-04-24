const logger = require('./lib/logger');
const cluster = require('cluster');

const startWorker = () => {
    let worker = cluster.fork();
    logger.info(`CLUSTER: Worker ${worker.id} started`);
};

if (cluster.isMaster) {
    /* If you want multi process nodes -> uncomment below */
    // require('os').cpus().forEach(() => {
    //     startWorker();
    // });

    /* If you want dual process nodes -> uncomment below */
    // [0, 1].forEach(() => {
    //     startWorker();
    // })

    /* If you want a single process node */
    startWorker();

    /* disconnect -> exit */
    cluster.on('disconnect', worker => {
        logger.info(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    });
    cluster.on('exit', (worker, code, signal) => {
        logger.info(`CLUSTER Worker ${worker.id} died with exit code ${code} (${signal})`);
        startWorker();
    });
} else {    /* It's not the Master then start server */
    require('./server')();
}
