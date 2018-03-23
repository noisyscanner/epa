import {describe, it} from 'mocha';
import chai from 'chai';
import sha1 from 'sha1';
import {User} from '../../../src/models/User';
import {fooUser} from '../../support/fixtures';
import {createUser} from '../../support/helper';

chai.should();

describe('UserSchema', () => {
    it('should save the balance as a pence integer', () => {
        const user = new User(fooUser);
        user.balance = 5.69; // £5.69

        user.toObject().balance.should.equal(569);
    });

    it('should hash the card_number when the user is saved', (done) => {
        createUser(fooUser, (user) => {
            const expectedCardNumber = sha1(fooUser.card_number);
            user.card_number.should.equal(expectedCardNumber);

            done();
        });
    });

    it('should hash the pin when the user is saved', (done) => {
        createUser(fooUser, (user) => {
            const expectedPin = sha1(fooUser.pin);
            user.pin.should.equal(expectedPin);

            done();
        });
    });
});
