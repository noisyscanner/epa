import express from 'express';
import log from 'loglevel';
import {createRouter} from './routes';
import {setupDb} from './db';

setupDb();

const app = express();
app.use('/v1', createRouter());

export const server = app.listen(3000, () => log.debug('Listening on port 3000'));
