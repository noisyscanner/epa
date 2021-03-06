import {describe, it, beforeEach} from 'mocha';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {server} from '../../src';
import {createClientWithToken, createUser} from '../support/helper';
import {fooClient, fooClientToken, fooUser} from '../support/fixtures';

chai.should();
chai.use(chaiHttp);

describe('CardController', () => {
    describe('/v1/cards/:card_number', () => {
        describe('HEAD', () => {
            let req;

            beforeEach((done) => {
                req = chai.request(server);
                createClientWithToken(fooClient, fooClientToken, () => done());
            });

            it('should return 200 for existing cards', (done) => {
                createUser(fooUser, () => {
                    req
                        .head(`/v1/cards/${fooUser.card_number}`)
                        .set('Authorization', `Bearer ${fooClientToken.token}`)
                        .end((err, res) => {
                            res.should.have.status(200);

                            done();
                        });
                });
            });

            it('should return 404 for non-existent cards', (done) => {
                req
                    .head('/v1/cards/5678901234')
                    .set('Authorization', `Bearer ${fooClientToken.token}`)
                    .end((err, res) => {
                        res.should.have.status(404);

                        done();
                    });
            });
        });
    });
});
