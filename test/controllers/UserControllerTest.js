import chai from 'chai';
import chaiHttp from 'chai-http';
import {server} from '../../src';
import {createClientWithToken, createUserWithToken} from '../support/helper';
import {fooClient, fooClientToken, fooUser, fooUserToken} from '../support/fixtures';
import {serialiseUser} from '../../src/serialisers';
import {User} from '../../src/models/User';

chai.should();
chai.use(chaiHttp);

const request = chai.request(server);

describe('UserController', () => {
    describe('/v1/users/me', () => {
        let user;

        beforeEach((done) => {
            createUserWithToken(fooUser, fooUserToken, (newUser) => {
                user = newUser;
                done();
            });
        });

        describe('GET', () => {
            let req;

            beforeEach(() => {
                req = request
                    .get('/v1/users/me')
                    .set('Authorization', `Bearer ${fooUserToken.token}`);
            });

            it('should return the currently logged in user', (done) => {
                req.end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('user').that.is.an('object');
                    res.body.user.should.deep.equal(serialiseUser(user));

                    done();
                });
            });

            it('should return the expected links', (done) => {
                req.end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('links').that.is.an('array');
                    res.body.links.should.deep.equal([
                        {
                            rel: 'self',
                            href: '/v1/users/me'
                        },
                        {
                            rel: 'balance',
                            href: '/v1/users/me'
                        }
                    ]);

                    done();
                });
            });
        });

        describe('DELETE', () => {
            it('should delete the user and return a 204 response', (done) => {
                request
                    .delete('/v1/users/me')
                    .set('Authorization', `Bearer ${fooUserToken.token}`)
                    .end((err, res) => {
                        res.should.have.status(204);
                        User.count({id: user.id}, (error, count) => {
                            count.should.equal(0);
                            done();
                        })
                    });
            });
        });
    });

    describe('/v1/users/me/balance', () => {
        let user;

        beforeEach((done) => {
            createUserWithToken(fooUser, fooUserToken, (newUser) => {
                user = newUser;
                done();
            });
        });

        describe('GET', () => {
            let req;

            beforeEach(() => {
                req = request
                    .get('/v1/users/me/balance')
                    .set('Authorization', `Bearer ${fooUserToken.token}`);
            });

            it('should return the user\'s balance', (done) => {
                req.end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('balance').that.is.a('number');
                    res.body.balance.should.equal(user.balance);

                    done();
                });
            });

            it('should return the expected links', (done) => {
                req.end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('links').that.is.an('array');
                    res.body.links.should.deep.equal([
                        {
                            rel: 'self',
                            href: '/v1/users/me/balance'
                        },
                        {
                            rel: 'user',
                            href: '/v1/users/me'
                        }
                    ]);

                    done();
                });
            });
        });

        describe('PATCH', () => {
            let req;

            beforeEach(() => {
                req = request
                    .patch('/v1/users/me/balance')
                    .set('Authorization', `Bearer ${fooUserToken.token}`);
            });

            it('should return a validation error if the add value is not given', (done) => {
                req.end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('errors').that.is.an('object');
                    res.body.errors.should.deep.equal({
                        add: ['add is required']
                    });

                    done();
                });
            });

            it('should return a validation error if the add value is not a number', (done) => {
                req
                    .send({
                        add: 'a tenner'
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('errors').that.is.an('object');
                        res.body.errors.should.deep.equal({
                            add: ['add must be a Number']
                        });

                        done();
                    });
            });

            it('should increase the user\'s balance if a positive value is given', (done) => {
                req
                    .send({
                        add: 5.99
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('balance').that.is.a('number');
                        res.body.balance.should.equal(16.06);

                        done();
                    });
            });

            it('should decrease the user\'s balance if a positive value is given', (done) => {
                req
                    .send({
                        add: -5.99
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('balance').that.is.a('number');
                        res.body.balance.should.equal(4.08);

                        done();
                    });
            });

            it('should return the expected links', (done) => {
                req
                    .send({
                        add: 5.99
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('links').that.is.an('array');
                        res.body.links.should.deep.equal([
                            {
                                rel: 'self',
                                href: '/v1/users/me/balance'
                            },
                            {
                                rel: 'user',
                                href: '/v1/users/me'
                            }
                        ]);

                        done();
                    });
            });
        });
    });

    describe('/v1/users', () => {
        let client;

        beforeEach((done) => {
            createClientWithToken(fooClient, fooClientToken, (newClient) => {
                client = newClient;
                done();
            });
        });

        describe('POST', () => {
            let req;

            beforeEach(() => {
                req = request
                    .post('/v1/users')
                    .set('Authorization', `Bearer ${fooClientToken.token}`);
            });

            it('should create and return a new user when correct data is given', (done) => {
                req
                    .send(fooUser)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.should.have.header('Location', '/v1/users/me');
                        res.body.should.have.property('user').that.is.an('object');
                        res.body.user.should.deep.equal({
                            first_name: 'Brad',
                            surname: 'Reed',
                            email: 'brad@bradreed.co.uk',
                            mobile_number: '07123456789',
                            employee_id: 'B3AKS22',
                            balance: 10.07
                        });

                        done();
                    });
            });

            it('should return the expected links with the user', (done) => {
                req
                    .send(fooUser)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('links').that.is.an('array');
                        res.body.links.should.deep.equal([
                            {
                                rel: 'self',
                                href: '/v1/users/me'
                            },
                            {
                                rel: 'balance',
                                href: '/v1/users/me'
                            }
                        ]);

                        done();
                    });
            });

            it('should return validation errors if the data is not correct', (done) => {
                req
                    .send({})
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('errors').that.is.an('object');
                        res.body.errors.should.deep.equal({
                            first_name: 'First name is required',
                            surname: 'Surname is required',
                            email: 'Email address is required',
                            employee_id: 'Employee ID is required',
                            mobile_number: 'Mobile number is required',
                            card_number: 'Card number is required',
                            pin: 'Please enter a 4 digit PIN number'
                        });

                        done();
                    });
            });
        });
    });
});
