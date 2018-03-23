import {describe, it} from 'mocha';
import chai from 'chai';
import {generateToken} from '../src/helpers';

chai.should();

describe('helpers', () => {
    describe('generateToken', () => {
        it('should generate a token of the specified length', () => {
            const expectedLength = 16;
            const token = generateToken(expectedLength);

            token.should.be.a('string').with.lengthOf(expectedLength);
        });

        it('should use only the letters in the provided alphabet', () => {
            const length = 10;
            const alphabet = 'abcdef';

            const token = generateToken(length, alphabet);

            token.should.be.a('string');
            token.split('').filter((c) => !alphabet.includes(c)).should.be.empty;
        });
    });
});
