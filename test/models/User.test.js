import {describe, it} from 'mocha';
import chai from 'chai';
import {User} from '../../src/models/User';
import {fooUser} from '../support/fixtures';

chai.should();

describe('User', () => {
    describe('set balance', () => {
        it('should set the balance if a valid value is given', () => {
            const user = new User(fooUser);
            user.balance = 5.99;
            user.balance.should.equal(5.99);
        });

        it('should not set the balance if an invalid value is given', () => {
            const user = new User(fooUser);
            user.balance = 'notanumber';
            user.balance.should.equal(fooUser.balance);
        });
    });
});
