import {server} from '../../src/index';
import {disconnectDb} from '../../src/db';
import {clearMongo} from './helper';

beforeEach(clearMongo);

after((done) => {
    server.close(() => {
        disconnectDb();
        done();
    });
});
