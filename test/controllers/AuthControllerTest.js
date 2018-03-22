import {describe, it} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {server} from '../../src/index';
import {User} from '../../src/models/User';
import {createClient, createUser, createUserWithToken} from '../support/helper';
import {fooClient, fooUserToken, fooUser} from '../support/fixtures';

chai.should();
chai.use(chaiHttp);

describe('AuthController', () => {
    describe('tokens', () => {
        it('should return an error for an invalid grant_type', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({grant_type: 'notcard'})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            grant_type: [
                                'grant_type must be one of: card, client_credentials'
                            ]
                        }
                    });
                    done();
                });
        });

        it('should return a validation error if grant_type is not present', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    card_number: '1234567890',
                    pin: 1234
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            grant_type: ['grant_type is required']
                        }
                    });
                    done();
                });
        });

        it('should return a validation error if card_number is not present for card grant_type', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'card',
                    pin: 1234
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            card_number: ['card_number is required']
                        }
                    });
                    done();
                });
        });

        it('should return a validation error if pin is not present for card grant_type', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'card',
                    card_number: '1234567890'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            pin: ['pin is required']
                        }
                    });
                    done();
                });
        });

        it('should return a validation error if client_id is not present for client_credentials grant_type', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'client_credentials',
                    client_secret: 'somesecret'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            client_id: ['client_id is required']
                        }
                    });
                    done();
                });
        });

        it('should return a validation error if client_secret is not present for client_credentials grant_type', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'client_credentials',
                    client_id: 'clientid'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({
                        errors: {
                            client_secret: ['client_secret is required']
                        }
                    });
                    done();
                });
        });

        it('should return a 400 error if the client_id and client_secret are invalid', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'client_credentials',
                    client_id: 'clientid',
                    client_secret: 'clientsecret'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.nested.property('error.message');
                    res.body.error.message.should.equal('Invalid client credentials');
                    done();
                });
        });

        it('should return a 404 for a non-existent user', (done) => {
            chai.request(server)
                .post('/v1/tokens')
                .send({
                    grant_type: 'card',
                    card_number: '1234567890',
                    pin: 1234
                })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.nested.property('error.message');
                    res.body.error.message.should.equal('User not found - the card has not been registered yet.');
                    done();
                });
        });

        it('should return a 201 and valid token for an existing user', (done) => {
            createClient(fooClient, () =>
                createUser(fooUser, () =>
                    chai.request(server)
                        .post('/v1/tokens')
                        .send({
                            client_id: fooClient.client_id,
                            client_secret: fooClient.client_secret,
                            grant_type: 'card',
                            card_number: fooUser.card_number,
                            pin: fooUser.pin
                        })
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.have.property('access_token');
                            res.body.should.have.property('expires_at');
                            done();
                        })));
        });

    });

    describe('invalidateToken', () => {
        it('should return a 401 error if the user is not authenticated', (done) => {
            chai.request(server)
                .delete('/v1/tokens/me')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('error');
                    res.body.error.should.equal('Invalid Authorization');
                    done();
                });
        });

        it('should invalidate a user\'s token and return status 204', (done) => {
            createUserWithToken(fooUser, fooUserToken, () =>
                chai.request(server)
                    .delete('/v1/tokens/me')
                    .set('Authorization', `Bearer ${fooUserToken.token}`)
                    .end((err, res) => {
                        res.should.have.status(204);

                        User.findOne({}, (error, user) => {
                            user.should.have.nested.property('access_token.expires_at');
                            user.access_token.expires_at.should.be.below(new Date());
                            done();
                        });
                    }));
        });
    });
});
