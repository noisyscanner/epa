import log from 'loglevel';
import config from '../config';

const mongoose = require('mongoose');

export const setupDb = () => {
    const connString = (process.env.NODE_ENV === 'test')
        ? config.db.uri_test
        : config.db.uri;

    log.debug(`Using DB at ${connString}`);
    mongoose.connect(connString);
};

export const disconnectDb = () => mongoose.connection.close();
