import {describe, it} from 'mocha';
import chai from 'chai';
import {getExpiry} from '../../../src/models/schemas/AccessTokenSchema';

chai.should();

describe('AccessTokenSchema', () => {
    describe('getExpiry', () => {
        it('should add the given minutes to the current time', () => {
            const lifetime_minutes = 10;

            const expectedDate = new Date();
            expectedDate.setMinutes(expectedDate.getMinutes() + lifetime_minutes);

            getExpiry(lifetime_minutes)().getMinutes().should.equal(expectedDate.getMinutes());
        });
    });
});
