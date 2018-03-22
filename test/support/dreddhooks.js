const hooks = require('hooks');

import {clearMongo, createClientWithToken, createUser, createUserWithToken} from './helper';
import {disconnectDb, setupDb} from '../../src/db';
import {fooUser, fooUserToken, fooClient, fooClientToken} from './fixtures';

hooks.beforeAll((_, done) => {
    setupDb();
    done();
});

hooks.beforeEach((_, done) => {
    clearMongo().then(done);
});

hooks.before('Users > Create a new User > Create a new User', (_, done) =>
    createClientWithToken(fooClient, fooClientToken, done));

hooks.before('Users > Retrieve a User by Card Number and PIN > Retrieve a User by Card Number and PIN', (_, done) =>
    createUser(fooUser, done));

hooks.before('Users > Current User > Retrieve the current User', (_, done) =>
    createUserWithToken(fooUser, fooUserToken, done));

hooks.before('Users > Current User > Delete the current User', (_, done) =>
    createUserWithToken(fooUser, fooUserToken, done));

hooks.before("Users > Current User's Balance > Increment the current User's balance", (_, done) =>
    createUserWithToken(fooUser, fooUserToken, done));

hooks.before("Users > Current User's Balance > Retrieve the current User's balance", (_, done) =>
    createUserWithToken(fooUser, fooUserToken, done));

hooks.before('Cards > Check if a Card is registered > Check if a Card is registered', (_, done) =>
    createClientWithToken(fooClient, fooClientToken, () =>
        createUser(fooUser, done)));

hooks.before('Auth > Get an Access Token for a User > Get an Access Token for a User', (_, done) =>
    createUser(fooUser, done));

hooks.before("Auth > Invalidate the User's Access Token > Invalidate the User's Access Token", (_, done) =>
    createUserWithToken(fooUser, fooUserToken, done));

hooks.afterAll((_, done) => {
    disconnectDb();
    done();
});
