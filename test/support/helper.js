import * as log from 'loglevel';
import {User} from '../../src/models/User';
import {Client} from '../../src/models/Client';

const clearCollection = (model) => new Promise((resolve, reject) => model.remove({}, (error) => error ? reject(error) : resolve()));

export const clearMongo = () =>
    Promise.all([User, Client].map(clearCollection))
        .catch((err) => log.warn(err));

export const createUser = (userDef, done) => {
    const user = new User(userDef);
    user.save((error) => {
        if (error) {
            log.error(error);
        }

        done(user);
    });
};

export const createTokenForModel = (model, tokenDef, done) => {
    model.access_token = tokenDef;
    model.save((error) => {
        if (error) {
            log.error(error);
        }

        done();
    });
};

export const createUserWithToken = (userDef, tokenDef, done) =>
    createUser(userDef, (user) =>
        createTokenForModel(user, tokenDef, () => done(user)));

export const createClient = (clientDef, done) => {
    const client = new Client(clientDef);
    client.save((error) => {
        if (error) {
            log.error(error);
        }

        done(client);
    });
};

export const createClientWithToken = (clientDef, tokenDef, done) =>
    createClient(clientDef, (client) =>
        createTokenForModel(client, tokenDef, () => done(client)));
