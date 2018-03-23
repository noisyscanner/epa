import log from 'loglevel';
import {Client} from '../models/Client';
import {disconnectDb, setupDb} from '../db';

export const makeClient = (name) => new Promise((resolve, reject) => {
    const client = new Client({name});
    client.save((error) => {
        if (error) {
            reject(error);
            return;
        }

        resolve(client);
    });
});

export const run = async (args) => {
    log.setLevel('debug');
    setupDb();

    if (args.length === 0) {
        log.info('USAGE: manage.js addclient <client_name>');
        process.exit(1);
    }

    const name = args.join(' ');
    try {
        const client = await makeClient(name);
        log.info(
            `Created client '${name}'
Client ID: ${client.client_id}
Client Secret ${client.client_secret}`);
    } catch (error) {
        switch (error.code) {
        case 11000:
            log.error(`Error saving client: Client with name '${name}' already exists.`);
            process.exit(0);
            break;
        default:
            log.error('Error saving client:', error);
            process.exit(2);
        }
    }

    disconnectDb();
};
