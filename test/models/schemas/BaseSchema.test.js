import {describe, it} from 'mocha';
import chai from 'chai';
import {BaseSchema} from '../../../src/models/schemas/BaseSchema';

chai.should();

class FakeSchema extends BaseSchema {

    constructor(errorToReturn) {
        super();
        this.access_token = {};
        this.errorToReturn = errorToReturn;
    }

    save(cb) {
        cb(this.errorToReturn);
    }
}

describe('BaseSchema', () => {
    const errorToReturn = new Error('Oops!');

    describe('makeToken', () => {
        it('should resolve if successful', () => {
            const schema = new FakeSchema;

            return schema.makeToken();
        });

        it('should reject if there was an error', (done) => {
            const schema = new FakeSchema(errorToReturn);

            schema.makeToken()
                .catch((error) => {
                    error.should.equal(errorToReturn);
                    done();
                });
        });
    });

    describe('touchToken', () => {
        it('should resolve if successful', () => {
            const schema = new FakeSchema;

            return schema.touchToken();
        });

        it('should reject if there was an error', (done) => {
            const schema = new FakeSchema(errorToReturn);

            schema.touchToken()
                .catch((error) => {
                    error.should.equal(errorToReturn);
                    done();
                });
        });
    });

    describe('invalidateToken', () => {
        it('should resolve if the save was successful', () => {
            const schema = new FakeSchema;

            return schema.invalidateToken();
        });

        it('should reject if there was an error saving', (done) => {
            const schema = new FakeSchema(errorToReturn);

            schema.invalidateToken()
                .catch((error) => {
                    error.should.equal(errorToReturn);
                    done();
                });
        });
    });
});
