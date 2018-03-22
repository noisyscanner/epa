import {describe, it} from 'mocha';
import chai from 'chai';
import {Validator} from '../src/Validator';

const expect = chai.expect;
chai.should();

describe('Validator', () => {
    describe('validate', () => {
        it('should return undefined if no errors occurred', () => {
            const validator = new Validator({
                field1: {
                    required: true
                }
            });

            expect(validator.validate({field1: 'foobar'})).to.be.undefined;
        });

        describe('required', () => {
            it('should validate required fields', () => {
                const validator = new Validator({
                    field1: {
                        required: true
                    },
                    field2: {
                        required: true
                    }
                });

                const result = validator.validate({
                    field2: ''
                });

                result.should.deep.equal({
                    field1: [
                        'field1 is required'
                    ],
                    field2: [
                        'field2 is required'
                    ]
                });
            });

            it('should ignore non-required fields', () => {
                const validator = new Validator({
                    field1: {
                        required: false
                    }
                });

                const result = validator.validate({field2: 'foo'});

                expect(result).to.be.undefined;
            });

            it('should skip other rules if required = true and the value is missing', () => {
                const validator = new Validator({
                    field1: {
                        required: true,
                        oneOf: ['foo', 'bar']
                    }
                });

                const result = validator.validate({});

                result.should.deep.equal({
                    field1: [
                        'field1 is required'
                    ]
                });
            });
        });

        describe('oneOf', () => {
            it('should validate against an array of valid values', () => {
                const validator = new Validator({
                    field1: {
                        oneOf: ['foo', 'bar']
                    },
                    field2: {
                        oneOf: ['bar', 'baz']
                    }
                });

                const result = validator.validate({
                    field1: 'bar',
                    field2: 'foo'
                });

                result.should.deep.equal({
                    field2: [
                        'field2 must be one of: bar, baz'
                    ]
                });
            });
        });

        describe('when', () => {
            it('should skip validation rules if `when` is provided, and returns false', () => {
                const validator = new Validator({
                    field1: {
                        required: true,
                        when: () => false
                    }
                });

                const result = validator.validate({});

                expect(result).to.be.undefined;
            });
        });

        describe('type', () => {
            it('should return validation errors for numbers', () => {
                const validator = new Validator({
                    field1: {
                        type: Number
                    },
                    field2: {
                        type: Number
                    },
                    field3: {
                        type: Number
                    },
                    field4: {
                        type: Number
                    },
                    field5: {
                        type: Number
                    }
                });

                const result = validator.validate({
                    field1: 5,
                    field2: 5.99,
                    field3: '5',
                    field4: '5.99',
                    field5: 'notanumber'
                });

                result.should.deep.equal({
                    field5: [
                        'field5 must be a Number'
                    ]
                });
            });
        });
    });

    describe('validateType', () => {
        describe('Number', () => {
            it('should return true for integers', () => {
                Validator.validateType(5, Number).should.be.true;
            });

            it('should return true for integer strings', () => {
                Validator.validateType('5', Number).should.be.true;
            });

            it('should return true for floats', () => {
                Validator.validateType(5.99, Number).should.be.true;
            });

            it('should return true for float strings', () => {
                Validator.validateType('5.99', Number).should.be.true;
            });

            it('should return false for non-numeric strings', () => {
                Validator.validateType('five ninety nine', Number).should.be.false;
            });

            it('should return false for undefined', () => {
                Validator.validateType(undefined, Number).should.be.false;
            });

            it('should return false for null', () => {
                Validator.validateType(null, Number).should.be.false;
            });
        });
    });
});
