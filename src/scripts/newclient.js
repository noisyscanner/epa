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
    setupDb();

    if (args.length === 0) {
        console.log('USAGE: manage.js addclient <client_name>');
        process.exit(1);
    }

    const name = args.join(' ');
    try {
        const client = await makeClient(name);
        console.log(
            `Created client '${name}'
Client ID: ${client.client_id}
Client Secret ${client.client_secret}`);
    } catch (error) {
        switch (error.code) {
        case 11000:
            console.error(`Error saving client: Client with name '${name}' already exists.`);
            process.exit(0);
            break;
        default:
            console.error('Error saving client:', error);
            process.exit(2);
        }
    }

    disconnectDb();
};
