import {describe, it} from 'mocha';
import chai from 'chai';
import {serialiseUser} from '../src/serialisers';
import {fooUser} from './support/fixtures';
import {createUser} from './support/helper';

chai.should();


describe('serialiseUser', () => {
    it('should serialise a User', (done) => {
        createUser(fooUser, (user) => {
            serialiseUser(user).should.deep.equal({
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
});
