import express from 'express';
import {createRouter} from './routes';
import {setupDb} from './db';

setupDb();

const app = express();
app.use('/v1', createRouter());

export const server = app.listen(3000, () => console.log('Listening on port 3000'));
