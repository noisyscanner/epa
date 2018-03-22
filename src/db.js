import config from '../config';

const mongoose = require('mongoose');

export const setupDb = () => {
    const connString = (process.env.NODE_ENV === 'test')
        ? config.db.uri
        : config.db.uri_test;

    console.log(`Using DB at ${connString}`);
    mongoose.connect(connString);
};

export const disconnectDb = () => mongoose.connection.close();
