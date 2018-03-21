const mongoose = require('mongoose');

export const setupDb = () => {
    if (process.env.NODE_ENV === 'test') {
        console.log('Using DB epa_test');
        mongoose.connect('mongodb://localhost/epa_test');
    } else {
        console.log('Using DB epa');
        mongoose.connect('mongodb://localhost/epa');
    }
};

export const disconnectDb = () => mongoose.connection.close();
