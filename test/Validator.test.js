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

        it('should correctly format the field name in the error messages', () => {
            const validator = new Validator({
                first_name: {
                    required: true
                },
                surname: {
                    required: true
                }
            });

            const result = validator.validate({});

            result.should.deep.equal({
                first_name: ['First Name is required'],
                surname: ['Surname is required']
            });
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
                        'Field1 is required'
                    ],
                    field2: [
                        'Field2 is required'
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
                        'Field1 is required'
                    ]
                });
            });

            it('should use the given validation message if there was one', () => {
                const validator = new Validator({
                    field1: {
                        required: 'Field1 is super important',
                    }
                });

                const result = validator.validate({});

                result.should.deep.equal({
                    field1: [
                        'Field1 is super important'
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
                        'Field2 must be one of: bar, baz'
                    ]
                });
            });

            it('should skip the rule if a non-array is given to validate against', () => {
                const validator = new Validator({
                    field1: {
                        oneOf: 'notanarray'
                    },
                    field2: {
                        oneOf: null
                    },
                    field3: {
                        oneOf: undefined
                    }
                });

                const result = validator.validate({
                    field1: 'foo',
                    field2: 'bar',
                    field3: 'baz',
                });

                expect(result).to.be.undefined;
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
                        'Field5 must be a Number'
                    ]
                });
            });
        });

        describe('func', () => {
            it('should validate against the given function', () => {
                const validator = new Validator({
                    field1: {
                        func: (value) => value === 'foo'
                    }
                });

                const result = validator.validate({
                    field1: 'bar',
                });

                result.should.deep.equal({
                    field1: [
                        'Field1 must be valid'
                    ]
                });
            });

            it('should use the given validation message if there was an error', () => {
                const validator = new Validator({
                    field1: {
                        func: [(value) => value === 'foo', 'Field1 must be foo']
                    }
                });

                const result = validator.validate({
                    field1: 'bar',
                });

                result.should.deep.equal({
                    field1: [
                        'Field1 must be foo'
                    ]
                });
            });

            it('should ignore the rule if a non-function is given', () => {
                const validator = new Validator({
                    field1: {
                        func: 'notafunction'
                    }
                });

                const result = validator.validate({
                    field1: 'bar',
                });

                expect(result).to.be.undefined;
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

            it('should return false by default for unknown type values', () => {
                Validator.validateType('somevalue', 'SomeUnknownType').should.be.false;
            });
        });
    });

    describe('validateCardNumber', () => {
        it('should return true for 16 digit card numbers', () => {
            Validator.validateCardNumber(1234567890123456).should.be.true;
            Validator.validateCardNumber('1234567890123456').should.be.true;
        });

        it('should return false for numbers not 16 digits long', () => {
            Validator.validateCardNumber('12345678').should.be.false;
            Validator.validateCardNumber('123456781234567812345678').should.be.false;
        });

        it('should return false for non-numerical inputs', () => {
            Validator.validateCardNumber('notacardnumber').should.be.false;
        });
    });

    describe('validateEmail', () => {
        it('should return true for valid email addresses', () => {
            Validator.validateEmail('brad@reed.co.uk').should.be.true;
        });

        it('should return false for invalid email addresses', () => {
            Validator.validateEmail('brad@@reed.co.uk').should.be.false;
            Validator.validateEmail('fake@@email').should.be.false;
            Validator.validateEmail('don.com').should.be.false;
            Validator.validateEmail('notanemail').should.be.false;
        });
    });

    describe('validateEmployeeID', () => {
        it('should return true for 7 character alphanumeric employee IDs', () => {
            Validator.validateEmployeeID('BS9K22D').should.be.true;
            Validator.validateEmployeeID('A1BCDEF').should.be.true;
            Validator.validateEmployeeID('1A23456').should.be.true;
        });

        it('should return false if lower-case letters are used', () => {
            Validator.validateEmployeeID('aaaaaaa').should.be.false;
            Validator.validateEmployeeID('62hH2d').should.be.false;
        });

        it('should return false for strings longer than 7 characters', () => {
            Validator.validateEmployeeID('ABCDEFG1234').should.be.false;
        });

        it('should return false for strings shorter than 7 characters', () => {
            Validator.validateEmployeeID('ABC123').should.be.false;
        });

        it('should return false for empty values', () => {
            Validator.validateEmployeeID('').should.be.false;
            Validator.validateEmployeeID(undefined).should.be.false;
            Validator.validateEmployeeID(null).should.be.false;
            Validator.validateEmployeeID(0).should.be.false;
        });
    });

    describe('validateMobileNumber', () => {
        it('should return true for valid UK mobile numbers beginning in 0', () => {
            Validator.validateMobileNumber('07123456789').should.be.true;
        });

        it('should return true for valid UK mobile numbers beginning in +44', () => {
            Validator.validateMobileNumber('+447123456789').should.be.true;
        });

        it('should return false for other types of phone numbers', () => {
            Validator.validateMobileNumber('02033445566').should.be.false;
            Validator.validateMobileNumber('0800001066').should.be.false;
        });
    });

    describe('validatePIN', () => {
        it('should return true for 4 digit pin numbers', () => {
            Validator.validatePIN(1234).should.be.true;
            Validator.validatePIN('0000').should.be.true;
            Validator.validatePIN('9999').should.be.true;
            Validator.validatePIN(3745).should.be.true;
            Validator.validatePIN('0999').should.be.true;
        });

        it('should return false for non-numbers', () => {
            Validator.validatePIN('notanumber').should.be.false;
            Validator.validatePIN('').should.be.false;
            Validator.validatePIN(undefined).should.be.false;
            Validator.validatePIN(null).should.be.false;
        });

        it('should return false for non-4-digit numbers', () => {
            Validator.validatePIN(0).should.be.false;
            Validator.validatePIN('0').should.be.false;
            Validator.validatePIN('000').should.be.false;
            Validator.validatePIN('12345').should.be.false;
            Validator.validatePIN(12345).should.be.false;
            Validator.validatePIN('-2345').should.be.false;
        });
    });
});
