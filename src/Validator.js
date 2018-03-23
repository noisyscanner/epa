export class Validator {
    constructor(rules) {
        this.rules = rules;
    }

    validate(obj) {
        let errors = {};

        Object.entries(this.rules).forEach(([field, fieldRules]) => {
            if (fieldRules.when === false || typeof fieldRules.when === 'function' && !fieldRules.when()) {
                return;
            }

            const fieldValue = obj[field];
            let errs = [];

            const humanField = field
                .replace('_', ' ')
                .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());

            // Do 'required' validation before the rest
            // If this fails, skip the rest of the rules
            if (fieldRules.required) {
                if (!fieldValue || fieldValue.length === 0) {
                    const errMsg = typeof fieldRules.required === 'string'
                        ? fieldRules.required
                        : `${humanField} is required`;

                    errs.push(errMsg);
                }
            }

            if (errs.length === 0) {
                Object.entries(fieldRules).forEach(([ruleName, ruleValue]) => {
                    switch (ruleName) {
                    case 'oneOf':
                        if (!(ruleValue instanceof Array)) break;

                        if (!ruleValue.includes(fieldValue)) {
                            errs.push(`${humanField} must be one of: ${ruleValue.join(', ')}`);
                        }
                        break;
                    case 'type':
                        if (!Validator.validateType(fieldValue, ruleValue)) {
                            errs.push(`${humanField} must be a ${ruleValue.name}`);
                        }
                        break;
                    case 'func': {
                        let func, errMsg;

                        if (ruleValue instanceof Array) {
                            [func, errMsg] = ruleValue;
                        } else {
                            [func, errMsg] = [ruleValue, `${humanField} must be valid`];
                        }

                        if (typeof func !== 'function') return;

                        if (!func(fieldValue)) {
                            errs.push(errMsg);
                        }
                    }
                    }
                });
            }

            if (errs.length > 0) {
                errors[field] = errs;
            }
        });

        return (Object.keys(errors).length > 0) ? errors : undefined;
    }

    static validateType(value, type) {
        switch (type) {
        case Number:
            return !isNaN(parseFloat(value));
        case String:
            return typeof value === 'string';
        default:
            return false;
        }
    }

    static validateCardNumber = (cardNumber) => /^\d{16}$/.test(cardNumber);

    static validateEmail = (email) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

    static validateEmployeeID = (employeeID) =>
        /^[A-Z\d]{7}$/.test(employeeID);

    static validateMobileNumber = (number) => /^(?:0|\+44)7\d{9}$/.test(number);

    static validatePIN(pin) {
        if (!Validator.validateType(pin, String)) {
            pin = String(pin);
        }

        const VALID_PIN_LENGTH = 4;

        return pin.length === VALID_PIN_LENGTH && !isNaN(parseInt(pin));
    }
}

export class ValidationError extends Error {
    constructor(errors) {
        super();
        this.message = 'There were some validation errors';
        this.errors = errors;
    }
}
