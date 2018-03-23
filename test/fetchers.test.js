import {describe, it} from 'mocha';
import chai from 'chai';
import proxyquire from 'proxyquire';

chai.should();

describe('fetchers', () => {
    describe('cards', () => {
        describe('isCardRegistered', () => {
            it('should reject if an error occurred', (done) => {
                // Mock the User model so that count() returns an error
                const err = new Error('Something happened');
                const {isCardRegistered} = proxyquire('../src/fetchers', {
                    './models': {
                        User: {
                            count(opts, cb) {
                                cb(err, 0);
                            }
                        }
                    }
                });

                isCardRegistered('somecardnumber')
                    .catch((error) => {
                        error.should.equal(err);
                        done();
                    });
            });
        });
    });

    describe('findUser', () => {
        it('should resolve if the query succeeds', (done) => {
            const someUser = {name: 'Fred'};
            const {findUser} = proxyquire('../src/fetchers', {
                './models': {
                    User: {
                        findOne(opts, cb) {
                            cb(undefined, someUser);
                        }
                    }
                }
            });

            findUser({id: 'foo'})
                .then((user) => {
                    user.should.equal(someUser);
                    done();
                });
        });

        it('should reject if the query fails', (done) => {
            // Mock the User model so that findOne() returns an error
            const err = new Error('Something happened');
            const {findUser} = proxyquire('../src/fetchers', {
                './models': {
                    User: {
                        findOne(opts, cb) {
                            cb(err, undefined);
                        }
                    }
                }
            });

            findUser({id: 'foo'})
                .catch((error) => {
                    error.should.equal(err);
                    done();
                });
        });
    });

    describe('findClient', () => {
        it('should resolve if the query succeeds', (done) => {
            const someClient = {name: 'Kiosk'};
            const {findClient} = proxyquire('../src/fetchers', {
                './models': {
                    Client: {
                        findOne(opts, cb) {
                            cb(undefined, someClient);
                        }
                    }
                }
            });

            findClient({id: 'foo'})
                .then((client) => {
                    client.should.equal(someClient);
                    done();
                });
        });

        it('should reject if the query fails', (done) => {
            // Mock the Client model so that findOne() returns an error
            const err = new Error('Something happened');
            const {findClient} = proxyquire('../src/fetchers', {
                './models': {
                    Client: {
                        findOne(opts, cb) {
                            cb(err, undefined);
                        }
                    }
                }
            });

            findClient({id: 'foo'})
                .catch((error) => {
                    error.should.equal(err);
                    done();
                });
        });
    });
});
