import {describe, it} from 'mocha';
import chai from 'chai';
import {getExpiry} from '../../../src/models/schemas/AccessTokenSchema';
import config from '../../../config.json';

chai.should();

describe('AccessTokenSchema', () => {
    describe('getExpiry', () => {
        it('should add the given minutes to the current time', () => {
            const lifetime_minutes = 10;

            const expectedDate = new Date();
            expectedDate.setMinutes(expectedDate.getMinutes() + lifetime_minutes);

            getExpiry(lifetime_minutes).getMinutes().should.equal(expectedDate.getMinutes());
        });

        it('should default to the token lifetime in the config', () => {
            const lifetime_minutes = config.oauth.user_token_lifetime_minutes;

            const expectedDate = new Date();
            expectedDate.setMinutes(expectedDate.getMinutes() + lifetime_minutes);

            const actualDate = getExpiry(lifetime_minutes);

            actualDate.getMinutes().should.equal(expectedDate.getMinutes());
        });
    });
});
